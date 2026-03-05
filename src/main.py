from src.models import AskRequest, AskResponse
from src.retrieval.rag_service import rag_service

from fastapi import FastAPI

app = FastAPI()

@app.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    try:
        answer = await rag_service.ask(request.query)
        return AskResponse(answer=answer)
    except Exception as e:
        return AskResponse(answer=f"Error: {str(e)}")