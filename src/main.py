from src.models import AskRequest, AskResponse
from src.retrieval.rag_service import rag_service

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    try:
        answer = await rag_service.ask(request.query)
        return AskResponse(answer=answer)
    except Exception as e:
        return AskResponse(answer=f"Error: {str(e)}")