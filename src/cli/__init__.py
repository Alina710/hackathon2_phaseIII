"""CLI package for Todo application."""
from .validators import validate_description, validate_task_id
from .handlers import (
    handle_add_task,
    handle_view_tasks,
    handle_update_task,
    handle_delete_task,
    handle_toggle_task,
    handle_exit,
)
from .menu import display_menu, get_menu_choice, run

__all__ = [
    "validate_description",
    "validate_task_id",
    "handle_add_task",
    "handle_view_tasks",
    "handle_update_task",
    "handle_delete_task",
    "handle_toggle_task",
    "handle_exit",
    "display_menu",
    "get_menu_choice",
    "run",
]
