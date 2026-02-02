"""Message model per data-model.md."""

from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional, Any
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import Text, JSON
from enum import Enum


class MessageRole(str, Enum):
    """Message role enum - who sent the message."""
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


if TYPE_CHECKING:
    from app.models.conversation import Conversation


class Message(SQLModel, table=True):
    """Message entity representing a single exchange in a conversation."""

    __tablename__ = "message"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True)
    role: str = Field(max_length=20)  # 'user', 'assistant', or 'tool'
    content: str = Field(sa_column=Column(Text))
    tool_calls: Optional[Any] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
