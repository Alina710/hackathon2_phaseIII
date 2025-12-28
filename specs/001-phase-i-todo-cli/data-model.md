# Data Model: Phase I Todo CLI

**Feature**: 001-phase-i-todo-cli
**Date**: 2025-12-28

## Entities

### Task

Represents a single todo item in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | Unique, auto-assigned, immutable | Sequential identifier starting at 1 |
| description | str | Required, non-empty, no whitespace-only | Text describing the task |
| completed | bool | Default: False | Indicates if task is done |

**Validation Rules**:
- description must not be empty or whitespace-only
- id is assigned automatically by the system (next available integer)
- id cannot be modified after creation
- completed can be toggled between True and False

**State Transitions**:

1. **Created**: Task is created with completed=False
2. **Marked Complete**: completed changes from False to True
3. **Marked Incomplete**: completed changes from True to False
4. **Updated**: description changes, id and completed preserved
5. **Deleted**: Task is removed from the list

## Storage Design

### TaskStore

In-memory storage for tasks during application runtime.

| Attribute | Type | Purpose |
|-----------|------|---------|
| tasks | dict[int, Task] | Maps task ID to Task object |
| next_id | int | Tracks next available ID (starts at 1) |

**Operations**:
- add(description: str) -> Task: Create new task, return it
- get(id: int) -> Task or None: Retrieve task by ID
- get_all() -> list[Task]: Return all tasks
- update(id: int, description: str) -> Task or None: Update description
- delete(id: int) -> bool: Remove task, return success
- toggle(id: int) -> Task or None: Toggle completion status

## Relationships

Phase I has a single entity (Task) with no relationships.
Tasks are independent and have no dependencies on each other.

## Data Constraints

- Maximum tasks: Unlimited (bounded only by available memory)
- ID range: 1 to sys.maxsize (effectively unlimited for single session)
- Description length: No artificial limit
- No persistence: All data lost when application exits
