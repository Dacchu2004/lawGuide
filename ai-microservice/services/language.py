# services/language.py
from typing import Optional

LANG_NAME_TO_CODE = {
    "English": "en",
    "Hindi": "hi",
    "Kannada": "kn",
    "Tamil": "ta",
    "Telugu": "te",
    "Malayalam": "ml",
    "Marathi": "mr",
    "Bengali": "bn",
    "Gujarati": "gu",
}

def resolve_language_code(user_language: Optional[str]) -> str:
    """
    Map user_language (e.g., 'Kannada' or 'kn') to language code ('kn').
    Default is 'en' (English).
    """
    if not user_language:
        return "en"
    
    sanitized = user_language.strip().title()  # Handles 'kannada', ' KANNADA ', etc.

    # Directly if it's a full name
    if sanitized in LANG_NAME_TO_CODE:
        return LANG_NAME_TO_CODE[sanitized]

    # If already code (like 'kn', 'en')
    if user_language.lower() in LANG_NAME_TO_CODE.values():
        return user_language.lower()

    return "en"

def detect_language(text: str, user_language: Optional[str] = None) -> str:
    """
    Detects language preference from text keywords first, then user profile.
    """
    text_lower = text.lower()
    
    # Check for explicit instructions like "in hindi", "in tamil"
    for name, code in LANG_NAME_TO_CODE.items():
        if f"in {name.lower()}" in text_lower:
            return code

    return resolve_language_code(user_language)
