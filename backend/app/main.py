"""FastAPI application entry point."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text

from app.config import get_settings
from app.db.session import engine, init_db
from app.api.deps import (
    validation_exception_handler,
    http_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import router as api_v1_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Phase II Full-Stack Todo Web Application API",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include API routers
app.include_router(api_v1_router)


@app.on_event("startup")
def on_startup():
    """Initialize database tables on startup."""
    # Import models to register them with SQLModel
    from app.models import User, Todo, Conversation, Message  # noqa: F401
    init_db()


@app.get("/health")
def health_check():
    """Check if the service is running."""
    return {"status": "healthy"}


@app.get("/ready")
def readiness_check():
    """Check if the service is ready to accept requests (database connected)."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception:
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "database": "disconnected"}
        )
