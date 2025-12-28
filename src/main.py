"""Todo CLI Application - Entry Point.

Phase I: In-memory console todo manager.
Ref: plan.md lines 123-124
"""
from src.services.task_store import TaskStore
from src.cli.menu import run


def main() -> None:
    """Application entry point.
    
    Creates TaskStore instance and runs the menu loop.
    """
    store = TaskStore()
    run(store)


if __name__ == "__main__":
    main()
