"""Menu display and main application loop.

Ref: plan.md lines 121-129, quickstart.md lines 27-37
"""
from src.services.task_store import TaskStore
from src.cli.handlers import (
    handle_add_task,
    handle_view_tasks,
    handle_update_task,
    handle_delete_task,
    handle_toggle_task,
    handle_exit,
)


def display_menu() -> None:
    """Display the main menu options.
    
    Ref: quickstart.md lines 27-37
    """
    print("\n=== Todo Application ===")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Mark Complete/Incomplete")
    print("6. Exit")


def get_menu_choice() -> str:
    """Read and return user menu selection.
    
    Returns:
        The user input string (stripped)
    """
    return input("\nSelect an option: ").strip()


def run(store: TaskStore) -> None:
    """Run the main menu loop.
    
    Displays menu, gets user choice, routes to appropriate handler.
    Loops until exit is selected.
    
    Args:
        store: TaskStore instance for data operations
        
    Ref: plan.md lines 121-129
    """
    while True:
        display_menu()
        choice = get_menu_choice()
        
        if choice == "1":
            handle_add_task(store)
        elif choice == "2":
            handle_view_tasks(store)
        elif choice == "3":
            handle_update_task(store)
        elif choice == "4":
            handle_delete_task(store)
        elif choice == "5":
            handle_toggle_task(store)
        elif choice == "6":
            if handle_exit():
                break
        else:
            print("Invalid option. Please select from the menu")
