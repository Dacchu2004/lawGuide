import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

CHROMA_HOST = os.getenv("CHROMA_HOST")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

if not all([CHROMA_HOST, CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE]):
    raise RuntimeError("❌ Chroma Cloud environment variables missing")

client = chromadb.Client(
    Settings(
        chroma_api_impl="rest",
        chroma_server_host=CHROMA_HOST,
        chroma_server_http_port=443,
        chroma_server_ssl_enabled=True,
        chroma_server_headers={
            "Authorization": f"Bearer {CHROMA_API_KEY}"
        },
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE,
    )
)

collection = client.get_collection("legal_sections")

embedding_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def retrieve_sections(query: str, state: str, top_k: int = 20):
    """
    Retrieve relevant legal sections from Chroma using semantic similarity.
    - query: normalized English query
    - state: user's state (e.g., Karnataka)
    - top_k: number of results to return (default 5)
    """
    if not query:
        return []

    query_embedding = embedding_model.encode([query]).tolist()[0]
    print("Chroma count:", collection.count())


    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,  # 👈 now dynamic
        where={
            "$or": [
                {"state": state},
                {"state": "India"}
            ]
        } if state and state.lower() != "india" else None # Optimize: if state is India, no filter needed usually, or just don't filter
    )

    # RETRY LOGIC: If no results found with filter, try WITHOUT filter (Broad Search)
    if not results or not results["ids"] or not results["ids"][0]:
        print(f"⚠ No strict results for state='{state}'. Retrying broad search...")
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

    docs = []
    for doc_id, text, metadata in zip(
        results["ids"][0],
        results["documents"][0],
        results["metadatas"][0]
    ):
        docs.append({
            "id": doc_id,
            "text": text,
            "act": metadata.get("act"),
            "section": metadata.get("section"),
            "jurisdiction": metadata.get("jurisdiction"),
            "state": metadata.get("state"),
            "sourceLink": metadata.get("source_link") or metadata.get("sourceLink"),
        })
    return docs
