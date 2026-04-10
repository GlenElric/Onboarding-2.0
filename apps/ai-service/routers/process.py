import os
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import PyPDF2
import io
import httpx
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

API_SERVICE_URL = os.getenv("API_SERVICE_URL", "http://localhost:3001")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def chunk_text(text: str, chunk_size: int = 1500) -> list[str]:
    words = text.split()
    chunks = []
    current_chunk = []
    current_len = 0
    for word in words:
        current_len += len(word) + 1
        current_chunk.append(word)
        if current_len >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_len = 0
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks


@router.post("/pdf")
async def process_pdf(
    topicId: str = Query(..., description="ID of the topic this PDF belongs to"),
    file: UploadFile = File(...),
    token: str = Query(None, description="Bearer token to save chunks back to API"),
):
    """
    Reads a PDF, extracts text, chunks it, and stores the chunks via the NestJS API.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF")

    chunks = chunk_text(text)

    # Post chunks back to NestJS API
    if token:
        async with httpx.AsyncClient() as client:
            for idx, chunk in enumerate(chunks):
                await client.post(
                    f"{API_SERVICE_URL}/courses/topics/{topicId}/chunks",
                    json={"content": chunk, "order": idx},
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=10,
                )

    return {
        "message": f"PDF processed successfully",
        "topicId": topicId,
        "filename": file.filename,
        "chunkCount": len(chunks),
        "preview": chunks[0][:300] if chunks else "",
    }
