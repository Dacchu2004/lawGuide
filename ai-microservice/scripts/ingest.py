import sys
import os
import re
import uuid
import logging
from typing import Dict, Any, List

# --------------------------------------------------
# Make project root importable
# --------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

from config import EMBEDDING_MODEL_NAME

try:
    from datasets import load_dataset
except ImportError:
    load_dataset = None

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

COLLECTION_NAME = "legal_sections"

# ==================================================
# Qdrant client
# ==================================================
def get_qdrant_client() -> QdrantClient:
    return QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"],
        timeout=60,
    )

# ==================================================
# Helpers
# ==================================================
def make_doc(
    act: str,
    section: str,
    text: str,
    jurisdiction: str,
    state: str,
    source_link: str,
) -> Dict[str, Any]:
    return {
        "doc_id": f"{act}_{uuid.uuid4().hex}",  # ← your old ID kept here
        "act": act,
        "section": section,
        "text": text.strip(),
        "jurisdiction": jurisdiction,
        "state": state,
        "source_link": source_link,
    }

# ==================================================
# PDF ingestion
# ==================================================
def extract_pdf_sections(pdf_path: str, act_name: str):
    if not PdfReader:
        return []

    reader = PdfReader(pdf_path)
    full_text = ""

    for page in reader.pages:
        try:
            t = page.extract_text()
            if t:
                full_text += t + "\n"
        except Exception:
            continue

    sections = re.findall(
        r"(?:Section\s*)?(\d+[A-Z]?)[\.\-:\)]\s*(.*?)(?=(?:Section\s*\d+|\Z))",
        full_text,
        flags=re.DOTALL,
    )

    logging.info(f"📝 Extracted {len(sections)} sections from {act_name}")

    return [
        make_doc(
            act=act_name,
            section=f"Section {n}",
            text=t,
            jurisdiction="central",
            state="India",
            source_link="",
        )
        for n, t in sections if t.strip()
    ]

def load_manual_pdfs(base_dir: str):
    logging.info("📥 Loading BNS & BNSS PDFs")
    data_dir = os.path.join(base_dir, "data")

    docs = []
    pdfs = [
        ("BNS_2023.pdf", "Bharatiya Nyaya Sanhita 2023"),
        ("BNSS_2023.pdf", "Bharatiya Nagarik Suraksha Sanhita 2023"),
    ]

    for fname, act in pdfs:
        path = os.path.join(data_dir, fname)
        if os.path.exists(path):
            docs.extend(extract_pdf_sections(path, act))

    return docs

# ==================================================
# HuggingFace ingestion
# ==================================================
def load_huggingface_acts():
    if not load_dataset:
        return []

    logging.info("🌐 Loading HuggingFace dataset")
    ds = load_dataset("geekyrakshit/Indian-Legal-Acts")

    docs = []
    for split in ds:
        for row in ds[split]:
            text = (row.get("Markdown") or "").strip()
            if not text:
                continue

            entity = row.get("Entity") or "central"

            docs.append(
                make_doc(
                    act=row.get("Short Title") or "Unknown Act",
                    section=str(row.get("Act Number") or ""),
                    text=text,
                    jurisdiction="central" if entity.lower() == "central" else "state",
                    state=entity.replace("_", " ").title(),
                    source_link=row.get("View") or "",
                )
            )
    return docs

# ==================================================
# INGESTION
# ==================================================
def run_ingestion():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs = load_manual_pdfs(base_dir) + load_huggingface_acts()

    logging.info(f"📄 Total documents: {len(docs)}")

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    vectors = model.encode(
        [d["text"] for d in docs],
        batch_size=32,
        show_progress_bar=True,
    ).tolist()

    client = get_qdrant_client()

    # Recreate collection
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=len(vectors[0]),
            distance=Distance.COSINE,
        ),
    )

    # REQUIRED FILTER INDEXES
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="state",
        field_schema="keyword",
    )
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="jurisdiction",
        field_schema="keyword",
    )

    points = [
        PointStruct(
            id=str(uuid.uuid4()),   # ✅ VALID QDRANT ID (Must be string)
            vector=vectors[i],
            payload=docs[i],
        )
        for i in range(len(docs))
    ]

    BATCH = 50
    for i in range(0, len(points), BATCH):
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points[i:i+BATCH],
        )
        logging.info(f"✅ Uploaded {min(i+BATCH, len(points))}/{len(points)}")

    logging.info("🎉 Qdrant ingestion completed successfully")

if __name__ == "__main__":
    run_ingestion()
