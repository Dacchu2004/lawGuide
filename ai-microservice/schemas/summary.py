# schemas/summary.py

from pydantic import BaseModel
from typing import Optional


class SectionSummaryRequest(BaseModel):
    text: str
    user_language: Optional[str] = "en"


class SectionSummaryResponse(BaseModel):
    summary: str
