import os
import re
import argparse
import logging
import uuid
from typing import List, Dict, Any

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

from config import EMBEDDING_MODEL_NAME, CHROMA_DB_DIR

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


# ================= Helper =================
def make_unique_id(prefix: str) -> str:
    """Generate a unique ID based on prefix and uuid4."""
    return f"{prefix}_{uuid.uuid4().hex}"


def make_doc(doc_id: str, act: str, section: str, text: str,
             jurisdiction="central", state="India", source_link=""):
    return {
        "id": doc_id,
        "act": act,
        "section": section,
        "text": text.strip(),
        "jurisdiction": jurisdiction,
        "state": state,
        "source_link": source_link,
    }


# ===== PDF Extraction =====
def extract_pdf_sections(pdf_path, act_name, jurisdiction, state):
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
            full_text += page.extract_text() + "\n"
        except:
            continue

    # Improved regex for section detection
    sections = re.findall(
        r"(?:Section\s*)?(\d+[A-Z]?)[\.\-:\)]\s*(.*?)(?=(?:Section\s*\d+[A-Z]?|^\d+[A-Z]?[\.\-:\)]|\Z))",
        full_text,
        flags=re.DOTALL | re.MULTILINE
    )
    logging.info(f"📝 Extracted {len(sections)} sections from {act_name}")

    docs = []
    for sec_num, sec_text in sections:
        section_name = f"Section {sec_num}"
        doc_id = make_unique_id(act_name.replace(" ", "_").lower())
        docs.append(make_doc(doc_id, act_name, section_name, sec_text, jurisdiction, state))

    return docs


def load_manual_pdfs(base_dir):
    logging.info("📥 Loading BNS & BNSS PDFs")
    data_dir = os.path.join(base_dir, "data")
    docs = []

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


# ===== Hugging Face Dataset Ingestion =====
def load_huggingface_acts(include_states=True):
    if not load_dataset:
        logging.warning("datasets not installed. Skipping HuggingFace ingestion.")
        return []

    logging.info("🌐 Loading HuggingFace dataset: geekyrakshit/Indian-Legal-Acts")

    try:
        ds = load_dataset("geekyrakshit/Indian-Legal-Acts")
    except Exception as e:
        logging.error(f"❌ Failed to download dataset: {e}")
        return []

    docs = []
    selected_splits = list(ds.keys()) if include_states else ["central"]

    for split in selected_splits:
        for i, row in enumerate(ds[split]):
            act = row.get("Short Title") or "Unknown Act"
            section = row.get("Act Number") or f"Act_{i}"
            text = row.get("Markdown") or ""
            source_link = row.get("View") or ""
            entity = row.get("Entity") or "central"

            if not text.strip():
                continue

            doc_id = make_unique_id(f"{split}_{act.replace(' ', '_')}")
            docs.append(make_doc(
                doc_id=doc_id,
                act=act,
                section=str(section),
                text=text,
                jurisdiction="central" if entity.lower() == "central" else "state",
                state=entity.replace("_", " ").title(),
                source_link=source_link
            ))

    logging.info(f"📚 Successfully mapped {len(docs)} acts from HuggingFace")
    return docs


# ===== Build ChromaDB Index =====
def build_chroma_index(docs):
    logging.info("🚀 Creating vector embeddings...")
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    client = chromadb.PersistentClient(path=CHROMA_DB_DIR, settings=Settings(allow_reset=True))
    collection = client.get_or_create_collection("legal_sections")

    texts = [d["text"] for d in docs]
    ids = [d["id"] for d in docs]

    # Ensure no duplicates before indexing
    assert len(ids) == len(set(ids)), "❌ Duplicate IDs found — uniqueness check failed"

    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True).tolist()

    collection.upsert(
        ids=ids,
        documents=texts,
        metadatas=[{k: d[k] for k in ["act", "section", "jurisdiction", "state", "source_link"]} for d in docs],
        embeddings=embeddings
    )

    logging.info("🎉 Chroma Index Built Successfully!")


# ================= MAIN =================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-pdf", action="store_true", help="Skip BNS/BNSS PDF extraction")
    parser.add_argument("--only-hf", action="store_true", help="Only ingest HuggingFace dataset")
    parser.add_argument("--central-only", action="store_true", help="Ignore state acts")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs = []

    if not args.only_hf:
        if not args.skip_pdf:
            docs.extend(load_manual_pdfs(base_dir))
        else:
            logging.info("⏭ Skipping PDF ingestion")

    docs.extend(load_huggingface_acts(include_states=not args.central_only))

    if not docs:
        logging.error("❌ No documents found. Aborting.")
        return

    build_chroma_index(docs)


if __name__ == "__main__":
    main()
