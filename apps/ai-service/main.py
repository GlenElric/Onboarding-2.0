from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import process, generate

app = FastAPI(title="Aura Learning AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process.router, prefix="/process", tags=["process"])
app.include_router(generate.router, prefix="/generate", tags=["generate"])

@app.get("/")
def read_root():
    return {"message": "Aura Learning AI Service is running"}
