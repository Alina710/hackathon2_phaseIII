# Quickstart: Phase I Todo CLI

**Feature**: 001-phase-i-todo-cli
**Date**: 2025-12-28

## Prerequisites

- Python 3.11 or higher
- No external dependencies required

## Installation

No installation required. The application runs directly from source.

## Running the Application

From the repository root:

python src/main.py

Or if using a different entry point structure:

python -m src.cli.main

## Usage

The application presents a menu-based interface:

=== Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Mark Complete/Incomplete
6. Exit

Select an option: _

### Adding a Task

1. Select option 1
2. Enter task description
3. System confirms task creation with assigned ID

### Viewing Tasks

1. Select option 2
2. All tasks are displayed with ID, description, and status
3. Complete tasks are visually distinguished

### Updating a Task

1. Select option 3
2. Enter task ID to update
3. Enter new description
4. System confirms update

### Deleting a Task

1. Select option 4
2. Enter task ID to delete
3. System confirms deletion

### Toggling Completion Status

1. Select option 5
2. Enter task ID
3. System toggles and confirms new status

### Exiting

1. Select option 6
2. Application displays farewell and terminates

## Running Tests

pytest tests/

Or for verbose output:

pytest tests/ -v

## Project Structure

src/
  models/
    task.py          # Task dataclass
  services/
    task_store.py    # In-memory storage
  cli/
    menu.py          # Menu display and routing
    handlers.py      # Menu option handlers
  main.py            # Entry point

tests/
  unit/
    test_task.py
    test_task_store.py
  integration/
    test_cli.py
