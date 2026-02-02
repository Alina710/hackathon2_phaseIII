"""MCP Tool: list_tasks - Retrieve tasks for the user."""

from typing import Dict, Any, Optional
from uuid import UUID
from sqlmodel import Session

from app.repositories.todo import TodoRepository


LIST_TASKS_DEFINITION = {
    "description": "Retrieve tasks for the authenticated user with optional filtering",
    "parameters": {
        "type": "object",
        "properties": {
            "filter": {
                "type": "string",
                "enum": ["all", "completed", "incomplete"],
                "description": "Filter tasks by completion status (default: all)"
            }
        },
        "required": []
    }
}


def list_tasks(
    user_id: UUID,
    session: Session,
    filter: Optional[str] = "all"
) -> Dict[str, Any]:
    """
    Retrieve tasks for the user with optional filtering.

    Args:
        user_id: The authenticated user's ID
        session: Database session
        filter: Filter by status - "all", "completed", or "incomplete"

    Returns:
        Dict with tasks array and count
    """
    todo_repo = TodoRepository(session)

    # Map filter to status parameter
    status = None
    if filter == "completed":
        status = "completed"
    elif filter == "incomplete":
        status = "pending"  # Repository uses "pending" for incomplete

    todos = todo_repo.list_filtered(
        user_id=user_id,
        status=status,
        sort_by="created_at",
        sort_order="desc"
    )

    tasks = [
        {
            "id": str(todo.id),
            "title": todo.title,
            "is_completed": todo.completed,
            "created_at": todo.created_at.isoformat()
        }
        for todo in todos
    ]

    return {
        "status": "success",
        "tasks": tasks,
        "count": len(tasks)
    }
