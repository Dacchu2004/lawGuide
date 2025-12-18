
import os
import sys

# Ensure we can import services
sys.path.append(os.getcwd())

from services.llm import generate_answer

def test_legal_rag():
    print("🧪 Testing Legal RAG with Context...")
    
    # Simulate retrieved sections (RAG context)
    # Creating a dummy context that mimics multiple legal sections
    sections = []
    for i in range(5):
        sections.append({
            "act": "Indian Penal Code",
            "section": f"Section {300 + i}",
            "text": f"This is the legal text for section {300 + i}. It defines the punishment for specific offenses involved in mock scenarios. " * 20  # ~40 words * 20 = 800 words per section
        })
    
    # User query
    query = "What are the punishments mentioned in these sections?"
    state = "Karnataka"
    
    print(f"   Context Size: {len(sections)} sections (approx {5 * 800} words)")
    
    try:
        answer = generate_answer(
            query=query,
            sections=sections,
            explanation_mode="standard",
            state=state
        )
        
        if answer:
            print("\n✅ Answer Generated Successfully:")
            print("-" * 40)
            print(answer)
            print("-" * 40)
        else:
            print("\n❌ No answer generated (returned None).")

    except Exception as e:
        print(f"\n❌ Exception: {e}")

if __name__ == "__main__":
    test_legal_rag()
