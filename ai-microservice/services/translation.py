# services/translation.py

from deep_translator import GoogleTranslator

def translate_to_english(text: str, src_lang_code: str) -> str:
    """
    Translate user query from src_lang_code → English.
    src_lang_code like 'hi', 'kn', 'ta', etc.
    """
    if src_lang_code.lower() == "en":
        return text.strip()

    try:
        translator = GoogleTranslator(source="auto", target="en")
        return translator.translate(text).strip()
    except Exception:
        # Better fallback: original text instead of empty string
        return text.strip()


def translate_from_english(text: str, target_lang_code: str) -> str:
    """
    Translate final answer from English → target_lang_code.
    """
    if target_lang_code.lower() == "en":
        return text.strip()

    try:
        translator = GoogleTranslator(source="en", target=target_lang_code)
        return translator.translate(text).strip()
    except Exception:
        # Fallback: keep the English response instead of breaking
        return text.strip()
