"""MCP Tool: complete_task - Toggle a task's completion status."""

from typing import Dict, Any
from uuid import UUID
from sqlmodel import Session

from app.repositories.todo import TodoRepository


COMPLETE_TASK_DEFINITION = {
    "description": "Toggle a task's completion status",
    "parameters": {
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "ID of the task to complete/uncomplete"
            },
            "is_completed": {
                "type": "boolean",
                "description": "Target completion state (true=complete, false=incomplete)"
            }
        },
        "required": ["task_id", "is_completed"]
    }
}


def complete_task(
    user_id: UUID,
    session: Session,
    task_id: str,
    is_completed: bool
) -> Dict[str, Any]:
    """
    Toggle a task's completion status.

    Args:
        user_id: The authenticated user's ID
        session: Database session
        task_id: ID of the task to complete/uncomplete
        is_completed: Target completion state

    Returns:
        Dict with task_id, title, and new completion status
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

    # Get the task first
    todo_repo = TodoRepository(session)
    existing = todo_repo.get_by_id(task_uuid, user_id)

    if not existing:
        return {
            "status": "error",
            "error": "not_found",
            "message": "Task not found"
        }

    # Check if already in target state
    if existing.completed == is_completed:
        state = "complete" if is_completed else "incomplete"
        return {
            "status": "success",
            "task_id": task_id,
            "title": existing.title,
            "is_completed": existing.completed,
            "message": f"Task is already marked as {state}"
        }

    # Update completion status
    updated = todo_repo.update(
        todo_id=task_uuid,
        user_id=user_id,
        completed=is_completed
    )

    return {
        "status": "success",
        "task_id": str(updated.id),
        "title": updated.title,
        "is_completed": updated.completed
    }
