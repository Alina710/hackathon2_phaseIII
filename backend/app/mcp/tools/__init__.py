"""MCP Tools package for todo management operations."""

from typing import List, Dict, Any

from app.mcp.tools.add_task import add_task, ADD_TASK_DEFINITION
from app.mcp.tools.list_tasks import list_tasks, LIST_TASKS_DEFINITION
from app.mcp.tools.update_task import update_task, UPDATE_TASK_DEFINITION
from app.mcp.tools.delete_task import delete_task, DELETE_TASK_DEFINITION
from app.mcp.tools.complete_task import complete_task, COMPLETE_TASK_DEFINITION


def get_all_tools() -> List[Dict[str, Any]]:
    """Get all MCP tool definitions with their functions."""
    return [
        {
            "name": "add_task",
            "function": add_task,
            **ADD_TASK_DEFINITION
        },
        {
            "name": "list_tasks",
            "function": list_tasks,
            **LIST_TASKS_DEFINITION
        },
        {
            "name": "update_task",
            "function": update_task,
            **UPDATE_TASK_DEFINITION
        },
        {
            "name": "delete_task",
            "function": delete_task,
            **DELETE_TASK_DEFINITION
        },
        {
            "name": "complete_task",
            "function": complete_task,
            **COMPLETE_TASK_DEFINITION
        }
    ]


__all__ = [
    "add_task",
    "list_tasks",
    "update_task",
    "delete_task",
    "complete_task",
    "get_all_tools",
]
