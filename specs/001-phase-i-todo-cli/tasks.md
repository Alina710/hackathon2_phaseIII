# Tasks: Phase I Todo CLI Application

**Feature**: 001-phase-i-todo-cli
**Branch**: 001-phase-i-todo-cli
**Date**: 2025-12-28
**Input**: Design documents from /specs/001-phase-i-todo-cli/

## Format

Each task follows: - [ ] [TaskID] [P?] [Story?] Description with file path

- **[P]**: Task can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story label (US1-US6) for story phase tasks only

## User Stories Summary

| ID | Story | Priority | Description |
|----|-------|----------|-------------|
| US1 | Add Task | P1 | User adds a new task with description |
| US2 | View Tasks | P1 | User views all tasks with status |
| US3 | Toggle Complete | P2 | User marks task complete/incomplete |
| US4 | Update Task | P3 | User updates task description |
| US5 | Delete Task | P3 | User removes a task |
| US6 | Exit Application | P1 | User exits gracefully |

---

## Phase 1: Setup

**Goal**: Initialize project structure per plan.md architecture.

- [X] T001 Create src/ directory structure with __init__.py files
- [X] T002 [P] Create src/models/ directory with __init__.py
- [X] T003 [P] Create src/services/ directory with __init__.py
- [X] T004 [P] Create src/cli/ directory with __init__.py
- [X] T005 Create tests/ directory structure with __init__.py files
- [X] T006 [P] Create tests/unit/ directory with __init__.py
- [X] T007 [P] Create tests/integration/ directory with __init__.py
- [X] T008 Create pyproject.toml with pytest configuration
- [X] T009 Create src/main.py entry point stub (empty main function)

**Acceptance**: All directories exist, Python imports work, pytest discovers test directories.

---

## Phase 2: Foundational - Domain Layer

**Goal**: Implement Task model and TaskStore service (blocking prerequisites).
**Ref**: data-model.md, contracts/interfaces.md

### Task Model

- [X] T010 Implement Task dataclass in src/models/task.py
  - Fields: id (int), description (str), completed (bool, default=False)
  - Ref: data-model.md lines 8-30
- [X] T011 [P] Create tests/unit/test_task.py with Task creation tests
- [X] T012 Add Task to src/models/__init__.py exports

### TaskStore Service

- [X] T013 Implement TaskStore class skeleton in src/services/task_store.py
  - Attributes: _tasks (dict[int, Task]), _next_id (int, starts at 1)
  - Ref: data-model.md lines 34-49
- [X] T014 Implement TaskStore.add(description) method
  - Creates Task with auto-assigned ID, adds to _tasks, returns Task
  - Raises ValueError if description is empty/whitespace
  - Ref: contracts/interfaces.md lines 17-23
- [X] T015 Implement TaskStore.get(task_id) method
  - Returns Task if found, None otherwise
  - Ref: contracts/interfaces.md lines 25-29
- [X] T016 Implement TaskStore.get_all() method
  - Returns list of all Task objects
  - Ref: contracts/interfaces.md lines 31-34
- [X] T017 Implement TaskStore.update(task_id, description) method
  - Updates description if task found, raises ValueError if empty
  - Returns updated Task or None
  - Ref: contracts/interfaces.md lines 36-44
- [X] T018 Implement TaskStore.delete(task_id) method
  - Removes task, returns True if deleted, False if not found
  - Ref: contracts/interfaces.md lines 46-51
- [X] T019 Implement TaskStore.toggle_complete(task_id) method
  - Toggles completed status, returns updated Task or None
  - Ref: contracts/interfaces.md lines 53-58
- [X] T020 [P] Create tests/unit/test_task_store.py with full coverage
- [X] T021 Add TaskStore to src/services/__init__.py exports

### Input Validators

- [X] T022 Create src/cli/validators.py with validation functions
  - validate_description(text) -> str or raises ValueError
  - validate_task_id(text) -> int or raises ValueError
  - Ref: contracts/interfaces.md lines 73-79
- [X] T023 [P] Create tests/unit/test_validators.py with validation tests
- [X] T024 Add validators to src/cli/__init__.py exports

**Acceptance**: All unit tests pass. TaskStore operations work correctly. Validators catch invalid input.

---

## Phase 3: US1 - Add Task + US2 - View Tasks

**Goal**: Implement core add and view functionality.
**Stories**: US1 (P1), US2 (P1)

- [X] T025 [US1] Implement handle_add_task(store) in src/cli/handlers.py
  - Prompts for description, validates, calls store.add()
  - Prints success with task ID or error message
  - Ref: spec.md FR-001, contracts/interfaces.md line 66
- [X] T026 [US2] Implement handle_view_tasks(store) in src/cli/handlers.py
  - Calls store.get_all(), formats and prints task list
  - Shows ID, description, status ([ ] or [X])
  - Handles empty list case
  - Ref: spec.md FR-002, contracts/interfaces.md line 67
- [X] T027 [P] Add handlers to src/cli/__init__.py exports

**Acceptance**: User can add tasks and view them. Error messages display correctly.

---

## Phase 4: US6 - Exit Application

**Goal**: Implement graceful exit.
**Story**: US6 (P1)

- [X] T028 [US6] Implement handle_exit() in src/cli/handlers.py
  - Prints farewell message
  - Returns signal to break menu loop
  - Ref: spec.md FR-007, contracts/interfaces.md line 71

**Acceptance**: Exit option terminates application cleanly with message.

---

## Phase 5: CLI Menu Integration

**Goal**: Implement menu display and main application loop.
**Ref**: plan.md lines 121-129, quickstart.md lines 27-37

- [X] T029 Implement display_menu() in src/cli/menu.py
  - Prints menu header and 6 options
  - Ref: quickstart.md lines 27-37
