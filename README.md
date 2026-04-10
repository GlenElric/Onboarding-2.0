# Aura Learning Platform

An AI-powered B2B/B2C learning platform.

## Architecture

- **apps/api**: NestJS backend (Port 3001)
- **apps/web**: Next.js frontend (Port 3000)
- **apps/ai-service**: FastAPI AI service (Port 8000)

## Getting Started (Local Development)

This platform now uses **SQLite** for zero-config database setup in local development.

### 1. Start the Backend API
```bash
cd apps/api
npm install
# Initialize database and seed with sample course
export DATABASE_URL="file:./prisma/dev.db"
npx prisma migrate dev --name init
npx prisma db seed
# Run the server
npm run start
```

### 2. Start the AI Service
```bash
cd apps/ai-service
pip install -r requirements.txt
# Ensure you have an OpenAI/Gemini API key in .env if needed
uvicorn main:app --reload --port 8000
```

### 3. Start the Frontend
```bash
cd apps/web
npm install
npm run dev
```

## Development Roadmap Status

- [x] **Step 0: Foundation** (Monorepo, Next.js, NestJS, Prisma, SQLite)
- [x] **Step 1: Identity** (JWT Auth, Role-based access)
- [x] **Step 2: Course Management** (Courses, Modules, Topics, Material uploads)
- [x] **Step 3: AI Pipeline** (PDF processing, sliding window chunking)
- [x] **Step 4: Learning Engine** (Enrollments, Dashboard, Sequential progress)
- [x] **Step 5: Assessment Engine** (AI Quizzes, Score thresholds, Retry logic)
- [ ] **Step 6: AI Tutor** (Chatbot remediation - *In Progress*)
- [ ] **Step 7: B2C Layer** (Stripe payments)
- [ ] **Step 8: B2B Layer** (Org management, Invitations)

## Core Features Implemented

- **Learning Engine**: Dynamic course navigation, modules, and topics.
- **Assessment Engine**: AI-generated quizzes with scoring and retry logic.
- **Content Processing**: Text chunking with sliding window context for better AI accuracy.
- **Polished UI**: Modern dashboard and curriculum views using Tailwind CSS and Lucide icons.

## Environment Variables

### `apps/api/.env`
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-key"
```

### `apps/web/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
