"""Conversation schemas per contracts/chat-api.yaml."""

from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field


class ConversationSummary(BaseModel):
    """Summary of a conversation for list responses."""
    id: UUID
    created_at: datetime
    last_activity: datetime
    message_count: int
    preview: Optional[str] = Field(
        default=None,
        description="First message preview (truncated)"
    )


class ConversationListResponse(BaseModel):
    """Response body for GET /api/v1/conversations."""
    conversations: List[ConversationSummary]
    total: int = Field(..., description="Total number of conversations")


class ConversationDetailResponse(BaseModel):
    """Response body for GET /api/v1/conversations/{id}."""
    id: UUID
    created_at: datetime
    last_activity: datetime
    messages: List["MessageResponse"] = Field(default_factory=list)


# Import at bottom to avoid circular import
from app.schemas.message import MessageResponse

ConversationDetailResponse.model_rebuild()
