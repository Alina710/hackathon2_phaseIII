"""Todo endpoints per contracts/api.md."""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db.session import get_session
from app.api.deps import get_current_user
from app.models.user import User
from app.services.todo import TodoService
from app.schemas.todo import (
    TodoCreate,
    TodoUpdate,
    TodoResponse,
    TodoListResponse,
    TodoDeleteResponse,
)

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=TodoListResponse)
def list_todos(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """List all todos for the current user."""
    todo_service = TodoService(session)
    todos = todo_service.list_todos(current_user.id)

    return TodoListResponse(
        todos=[TodoResponse.model_validate(t) for t in todos],
        total=len(todos),
    )


@router.post("", response_model=TodoResponse, status_code=201)
def create_todo(
    todo_data: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new todo."""
    todo_service = TodoService(session)

    try:
        todo = todo_service.create_todo(
            title=todo_data.title,
            user_id=current_user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TodoResponse.model_validate(todo)


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get a single todo by ID."""
    todo_service = TodoService(session)
    todo = todo_service.get_todo(todo_id, current_user.id)

    if not todo:
        # Return 404 for both not found and unauthorized (security)
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoResponse.model_validate(todo)


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: UUID,
    todo_data: TodoUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update a todo (title or completion status)."""
    todo_service = TodoService(session)

    try:
        todo = todo_service.update_todo(
            todo_id=todo_id,
            user_id=current_user.id,
            title=todo_data.title,
            completed=todo_data.completed,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoResponse.model_validate(todo)


@router.delete("/{todo_id}", response_model=TodoDeleteResponse)
def delete_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Delete a todo."""
    todo_service = TodoService(session)
    deleted = todo_service.delete_todo(todo_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoDeleteResponse(message="Todo deleted successfully")
