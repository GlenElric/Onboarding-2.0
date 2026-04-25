import os
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import PyPDF2
import io
import httpx
import openai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

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


@router.post("/course-structure")
async def extract_course_structure(
    file: UploadFile = File(...),
):
    """
    Analyzes a whole PDF and generates a structure of Modules and Topics using gpt-4o-mini.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF")

    # Use a large window for structure analysis
    context = text[:150000]

    prompt = f"""
    You are a Course Curriculum Architect.
    Analyze the following text extracted from a course PDF and generate a logical structure for an online course.
    Group the content into Modules, and each Module should have several Topics.
    For each topic, provide a brief 'content_summary' that captures the key concepts covered in that topic.
    This summary will be used to map raw text chunks to the topic later.

    TEXT CONTENT:
    {context}

    Provide your response in JSON format:
    {{
      "modules": [
        {{
          "title": "Module Title",
          "topics": [
            {{
              "title": "Topic Title",
              "content_summary": "Detailed summary of what this topic covers..."
            }},
            ...
          ]
        }},
        ...
      ]
    }}
    """

    try:
        openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a specialized Course Architect AI. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return json.loads(response.choices[0].message.content, strict=False)
    except Exception as e:
        print(f"STRUCTURE EXTRACTION ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate course structure: {str(e)}")
