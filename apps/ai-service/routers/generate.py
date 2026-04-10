import os
import json
from fastapi import APIRouter, HTTPException, Query
import httpx
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

API_SERVICE_URL = os.getenv("API_SERVICE_URL", "http://localhost:3001")

QUIZ_PROMPT_TEMPLATE = """
You are an expert educational quiz generator. Based on the following course content, generate exactly {count} multiple-choice quiz questions.

CONTENT:
{content}

Requirements:
- Each question must test understanding of a key concept from the content
- Each question must have exactly 4 options
- Exactly 1 option must be correct
- Questions should range from basic recall to application-level understanding
- Keep questions concise and unambiguous

Return ONLY a valid JSON array (no markdown, no explanations) in this exact format:
[
  {{
    "text": "Question text here?",
    "options": [
      {{"text": "Option A", "isCorrect": false}},
      {{"text": "Option B", "isCorrect": true}},
      {{"text": "Option C", "isCorrect": false}},
      {{"text": "Option D", "isCorrect": false}}
    ]
  }}
]
"""


@router.post("/quiz")
async def generate_quiz(
    topicId: str = Query(..., description="Topic ID to generate quiz for"),
    questionCount: int = Query(5, description="Number of questions to generate"),
    token: str = Query(None, description="Bearer token to fetch content chunks"),
):
    """
    Fetches content chunks for a topic, sends them to Gemini, and returns structured quiz questions.
    """
    content = ""

    # Fetch content chunks from the NestJS API
    if token:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{API_SERVICE_URL}/courses/topics/{topicId}/chunks",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=15,
                )
                if resp.status_code == 200:
                    chunks = resp.json()
                    content = "\n\n".join([c.get("content", "") for c in chunks])
        except Exception:
            pass

    if not content:
        raise HTTPException(
            status_code=422,
            detail="No content found for this topic. Please upload a PDF first.",
        )

    # Trim to avoid token limits (roughly 4000 words)
    words = content.split()
    if len(words) > 4000:
        content = " ".join(words[:4000])

    prompt = QUIZ_PROMPT_TEMPLATE.format(count=questionCount, content=content)

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        questions = json.loads(raw)

        if not isinstance(questions, list):
            raise ValueError("Expected a JSON array")

        return {"topicId": topicId, "questions": questions}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Gemini returned invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
