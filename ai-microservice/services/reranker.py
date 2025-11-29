# services/rerank.py

from typing import List, Dict, Any, Optional
from sentence_transformers import CrossEncoder
import logging

# Best practice: lazy load model once
RERANKER_MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"
_cross_encoder: Optional[CrossEncoder] = None


def get_reranker_model() -> CrossEncoder:
    global _cross_encoder
    if _cross_encoder is None:
        logging.info("🧠 Loading CrossEncoder model for reranking...")
        try:
            _cross_encoder = CrossEncoder(RERANKER_MODEL_NAME)
        except Exception as e:
            logging.error(f"❌ Failed to load CrossEncoder model: {e}")
            raise
    return _cross_encoder


def rerank_sections(query: str, sections: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Rerank retrieved sections using cross-encoder scores.
    Returns top_k most relevant sections.
    """
    if not sections:
        return sections

    model = get_reranker_model()

    try:
        pairs = [(query, s["text"]) for s in sections]
        scores = model.predict(pairs)
    except Exception as e:
        logging.error(f"⚠ Error during reranking: {e}")
        return sections  # fallback – return original sections

    # Attach score and rerank
    scored = [(s, float(score)) for s, score in zip(sections, scores)]
    scored.sort(key=lambda x: x[1], reverse=True)

    ranked = [s for s, _ in scored[:top_k]]
    logging.info(f"📊 Reranked {len(sections)} → top {top_k} sections")
    return ranked

