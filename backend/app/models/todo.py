"""Todo model per data-model.md."""

from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

if TYPE_CHECKING:
    from app.models.user import User


class Priority(str, Enum):
    """Priority levels for todos."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Category(str, Enum):
    """Categories for todos."""
    WORK = "work"
    PERSONAL = "personal"
    STUDY = "study"
    HEALTH = "health"
    FINANCE = "finance"
    SHOPPING = "shopping"
    MEETINGS = "meetings"
    HOME = "home"
    ERRANDS = "errands"


class Todo(SQLModel, table=True):
    """Todo item entity owned by a user."""

    __tablename__ = "todo"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", max_length=10)
    category: str = Field(default="personal", max_length=20)
    due_date: Optional[datetime] = Field(default=None)
    is_recurring: bool = Field(default=False)
    recurring_frequency: Optional[str] = Field(default=None, max_length=20)  # daily, weekly, monthly
    reminder_time: Optional[datetime] = Field(default=None)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="todos")
