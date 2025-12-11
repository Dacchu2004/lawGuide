# services/translation.py

from deep_translator import GoogleTranslator
from services.language import resolve_language_code

def translate_to_english(text: str, src_lang_code: str) -> str:
    """
    Translate user query from src_lang_code → English.
    """
    if src_lang_code.lower() == "en" or src_lang_code.lower() == "english":
        return text.strip()

    try:
        translator = GoogleTranslator(source="auto", target="en")
        return translator.translate(text).strip()
    except Exception:
        return text.strip()


def translate_from_english(text: str, target_lang_code: str) -> str:
    """
    Safe translation English -> target language.
    Prevents empty or invalid language codes.
    """

    # --------- UNIVERSAL FIX ---------
    # 1. Resolve full names "Kannada" -> "kn"
    # 2. Handle empty/None -> "en"
    target_lang_code = resolve_language_code(target_lang_code)
    # ---------------------------------

    if target_lang_code == "en":
        return text.strip()

    try:
        CHUNK_SIZE = 4000

        if len(text) <= CHUNK_SIZE:
            translator = GoogleTranslator(source="en", target=target_lang_code)
            return translator.translate(text).strip()

        chunks = [text[i:i+CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)]
        translator = GoogleTranslator(source="en", target=target_lang_code)
        translated = [translator.translate(chunk) for chunk in chunks]

        return "".join(translated).strip()

    except Exception as e:
        print(f"Translation Error: {e}")
        return text.strip()
