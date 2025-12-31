"""Todo schemas per contracts/api.md."""

from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    """Schema for creating a new todo."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium")
    category: str = Field(default="personal")
    due_date: Optional[datetime] = None
    is_recurring: bool = False
    recurring_frequency: Optional[str] = Field(None, max_length=20)
    reminder_time: Optional[datetime] = None


class TodoUpdate(BaseModel):
    """Schema for updating a todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurring_frequency: Optional[str] = Field(None, max_length=20)
    reminder_time: Optional[datetime] = None


class TodoResponse(BaseModel):
    """Schema for todo in API responses."""
    id: UUID
    title: str
    description: Optional[str] = None
    completed: bool
    priority: str
    category: str
    due_date: Optional[datetime] = None
    is_recurring: bool
    recurring_frequency: Optional[str] = None
    reminder_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    """Schema for list of todos response."""
    todos: list[TodoResponse]
    total: int


class TodoDeleteResponse(BaseModel):
    """Schema for delete response."""
    message: str
