import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from config import CHROMA_DB_DIR, EMBEDDING_MODEL_NAME

# Load client & embedding model once
client = chromadb.PersistentClient(
    path=CHROMA_DB_DIR,
    settings=Settings(allow_reset=False)
)

collection = client.get_or_create_collection("legal_sections")
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

def retrieve_sections(query: str, state: str, top_k: int = 5):
    """
    Real retrieval from Chroma using semantic similarity.
    State is used to prioritize relevant documents.
    """
    if not query:
        return []

    query_embedding = embedding_model.encode([query]).tolist()[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
            "$or": [
                {"state": state},
                {"state": "India"}
            ]
        }
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
            "source_link": metadata.get("source_link"),
        })
    return docs
