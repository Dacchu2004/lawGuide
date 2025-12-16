# services/chroma_loader.py
import logging
from config import CHROMA_DB_DIR
from scripts.ingest import run_ingestion
from services.embeddings import client  # 👈 REUSE EXISTING CLIENT

logging.basicConfig(level=logging.INFO)

def ensure_chroma_ready():
    # client is already initialized in embeddings.py
    collection = client.get_or_create_collection("legal_sections")
    count = collection.count()

    logging.info(f"📊 Chroma document count at startup: {count}")

    if count > 0:
        logging.info("✅ Chroma already populated. Skipping ingestion.")
        return

    logging.warning("⚠ Chroma empty — starting FULL ingestion")
    run_ingestion(client=client)
