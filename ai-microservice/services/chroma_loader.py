import os
import logging
import chromadb
from chromadb.config import Settings

from config import CHROMA_DB_DIR
from scripts.ingest import main as ingest_main

client = chromadb.PersistentClient(
    path=CHROMA_DB_DIR,
    settings=Settings(allow_reset=False)
)

collection = client.get_or_create_collection("legal_sections")

def ensure_chroma_ready():
    """
    Ensures Chroma has data.
    Runs ingestion ONLY if empty.
    """
    count = collection.count()
    logging.info(f"📊 Chroma document count at startup: {count}")

    if count > 0:
        logging.info("✅ Chroma already populated. Skipping ingestion.")
        return

    logging.warning("⚠ Chroma is empty. Running ingestion now...")
    ingest_main()  # 🔥 THIS WAS MISSING
    logging.info("🎉 Chroma ingestion completed.")
