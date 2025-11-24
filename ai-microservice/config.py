# config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# 🔐 API_KEYS
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY missing in .env — cannot start microservice.")

# 🧠 Model Names
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
RERANKER_MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"

# 📍 ChromaDB config
CHROMA_DB_DIR = "./chroma_db"

# 🧪 Confidence threshold for safe output
CONFIDENCE_THRESHOLD = 0.75

# 🔧 System config
DEVICE = "cpu"  # or "cuda" if future GPU enabled
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
