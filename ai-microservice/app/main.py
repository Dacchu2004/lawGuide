# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # ✅ ADD THIS

# Existing imports
from schemas.request import QueryRequest, SectionSearchRequest
from schemas.response import QueryResponse, SectionSearchResponse, SectionSearchResult
from core.pipeline import process_query
from services.language import detect_language
from services.translation import translate_to_english, translate_from_english
from services.embeddings import retrieve_sections

app = FastAPI(title="LawGuide India - AI Microservice")

# ✅✅✅ ADD THIS ENTIRE CORS BLOCK ✅✅✅
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ✅✅✅ END CORS BLOCK ✅✅✅


# ======================= Health Check =======================
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI microservice running"}


# ======================= Chatbot Endpoint ======================
@app.post("/answer", response_model=QueryResponse)
async def answer_query(payload: QueryRequest):
    return await process_query(payload)


# ======================= Semantic Section Search ======================
@app.post("/search-sections", response_model=SectionSearchResponse)
async def search_sections(payload: SectionSearchRequest):

    detected_lang = detect_language(payload.query_text, payload.user_language)

    normalized_query = translate_to_english(payload.query_text.strip(), detected_lang)
    if not normalized_query:
        normalized_query = payload.query_text.strip()

    user_state = payload.user_state or "India"

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
                text_primary=text_user,
                text_english=text_en,
                jurisdiction=d["jurisdiction"],
                source_link=d.get("source_link") or None,
            )
        )

    return SectionSearchResponse(
        detected_language=detected_lang,
        query_text=payload.query_text,
        results=results,
    )
