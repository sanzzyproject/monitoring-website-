from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import check, health

app = FastAPI(
    title="PingChecker API",
    description="Serverless Website Monitoring API",
    version="1.0.0"
)

# Konfigurasi CORS (Penting untuk akses frontend ke backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Dalam production sebaiknya diganti dengan domain frontend spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(check.router, prefix="/api")
app.include_router(health.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "PingChecker API is running. Go to /api/check?url=... to use it."}
