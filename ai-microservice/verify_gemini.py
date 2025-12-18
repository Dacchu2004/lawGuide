import os
import sys

# Ensure we can import services
sys.path.append(os.getcwd())

from services.llm import classify_intent, chat_general
from services.summarizer import summarize_text
from config import GEMINI_API_KEY, GEMINI_MODEL_NAME

def test_integration():
    print("Testing Gemini Integration...")
    print(f"   API Key Present: {bool(GEMINI_API_KEY)}")
    print(f"   Model Name: {GEMINI_MODEL_NAME}")
    
    # 1. Test Intent Classification
    print("\n[1] Testing Intent Classification (expect GENERAL)...")
    try:
        intent = classify_intent("Hello there")
        print(f"    Intent: {intent}")
    except Exception as e:
        print(f"    FAILED with exception: {e}")
        intent = "FAILED"

    # 2. Test Chat General
    print("\n[2] Testing Chat General...")
    try:
        response = chat_general("Hi, I am testing your new brain.")
        print(f"    Response: {response}")
    except Exception as e:
        print(f"    FAILED with exception: {e}")
        response = None
    
    # 3. Test Summarizer
    print("\n[3] Testing Summarizer...")
    try:
        dummy_legal_text = (
            "Whoever, being a public servant, knowingly disobeys any direction of the law as to the way in which he is to conduct himself as such public servant, intending to cause, or knowing it to be likely that he will, by such disobedience, cause injury to any person, shall be punished with simple imprisonment for a term which may extend to one year, or with fine, or with both."
        )
        summary = summarize_text(dummy_legal_text)
        print(f"    Summary: {summary}")
    except Exception as e:
        print(f"    FAILED with exception: {e}")
        summary = None

    if response is None:
        print("\nVerification Failed: chat_general returned None")
        sys.exit(1)
        
    print("\nVerification Completed (Check outputs above)")

if __name__ == "__main__":
    test_integration()
