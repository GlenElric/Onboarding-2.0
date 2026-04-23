import os
from fastapi import APIRouter, HTTPException, Query
import httpx
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

class ChatRequest(BaseModel):
    context: str
    message: str

@router.post("/chat")
async def generate_chat(request: ChatRequest):
    """
    RAG-based chat using provided context chunks.
    """
    if not request.context:
        return {"answer": "I don't have any specific content for this topic yet. How can I help you generally?", "citations": []}

    prompt = f"""
    You are an AI Tutor for the Aura Learning Platform.
    Use the following content to answer the student's question.
    If the answer is not in the content, say you don't know based on the material provided, but try to be helpful.
    Always provide citations if you use specific parts of the text.

    CONTENT:
    {request.context}

    STUDENT QUESTION:
    {request.message}

    Provide your response in JSON format:
    {{
      "answer": "your response text",
      "citations": ["list of strings or source indicators"]
    }}
    """

    model = genai.GenerativeModel('gemini-1.5-flash')
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quiz")
async def generate_quiz(topicId: str = Query(...)):
    """
    Generate structured MCQs from topic content chunks.
    """
    # 1. Fetch chunks from NestJS API
    API_SERVICE_URL = os.getenv("API_SERVICE_URL", "http://localhost:3001")

    async with httpx.AsyncClient() as client:
        try:
            # We assume internal communication doesn't always need full JWT for these tasks if secured by VPC
            # or we could use a service token. For MVP, we'll try to fetch public chunks if allowed.
            resp = await client.get(f"{API_SERVICE_URL}/courses/topics/{topicId}/chunks")
            chunks = resp.json()
            context = "\n\n".join([c['content'] for c in chunks])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch content from API: {str(e)}")

    if not context:
        raise HTTPException(status_code=400, detail="No content available for this topic to generate a quiz.")

    prompt = f"""
    You are an AI Assessment Generator.
    Based on the following content, generate 5 Multiple Choice Questions (MCQs).
    Each question should have 4 options and exactly one correct answer.

    CONTENT:
    {context}

    Provide your response in JSON format:
    {{
      "questions": [
        {{
          "text": "question text",
          "options": [
            {{ "text": "option 1", "isCorrect": true }},
            {{ "text": "option 2", "isCorrect": false }},
            ...
          ]
        }},
        ...
      ]
    }}
    """

    model = genai.GenerativeModel('gemini-1.5-flash')
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
