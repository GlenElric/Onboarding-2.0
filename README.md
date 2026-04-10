# Onboarding 2.0 — Aura Learning Platform

An AI-powered onboarding and learning platform built with NestJS, Next.js, and FastAPI (Gemini).

## Architecture

```
apps/
├── api/          # NestJS REST API (port 3001)
├── web/          # Next.js 14 frontend (port 3000)
└── ai-service/   # FastAPI AI service (port 8000)
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, Tailwind CSS |
| Backend API | NestJS 10, Prisma ORM, MySQL |
| AI Service | FastAPI, Google Gemini 1.5 Flash, PyPDF2 |
| Auth | JWT (passport-jwt) |

## Features

- 🔐 **Auth** — Signup/Login with JWT, role-based access (USER / ADMIN)
- 📚 **Courses** — Full CRUD, modules, topics with sequential unlocking
- 📄 **PDF Processing** — Upload PDFs → extract & chunk text → store via AI service
- 🤖 **AI Quiz Generation** — Gemini generates MCQs from course content
- 📊 **Progress Tracking** — Per-topic progress (locked → unlocked → completed)
- 🎯 **Quiz Engine** — Take AI-generated quizzes, graded with 70% pass threshold

## Setup

### 1. Database (MySQL)
```sql
CREATE DATABASE aura_learning;
```

### 2. API (NestJS)
```bash
cd apps/api
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev
npm run start:dev
```

### 3. AI Service (FastAPI)
```bash
cd apps/ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY=your-key
uvicorn main:app --reload --port 8000
```

### 4. Web (Next.js)
```bash
cd apps/web
npm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
npm run dev
```

## Environment Variables

### `apps/api/.env`
```
DATABASE_URL="mysql://root:password@localhost:3306/aura_learning"
JWT_SECRET="your-secret-key"
AI_SERVICE_URL="http://localhost:8000"
```

### `apps/ai-service/.env`
```
GEMINI_API_KEY=your-gemini-api-key
API_SERVICE_URL=http://localhost:3001
```

### `apps/web/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```
