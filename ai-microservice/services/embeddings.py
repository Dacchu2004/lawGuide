import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

from config import EMBEDDING_MODEL_NAME

# ---------------- ENV ----------------
QDRANT_URL = os.environ["QDRANT_URL"]
QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]

COLLECTION_NAME = "legal_sections"

# ---------------- CLIENT ----------------
client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=60,
)

# ---------------- MODEL ----------------
_embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

# ---------------- RETRIEVAL ----------------
def retrieve_sections(query: str, state: str, top_k: int = 10):
    """
    Semantic search over Indian legal sections using Qdrant.
    """

    if not query:
        return []

    query_vector = _embedding_model.encode(query).tolist()

    query_filter = None
    if state and state.lower() != "india":
        query_filter = Filter(
            should=[
                FieldCondition(
                    key="state",
                    match=MatchValue(value=state)
                ),
                FieldCondition(
                    key="state",
                    match=MatchValue(value="India")
                ),
            ]
        )

    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=top_k,
        query_filter=query_filter,
    )

    docs = []
    for r in results:
        p = r.payload
        docs.append({
            "id": p.get("doc_id"),              # ✅ FIXED
            "text": p.get("text"),
            "act": p.get("act"),
            "section": p.get("section"),
            "jurisdiction": p.get("jurisdiction"),
            "state": p.get("state"),
            "sourceLink": p.get("source_link"),
        })

    return docs