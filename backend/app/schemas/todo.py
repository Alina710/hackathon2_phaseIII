"""Todo schemas per contracts/api.md."""

from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    """Schema for creating a new todo."""
    title: str = Field(min_length=1, max_length=255)


class TodoUpdate(BaseModel):
    """Schema for updating a todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    """Schema for todo in API responses."""
    id: UUID
    title: str
    completed: bool
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
