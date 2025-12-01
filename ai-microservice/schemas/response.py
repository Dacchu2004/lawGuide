from pydantic import BaseModel, Field
from typing import List, Optional

class RetrievedSection(BaseModel):
    act: str
    section: str
    text: str
    jurisdiction: str
    source_link: Optional[str] = None

class QueryResponse(BaseModel):
    status: str  # "answer" or "refusal"
    answer_primary: Optional[str] = None  # Final answer in original language
    answer_english: Optional[str] = None  # English version for internal use
    confidence: float = 0.0
    detected_language: Optional[str] = None
    
    retrieved_sections: List[RetrievedSection] = Field(default_factory=list)
    
    error_type: Optional[str] = None  # Like "unretrievable" "low_confidence" "invalid_query"
    high_risk: bool = False  # Used to trigger caution notifications
    
# 🆕 New: for section search API (law browser)
class SectionSearchResult(BaseModel):
    act: str
    section: str
    text_primary: str       # in user's language
    text_english: str       # original English law
    jurisdiction: str
    source_link: Optional[str] = None


class SectionSearchResponse(BaseModel):
    detected_language: str
    query_text: str
    results: List[SectionSearchResult] = Field(default_factory=list)