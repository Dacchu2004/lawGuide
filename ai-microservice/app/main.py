from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ======================= SCHEMAS =======================
from schemas.request import (
    QueryRequest,
    SectionSearchRequest,
)
from schemas.response import (
    QueryResponse,
    SectionSearchResponse,
    SectionSearchResult,
)
from schemas.summary import (
    SectionSummaryRequest,
    SectionSummaryResponse,
)

# ======================= CORE AI =======================
from core.pipeline import process_query
from services.language import detect_language, resolve_language_code
from services.translation import translate_to_english, translate_from_english
from services.embeddings import retrieve_sections
from services.summarizer import summarize_text   # ✅ YOUR REAL AI SUMMARIZER

app = FastAPI(title="LawGuide India - AI Microservice")

# ======================= ✅✅✅ CORS CONFIG =======================
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
# ======================= ✅✅✅ END CORS =======================


# ======================= ✅ HEALTH =======================
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI microservice running"}


# ======================= ✅ CHATBOT (RAG + GROQ) =======================
@app.post("/answer", response_model=QueryResponse)
async def answer_query(payload: QueryRequest):
    return await process_query(payload)


# ======================= ✅ SEMANTIC SEARCH (LAW BROWSER) =======================
@app.post("/search-sections", response_model=SectionSearchResponse)
async def search_sections(payload: SectionSearchRequest):
    """
    Semantic section search using Chroma + embeddings
    """

    detected_lang = detect_language(payload.query_text, payload.user_language)

    normalized_query = translate_to_english(
        payload.query_text.strip(), detected_lang
    )
    if not normalized_query:
        normalized_query = payload.query_text.strip()

    user_state = payload.user_state or "India"

    docs = retrieve_sections(
        normalized_query,
        user_state,
        top_k=payload.top_k or 20
    )

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
                source_link=d.get("sourceLink") or d.get("source_link") or None,
            )
        )

    return SectionSearchResponse(
        detected_language=detected_lang,
        query_text=payload.query_text,
        results=results,
    )


# ======================= ✅ ✅ ✅ REAL AI LEGAL SUMMARY =======================
@app.post("/summarize-section", response_model=SectionSummaryResponse)
async def summarize_section(payload: SectionSummaryRequest):

    raw_text = payload.text.strip()

    # Normalize language (e.g. "English" -> "en", "Kannada" -> "kn")
    user_language = resolve_language_code(payload.user_language)

    if not raw_text or len(raw_text) < 80:
        return SectionSummaryResponse(
            summary="The selected legal text is too short to generate a meaningful explanation."
        )

    # STEP 1 — convert section to English
    normalized_text = translate_to_english(raw_text, "auto")

    # STEP 2 — summarize in stable English
    summary_en = summarize_text(normalized_text)

    # STEP 3 — translate ONLY if language != en
    if user_language.lower() != "en":
        summary_local = translate_from_english(summary_en, user_language)
    else:
        summary_local = summary_en

    return SectionSummaryResponse(summary=summary_local)

