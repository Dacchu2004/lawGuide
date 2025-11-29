from schemas.request import QueryRequest
from schemas.response import QueryResponse, RetrievedSection
from services.embeddings import retrieve_sections

async def process_query(payload: QueryRequest) -> QueryResponse:
    query = payload.query_text
    state = payload.user_state or "India"

    # 1 - retrieve sections
    retrieved = retrieve_sections(query, state)

    if not retrieved:
        return QueryResponse(
            status="refusal",
            answer_primary="No relevant legal sections found in dataset.",
            answer_english="No relevant legal sections found in dataset.",
            confidence=0.0,
            detected_language="en",
            retrieved_sections=[],
            error_type="retrieval_failure"
        )

    # 2 - Prepare result (no LLM yet)
    sections_payload = [
        RetrievedSection(
            act=d["act"],
            section=d["section"],
            text=d["text"],
            jurisdiction=d["jurisdiction"],
            source_link=d["source_link"]
        ) for d in retrieved
    ]

    explanation = (
        f"Based on your query, this section may be relevant:\n\n"
        f"Act: {retrieved[0]['act']}\n"
        f"Section: {retrieved[0]['section']}\n"
        f"Text: {retrieved[0]['text']}\n\n"
        f"⚠ AI explanation not yet enabled — only retrieval working."
    )

    return QueryResponse(
        status="answer",
        answer_primary=explanation,
        answer_english=explanation,
        confidence=0.5,  # temporary
        detected_language="en",
        retrieved_sections=sections_payload
    )
