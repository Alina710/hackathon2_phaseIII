"""CLI handlers for menu options.

Ref: contracts/interfaces.md lines 64-71
"""
from src.services.task_store import TaskStore
from src.cli.validators import validate_description, validate_task_id


def handle_add_task(store: TaskStore) -> None:
    """Handle Add Task menu option (US1).
    
    Prompts for description, validates, creates task.
    Ref: spec.md FR-001, contracts/interfaces.md line 66
    """
    description = input("Enter task description: ")
    try:
        validated = validate_description(description)
        task = store.add(validated)
        print(f"Task added with ID {task.id}")
    except ValueError as e:
        print(str(e))


def handle_view_tasks(store: TaskStore) -> None:
    """Handle View Tasks menu option (US2).
    
    Displays all tasks with ID, description, and status.
    Ref: spec.md FR-002, contracts/interfaces.md line 67
    """
    tasks = store.get_all()
    if not tasks:
        print("No tasks found")
        return
    
    print("\n=== Tasks ===")
    for task in tasks:
        status = "[X]" if task.completed else "[ ]"
        print(f"{task.id}. {status} {task.description}")
    print()


def handle_update_task(store: TaskStore) -> None:
    """Handle Update Task menu option (US4).
    
    Prompts for task ID and new description.
    Ref: spec.md FR-003, contracts/interfaces.md line 68
    """
    task_id_input = input("Enter task ID to update: ")
    try:
        task_id = validate_task_id(task_id_input)
    except ValueError as e:
        print(str(e))
        return
    
    description = input("Enter new description: ")
    try:
        validated = validate_description(description)
        task = store.update(task_id, validated)
        if task:
            print(f"Task {task_id} updated")
        else:
            print(f"Task with ID {task_id} not found")
    except ValueError as e:
        print(str(e))


def handle_delete_task(store: TaskStore) -> None:
    """Handle Delete Task menu option (US5).
    
    Prompts for task ID and deletes if found.
    Ref: spec.md FR-004, contracts/interfaces.md line 69
    """
    task_id_input = input("Enter task ID to delete: ")
    try:
        task_id = validate_task_id(task_id_input)
    except ValueError as e:
        print(str(e))
        return
    
    if store.delete(task_id):
        print(f"Task {task_id} deleted")
    else:
        print(f"Task with ID {task_id} not found")


def handle_toggle_task(store: TaskStore) -> None:
    """Handle Toggle Complete menu option (US3).
    
    Prompts for task ID and toggles completion status.
    Ref: spec.md FR-005, contracts/interfaces.md line 70
    """
    task_id_input = input("Enter task ID to toggle: ")
    try:
        task_id = validate_task_id(task_id_input)
    except ValueError as e:
        print(str(e))
        return
    
    task = store.toggle_complete(task_id)
    if task:
        status = "complete" if task.completed else "incomplete"
        print(f"Task {task_id} marked as {status}")
    else:
        print(f"Task with ID {task_id} not found")


def handle_exit() -> bool:
    """Handle Exit menu option (US6).
    
    Prints farewell message and returns True to signal exit.
    Ref: spec.md FR-007, contracts/interfaces.md line 71
    """
    print("Goodbye!")
    return True
