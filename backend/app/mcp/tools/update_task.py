"""MCP Tool: update_task - Modify an existing task's title."""

from typing import Dict, Any
from uuid import UUID
from sqlmodel import Session

from app.repositories.todo import TodoRepository


UPDATE_TASK_DEFINITION = {
    "description": "Modify an existing task's title",
    "parameters": {
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "ID of the task to update"
            },
            "title": {
                "type": "string",
                "description": "New title for the task (1-500 characters)"
            }
        },
        "required": ["task_id", "title"]
    }
}


def update_task(
    user_id: UUID,
    session: Session,
    task_id: str,
    title: str
) -> Dict[str, Any]:
    """
    Update a task's title.

    Args:
        user_id: The authenticated user's ID
        session: Database session
        task_id: ID of the task to update
        title: New title for the task

    Returns:
        Dict with task_id, old_title, and new_title
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

    # Parse and validate task_id
    try:
        task_uuid = UUID(task_id)
    except ValueError:
        return {
            "status": "error",
            "error": "invalid_input",
            "message": "Invalid task ID format"
        }

    # Get the existing task first
    todo_repo = TodoRepository(session)
    existing = todo_repo.get_by_id(task_uuid, user_id)

    if not existing:
        return {
            "status": "error",
            "error": "not_found",
            "message": "Task not found"
        }

    old_title = existing.title

    # Update the task
    updated = todo_repo.update(
        todo_id=task_uuid,
        user_id=user_id,
        title=title.strip()
    )

    return {
        "status": "success",
        "task_id": str(updated.id),
        "old_title": old_title,
        "new_title": updated.title
    }
