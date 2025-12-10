# services/llm.py

import json
import requests
from typing import List, Dict, Any, Optional

from config import GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL_NAME
from core.validation import ValidationResult



SCRIPT_INSTRUCTIONS = {
    "hi": "Hindi Language (using Devanagari script)",
    "ta": "Tamil Language (using Tamil script)",
    "te": "Telugu Language (using Telugu script)",
    "kn": "Kannada Language (using Kannada script)",
    "ml": "Malayalam Language (using Malayalam script)",
    "bn": "Bengali Language (using Bengali script)",
    "gu": "Gujarati Language (using Gujarati script)",
    "mr": "Marathi Language (using Devanagari script)",
    "pa": "Punjabi Language (using Gurmukhi script)",
    "en": "English Language",
}

def _groq_chat(
    messages: List[Dict[str, str]],
    max_tokens: int = 800,
    temperature: float = 0.2,
) -> Optional[str]:
    """
    Send a chat request to Groq LLM.
    Returns only the content string or None if failed.
    """
    if not GROQ_API_KEY:
        print("⚠ GROQ_API_KEY not set. Skipping LLM call.")
        return None

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL_NAME,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }

    try:
        resp = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=40)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"🚨 Groq API Error: {str(e)}")
        return None


def classify_intent(query: str) -> str:
    """
    Classifies user query into: GENERAL, LEGAL, OFF_TOPIC, ILLEGAL
    """
    if not GROQ_API_KEY:
        return "LEGAL"  # Fallback

    system = (
        "You are an intent classifier for a legal AI assistant.\n\n"
        "Classify the user query into exactly ONE of the following:\n\n"
        "GENERAL → greetings, who are you, what can you do, thanks, small talk\n"
        "LEGAL → laws, crimes, punishments, FIR, disputes, money, property, family conflicts, violence, police, court\n"
        "OFF_TOPIC → coding, math, cooking, movies, sports, jokes, random facts\n"
        "ILLEGAL → escaping crime, harming someone, fraud tactics\n\n"
        "Rules:\n"
        "- Any real-world problem involving money/property/violence/disputes = LEGAL\n"
        "- Instructions to escape law = ILLEGAL\n"
        "- Respond ONLY with one word from: GENERAL, LEGAL, OFF_TOPIC, ILLEGAL"
    )

    msgs = [
        {"role": "system", "content": system},
        {"role": "user", "content": query}
    ]

    # Quick classification
    resp = _groq_chat(msgs, max_tokens=10, temperature=0.0)
    if not resp:
        return "LEGAL"
    
    intent = resp.upper().strip()
    # Sanity check
    if intent not in ["GENERAL", "LEGAL", "OFF_TOPIC", "ILLEGAL"]:
        return "LEGAL"
        
    return intent


def chat_general(query: str) -> Optional[str]:
    """
    Handles GENERAL queries (greetings, about me)
    """
    if not GROQ_API_KEY:
        return None

    system = (
        "You are LawGuide AI.\n"
        "You are polite, friendly, and informative.\n"
        "If the user greets you or asks who you are, introduce yourself briefly.\n"
        "If the user says 'ok', 'thanks', 'good', etc., simply acknowledge politely (e.g., 'You're welcome!', 'Glad I could help.').\n"
        "Do NOT re-introduce yourself unless asked.\n"
        "If the user asks illegal or harmful questions, you MUST refuse.\n"
        "Keep responses concise and helpful."
    )

    msgs = [
        {"role": "system", "content": system},
        {"role": "user", "content": query},
    ]

    # User requested huge limit ("infinity") -> using 4096 which is practical max
    return _groq_chat(msgs, temperature=0.4, max_tokens=4096)


