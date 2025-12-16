# services/chroma_loader.py
import logging
import chromadb
from chromadb.config import Settings

from config import CHROMA_DB_DIR
from scripts.ingest import run_ingestion

logging.basicConfig(level=logging.INFO)

def ensure_chroma_ready():
    client = chromadb.PersistentClient(
        path=CHROMA_DB_DIR,
        settings=Settings(allow_reset=False)
    )

    collection = client.get_or_create_collection("legal_sections")
    count = collection.count()

    logging.info(f"📊 Chroma document count at startup: {count}")

    if count > 0:
        logging.info("✅ Chroma already populated. Skipping ingestion.")
        return

    logging.warning("⚠ Chroma empty — starting FULL ingestion")
    run_ingestion()
