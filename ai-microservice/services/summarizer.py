# services/summarizer.py

from services.llm import _groq_chat

def summarize_text(text: str) -> str:
    """
    Generates a clean, readable legal summary WITHOUT markdown, stars, or bullets.
    """

    if not text or len(text.strip()) < 80:
        return "The selected legal text is too short to generate a meaningful explanation."

    system_prompt = (
        "You are a legal explainer for Indian law.\n\n"
        "Your task:\n"
        "- Rewrite the legal section in very simple English.\n"
        "- DO NOT repeat the original text.\n"
        "- DO NOT use markdown symbols (*, **, -, etc.).\n"
        "- Do NOT show bullet points.\n"
        "- Use short clean paragraphs.\n"
        "- Cover: what the law is about, who it applies to, punishment, and purpose.\n\n"
        "Return ONLY plain readable text."
    )

    user_prompt = f"Legal section:\n{text}\n\nNow explain it simply."

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    result = _groq_chat(
        messages,
        max_tokens=500,
        temperature=0.2,
    )

    if not result:
        return (
            "A clear explanation is currently unavailable. "
            "Please consult a legal expert."
        )

    return result.strip()
