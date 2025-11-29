# app/main.py
from fastapi import FastAPI
from schemas.request import QueryRequest
from schemas.response import QueryResponse
from core.pipeline import process_query

app = FastAPI(title="LawGuide India - AI Microservice")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI microservice running"}

@app.post("/answer", response_model=QueryResponse)
async def answer_query(payload: QueryRequest):
    return await process_query(payload)
