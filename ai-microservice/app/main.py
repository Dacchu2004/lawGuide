from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LawGuide India - AI Microservice")

@app.on_event("startup")
def startup_event():
    from services.chroma_loader import ensure_chroma_ready
    ensure_chroma_ready()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================= ROUTES =======================
from schemas.request import QueryRequest, SectionSearchRequest
from schemas.response import QueryResponse, SectionSearchResponse, SectionSearchResult
from schemas.summary import SectionSummaryRequest, SectionSummaryResponse

from core.pipeline import process_query
from services.language import detect_language, resolve_language_code
from services.translation import translate_to_english, translate_from_english
from services.embeddings import retrieve_sections
from services.summarizer import summarize_text

@app.get("/")
def root():
    return {"message": "AI service running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/answer", response_model=QueryResponse)
async def answer_query(payload: QueryRequest):
    return await process_query(payload)

@app.post("/search-sections", response_model=SectionSearchResponse)
async def search_sections(payload: SectionSearchRequest):
    detected_lang = detect_language(payload.query_text, payload.user_language)
    query_en = translate_to_english(payload.query_text, detected_lang)
    docs = retrieve_sections(query_en, payload.user_state or "India", payload.top_k)

    results = []
    for d in docs:
        text = d["text"]
        if detected_lang != "en":
            text = translate_from_english(text, detected_lang)

        results.append(SectionSearchResult(
            act=d["act"],
            section=d["section"],
            text_primary=text,
            text_english=d["text"],
            jurisdiction=d["jurisdiction"],
            source_link=d.get("sourceLink"),
        ))

    return SectionSearchResponse(
        detected_language=detected_lang,
        query_text=payload.query_text,
        results=results,
    )

@app.post("/summarize-section", response_model=SectionSummaryResponse)
async def summarize_section(payload: SectionSummaryRequest):
    summary = summarize_text(translate_to_english(payload.text, "auto"))
    if resolve_language_code(payload.user_language) != "en":
        summary = translate_from_english(summary, payload.user_language)
    return SectionSummaryResponse(summary=summary)
