# Internal Contracts: Phase I Todo CLI

**Feature**: 001-phase-i-todo-cli
**Date**: 2025-12-28

## Overview

Phase I is a console application with no external APIs. This document defines
the internal interfaces between components.

## TaskStore Interface

The TaskStore provides the data access layer for Task objects.

### Methods

#### add(description: str) -> Task

Creates a new task with the given description.

- **Input**: description (str) - non-empty task description
- **Output**: Task - the created task with assigned ID
- **Raises**: ValueError if description is empty or whitespace-only

#### get(task_id: int) -> Task | None

Retrieves a task by its ID.

- **Input**: task_id (int) - the task identifier
- **Output**: Task if found, None otherwise

#### get_all() -> list[Task]

Returns all tasks in the store.

- **Output**: list[Task] - all tasks (may be empty)

#### update(task_id: int, description: str) -> Task | None

Updates the description of an existing task.

- **Input**: task_id (int), description (str)
- **Output**: Updated Task if found, None if not found
- **Raises**: ValueError if description is empty or whitespace-only

#### delete(task_id: int) -> bool

Removes a task from the store.

- **Input**: task_id (int)
- **Output**: True if deleted, False if not found

#### toggle_complete(task_id: int) -> Task | None

Toggles the completion status of a task.

- **Input**: task_id (int)
- **Output**: Updated Task if found, None if not found

## CLI Interface

### Menu Options

| Option | Action | Handler Function |
|--------|--------|------------------|
| 1 | Add Task | handle_add_task() |
| 2 | View Tasks | handle_view_tasks() |
| 3 | Update Task | handle_update_task() |
| 4 | Delete Task | handle_delete_task() |
| 5 | Toggle Complete | handle_toggle_task() |
| 6 | Exit | handle_exit() |

### Input Validation

| Context | Input Type | Validation |
|---------|------------|------------|
| Menu selection | str | Must be 1-6 |
| Task ID | str | Must be numeric integer |
| Description | str | Must be non-empty after strip |

### Error Messages

| Error Case | Message |
|------------|---------|
| Empty description | Task description cannot be empty |
| Invalid ID format | Invalid ID format. Please enter a number |
| Task not found | Task with ID {id} not found |
| Invalid menu option | Invalid option. Please select from the menu |
| No tasks exist | No tasks found |
