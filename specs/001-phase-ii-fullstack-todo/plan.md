# Implementation Plan: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack-todo` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase-ii-fullstack-todo/spec.md`
**Constitution**: v1.1.0 (Phase II Technology Matrix)

## Summary

Transform the Phase I in-memory todo application into a full-stack web application with:
- **Backend**: Python FastAPI REST API with SQLModel ORM
- **Database**: Neon Serverless PostgreSQL for persistent storage
- **Frontend**: Next.js 14+ with TypeScript and App Router
- **Authentication**: Better Auth for signup/signin with session management

Users can register, sign in, and manage personal todo lists. Each user sees only their own todos. All data persists across sessions.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Pydantic v2, Next.js 14+, Better Auth
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Web (modern browsers), Linux server deployment
**Project Type**: Web application (separate backend + frontend)
**Performance Goals**: <2s response time, 100 concurrent users
**Constraints**: No AI/agents (Phase III), no Docker/K8s (Phase IV+)
**Scale/Scope**: Single-tenant, ~100 concurrent users, 2 entities (User, Todo)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Technology Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Backend: Python 3.11+ | PASS | Using Python 3.11+ |
| Framework: FastAPI | PASS | FastAPI for REST API |
| ORM: SQLModel | PASS | SQLModel for data access |
| Validation: Pydantic v2 | PASS | Pydantic v2 via SQLModel |
| Database: Neon PostgreSQL | PASS | Neon Serverless PostgreSQL |
| Frontend: Next.js 14+ | PASS | Next.js 14+ with App Router |
| Language: TypeScript | PASS | TypeScript strict mode |
| Auth: Better Auth | PASS | Better Auth for signup/signin |

### Phase II Prohibitions

| Prohibition | Status | Notes |
|-------------|--------|-------|
| No AI/ML frameworks | PASS | Not using OpenAI SDK, LangChain, etc. |
| No Agent frameworks | PASS | Not using AutoGPT, CrewAI, etc. |
| No MCP | PASS | Not using Model Context Protocol |
| No Docker (Phase IV) | PASS | Local development only |
| No Kubernetes (Phase V) | PASS | No orchestration |

### Quality Principles Compliance

| Principle | Status | Implementation |
|-----------|--------|----------------|
| Clean Architecture | PASS | Domain → Application → Infrastructure → Presentation |
| Separation of Concerns | PASS | Routes, services, repositories separated |
| Stateless Services | PASS | Session state in database via Better Auth |
| API Versioning | PASS | /api/v1/ prefix |
| Environment Variables | PASS | All secrets via .env |
| Database Migrations | PASS | Alembic for schema changes |

**Gate Result**: PASS - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-ii-fullstack-todo/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # REST API contract
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   └── todo.py          # Todo SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # User Pydantic schemas
│   │   └── todo.py          # Todo Pydantic schemas
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── user.py          # User data access
│   │   └── todo.py          # Todo data access
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py          # Better Auth integration
│   │   └── todo.py          # Todo business logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py    # API v1 router
│   │   │   ├── auth.py      # Auth endpoints
│   │   │   └── todos.py     # Todo endpoints
│   │   └── deps.py          # Dependency injection
│   └── db/
│       ├── __init__.py
│       ├── session.py       # Database session
│       └── migrations/      # Alembic migrations
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   ├── unit/
│   │   └── test_todo_service.py
│   └── integration/
│       └── test_api_todos.py
├── alembic.ini
├── pyproject.toml
└── requirements.txt

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home (redirect to todos or signin)
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   └── (protected)/
│   │       └── todos/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   └── todos/
│   │       ├── TodoList.tsx
│   │       ├── TodoItem.tsx
│   │       ├── TodoForm.tsx
│   │       └── DeleteConfirmModal.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Better Auth client
│   │   └── types.ts         # TypeScript types
│   └── hooks/
│       ├── useAuth.ts       # Auth state hook
│       └── useTodos.ts      # Todos data hook
├── tests/
│   └── components/
│       └── TodoList.test.tsx
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

**Structure Decision**: Web application with separate backend and frontend projects. Backend follows Clean Architecture (models → repositories → services → API). Frontend uses Next.js App Router with route groups for auth vs protected pages.

## Architecture Decisions

