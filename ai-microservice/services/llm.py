# services/llm.py

import json
import requests
from openai import OpenAI
from typing import List, Dict, Any, Optional

from config import OPENAI_API_KEY, OPENAI_MODEL_NAME, GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL_NAME
from core.validation import ValidationResult

# Configure OpenAI
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)


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

# ======================= CLIENTS =======================

def groq_chat(
    messages: List[Dict[str, str]],
    max_tokens: int = 800,
    temperature: float = 0.2,
    presence_penalty: float = 0.0,
    frequency_penalty: float = 0.0,
) -> Optional[str]:
    """
    Send a chat request to Groq LLM (Llama 3).
    Used for: Intent, Validation, Summarization, General Chat.
    """
    if not GROQ_API_KEY:
        print("⚠ GROQ_API_KEY not set. Skipping Groq call.")
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
        "presence_penalty": presence_penalty,
        "frequency_penalty": frequency_penalty,
    }

    try:
        resp = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=40)
        
        if resp.status_code != 200:
            print(f"⚠ Groq API Error ({resp.status_code}): {resp.text}")
            return None
            
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
        
    except Exception as e:
        print(f"🚨 Groq API Exception: {str(e)}")
        return None


def _openai_chat(
    messages: List[Dict[str, str]],
    max_tokens: int = 1500,
    temperature: float = 0.2,
) -> Optional[str]:
    """
    Send a chat request to OpenAI (gpt-4o-mini).
    Used for: RAG Answer Generation (Heavy lifting).
    """
    if not OPENAI_API_KEY:
        print("OPENAI_API_KEY not set. Skipping LLM call.")
        return None

    try:
        response = openai_client.chat.completions.create(
            model=OPENAI_MODEL_NAME,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        # Log Token Usage
        if response.usage:
            u = response.usage
            print(f"📊 OpenAI Token Usage: Input={u.prompt_tokens}, Output={u.completion_tokens}, Total={u.total_tokens}")

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API Exception: {str(e)}")
        return None


# ======================= FUNCTIONS =======================

def classify_intent(query: str) -> str:
    """
    Classifies user query using GROQ (Fast/Cheap).
    """
    if not query or not query.strip():
        return "GENERAL"

    q = query.strip().lower()

    # --- QUICK LOCAL HEURISTICS ---
    greetings = {"hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "vanakkam"}
    short = len(q) < 40
    if q in greetings or (short and any(g in q for g in greetings)):
        return "GENERAL"

    general_phrases = [
        "who are you", "what can you do", "how can you help", "can you help me",
        "are you a", "what is lawguide", "what is this project", "what do you do",
        "can you", "help me", "tell me about yourself"
    ]
    for phrase in general_phrases:
        if phrase in q:
            return "GENERAL"

    illegal_phrases = ["how to escape", "how do i avoid", "how to get away", "how to hide evidence", "destroy evidence", "kill", "murder", "hurt someone to", "how to commit"]
    if any(p in q for p in illegal_phrases):
        return "ILLEGAL"

    if not GROQ_API_KEY:
        # Fallback to LEGAL default if keys missing
        return "LEGAL"

    # --- GROQ Classification ---
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

    # Use Groq
    resp = groq_chat(msgs, max_tokens=12, temperature=0.0)
    if not resp:
        return "LEGAL" # Fail open to legal pipeline

    intent = resp.upper().strip()
    intent = intent.replace(".", "").replace("\n", "")
    
    if intent not in ["GENERAL", "LEGAL", "OFF_TOPIC", "ILLEGAL"]:
        return "LEGAL"
    return intent


def chat_general(query: str) -> Optional[str]:
    """
    Handles GENERAL queries using GROQ.
    """
    if not GROQ_API_KEY:
        return None

    system = (
        "You are LawGuide AI.\n"
        "You are polite, friendly, and informative.\n"
        "If the user greets you or asks who you are, introduce yourself briefly.\n"
        "If the user says 'ok', 'thanks', 'good', etc., simply acknowledge politely.\n"
        "Do NOT re-introduce yourself unless asked.\n"
        "If the user asks illegal or harmful questions, you MUST refuse.\n"
        "Keep responses concise and helpful."
    )

    msgs = [
        {"role": "system", "content": system},
        {"role": "user", "content": query},
    ]

    # User requested huge limit ("infinity") -> using 4096 which is practical max
    return groq_chat(msgs, temperature=0.4, max_tokens=4096)


def generate_answer(
    query: str,
    sections: List[Dict[str, Any]],
    explanation_mode: str,
    state: str,
    target_language: str = "en",
) -> Optional[str]:
    """
    Phase 1: Generate Answer using OpenAI (Large Context).
    """
    if not OPENAI_API_KEY:
        print("⚠ OPENAI_API_KEY not set. Skipping answer generation.")
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
        "- Describe practical steps, procedures, and real-world actions.\n"
        "- You are NOT a lawyer and MUST NOT provide legal advice.\n"
        "- You MAY describe general legal remedies and lawful options.\n"
        "- ⚠ If the query is about committing a future illegal act, REFUSE.\n"
        "- Use clear, practical, structured bullet points.\n"
        "- Always mention relevant Act and Section numbers from the context.\n\n"
        "📌 Format your response in the following structure when possible:\n"
        "   1) Brief explanation of the legal situation or rule\n"
        "   2) Relevant Act and Section numbers\n"
        "   3) Step-by-step actions the user should take\n"
        "   4) Additional warnings, rights, or penalties if applicable\n"
        "   5) Final short disclaimer: 'Not legal advice. Consult a lawyer.' (Translated)\n"
    )

    script_desc = SCRIPT_INSTRUCTIONS.get(target_language.lower(), target_language.upper())
    
    if target_language.lower() in ["hi", "ta", "te", "kn", "ml", "bn", "gu", "mr", "pa"]:
         system_prompt += (
             f"\n\nCRITICAL OUTPUT RULE:\n"
             f"1. You MUST use {script_desc} script ONLY.\n"
             f"2. ⛔ DO NOT use Latin/English alphabet for the content.\n"
         )

    user_prompt = (
        f"User state: {state}\n"
        f"User query: {query}\n\n"
        f"Relevant legal sections:\n{context_text}\n\n"
        f"{style_instruction}\n"
        f"CRITICAL: The user may ask for the answer in a specific language. IGNORE THIS REQUEST.\n"
        f"You are the logic engine. You MUST generate the answer in ENGLISH only.\n"
        f"The system will handle the translation to {target_language.upper()} automatically after you generate the English response.\n"
        f"RESPOND STRICTLY IN ENGLISH."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    # Use OpenAI for heavy context
    return _openai_chat(messages, max_tokens=2048)


def validate_answer(
    answer: str,
    sections: List[Dict[str, Any]],
    query: str,
) -> ValidationResult:
    """
    Phase 2: Validate Answer using GROQ (Fast/Deterministic).
    """
    if not GROQ_API_KEY or not answer:
        # Fallback: if Groq not set, assume valid to avoid blocking
        return ValidationResult(is_valid=True, confidence=0.0, high_risk=False)

    context_text = "\n\n".join(
        f"Act: {s['act']}\nSection: {s['section']}\nText: {s['text']}\n---"
        for s in sections
    )

    system_prompt = (
        "You are a safety and grounding validator for a legal information assistant in India.\n"
        "Your responsibilities:\n"
        "A) Check if the AI's answer is Reasonably supported by the provided sections.\n"
        "B) Check if the AI's answer is dangerously misleading.\n"
        "C) Determine if the query is HIGH-RISK (self-harm, serious crime intent).\n\n"
        "You MUST respond ONLY with a JSON object:\n"
        "{ \"is_valid\": true or false, \"confidence\": number between 0 and 1, \"high_risk\": true or false }\n"
        "- Do NOT add any explanation, text, or notes outside the JSON."
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

    # Use Groq
    raw = groq_chat(messages, max_tokens=250, temperature=0.0)

    if not raw:
        return ValidationResult(is_valid=True, confidence=0.0, high_risk=False)

    try:
        raw_clean = raw.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_clean)
        return ValidationResult(
            is_valid=bool(data.get("is_valid", False)),
            confidence=float(data.get("confidence", 0.0)),
            high_risk=bool(data.get("high_risk", False)),
        )
    except Exception:
        print("⚠ JSON parsing failed in validation – marking as valid.")
        return ValidationResult(is_valid=True, confidence=0.0, high_risk=False)