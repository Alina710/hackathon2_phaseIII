"""Todo model per data-model.md."""

from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class Todo(SQLModel, table=True):
    """Todo item entity owned by a user."""

    __tablename__ = "todo"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255)
    completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="todos")
