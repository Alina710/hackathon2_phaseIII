"""User model per data-model.md."""

from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.todo import Todo
    from app.models.conversation import Conversation


class User(SQLModel, table=True):
    """User entity for authentication and todo ownership."""

    __tablename__ = "user"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to todos
    todos: List["Todo"] = Relationship(back_populates="user")

    # Relationship to conversations (Phase III)
    conversations: List["Conversation"] = Relationship(back_populates="user")
