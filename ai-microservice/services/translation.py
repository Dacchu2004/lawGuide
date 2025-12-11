# services/translation.py

from deep_translator import GoogleTranslator

def translate_to_english(text: str, src_lang_code: str) -> str:
    """
    Translate user query from src_lang_code → English.
    """
    if src_lang_code.lower() == "en":
        return text.strip()

    try:
        translator = GoogleTranslator(source="auto", target="en")
        return translator.translate(text).strip()
    except Exception:
        return text.strip()


def translate_from_english(text: str, target_lang_code: str) -> str:
    """
    Translate final answer from English → target_lang_code.
    Handles long text by chunking (approx 4500 chars).
    """
    if target_lang_code.lower() == "en":
        return text.strip()

    try:
        # Simple chunking by paragraphs or strict length
        # GoogleTranslator usually handles ~5000 chars. We'll be safe with 4000.
        CHUNK_SIZE = 4000
        
        if len(text) <= CHUNK_SIZE:
             translator = GoogleTranslator(source="en", target=target_lang_code)
             return translator.translate(text).strip()
        
        # Split by chunks
        chunks = [text[i:i+CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)]
        translator = GoogleTranslator(source="en", target=target_lang_code)
        translated_chunks = []
        for chunk in chunks:
            translated_chunks.append(translator.translate(chunk))
            
        return "".join(translated_chunks).strip()

    except Exception as e:
        print(f"Translation Error: {e}")
        # Fallback: keep the English response instead of breaking
        return text.strip()