### 1. Backend Architecture

**Decision**: FastAPI with Clean Architecture layers

**Rationale**:
- Constitution mandates FastAPI for Phase II
- Clean Architecture ensures testability and separation
- SQLModel provides type-safe ORM with Pydantic integration

**Layers**:
1. **Models** (SQLModel): Database entities
2. **Schemas** (Pydantic): Request/response validation
3. **Repositories**: Data access abstraction
4. **Services**: Business logic
5. **API Routes**: HTTP handling only

### 2. Database Schema

**Decision**: Two tables (users, todos) with foreign key relationship

**Rationale**:
- Spec defines User and Todo as key entities
- One-to-many: User owns Todos
- User deletion cascades to todos (per spec: data retained until explicit deletion)

### 3. Authentication Flow

**Decision**: Better Auth with session-based authentication

**Rationale**:
- Constitution mandates Better Auth for Phase II
- Session-based auth simpler than JWT for web apps
- Secure cookies with CSRF protection

**Flow**:
1. User submits credentials → Better Auth validates
2. Session created in database
3. Session cookie set (httpOnly, secure, sameSite)
4. Frontend includes cookie automatically
5. Backend validates session on protected routes

### 4. Frontend Architecture

**Decision**: Next.js 14+ App Router with Server Components

**Rationale**:
- Constitution mandates Next.js 14+
- App Router provides file-based routing
- Server Components reduce client-side JavaScript
- Client Components for interactive elements (forms, toggles)

**Route Groups**:
- `(auth)`: Sign in, sign up pages (no auth required)
- `(protected)`: Todo pages (auth required, redirect if not signed in)

### 5. API Communication

**Decision**: REST API with fetch, no external state library

**Rationale**:
- Spec requires REST API communication
- Native fetch sufficient for CRUD operations
- React state + Server Actions for simplicity
- No Redux/Zustand needed for this scope

### 6. Responsive Design

**Decision**: Tailwind CSS with mobile-first breakpoints

**Rationale**:
- Tailwind provides utility classes for responsive design
- Mobile-first ensures small screens work by default
- Breakpoints: sm (640px), md (768px), lg (1024px)

## API Design

### Base URL

