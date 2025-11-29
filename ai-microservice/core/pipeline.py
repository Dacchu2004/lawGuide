from schemas.request import QueryRequest
from schemas.response import QueryResponse

async def process_query(payload: QueryRequest) -> QueryResponse:
    return QueryResponse(
        status="refusal",  # Placeholder only. Real logic will provide "answer"
        answer_primary="AI processing coming soon.",
        answer_english="AI processing coming soon.",
        confidence=0.0,
        detected_language="en",
        retrieved_sections=[],
        error_type="not_implemented",
        high_risk=False
    )
