"""API v1 router aggregating all endpoints."""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.todos import router as todos_router

router = APIRouter(prefix="/api/v1")

# Include routers
router.include_router(auth_router)
router.include_router(todos_router)
