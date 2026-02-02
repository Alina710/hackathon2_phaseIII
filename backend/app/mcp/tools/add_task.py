"""MCP Tool: add_task - Create a new task for the user."""

from typing import Dict, Any
from uuid import UUID
from sqlmodel import Session

from app.repositories.todo import TodoRepository


ADD_TASK_DEFINITION = {
    "description": "Create a new task for the authenticated user",
    "parameters": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The task title/description (1-500 characters)"
            }
        },
        "required": ["title"]
    }
}


def add_task(
    user_id: UUID,
    session: Session,
    title: str
) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        user_id: The authenticated user's ID
        session: Database session
        title: The task title

    Returns:
        Dict with task_id, title, and created_at

    Raises:
        ValueError: If title is invalid
    """
    # Validate title
    if not title or len(title.strip()) == 0:
        return {
            "status": "error",
            "error": "invalid_input",
            "message": "Title cannot be empty"
        }

    if len(title) > 500:
        return {
            "status": "error",
            "error": "invalid_input",
            "message": "Title must be 500 characters or less"
        }

    # Create the task
    todo_repo = TodoRepository(session)
    todo = todo_repo.create(
        title=title.strip(),
        user_id=user_id
    )

    return {
        "status": "success",
        "task_id": str(todo.id),
        "title": todo.title,
        "created_at": todo.created_at.isoformat()
    }
