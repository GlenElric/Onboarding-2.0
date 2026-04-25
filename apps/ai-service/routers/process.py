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
    # Clean control characters except common ones like \n and \t
    import re
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', text)
    return text


def chunk_text(text: str, chunk_size: int = 1500, overlap: int = 200) -> list[str]:
    """
    Chunks text using a sliding window approach with overlap.
    chunk_size and overlap are in characters for simpler implementation here.
    """
    chunks = []
    if not text:
        return chunks

    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size

        # If not the first chunk, try to find a space to break more cleanly
        if end < text_len:
            # Look for a space near the end of the chunk
            last_space = text.rfind(' ', start, end)
            if last_space != -1 and last_space > start:
                end = last_space

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap
        if start >= text_len or end >= text_len:
            break

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
        async with httpx.AsyncClient() as http_client:
            for idx, chunk in enumerate(chunks):
                await http_client.post(
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
