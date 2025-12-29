# Research: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack-todo`
**Date**: 2025-12-29
**Status**: Complete

## Research Topics

### 1. Better Auth Integration with FastAPI

**Question**: How to integrate Better Auth with FastAPI for session-based authentication?

**Decision**: Use Better Auth's Python SDK with FastAPI dependency injection

**Rationale**:
- Better Auth provides official Python SDK for server-side integration
- Session-based authentication fits web application pattern
- Dependency injection allows clean separation of auth logic

**Alternatives Considered**:
1. **JWT with custom implementation**: Rejected - more complexity, Better Auth handles sessions
2. **Passport.js (Node)**: Rejected - constitution mandates Python backend
3. **FastAPI-Users**: Rejected - constitution mandates Better Auth specifically

**Implementation Notes**:
- Install `better-auth` Python package
- Configure session storage in PostgreSQL (same database)
- Create FastAPI dependency `get_current_user()` for protected routes
- Use secure cookies (httpOnly, secure, sameSite=strict)
- Better Auth handles password hashing (bcrypt) automatically

### 2. Neon PostgreSQL Connection Best Practices

**Question**: How to connect FastAPI/SQLModel to Neon Serverless PostgreSQL?

**Decision**: Use psycopg2 with connection pooling via SQLAlchemy engine

**Rationale**:
- Neon is wire-compatible with PostgreSQL
- Standard connection string works
- Connection pooling handles serverless cold starts
- SQLModel uses SQLAlchemy engine underneath

**Alternatives Considered**:
1. **asyncpg (async driver)**: Deferred - adds complexity, sync sufficient for Phase II
2. **Direct psycopg3**: Rejected - SQLModel requires SQLAlchemy integration
3. **Prisma**: Rejected - not SQLModel/SQLAlchemy based

**Implementation Notes**:
- Connection string format: `postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require`
- Enable SSL mode for Neon (required)
- Set pool size appropriate for serverless (5-10 connections)
- Use environment variable for connection string
- Alembic for migrations with same connection string

### 3. Next.js 14 App Router Authentication Patterns

**Question**: How to handle authentication state in Next.js 14 with App Router?

**Decision**: Server-side session check in middleware + client-side auth context

**Rationale**:
- App Router supports middleware for route protection
- Server Components can check auth before rendering
- Client Components need auth context for interactive UI
- Better Auth provides React hooks

**Alternatives Considered**:
1. **Client-only auth check**: Rejected - flashes content before redirect
2. **Server-only (no client state)**: Rejected - need loading states, UI feedback
3. **NextAuth.js**: Rejected - constitution mandates Better Auth

**Implementation Notes**:
- `middleware.ts` redirects unauthenticated users from `/todos` to `/signin`
- Server Components fetch session via cookies
- Client Components use `useSession()` hook from Better Auth
- Route groups: `(auth)` for public, `(protected)` for authenticated
- Auth state persists via httpOnly cookie (no localStorage)

### 4. SQLModel Schema Design

**Question**: How to structure SQLModel for User and Todo entities?

**Decision**: Two SQLModel classes with foreign key relationship

**Rationale**:
- SQLModel combines SQLAlchemy ORM with Pydantic validation
- Foreign key ensures referential integrity
- Cascade delete for user → todos relationship
- Timestamps tracked automatically

**Implementation Notes**:
```python
# User model (simplified)
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str  # Managed by Better Auth
    created_at: datetime = Field(default_factory=datetime.utcnow)
    todos: list["Todo"] = Relationship(back_populates="user")

# Todo model (simplified)
class Todo(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="todos")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 5. API Versioning Strategy

**Question**: How to implement API versioning in FastAPI?

**Decision**: URL path versioning with `/api/v1/` prefix

**Rationale**:
- Constitution mandates API versioning
- URL path versioning is most explicit and discoverable
- Easy to add `/api/v2/` when needed
- FastAPI routers support prefix configuration

**Alternatives Considered**:
1. **Header versioning (Accept header)**: Rejected - less discoverable
2. **Query parameter (?version=1)**: Rejected - non-standard
3. **No versioning**: Rejected - violates constitution

**Implementation Notes**:
- Create `APIRouter` with prefix `/api/v1`
- Include sub-routers for auth and todos
- All endpoints under versioned prefix
- Health endpoints can be unversioned (`/health`, `/ready`)

### 6. Error Handling Strategy

**Question**: How to handle errors consistently across the API?

**Decision**: Custom exception handlers with standardized error response format

**Rationale**:
- Spec requires meaningful error messages in consistent format
- FastAPI exception handlers enable centralized error handling
- Pydantic validation errors transformed to user-friendly format

**Implementation Notes**:
```python
# Error response schema
{
  "error": {
    "code": "VALIDATION_ERROR",  # Machine-readable
    "message": "Title is required",  # Human-readable
    "details": [...]  # Optional field-level errors
  }
}

# Error codes
- VALIDATION_ERROR: Invalid input
- UNAUTHORIZED: Not authenticated
- FORBIDDEN: Not authorized for resource
- NOT_FOUND: Resource doesn't exist
- SERVER_ERROR: Internal error
```

### 7. Responsive Design Approach

**Question**: How to implement responsive design for desktop and mobile?

**Decision**: Tailwind CSS with mobile-first breakpoints

**Rationale**:
- Tailwind provides utility classes for responsive design
- Mobile-first ensures small screens work by default
- Consistent with Next.js ecosystem
- No additional CSS framework needed

**Alternatives Considered**:
1. **CSS Modules**: Rejected - more verbose for responsive design
2. **Styled Components**: Rejected - adds runtime overhead
3. **Bootstrap**: Rejected - Tailwind more flexible and modern

**Implementation Notes**:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile: Single column, touch-friendly buttons (min 44px)
- Tablet: Two-column where appropriate
- Desktop: Full layout with sidebar potential
- Form inputs sized for touch on mobile

## Summary of Decisions

| Topic | Decision | Key Reason |
|-------|----------|------------|
| Auth | Better Auth with sessions | Constitution mandate |
| Database | Neon PostgreSQL + SQLModel | Constitution mandate |
| Connection | psycopg2 with pooling | Standard, reliable |
| Frontend Auth | Middleware + Context | Server + client needs |
| Schema | SQLModel with FK | Type-safe, validated |
| API Versioning | URL path /api/v1/ | Constitution mandate |
| Errors | Custom handlers | Consistent format |
| Responsive | Tailwind mobile-first | Modern, flexible |

## Open Questions (None)

All research questions resolved. Ready for Phase 1 design.
