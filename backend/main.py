# backend/main.py
# FastAPI application entry point: creates the app instance, registers
# routers, configures CORS, and starts the Uvicorn server when run directly.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router

app = FastAPI(title="Geopolitics News Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)