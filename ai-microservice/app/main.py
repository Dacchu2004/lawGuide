# app/main.py

from fastapi import FastAPI

# Existing chatbot imports
from schemas.request import QueryRequest, SectionSearchRequest   # ⬅ add this
from schemas.response import QueryResponse, SectionSearchResponse, SectionSearchResult  # ⬅ add this
from core.pipeline import process_query

# New imports for semantic search
from services.language import detect_language
from services.translation import translate_to_english, translate_from_english
from services.embeddings import retrieve_sections

app = FastAPI(title="LawGuide India - AI Microservice")


# ======================= Health Check =======================
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI microservice running"}


# ======================= Chatbot Endpoint ======================
# Keep as is – this is your RAG + LLM flow
@app.post("/answer", response_model=QueryResponse)
async def answer_query(payload: QueryRequest):
    return await process_query(payload)


# ======================= Semantic Section Search ======================
@app.post("/search-sections", response_model=SectionSearchResponse)
async def search_sections(payload: SectionSearchRequest):
    """
    Semantic section search (non-chatbot).
    - Detects query language
    - Translates to English
    - Runs Chroma semantic retrieval
    - Returns both English and user-language versions
    """
    # 1️⃣ Detect query language
    detected_lang = detect_language(payload.query_text, payload.user_language)

    # 2️⃣ Normalize query
    normalized_query = translate_to_english(payload.query_text.strip(), detected_lang)
    if not normalized_query:
        normalized_query = payload.query_text.strip()  # Fallback

    # 3️⃣ Use state from request (default: India)
    user_state = payload.user_state or "India"

    # 4️⃣ Retrieve best-matching sections
    docs = retrieve_sections(normalized_query, user_state, top_k=payload.top_k or 10)

    results = []
    for d in docs:
        text_en = d["text"]
        if detected_lang != "en":
            text_user = translate_from_english(text_en, detected_lang)
        else:
            text_user = text_en

        results.append(
            SectionSearchResult(
                act=d["act"],
                section=d["section"],
                text_primary=text_user,      # Localized
                text_english=text_en,        # Raw / legal English
                jurisdiction=d["jurisdiction"],
                source_link=d.get("source_link") or None,
            )
        )

    return SectionSearchResponse(
        detected_language=detected_lang,
        query_text=payload.query_text,
        results=results,
    )
