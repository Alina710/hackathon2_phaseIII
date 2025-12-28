# Implementation Plan: Phase I Todo CLI

**Branch**: `001-phase-i-todo-cli` | **Date**: 2025-12-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-phase-i-todo-cli/spec.md`

## Summary

Implement an in-memory Python console application for basic todo management.
The application provides a menu-based CLI for adding, viewing, updating, deleting,
and toggling completion status of tasks. All data is stored in memory and lost
when the application exits. No external dependencies beyond Python standard library.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: None (Python standard library only)
**Storage**: In-memory (Python dict/list structures)
**Testing**: pytest
**Target Platform**: Any platform with Python 3.11+ (Windows, Linux, macOS)
**Project Type**: Single CLI application
**Performance Goals**: Sub-second response for all operations
**Constraints**: No persistence, no external services, no network
**Scale/Scope**: Single user, single session, hundreds of tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Spec approved, plan derived from spec |
| II. Agent Behavior Rules | PASS | No feature invention, spec-compliant |
| III. Phase Governance | PASS | Phase I scope only, no Phase II+ leakage |
| IV. Technology Constraints | PASS | Python 3.11+, no DB/API (Phase I exempt) |
| V. Quality Principles | PASS | Clean architecture, separation of concerns |

### Post-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Clean Architecture | PASS | Domain (Task) -> Service (TaskStore) -> CLI |
| Separation of Concerns | PASS | Models, Services, CLI layers separated |
| Stateless Services | N/A | Phase I is single-process, in-memory by design |
| Testing Standards | PLANNED | Unit + integration tests to be created |

## Project Structure

### Documentation (this feature)

specs/001-phase-i-todo-cli/
  plan.md              # This file
  research.md          # Phase 0 output (complete)
  data-model.md        # Phase 1 output (complete)
  quickstart.md        # Phase 1 output (complete)
  contracts/           # Phase 1 output (complete)
    interfaces.md      # Internal interface contracts
  tasks.md             # Phase 2 output (created by /sp.tasks)

### Source Code (repository root)

src/
  __init__.py
  main.py              # Application entry point
  models/
    __init__.py
    task.py            # Task dataclass
  services/
    __init__.py
    task_store.py      # In-memory task storage
  cli/
    __init__.py
    menu.py            # Menu display and main loop
    handlers.py        # Menu option handlers
    validators.py      # Input validation utilities

tests/
  __init__.py
  unit/
    __init__.py
    test_task.py       # Task model tests
    test_task_store.py # TaskStore tests
    test_validators.py # Validator tests
  integration/
    __init__.py
    test_cli.py        # End-to-end CLI tests

**Structure Decision**: Single project layout selected. Clean separation between
models (domain), services (application), and cli (presentation) layers.

## Architecture Design

### Layer Diagram

+------------------+
|       CLI        |  <- Presentation Layer (menu.py, handlers.py)
+------------------+
         |
         v
+------------------+
|    TaskStore     |  <- Application Layer (task_store.py)
+------------------+
         |
         v
+------------------+
|      Task        |  <- Domain Layer (task.py)
+------------------+

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Task | Data structure representing a todo item |
| TaskStore | CRUD operations on in-memory task collection |
| validators | Input validation (non-empty, numeric ID) |
| handlers | Business logic for each menu option |
| menu | Display menu, read input, route to handlers |
| main | Initialize TaskStore, run main loop |

### Data Flow

1. main.py creates TaskStore instance
2. main.py calls menu.run(store)
3. menu displays options, reads user input
4. menu calls appropriate handler with store reference
5. handler validates input, calls store methods
6. handler displays result to user
7. menu loops until Exit selected

## Implementation Approach

### Phase I Scope Enforcement

The following items are EXPLICITLY EXCLUDED from this implementation:

- File I/O (no persistence)
- Database connections
- Network requests
- External libraries beyond standard library
- Configuration files (hardcoded defaults only)
- Logging to files (console output only)
- Multi-threading or async

### Key Implementation Decisions

1. **Task ID Generation**: Sequential integers starting at 1, never reused
2. **Storage Structure**: dict[int, Task] for O(1) lookup by ID
3. **Input Handling**: input() with strip() for all user input
4. **Error Display**: Print to stdout, no exception propagation to user
5. **Menu Loop**: while True with break on Exit selection

## Complexity Tracking

No constitution violations requiring justification. The design is minimal
and strictly adheres to Phase I scope.

## Artifacts Generated

| Artifact | Path | Status |
|----------|------|--------|
| Research | specs/001-phase-i-todo-cli/research.md | Complete |
| Data Model | specs/001-phase-i-todo-cli/data-model.md | Complete |
| Quickstart | specs/001-phase-i-todo-cli/quickstart.md | Complete |
| Contracts | specs/001-phase-i-todo-cli/contracts/interfaces.md | Complete |
| Plan | specs/001-phase-i-todo-cli/plan.md | Complete |

## Next Steps

Run `/sp.tasks` to generate executable task list from this plan.
