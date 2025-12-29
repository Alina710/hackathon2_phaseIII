# Tasks: Phase II Full-Stack Todo Web Application

**Input**: Design documents from `/specs/001-phase-ii-fullstack-todo/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/api.md, quickstart.md
**Branch**: `001-phase-ii-fullstack-todo`
**Date**: 2025-12-29

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US8)
- Include exact file paths in descriptions

## User Story Mapping

| Story | Priority | Description | Dependencies |
|-------|----------|-------------|--------------|
| US1 | P1 | User Registration | None (foundational) |
| US2 | P1 | User Sign In | US1 |
| US3 | P2 | View Todo List | US1, US2 |
| US4 | P2 | Create Todo | US3 |
| US5 | P3 | Update Todo | US4 |
| US6 | P3 | Toggle Todo Completion | US4 |
| US7 | P3 | Delete Todo | US4 |
| US8 | P4 | Responsive Interface | US3-US7 |

---

## Phase 1: Setup (Backend Project Initialization)

**Purpose**: Initialize backend Python project with FastAPI structure

- [ ] T001 Create backend directory structure per plan.md in backend/
- [ ] T002 [P] Create backend/pyproject.toml with Python 3.11+ and dependencies (fastapi, sqlmodel, pydantic, uvicorn, alembic, psycopg2-binary, python-dotenv, better-auth)
- [ ] T003 [P] Create backend/requirements.txt from pyproject.toml dependencies
- [ ] T004 [P] Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, FRONTEND_URL placeholders
- [ ] T005 [P] Create backend/app/__init__.py (empty init file)
- [ ] T006 Create backend/app/config.py with Settings class using pydantic-settings for environment variables
- [ ] T007 Create backend/app/main.py with FastAPI app, CORS middleware, health endpoints (/health, /ready)

**Checkpoint**: Backend project initializes and health endpoints respond

---

## Phase 2: Setup (Frontend Project Initialization)

**Purpose**: Initialize frontend Next.js project with TypeScript

- [ ] T008 Create frontend directory with Next.js 14+ App Router using `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir`
- [ ] T009 [P] Create frontend/.env.example with NEXT_PUBLIC_API_URL placeholder
- [ ] T010 [P] Create frontend/src/lib/types.ts with TypeScript interfaces (User, Todo, AuthResponse, TodoListResponse, ApiError) per contracts/api.md
- [ ] T011 Create frontend/src/lib/api.ts with base fetch wrapper for API calls (handles errors, JSON parsing)

**Checkpoint**: Frontend project builds and dev server starts

---

## Phase 3: Foundational (Database Connection)

**Purpose**: Establish Neon PostgreSQL connection - BLOCKS all user stories

**Precondition**: Phase 1, Phase 2 complete

- [ ] T012 Create backend/app/db/__init__.py (empty init)
- [ ] T013 Create backend/app/db/session.py with SQLModel engine creation from DATABASE_URL, get_session dependency
- [ ] T014 Create backend/alembic.ini configuration pointing to migrations directory
- [ ] T015 Initialize Alembic in backend/app/db/migrations/ with `alembic init migrations`
- [ ] T016 Update backend/app/db/migrations/env.py to use SQLModel metadata and DATABASE_URL from config
- [ ] T017 Update backend/app/main.py /ready endpoint to verify database connection

**Checkpoint**: /ready returns database: connected when Neon DB is accessible

---

## Phase 4: Foundational (Error Handling Infrastructure)

**Purpose**: Establish consistent error handling - BLOCKS all user stories

**Precondition**: Phase 3 complete

- [ ] T018 [P] Create backend/app/schemas/__init__.py (empty init)
- [ ] T019 Create backend/app/schemas/error.py with ErrorDetail, ErrorResponse Pydantic models per contracts/api.md
- [ ] T020 Create backend/app/api/deps.py with exception handlers (validation_error_handler, http_exception_handler) returning standardized error format
- [ ] T021 Register exception handlers in backend/app/main.py

**Checkpoint**: Invalid requests return standardized {"error": {...}} JSON response

---

## Phase 5: User Story 1 & 2 - User Registration & Sign In (Priority: P1)

**Goal**: Users can create accounts and sign in
**Spec Reference**: US1, US2, FR-AUTH-001 to FR-AUTH-008
**Independent Test**: Complete signup → auto-signin → signout → signin flow

### Backend Implementation for US1/US2

- [ ] T022 [P] [US1] Create backend/app/models/__init__.py (empty init)
- [ ] T023 [US1] Create backend/app/models/user.py with User SQLModel per data-model.md (id, email, password_hash, created_at, updated_at)
- [ ] T024 [US1] Create Alembic migration for user table: `alembic revision --autogenerate -m "create_user_table"`
- [ ] T025 [US1] Apply migration: `alembic upgrade head`
- [ ] T026 [P] [US1] Create backend/app/schemas/user.py with UserCreate (email: EmailStr, password: str), UserResponse per contracts/api.md
- [ ] T027 [P] [US1] Create backend/app/repositories/__init__.py (empty init)
- [ ] T028 [US1] Create backend/app/repositories/user.py with UserRepository (create, get_by_email, get_by_id, email_exists) per data-model.md
- [ ] T029 [P] [US1] Create backend/app/services/__init__.py (empty init)
- [ ] T030 [US1] Create backend/app/services/auth.py with AuthService (signup, signin, signout, get_session) using Better Auth, password validation (min 8 chars)
- [ ] T031 [P] [US1] Create backend/app/api/__init__.py (empty init)
- [ ] T032 [P] [US1] Create backend/app/api/v1/__init__.py (empty init)
- [ ] T033 [US1] Create backend/app/api/v1/auth.py with auth router: POST /signup, POST /signin, POST /signout, GET /session per contracts/api.md
- [ ] T034 [US1] Create backend/app/api/v1/router.py aggregating auth router under /api/v1 prefix
- [ ] T035 [US1] Include v1 router in backend/app/main.py
- [ ] T036 [US2] Create backend/app/api/deps.py get_current_user dependency that extracts user from Better Auth session cookie

### Frontend Implementation for US1/US2

- [ ] T037 [US1] Create frontend/src/lib/auth.ts with Better Auth client configuration
- [ ] T038 [US1] Create frontend/src/hooks/useAuth.ts hook for auth state (user, isLoading, isAuthenticated)
- [ ] T039 [P] [US1] Create frontend/src/components/ui/Button.tsx reusable button component with loading state
- [ ] T040 [P] [US1] Create frontend/src/components/ui/Input.tsx reusable input component with error display
- [ ] T041 [US1] Create frontend/src/components/auth/SignUpForm.tsx with email/password fields, validation, error display per FR-UI-007
- [ ] T042 [US2] Create frontend/src/components/auth/SignInForm.tsx with email/password fields, validation, error display per FR-UI-007
- [ ] T043 [US1] Create frontend/src/app/(auth)/signup/page.tsx signup page with SignUpForm
- [ ] T044 [US2] Create frontend/src/app/(auth)/signin/page.tsx signin page with SignInForm
- [ ] T045 [US2] Create frontend/src/middleware.ts to redirect unauthenticated users from /todos to /signin per FR-AUTH-008
- [ ] T046 [US2] Update frontend/src/app/layout.tsx with auth provider wrapper, signout button for authenticated users
- [ ] T047 [US2] Update frontend/src/app/page.tsx to redirect to /todos if authenticated, /signin if not

**Checkpoint US1/US2**: User can signup → auto-signin → see redirect to /todos → signout → signin again

---

## Phase 6: User Story 3 - View Todo List (Priority: P2)

**Goal**: Signed-in users can view their todo list
**Spec Reference**: US3, FR-TODO-003, FR-TODO-004, FR-UI-002
**Independent Test**: Sign in → navigate to /todos → see list (or empty state)

**Precondition**: US1/US2 complete

### Backend Implementation for US3

- [ ] T048 [US3] Create backend/app/models/todo.py with Todo SQLModel per data-model.md (id, title, completed, user_id FK, created_at, updated_at)
- [ ] T049 [US3] Create Alembic migration for todo table: `alembic revision --autogenerate -m "create_todo_table"`
- [ ] T050 [US3] Apply migration: `alembic upgrade head`
- [ ] T051 [P] [US3] Create backend/app/schemas/todo.py with TodoCreate, TodoUpdate, TodoResponse, TodoListResponse per contracts/api.md
- [ ] T052 [US3] Create backend/app/repositories/todo.py with TodoRepository (list_by_user) per data-model.md - filters by user_id
- [ ] T053 [US3] Create backend/app/services/todo.py with TodoService (list_todos) calling repository with user_id from session
- [ ] T054 [US3] Create backend/app/api/v1/todos.py with GET /todos endpoint requiring auth per contracts/api.md
- [ ] T055 [US3] Include todos router in backend/app/api/v1/router.py

### Frontend Implementation for US3

- [ ] T056 [US3] Create frontend/src/hooks/useTodos.ts hook for fetching and managing todos state (todos, isLoading, error)
- [ ] T057 [US3] Create frontend/src/components/todos/TodoList.tsx displaying list of todos with title and completion status
- [ ] T058 [US3] Create frontend/src/components/todos/TodoItem.tsx individual todo item display (title, checkbox for status)
- [ ] T059 [US3] Create frontend/src/app/(protected)/todos/page.tsx protected page using TodoList, shows empty state when no todos per Edge Cases

**Checkpoint US3**: Signed-in user sees their todo list (empty state if none), unauthenticated user redirected to signin

---

## Phase 7: User Story 4 - Create Todo (Priority: P2)

**Goal**: Signed-in users can create new todos
**Spec Reference**: US4, FR-TODO-001, FR-TODO-002, FR-TODO-010, FR-UI-003
**Independent Test**: Sign in → create todo → see it appear in list

**Precondition**: US3 complete

### Backend Implementation for US4

- [ ] T060 [US4] Add create method to backend/app/repositories/todo.py (creates todo with user_id, defaults completed=false)
- [ ] T061 [US4] Add create_todo method to backend/app/services/todo.py with title validation (1-255 chars) per FR-TODO-010
- [ ] T062 [US4] Add POST /todos endpoint to backend/app/api/v1/todos.py per contracts/api.md (returns 201)

### Frontend Implementation for US4

- [ ] T063 [US4] Create frontend/src/components/todos/TodoForm.tsx with title input, submit button, validation error display
- [ ] T064 [US4] Add createTodo function to frontend/src/hooks/useTodos.ts
- [ ] T065 [US4] Integrate TodoForm into frontend/src/app/(protected)/todos/page.tsx above TodoList
- [ ] T066 [US4] Add loading state to TodoForm during submission per FR-UI-008

**Checkpoint US4**: User creates todo → appears in list immediately → persists after refresh

---

## Phase 8: User Story 5 - Update Todo (Priority: P3)

**Goal**: Signed-in users can edit todo titles
**Spec Reference**: US5, FR-TODO-005, FR-TODO-009, FR-UI-004
**Independent Test**: Sign in → edit todo title → see change persist

**Precondition**: US4 complete

### Backend Implementation for US5

- [ ] T067 [US5] Add get_by_id method to backend/app/repositories/todo.py (filters by id AND user_id for authorization)
- [ ] T068 [US5] Add update method to backend/app/repositories/todo.py (filters by id AND user_id, updates fields)
- [ ] T069 [US5] Add update_todo method to backend/app/services/todo.py with ownership check (returns 404 if not found/unauthorized per security note)
- [ ] T070 [US5] Add GET /todos/{id} and PATCH /todos/{id} endpoints to backend/app/api/v1/todos.py per contracts/api.md

### Frontend Implementation for US5

- [ ] T071 [US5] Add edit mode state to frontend/src/components/todos/TodoItem.tsx (inline title editing)
- [ ] T072 [US5] Add updateTodo function to frontend/src/hooks/useTodos.ts
- [ ] T073 [US5] Implement cancel editing behavior in TodoItem (preserves original title per US5 acceptance scenario 4)

**Checkpoint US5**: User edits todo title → change persists → cancel restores original

---

## Phase 9: User Story 6 - Toggle Todo Completion (Priority: P3)

**Goal**: Signed-in users can mark todos complete/incomplete
**Spec Reference**: US6, FR-TODO-006, FR-UI-006
**Independent Test**: Sign in → toggle todo → see visual change → persists after refresh

**Precondition**: US5 complete (uses same PATCH endpoint)

### Frontend Implementation for US6

- [ ] T074 [US6] Add toggle checkbox/button to frontend/src/components/todos/TodoItem.tsx
- [ ] T075 [US6] Add toggleTodo function to frontend/src/hooks/useTodos.ts (calls PATCH with completed flip)
- [ ] T076 [US6] Style completed todos differently in TodoItem (e.g., strikethrough, muted color)

**Checkpoint US6**: User toggles todo → visual feedback → persists after page refresh

---

## Phase 10: User Story 7 - Delete Todo (Priority: P3)

**Goal**: Signed-in users can delete todos with confirmation
**Spec Reference**: US7, FR-TODO-007, FR-UI-005
**Independent Test**: Sign in → delete todo → confirm → todo removed permanently

**Precondition**: US4 complete

### Backend Implementation for US7

- [ ] T077 [US7] Add delete method to backend/app/repositories/todo.py (filters by id AND user_id)
- [ ] T078 [US7] Add delete_todo method to backend/app/services/todo.py with ownership check
- [ ] T079 [US7] Add DELETE /todos/{id} endpoint to backend/app/api/v1/todos.py per contracts/api.md

### Frontend Implementation for US7

- [ ] T080 [P] [US7] Create frontend/src/components/ui/Modal.tsx reusable modal component
- [ ] T081 [US7] Create frontend/src/components/todos/DeleteConfirmModal.tsx confirmation dialog
- [ ] T082 [US7] Add delete button to frontend/src/components/todos/TodoItem.tsx triggering modal
- [ ] T083 [US7] Add deleteTodo function to frontend/src/hooks/useTodos.ts
- [ ] T084 [US7] Integrate DeleteConfirmModal into todos page

**Checkpoint US7**: User clicks delete → sees confirmation → confirms → todo removed → doesn't reappear after refresh

---

## Phase 11: User Story 8 - Responsive Interface (Priority: P4)

**Goal**: Application works on desktop, tablet, and mobile
**Spec Reference**: US8, FR-UI-009, SC-005
**Independent Test**: Test all pages at 320px, 768px, 1024px, 1920px widths

**Precondition**: US3-US7 complete

### Frontend Implementation for US8

- [ ] T085 [US8] Update frontend/src/components/auth/SignUpForm.tsx with responsive Tailwind classes (mobile-first)
- [ ] T086 [US8] Update frontend/src/components/auth/SignInForm.tsx with responsive Tailwind classes
- [ ] T087 [US8] Update frontend/src/components/todos/TodoList.tsx with responsive layout (single column mobile, wider on desktop)
- [ ] T088 [US8] Update frontend/src/components/todos/TodoItem.tsx with touch-friendly controls (min 44px tap targets)
- [ ] T089 [US8] Update frontend/src/components/todos/TodoForm.tsx with responsive input sizing
- [ ] T090 [US8] Update frontend/src/app/layout.tsx with responsive container max-widths

**Checkpoint US8**: All features accessible and usable at all breakpoints (320px to 1920px)

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T091 [P] Add loading spinners to frontend components during async operations per FR-UI-008
- [ ] T092 [P] Add network error handling with retry option to frontend/src/lib/api.ts per Edge Cases
- [ ] T093 Update frontend/src/app/(protected)/todos/page.tsx with proper empty state message per Edge Cases
- [ ] T094 [P] Create backend/tests/__init__.py and backend/tests/conftest.py with test fixtures
- [ ] T095 Run quickstart.md validation - verify setup instructions work end-to-end
- [ ] T096 Verify all acceptance scenarios from spec.md pass manually

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Backend Setup)
    ↓
Phase 2 (Frontend Setup) ←── can run parallel with Phase 1
    ↓
Phase 3 (Database Connection) ←── requires Phase 1
    ↓
Phase 4 (Error Handling) ←── requires Phase 3
    ↓
Phase 5 (US1 + US2: Auth) ←── requires Phase 4
    ↓
Phase 6 (US3: View Todos) ←── requires Phase 5
    ↓
Phase 7 (US4: Create Todo) ←── requires Phase 6
    ↓
┌──────────────────┬──────────────────┬──────────────────┐
Phase 8 (US5)      Phase 9 (US6)      Phase 10 (US7)    ←── can run parallel
└──────────────────┴──────────────────┴──────────────────┘
    ↓
Phase 11 (US8: Responsive) ←── requires Phase 8-10
    ↓
Phase 12 (Polish) ←── requires Phase 11
```

