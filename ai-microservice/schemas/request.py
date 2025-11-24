
from pydantic import BaseModel
from typing import optional, List

class Conversation(BaseModel):
    role:str
    content:str

class QueryRequest(BaseModel):
    query_text:str
    user_state: Optional[str] = None  # Default from user profile
    user_language: Optional[str] = None  # Default from user profile
    explanation_mode:str= "normal"  # Or "eli15"
    query_id:Optional[int]=None
    user_id:Optional[int]=None
    conversation:Optional[List[Conversation]]=None
