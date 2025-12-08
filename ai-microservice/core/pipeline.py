# core/pipeline.py
import random

from schemas.request import QueryRequest
from schemas.response import QueryResponse, RetrievedSection
from services.language import detect_language
from services.translation import translate_to_english, translate_from_english
from services.embeddings import retrieve_sections
from services.reranker import rerank_sections
from services.reranker import rerank_sections
from services.llm import generate_answer, validate_answer, classify_intent, chat_general
from core.validation import ValidationResult
from config import CONFIDENCE_THRESHOLD


async def process_query(payload: QueryRequest) -> QueryResponse:
    # 🌟 Step 0: Dynamic Intent Classification (LLM)
    intent = classify_intent(payload.query_text)
    print(f"🧠 Detected Intent: {intent}")

    if intent == "GENERAL":
        reply = chat_general(payload.query_text) or "Hello! I am LawGuide AI."
        return QueryResponse(
            status="answer",
            answer_primary=reply,
            answer_english=reply,
            confidence=1.0,
            detected_language="en",
            retrieved_sections=[],
            error_type=None,
            high_risk=False
        )

    if intent == "OFF_TOPIC":
        msg = "I am a legal assistant and can only help with Indian laws, rights, and legal procedures."
        return QueryResponse(
            status="refusal",
            answer_primary=msg,
            answer_english=msg,
            confidence=1.0,
            detected_language="en",
            retrieved_sections=[],
            error_type="off_topic",
            high_risk=False
        )

    if intent == "ILLEGAL":
        msg = "I cannot help with illegal activities. If you need legal consequences or support for a lawful situation, I can assist."
        return QueryResponse(
            status="refusal",
            answer_primary=msg,
            answer_english=msg,
            confidence=1.0,
            detected_language="en",
            retrieved_sections=[],
            error_type="illegal_refusal",
            high_risk=True
        )

    # If intent is LEGAL (or fallback), proceed to RAG pipeline...
    detected_lang = detect_language(payload.query_text, payload.user_language)

    normalized_query = translate_to_english(payload.query_text.strip(), detected_lang)
    if not normalized_query:
        safe_msg = (
            "I'm unable to process your question due to language handling issues. "
            "Please try again in simple English or consult a legal expert."
        )
        return QueryResponse(
            status="refusal",
            answer_primary=safe_msg,
            answer_english=safe_msg,
            confidence=0.0,
            detected_language=detected_lang,
            retrieved_sections=[],
            error_type="translation_failure",
            high_risk=False,
        )

    user_state = payload.user_state or "India"

    # Retrieve related legal sections
    retrieved = retrieve_sections(normalized_query, user_state)
    if not retrieved:
        safe_msg = (
            "I couldn't find relevant legal sections in the current dataset for your question. "
            "Please consult a qualified legal expert or legal aid service."
        )
        return QueryResponse(
            status="refusal",
            answer_primary=safe_msg,
            answer_english=safe_msg,
            confidence=0.0,
            detected_language=detected_lang,
            retrieved_sections=[],
            error_type="retrieval_failure",
            high_risk=False,
        )

    # Rank sections using cross encoder
    reranked = rerank_sections(normalized_query, retrieved)

    # Generate primary answer
    draft_answer_en = generate_answer(
        query=normalized_query,
        sections=reranked[:5],  # Limit to top 5 to prevent 413 Payload Too Large
        explanation_mode=payload.explanation_mode,
        state=user_state,
        target_language=detected_lang,
    )

    if not draft_answer_en:
        explanation = (
            "I found relevant legal sections, but I’m currently unable to generate the full explanation. "
            "Please review the below sections and consult a lawyer."
        )
        return QueryResponse(
            status="answer",
            answer_primary=explanation,
            answer_english=explanation,
            confidence=0.4,
            detected_language=detected_lang,
            retrieved_sections=[RetrievedSection(**{
                "act": s["act"],
                "section": s["section"],
                "text": s["text"],
                "jurisdiction": s["jurisdiction"],
                "source_link": s.get("source_link", "")
            }) for s in reranked],
            error_type="llm_unavailable",
            high_risk=False,
        )

    # Validation phase
    validation_result: ValidationResult = validate_answer(
        answer=draft_answer_en,
        sections=reranked,
        query=normalized_query,
    )

    confidence = max(0.0, min(validation_result.confidence, 1.0))

    # Boost extremely cautious responses slightly
    if validation_result.is_valid and confidence < 0.3:
        confidence = 0.5

    # 🚨 High-risk handling
    if validation_result.high_risk:
        safe_en = (
            "Your question may involve serious harm, instructions to commit an illegal act, or suicide-related content. "
            "For safety reasons, I cannot provide guidance.\n\n"
            "If you or someone else is in immediate danger, please:"
            "\n• Call emergency services (Dial 100 in India)"
            "\n• Contact local authorities"
            "\n\nIf your question is about legal consequences of an incident that already occurred (not future intent), please rephrase clearly."
        )
        safe_local = translate_from_english(safe_en, detected_lang)
        return QueryResponse(
            status="refusal",
            answer_primary=safe_local,
            answer_english=safe_en,
            confidence=confidence,
            detected_language=detected_lang,
            retrieved_sections=[],
            error_type="high_risk_refusal",
            high_risk=True,
        )

    # 🚫 Low confidence & invalid grounding
    if not validation_result.is_valid and confidence < 0.4:
        safe_en = (
            "I'm unable to provide a fully reliable legal interpretation based on the available information. "
            "Please consult a qualified legal expert."
        )
        safe_local = translate_from_english(safe_en, detected_lang)
        return QueryResponse(
            status="refusal",
            answer_primary=safe_local,
            answer_english=safe_en,
            confidence=confidence,
            detected_language=detected_lang,
            retrieved_sections=[],
            error_type="validation_refusal",
            high_risk=False,
        )

    # ⚠ Medium confidence
    if confidence < CONFIDENCE_THRESHOLD:
        disclaimer = (
            "\n\n⚠ NOTE: This explanation is based only on available legal sections and may not reflect recent updates or state variations. "
            "Consult a licensed lawyer before making decisions."
        )
        enriched_en = draft_answer_en + disclaimer
        enriched_local = translate_from_english(enriched_en, detected_lang)
        return QueryResponse(
            status="answer",
            answer_primary=enriched_local,
            answer_english=enriched_en,
            confidence=max(confidence, 0.5),
            detected_language=detected_lang,
            retrieved_sections=[RetrievedSection(**{
                "act": s["act"],
                "section": s["section"],
                "text": s["text"],
                "jurisdiction": s["jurisdiction"],
                "source_link": s.get("source_link", "")
            }) for s in reranked],
            error_type="medium_confidence",
            high_risk=False,
        )

    # 🟢 High confidence answer
    final_local = translate_from_english(draft_answer_en, detected_lang)
    return QueryResponse(
        status="answer",
        answer_primary=final_local,
        answer_english=draft_answer_en,
        confidence=confidence,
        detected_language=detected_lang,
        retrieved_sections=[RetrievedSection(**{
            "act": s["act"],
            "section": s["section"],
            "text": s["text"],
            "jurisdiction": s["jurisdiction"],
            "source_link": s.get("source_link", "")
        }) for s in reranked],
        error_type=None,
        high_risk=False,
    )
