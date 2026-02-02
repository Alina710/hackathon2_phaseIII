"""Message schemas per contracts/chat-api.yaml."""

from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class MessageRole(str, Enum):
    """Message role enum."""
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class ToolCallSchema(BaseModel):
    """Schema for tool call within a message."""
    tool: str
    input: dict
    output: dict
    status: str


class MessageResponse(BaseModel):
    """Message response schema."""
    id: UUID
    role: MessageRole
    content: str
    tool_calls: Optional[List[ToolCallSchema]] = None
    created_at: datetime

    class Config:
        from_attributes = True
