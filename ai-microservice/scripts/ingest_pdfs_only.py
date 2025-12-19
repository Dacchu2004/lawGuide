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
) -> Dict[str, Any]:
    return {
        "doc_id": f"{act}_{uuid.uuid4().hex}",
        "act": act,
        "section": section,
        "text": text.strip(),
        "jurisdiction": "central",
        "state": "India",
        "source_link": "",
    }

# ==================================================
# PDF Extraction (SECTION-LEVEL)
# ==================================================
def extract_pdf_sections(pdf_path: str, act_name: str) -> List[Dict[str, Any]]:
    if not PdfReader:
        raise RuntimeError("pypdf is not installed")

    reader = PdfReader(pdf_path)
    full_text = ""

    for page in reader.pages:
        try:
            txt = page.extract_text()
            if txt:
                full_text += txt + "\n"
        except Exception:
            continue

    # Robust Indian law section matcher
    sections = re.findall(
        r"(?:Section\s*)?(\d+[A-Z]?)\s*[\.\-:\)]\s*(.*?)(?=(?:Section\s*\d+[A-Z]?|\Z))",
        full_text,
        flags=re.DOTALL | re.IGNORECASE,
    )

    logging.info(f"📝 Extracted {len(sections)} sections from {act_name}")

    docs = []
    for sec_no, sec_text in sections:
        cleaned = sec_text.strip()
        if len(cleaned) < 200:
            continue  # discard tiny junk sections

        docs.append(
            make_doc(
                act=act_name,
                section=f"Section {sec_no}",
                text=cleaned,
            )
        )

    return docs

# ==================================================
# Load ONLY PDFs
# ==================================================
def load_manual_pdfs(base_dir: str) -> List[Dict[str, Any]]:
    logging.info("📥 Loading legal PDFs (PDF ONLY MODE)")

    data_dir = os.path.join(base_dir, "data")
    pdfs = [
        ("BNS_2023.pdf", "Bharatiya Nyaya Sanhita 2023"),
        ("BNSS_2023.pdf", "Bharatiya Nagarik Suraksha Sanhita 2023"),
    ]

    docs: List[Dict[str, Any]] = []

    for filename, act_name in pdfs:
        path = os.path.join(data_dir, filename)
        if not os.path.exists(path):
            logging.warning(f"⚠ Missing PDF: {filename}")
            continue

        docs.extend(extract_pdf_sections(path, act_name))

    return docs

# ==================================================
# INGESTION
# ==================================================
def run_ingestion():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    docs = load_manual_pdfs(base_dir)
    logging.info(f"📄 Total PDF sections ingested: {len(docs)}")

    if not docs:
        raise RuntimeError("No documents extracted from PDFs")

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    embeddings = model.encode(
        [d["text"] for d in docs],
        batch_size=32,
        show_progress_bar=True,
    ).tolist()

    client = get_qdrant_client()

    # Recreate collection (clean slate)
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=len(embeddings[0]),
            distance=Distance.COSINE,
        ),
    )

    # Payload indexes for filtering
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
            id=str(uuid.uuid4()),  # Qdrant-safe ID
            vector=embeddings[i],
            payload=docs[i],
        )
        for i in range(len(docs))
    ]

    BATCH = 50
    for i in range(0, len(points), BATCH):
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points[i:i + BATCH],
        )
        logging.info(f"✅ Uploaded {min(i + BATCH, len(points))}/{len(points)}")

    logging.info("🎉 PDF-only Qdrant ingestion completed successfully")

if __name__ == "__main__":
    run_ingestion()