- [X] T030 Implement get_menu_choice() in src/cli/menu.py
  - Reads input, returns choice string
- [X] T031 Implement run(store) main loop in src/cli/menu.py
  - Displays menu, gets choice, routes to handlers
  - Handles invalid menu options
  - Loops until exit selected
  - Ref: plan.md lines 121-129
- [X] T032 Update src/main.py with complete entry point
  - Creates TaskStore instance
  - Calls menu.run(store)
  - Ref: plan.md lines 123-124
- [X] T033 Add menu functions to src/cli/__init__.py exports

**Acceptance**: Application starts, displays menu, routes to Add/View/Exit correctly.

---

## Phase 6: US3 - Toggle Complete

**Goal**: Implement mark complete/incomplete functionality.
**Story**: US3 (P2)

- [X] T034 [US3] Implement handle_toggle_task(store) in src/cli/handlers.py
  - Prompts for task ID, validates, calls store.toggle_complete()
  - Prints new status or error message
  - Ref: spec.md FR-005, contracts/interfaces.md line 70
- [X] T035 [US3] Wire toggle handler to menu option 5 in src/cli/menu.py

**Acceptance**: User can toggle task completion status. Status changes persist in memory.

---

## Phase 7: US4 - Update Task

**Goal**: Implement task description update.
**Story**: US4 (P3)

- [X] T036 [US4] Implement handle_update_task(store) in src/cli/handlers.py
  - Prompts for task ID and new description
  - Validates both inputs
  - Calls store.update(), prints result or error
  - Ref: spec.md FR-003, contracts/interfaces.md line 68
- [X] T037 [US4] Wire update handler to menu option 3 in src/cli/menu.py

**Acceptance**: User can update task descriptions. Validation works correctly.

---

## Phase 8: US5 - Delete Task

**Goal**: Implement task deletion.
**Story**: US5 (P3)

- [X] T038 [US5] Implement handle_delete_task(store) in src/cli/handlers.py
  - Prompts for task ID, validates
  - Calls store.delete(), prints result or error
  - Ref: spec.md FR-004, contracts/interfaces.md line 69
- [X] T039 [US5] Wire delete handler to menu option 4 in src/cli/menu.py

**Acceptance**: User can delete tasks. Task list updates correctly.

---

## Phase 9: Integration Tests

**Goal**: End-to-end CLI testing.

- [X] T040 Create tests/integration/test_cli.py with CLI flow tests
  - Test add -> view flow
  - Test toggle complete flow
  - Test update flow
  - Test delete flow
  - Test invalid input handling
  - Test exit flow

**Acceptance**: All integration tests pass. Full user workflows verified.

---

## Phase 10: Polish

**Goal**: Final refinements and validation.

- [X] T041 Verify all error messages match contracts/interfaces.md lines 83-89
- [X] T042 Verify menu display matches quickstart.md lines 27-37
- [X] T043 Run full test suite (pytest tests/ -v)
- [X] T044 Manual smoke test of all 6 menu options
- [X] T045 Verify no external dependencies (standard library only)
- [X] T046 Verify Python 3.11+ compatibility

**Acceptance**: All tests pass. Manual verification complete. Phase I requirements met.

---

## Dependencies and Execution Order

Phase 1 (Setup)
    |
    v
Phase 2 (Foundational: Task, TaskStore, Validators)
    |
    +---> Phase 3 (US1 Add + US2 View) --+
    |                                     |
    +---> Phase 4 (US6 Exit) ------------+
                                          |
                                          v
                                    Phase 5 (CLI Menu)
                                          |
              +---------------------------+---------------------------+
              |                           |                           |
              v                           v                           v
        Phase 6 (US3 Toggle)       Phase 7 (US4 Update)       Phase 8 (US5 Delete)
              |                           |                           |
              +---------------------------+---------------------------+
                                          |
                                          v
                                    Phase 9 (Integration Tests)
                                          |
                                          v
                                    Phase 10 (Polish)


## Parallel Execution Opportunities

| Phase | Parallel Tasks | Reason |
|-------|----------------|--------|
| 1 | T002, T003, T004 | Independent directories |
| 1 | T006, T007 | Independent test directories |
| 2 | T011 (test_task), T020 (test_task_store), T023 (test_validators) | Independent test files |
| 3 | T025, T026 | Independent handler functions |
| 6, 7, 8 | Entire phases | Independent user stories after Phase 5 |

## Implementation Strategy

1. **MVP First**: Complete Phases 1-5 for minimal working application
2. **Incremental Delivery**: Add US3, US4, US5 in priority order
3. **Test-Driven**: Write tests alongside implementation (T011, T020, T023)
4. **Validation Last**: Phase 10 ensures all requirements met

## Traceability Matrix

| Spec Requirement | Task(s) | User Story |
|------------------|---------|------------|
| FR-001 Add Task | T014, T025 | US1 |
| FR-002 View Tasks | T016, T026 | US2 |
| FR-003 Update Task | T017, T036-T037 | US4 |
| FR-004 Delete Task | T018, T038-T039 | US5 |
| FR-005 Toggle Complete | T019, T034-T035 | US3 |
| FR-006 Invalid Input | T022-T024 | All |
| FR-007 Exit | T028, T031-T032 | US6 |

---

## Summary

- **Total Tasks**: 46
- **Setup**: 9 tasks (Phase 1)
- **Foundational**: 15 tasks (Phase 2)
- **User Story Implementation**: 15 tasks (Phases 3-8)
- **Testing and Polish**: 7 tasks (Phases 9-10)
- **Parallel Opportunities**: 12 tasks marked [P]
- **MVP Scope**: Phases 1-5 (33 tasks)
