import sys
import os
import re
import uuid
import logging
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
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

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

def get_qdrant_client() -> QdrantClient:
    return QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"],
        timeout=60.0,
    )

# ==================================================
# Helpers
# ==================================================
def make_doc_id() -> str:
    return uuid.uuid4().hex

def make_doc(
    act: str,
    section: str,
    text: str,
    jurisdiction: str = "central",
    state: str = "India",
    source_link: str = "",
) -> Dict[str, Any]:
    return {
        "id": make_doc_id(),
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
def extract_pdf_sections(path: str, act: str):
    if not PdfReader:
        return []

    reader = PdfReader(path)
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

    return [
        make_doc(act, f"Section {n}", text)
        for n, text in sections
        if text.strip()
    ]

def load_pdfs(base_dir: str):
    docs = []
    data_dir = os.path.join(base_dir, "data")

    docs.extend(
        extract_pdf_sections(
            os.path.join(data_dir, "BNS_2023.pdf"),
            "Bharatiya Nyaya Sanhita 2023",
        )
    )
    docs.extend(
        extract_pdf_sections(
            os.path.join(data_dir, "BNSS_2023.pdf"),
            "Bharatiya Nagarik Suraksha Sanhita 2023",
        )
    )
    return docs

# ==================================================
# HuggingFace ingestion
# ==================================================
def load_hf():
    if not load_dataset:
        return []

    ds = load_dataset("geekyrakshit/Indian-Legal-Acts")
    docs = []

    for split in ds:
        for r in ds[split]:
            text = (r.get("Markdown") or "").strip()
            if not text:
                continue

            docs.append(
                make_doc(
                    act=r.get("Short Title", "Unknown"),
                    section=str(r.get("Act Number", "")),
                    text=text,
                    jurisdiction="central",
                    state=(r.get("Entity") or "India").replace("_", " ").title(),
                    source_link=r.get("View", ""),
                )
            )
    return docs

# ==================================================
# INGESTION ENTRYPOINT
# ==================================================
def run_ingestion():
    base_dir = PROJECT_ROOT
    docs = load_pdfs(base_dir) + load_hf()

    logging.info(f"📄 Total documents: {len(docs)}")

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    vectors = model.encode(
        [d["text"] for d in docs],
        batch_size=32,
        show_progress_bar=True,
    ).tolist()

    client = get_qdrant_client()

    # Recreate collection (clean start)
    client.recreate_collection(
        collection_name="legal_sections",
        vectors_config=VectorParams(
            size=len(vectors[0]),
            distance=Distance.COSINE,
        ),
    )

    points = [
        PointStruct(
            id=doc["id"],
            vector=vectors[i],
            payload=doc,
        )
        for i, doc in enumerate(docs)
    ]

    BATCH_SIZE = 50
    total = len(points)

    logging.info(f"📦 Uploading {total} points to Qdrant in batches...")

    for start in range(0, total, BATCH_SIZE):
        end = start + BATCH_SIZE
        batch = points[start:end]

        client.upsert(
            collection_name="legal_sections",
            points=batch,
        )

        logging.info(f"✅ Uploaded {min(end, total)} / {total}")

    logging.info("🎉 Qdrant ingestion completed successfully")

# ==================================================
# CLI
# ==================================================
if __name__ == "__main__":
    run_ingestion()
