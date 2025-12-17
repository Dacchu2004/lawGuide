# scripts/ingest.py
import sys
import os
import re
import logging
import uuid
from typing import List, Dict, Any

# --------------------------------------------------
# Make project root importable
# --------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# --------------------------------------------------
# Core imports
# --------------------------------------------------
from sentence_transformers import SentenceTransformer
import chromadb

from config import EMBEDDING_MODEL_NAME

# Optional dependencies
try:
    from datasets import load_dataset
except ImportError:
    load_dataset = None

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# ==================================================
# Chroma Cloud Client (CORRECT FOR chromadb==1.3.5)
# ==================================================
def get_chroma_cloud_client() -> chromadb.HttpClient:
    host = os.getenv("CHROMA_HOST")
    api_key = os.getenv("CHROMA_API_KEY")
    tenant = os.getenv("CHROMA_TENANT")
    database = os.getenv("CHROMA_DATABASE")

    if not all([host, api_key, tenant, database]):
        raise RuntimeError(
            "❌ Missing Chroma Cloud env vars "
            "(CHROMA_HOST, CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE)"
        )

    return chromadb.HttpClient(
        host=host,
        port=443,
        ssl=True,
        headers={
            "Authorization": f"Bearer {api_key}"
        },
        tenant=tenant,
        database=database,
    )

# ==================================================
# Helpers
# ==================================================
def make_unique_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex}"


def make_doc(
    doc_id: str,
    act: str,
    section: str,
    text: str,
    jurisdiction: str = "central",
    state: str = "India",
    source_link: str = "",
) -> Dict[str, Any]:
    return {
        "id": doc_id,
        "act": act,
        "section": section,
        "text": text.strip(),
        "jurisdiction": jurisdiction,
        "state": state,
        "source_link": source_link,
    }

# ==================================================
# PDF Extraction
# ==================================================
def extract_pdf_sections(pdf_path: str, act_name: str, jurisdiction: str, state: str):
    if not PdfReader:
        logging.warning("pypdf not installed. Skipping PDF extraction.")
        return []

    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        logging.error(f"❌ Failed to load {pdf_path}: {e}")
        return []

    full_text = ""
    for page in reader.pages:
        try:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
        except Exception:
            continue

    sections = re.findall(
        r"(?:Section\s*)?(\d+[A-Z]?)[\.\-:\)]\s*(.*?)(?=(?:Section\s*\d+[A-Z]?|^\d+[A-Z]?[\.\-:\)]|\Z))",
        full_text,
        flags=re.DOTALL | re.MULTILINE,
    )

    logging.info(f"📝 Extracted {len(sections)} sections from {act_name}")

    docs = []
    for sec_num, sec_text in sections:
        docs.append(
            make_doc(
                doc_id=make_unique_id(act_name.replace(" ", "_").lower()),
                act=act_name,
                section=f"Section {sec_num}",
                text=sec_text,
                jurisdiction=jurisdiction,
                state=state,
            )
        )

    return docs

def load_manual_pdfs(base_dir: str):
    logging.info("📥 Loading BNS & BNSS PDFs")
    docs = []
    data_dir = os.path.join(base_dir, "data")

    pdf_files = [
        ("BNS_2023.pdf", "Bharatiya Nyaya Sanhita 2023"),
        ("BNSS_2023.pdf", "Bharatiya Nagarik Suraksha Sanhita 2023"),
    ]

    for filename, act_name in pdf_files:
        path = os.path.join(data_dir, filename)
        if os.path.exists(path):
            docs.extend(extract_pdf_sections(path, act_name, "central", "India"))
        else:
            logging.warning(f"⚠ Missing PDF: {filename}")

    return docs

# ==================================================
# HuggingFace Ingestion
# ==================================================
def load_huggingface_acts(include_states: bool = True):
    if not load_dataset:
        logging.warning("datasets not installed. Skipping HuggingFace ingestion.")
        return []

    logging.info("🌐 Loading HuggingFace dataset: geekyrakshit/Indian-Legal-Acts")
    ds = load_dataset("geekyrakshit/Indian-Legal-Acts")

    docs = []
    selected_splits = list(ds.keys()) if include_states else ["central"]

    for split in selected_splits:
        for i, row in enumerate(ds[split]):
            text = (row.get("Markdown") or "").strip()
            if not text:
                continue

            docs.append(
                make_doc(
                    doc_id=make_unique_id(split),
                    act=row.get("Short Title") or "Unknown Act",
                    section=str(row.get("Act Number") or f"Act_{i}"),
                    text=text,
                    jurisdiction="central",
                    state=(row.get("Entity") or "India").replace("_", " ").title(),
                    source_link=row.get("View") or "",
                )
            )

    logging.info(f"📚 Loaded {len(docs)} sections from HuggingFace")
    return docs

# ==================================================
# Chroma Index Builder (CLOUD)
# ==================================================
def build_chroma_index(docs: List[Dict[str, Any]]):
    logging.info("🚀 Creating vector embeddings...")
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    client = get_chroma_cloud_client()
    collection = client.get_or_create_collection("legal_sections")

    texts = [d["text"] for d in docs]
    ids = [d["id"] for d in docs]
    metadatas = [
        {
            "act": d["act"],
            "section": d["section"],
            "jurisdiction": d["jurisdiction"],
            "state": d["state"],
            "source_link": d["source_link"],
        }
        for d in docs
    ]

    embeddings = model.encode(
        texts,
        batch_size=16,
        show_progress_bar=True,
    ).tolist()

    collection.upsert(
        ids=ids,
        documents=texts,
        metadatas=metadatas,
        embeddings=embeddings,
    )

    logging.info("🎉 Chroma Cloud index built successfully")

# ==================================================
# Entry Point
# ==================================================
def run_ingestion(skip_pdf=False, only_hf=False, central_only=False):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs: List[Dict[str, Any]] = []

    if not only_hf and not skip_pdf:
        docs.extend(load_manual_pdfs(base_dir))

    docs.extend(load_huggingface_acts(include_states=not central_only))

    if not docs:
        logging.error("❌ No legal documents found. Aborting ingestion.")
        return

    build_chroma_index(docs)
    logging.info("✅ Full ingestion complete (uploaded to Chroma Cloud)")

# ==================================================
# CLI
# ==================================================
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-pdf", action="store_true")
    parser.add_argument("--only-hf", action="store_true")
    parser.add_argument("--central-only", action="store_true")
    args = parser.parse_args()

    run_ingestion(
        skip_pdf=args.skip_pdf,
        only_hf=args.only_hf,
        central_only=args.central_only,
    )