def generate_answer(
    query: str,
    sections: List[Dict[str, Any]],
    explanation_mode: str,
    state: str,
    target_language: str = "en",
) -> Optional[str]:
    """
    Phase 1: Generate an answer grounded ONLY in the retrieved legal sections.
    - If user asks how to commit a crime or avoid punishment → must refuse.
    - If context insufficient → must say so and recommend consulting a lawyer.
    """
    if not GROQ_API_KEY:
        print("⚠ GROQ_API_KEY not set. Skipping answer generation.")
        return None

    context_text = "\n\n".join(
        f"Act: {s['act']}\nSection: {s['section']}\nText: {s['text']}\n---"
        for s in sections
    )

    style_instruction = (
        "Explain in clear, simple legal language suitable for an adult without a law background."
        if explanation_mode != "eli15"
        else "Explain like I am 15 years old, using very simple language and practical examples."
    )

    system_prompt = (
    "You are a legal information assistant for India with the goal of empowering general users "
    "to understand their rights, legal responsibilities, and consequences.\n\n"
    "- Use ONLY the legal sections provided in the context for legal citations.\n"
    "- Describe practical steps, procedures, and real-world actions (e.g., where to file, "
    "who to contact, what documents or evidence are required, how to respond to notices).\n"
    "- You are NOT a lawyer and MUST NOT provide legal advice, personal strategy, or methods to evade punishment.\n"
    "- You MAY describe general legal remedies and lawful options (e.g., 'You may file a complaint with police', "
    "'You can pay the challan online', 'You can contest through the magistrate', etc.).\n"
    "- ⚠ If the query is about committing a future illegal act or intentionally avoiding legal consequences "
    "after causing harm, REFUSE and warn clearly.\n"
    "- Use clear, practical, structured bullet points.\n"
    "- Always mention relevant Act and Section numbers from the context when explaining.\n\n"
    "📌 Format your response in the following structure when possible:\n"
    "   1) Brief explanation of the legal situation or rule\n"
    "   2) Relevant Act and Section numbers\n"
    "   3) Step-by-step actions the user should take\n"
    "   4) Additional warnings, rights, or penalties if applicable\n"
    "   5) Final disclaimer\n\n"
    "- Always end with exactly this disclaimer:\n"
    "'This is informational and not legal advice. Please consult a qualified lawyer for specific guidance.'"
)



    lang_instruction = SCRIPT_INSTRUCTIONS.get(target_language.lower(), target_language.upper() + " LANGUAGE")

    user_prompt = (
        f"User state: {state}\n"
        f"User query: {query}\n\n"
        f"Relevant legal sections:\n{context_text}\n\n"
        f"{style_instruction}\n"
        f"RESPOND STRICTLY IN {lang_instruction}. Do not use transliteration (e.g. Hinglish/Tanglish)."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    # User requested huge limit ("infinity") -> using 4096 which is practical max
    return _groq_chat(messages, max_tokens=4096)


def validate_answer(
    answer: str,
    sections: List[Dict[str, Any]],
    query: str,
) -> ValidationResult:
    """
    Phase 2: Ask LLM to validate:
    - Is the answer strictly grounded in the provided sections?
    - Does it seem dangerously misleading?
    - Is the query involving self-harm or instructions to commit crime?

    Returns ValidationResult:
        - is_valid: answer is grounded and not misleading
        - confidence: 0–1
        - high_risk: True ONLY if question involves self-harm / serious violence intent / how-to-commit-crime
    """
    if not GROQ_API_KEY or not answer:
        print("⚠ Validation skipped – missing API key or answer.")
        return ValidationResult(is_valid=False, confidence=0.0, high_risk=False)

    context_text = "\n\n".join(
        f"Act: {s['act']}\nSection: {s['section']}\nText: {s['text']}\n---"
        for s in sections
    )

    system_prompt = (
    "You are a safety and grounding validator for a legal information assistant in India.\n\n"
    "You will receive:\n"
    "1) The user's query.\n"
    "2) The AI's answer.\n"
    "3) The retrieved legal sections.\n\n"
    "Your responsibilities:\n"
    "A) Check if the AI's answer is Reasonably supported by the provided sections and general legal context.\n"
    "   - You should ALLOW general procedural advice (e.g. 'visit police station', 'file written complaint') even if not explicitly in the retrieved text.\n"
    "   - Only mark is_valid = false if the answer cites specific WRONG sections/penalties or makes up laws not in the text.\n"
    "B) Check if the AI's answer is dangerously misleading.\n"
    "C) Determine if the query is HIGH-RISK, which ONLY applies when:\n"
    "   - The user asks how to commit a serious crime (e.g., murder, assault) or intentionally avoid legal punishment, OR\n"
    "   - The user expresses intent to self-harm or suicide.\n"
    "   🚫 Do NOT mark as high-risk when user is asking about consequences of a past action "
    "   (e.g., crossing a red signal, not wearing helmet) or seeking general legal awareness.\n"
    "   🚫 If the user is a VICTIM asking what legal action can be taken, this is NOT high-risk.\n\n"
    "If you are unsure about grounding, set is_valid = false but keep high_risk = false unless the query itself indicates high-risk.\n\n"
    "You MUST respond ONLY with a JSON object:\n"
    "{ \"is_valid\": true or false, \"confidence\": number between 0 and 1, \"high_risk\": true or false }\n\n"
    "- Do NOT add any explanation, text, or notes outside the JSON.\n"
)


    user_prompt = (
        f"User query:\n{query}\n\n"
        f"AI answer:\n{answer}\n\n"
        f"Retrieved legal sections:\n{context_text}\n\n"
        "Now perform your evaluation and return ONLY the JSON object."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    raw = _groq_chat(messages, max_tokens=250, temperature=0.0)

    if not raw:
        return ValidationResult(is_valid=False, confidence=0.0, high_risk=False)

    try:
        data = json.loads(raw)
        return ValidationResult(
            is_valid=bool(data.get("is_valid", False)),
            confidence=float(data.get("confidence", 0.0)),
            high_risk=bool(data.get("high_risk", False)),
        )
    except Exception:
        print("⚠ JSON parsing failed in validation – marking as invalid.")
        return ValidationResult(is_valid=False, confidence=0.0, high_risk=False)