```
Backend: http://localhost:8000/api/v1
Frontend: http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/signup | Create new user account |
| POST | /api/v1/auth/signin | Sign in existing user |
| POST | /api/v1/auth/signout | End user session |
| GET | /api/v1/auth/session | Get current session |

### Todo Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/todos | List all todos for current user |
| POST | /api/v1/todos | Create new todo |
| GET | /api/v1/todos/{id} | Get single todo |
| PATCH | /api/v1/todos/{id} | Update todo (title or completion) |
| DELETE | /api/v1/todos/{id} | Delete todo |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [
      {"field": "title", "message": "Title is required"}
    ]
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST (resource created) |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden (accessing other user's resource) |
| 404 | Resource not found |
| 500 | Server error |

## Security Considerations

1. **Password Hashing**: bcrypt via Better Auth (never store plaintext)
2. **Session Security**: httpOnly, secure, sameSite=strict cookies
3. **CSRF Protection**: Better Auth provides built-in protection
4. **Input Validation**: Pydantic validates all inputs
5. **SQL Injection**: SQLModel/SQLAlchemy parameterized queries
6. **Authorization**: Every todo operation verifies user_id ownership
7. **Rate Limiting**: Consider for production (out of Phase II scope)

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Complexity Tracking

> **No violations to justify** - All decisions comply with Constitution v1.1.0 Phase II constraints.

| Aspect | Choice | Justification |
|--------|--------|---------------|
| Two projects (backend/frontend) | Required | Web application needs separate deployable units per constitution |
| Repository pattern | Chosen | Constitution requires database queries encapsulated in repositories |
| No external state library | Chosen | Simplest solution for scope; React state + fetch sufficient |

## Requirements Traceability

This section maps spec requirements to implementation approach.

### Authentication Requirements → Implementation

| Requirement | HOW It's Built |
|-------------|----------------|
| FR-AUTH-001: Create accounts | `POST /api/v1/auth/signup` → `AuthService.signup()` → `UserRepository.create()` → `user` table |
| FR-AUTH-002: Validate email | Pydantic `EmailStr` in `UserCreate` schema validates format before processing |
| FR-AUTH-003: Password min 8 chars | `AuthService.signup()` validates length before passing to Better Auth |
| FR-AUTH-004: Prevent duplicates | `UserRepository.email_exists()` check + database UNIQUE constraint on `email` |
| FR-AUTH-005: Sign in | `POST /api/v1/auth/signin` → Better Auth validates credentials → session created |
| FR-AUTH-006: Persist sessions | Better Auth stores session in PostgreSQL; httpOnly cookie sent to browser |
| FR-AUTH-007: Sign out | `POST /api/v1/auth/signout` → Better Auth deletes session → cookie cleared |
| FR-AUTH-008: Redirect unauth | Next.js `middleware.ts` checks session; redirects `/todos` → `/signin` if missing |

### Todo Requirements → Implementation

| Requirement | HOW It's Built |
|-------------|----------------|
| FR-TODO-001: Create todo | `POST /api/v1/todos` → `TodoService.create()` → `TodoRepository.create()` |
| FR-TODO-002: Associate with user | `TodoService.create()` extracts `user_id` from session, passes to repository |
| FR-TODO-003: View own todos only | `TodoRepository.list_by_user(user_id)` filters by `WHERE user_id = ?` |
| FR-TODO-004: Display title + status | `TodoResponse` schema includes `title` and `completed` fields |
| FR-TODO-005: Update title | `PATCH /api/v1/todos/{id}` with `{"title": "..."}` → `TodoRepository.update()` |
| FR-TODO-006: Toggle completion | `PATCH /api/v1/todos/{id}` with `{"completed": true/false}` |
| FR-TODO-007: Delete todo | `DELETE /api/v1/todos/{id}` → `TodoRepository.delete()` |
| FR-TODO-008: Persist data | All operations write to Neon PostgreSQL via SQLModel |
| FR-TODO-009: Reject other users | All repository methods require `user_id` parameter; query filters by owner |
| FR-TODO-010: Validate title | Pydantic schema: `title: str = Field(min_length=1, max_length=255)` |

### API Requirements → Implementation

| Requirement | HOW It's Built |
|-------------|----------------|
| FR-API-001: CRUD endpoints | FastAPI routers in `api/v1/todos.py` define GET, POST, PATCH, DELETE |
| FR-API-002: JSON format | FastAPI automatic JSON serialization; Pydantic models for validation |
| FR-API-003: Require auth | `get_current_user` dependency on all todo routes; returns 401 if no session |
| FR-API-004: Status codes | FastAPI `HTTPException` with appropriate codes; `status_code` on responses |
| FR-API-005: Error messages | Custom exception handler transforms errors to `{"error": {...}}` format |

### Frontend Requirements → Implementation

| Requirement | HOW It's Built |
|-------------|----------------|
| FR-UI-001: Auth pages | `(auth)/signin/page.tsx`, `(auth)/signup/page.tsx`, signout button in layout |
| FR-UI-002: Todo list view | `(protected)/todos/page.tsx` with `TodoList` component |
| FR-UI-003: Add interface | `TodoForm` component with title input and submit button |
| FR-UI-004: Edit interface | `TodoItem` component with edit mode; inline title editing |
| FR-UI-005: Delete with confirm | `DeleteConfirmModal` component shown on delete click |
| FR-UI-006: Toggle completion | Checkbox/button in `TodoItem` calls PATCH with `completed` toggle |
| FR-UI-007: Inline errors | Form components display errors below inputs using state |
| FR-UI-008: Loading states | `useTodos` hook tracks `isLoading`; components show spinner/disabled state |
| FR-UI-009: Responsive | Tailwind classes: `w-full md:w-1/2 lg:w-1/3` etc. for breakpoints |

## Implementation Phases

### Phase 0: Research (Complete in research.md)
- Better Auth integration patterns with FastAPI
- Neon PostgreSQL connection best practices
- Next.js 14 App Router authentication patterns

### Phase 1: Design (Complete in data-model.md, contracts/)
- Database schema with User and Todo models
- API contract with all endpoints
- Frontend component hierarchy

### Phase 2: Tasks (Output in tasks.md via /sp.tasks)
- Ordered implementation tasks
- Test requirements per task
- Dependency graph