### Parallel Opportunities

**Within Phase 1** (all [P] marked tasks):
```bash
T002, T003, T004, T005 can run in parallel
```

**Within Phase 5** (US1/US2):
```bash
T022, T026, T027, T029, T031, T032 can run in parallel
T039, T040 can run in parallel
```

**Within Phase 6** (US3):
```bash
T051 can run parallel with T050
```

**Across Phases 8, 9, 10** (US5, US6, US7):
```bash
All three user story phases can proceed in parallel after US4 completes
```

---

## Implementation Strategy

### MVP First (User Stories 1-4)

1. Complete Phase 1-2: Setup (both projects)
2. Complete Phase 3-4: Foundational (database, errors)
3. Complete Phase 5: US1+US2 (authentication)
4. Complete Phase 6: US3 (view todos)
5. Complete Phase 7: US4 (create todo)
6. **STOP and VALIDATE**: Test signup → signin → create todo → view list
7. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

After MVP:
- Add Phase 8: US5 (edit) → Test independently → Deploy
- Add Phase 9: US6 (toggle) → Test independently → Deploy
- Add Phase 10: US7 (delete) → Test independently → Deploy
- Add Phase 11: US8 (responsive) → Test independently → Deploy
- Add Phase 12: Polish → Final validation → Deploy

### Task Count Summary

| Phase | Tasks | Parallel |
|-------|-------|----------|
| Phase 1: Backend Setup | 7 | 4 |
| Phase 2: Frontend Setup | 4 | 2 |
| Phase 3: Database | 6 | 0 |
| Phase 4: Error Handling | 4 | 1 |
| Phase 5: US1+US2 Auth | 26 | 8 |
| Phase 6: US3 View | 12 | 1 |
| Phase 7: US4 Create | 7 | 0 |
| Phase 8: US5 Update | 7 | 0 |
| Phase 9: US6 Toggle | 3 | 0 |
| Phase 10: US7 Delete | 8 | 1 |
| Phase 11: US8 Responsive | 6 | 0 |
| Phase 12: Polish | 6 | 3 |
| **Total** | **96** | **20** |

---

## Notes

- All file paths are relative to repository root
- [P] tasks can run in parallel within their phase
- [US#] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate before proceeding
