"""Chat request/response schemas per contracts/chat-api.yaml."""

from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field


class ToolCall(BaseModel):
    """Represents an MCP tool invocation."""
    tool: str = Field(..., description="Name of the MCP tool invoked")
    input: dict = Field(..., description="Input parameters passed to the tool")
    output: dict = Field(..., description="Output returned by the tool")
    status: str = Field(..., description="Execution status: success or error")


class ChatRequest(BaseModel):
    """Request body for POST /api/v1/chat."""
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Natural language message from user"
    )
    conversation_id: Optional[UUID] = Field(
        default=None,
        description="Optional conversation ID to continue existing conversation"
    )


class ChatResponse(BaseModel):
    """Response body for POST /api/v1/chat."""
    response: str = Field(..., description="AI assistant's response message")
    conversation_id: UUID = Field(..., description="Conversation ID (new or existing)")
    tool_calls: List[ToolCall] = Field(
        default_factory=list,
        description="Tools invoked during this interaction"
    )
