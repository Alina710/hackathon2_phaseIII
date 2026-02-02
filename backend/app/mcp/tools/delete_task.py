"""MCP Tool: delete_task - Remove a task from the user's list."""

from typing import Dict, Any
from uuid import UUID
from sqlmodel import Session

from app.repositories.todo import TodoRepository


DELETE_TASK_DEFINITION = {
    "description": "Remove a task from the user's list",
    "parameters": {
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "ID of the task to delete"
            }
        },
        "required": ["task_id"]
    }
}


def delete_task(
    user_id: UUID,
    session: Session,
    task_id: str
) -> Dict[str, Any]:
    """
    Delete a task from the user's list.

    Args:
        user_id: The authenticated user's ID
        session: Database session
        task_id: ID of the task to delete

    Returns:
        Dict with task_id and title of deleted task
    """
    # Parse and validate task_id
    try:
        task_uuid = UUID(task_id)
    except ValueError:
        return {
            "status": "error",
            "error": "invalid_input",
            "message": "Invalid task ID format"
        }

    # Get the task first to return title
    todo_repo = TodoRepository(session)
    existing = todo_repo.get_by_id(task_uuid, user_id)

    if not existing:
        return {
            "status": "error",
            "error": "not_found",
            "message": "Task not found"
        }

    title = existing.title

    # Delete the task
    deleted = todo_repo.delete(task_uuid, user_id)

    if not deleted:
        return {
            "status": "error",
            "error": "not_found",
            "message": "Task not found"
        }

    return {
        "status": "success",
        "task_id": task_id,
        "title": title
    }
