# Data Model: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack-todo`
**Date**: 2025-12-29
**Status**: Complete

## Overview

Phase II introduces persistent storage with two core entities:
- **User**: Account holder who owns todos
- **Todo**: Task item belonging to a user

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│        User         │       │        Todo         │
├─────────────────────┤       ├─────────────────────┤
│ id: UUID (PK)       │──────<│ id: UUID (PK)       │
│ email: VARCHAR(255) │       │ title: VARCHAR(255) │
│ password_hash: TEXT │       │ completed: BOOLEAN  │
│ created_at: TIMESTAMP│      │ user_id: UUID (FK)  │
│ updated_at: TIMESTAMP│      │ created_at: TIMESTAMP│
└─────────────────────┘       │ updated_at: TIMESTAMP│
                              └─────────────────────┘

Relationship: User (1) ──── (0..*) Todo
```

## Entity Definitions

### User

**Purpose**: Represents a registered account in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Auto-generated | Unique identifier |
| email | VARCHAR(255) | Unique, Not Null, Indexed | Login email address |
| password_hash | TEXT | Not Null | Bcrypt hash (managed by Better Auth) |
| created_at | TIMESTAMP | Not Null, Default: now() | Account creation time |
| updated_at | TIMESTAMP | Not Null, Default: now() | Last update time |

**Indexes**:
- Primary key on `id`
- Unique index on `email` (for login lookups)

**Validation Rules** (from spec):
- Email must be valid format (FR-AUTH-002)
- Password minimum 8 characters before hashing (FR-AUTH-003)
- Email must not already exist (FR-AUTH-004)

### Todo

**Purpose**: Represents a task item owned by a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Auto-generated | Unique identifier |
| title | VARCHAR(255) | Not Null, Min 1 char | Task description |
| completed | BOOLEAN | Not Null, Default: false | Completion status |
| user_id | UUID | Foreign Key → User.id, Not Null | Owner reference |
| created_at | TIMESTAMP | Not Null, Default: now() | Creation time |
| updated_at | TIMESTAMP | Not Null, Default: now() | Last update time |

**Indexes**:
- Primary key on `id`
- Index on `user_id` (for filtering by user)
- Composite index on `(user_id, created_at)` for sorted queries

**Foreign Key Constraints**:
- `user_id` references `User.id` with ON DELETE CASCADE

**Validation Rules** (from spec):
- Title must be 1-255 characters (FR-TODO-010)
- Title must not be empty (FR-TODO-010)
- UTF-8 characters including emoji allowed

## Session Storage (Better Auth)

Better Auth manages its own session table. Schema is controlled by Better Auth.

```
┌─────────────────────┐
│      Session        │
├─────────────────────┤
│ id: TEXT (PK)       │
│ user_id: UUID (FK)  │
│ expires_at: TIMESTAMP│
│ created_at: TIMESTAMP│
└─────────────────────┘
```

**Note**: Do not manually modify session data. Use Better Auth APIs.

## State Transitions

### Todo Completion State

```
┌──────────────┐      toggle()      ┌──────────────┐
│   Incomplete │ <───────────────> │   Complete   │
│ completed=F  │                    │ completed=T  │
└──────────────┘                    └──────────────┘
```

### User Lifecycle

```
┌──────────────┐   signup()   ┌──────────────┐   signout()  ┌──────────────┐
│  Anonymous   │ ──────────> │   Signed In  │ ──────────> │  Signed Out  │
└──────────────┘              └──────────────┘              └──────────────┘
                                    │    ▲
                                    │    │
                                   signin()
```

## Database Schema (SQL)

```sql
-- Users table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "user"(email);

-- Todos table
CREATE TABLE todo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL CHECK (length(title) >= 1),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_todo_user_id ON todo(user_id);
CREATE INDEX idx_todo_user_created ON todo(user_id, created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_updated_at
    BEFORE UPDATE ON todo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## SQLModel Definitions

### User Model

```python
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    todos: List["Todo"] = Relationship(back_populates="user")
```

### Todo Model

```python
class Todo(SQLModel, table=True):
    __tablename__ = "todo"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255, min_length=1)
    completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: Optional[User] = Relationship(back_populates="todos")
```

## Pydantic Schemas (API Layer)

### User Schemas

```python
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Min 8 chars validated in service


class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
```

### Todo Schemas

```python
class TodoCreate(BaseModel):
    title: str  # 1-255 chars


class TodoUpdate(BaseModel):
    title: Optional[str] = None  # 1-255 chars if provided
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: UUID
    title: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    todos: List[TodoResponse]
    total: int
```

## Data Access Patterns

### User Repository

| Operation | Method | Query Pattern |
|-----------|--------|---------------|
| Create user | `create(email, password_hash)` | INSERT |
| Get by email | `get_by_email(email)` | SELECT WHERE email = ? |
| Get by ID | `get_by_id(id)` | SELECT WHERE id = ? |
| Check exists | `email_exists(email)` | SELECT 1 WHERE email = ? |

### Todo Repository

| Operation | Method | Query Pattern |
|-----------|--------|---------------|
| Create | `create(title, user_id)` | INSERT |
| List by user | `list_by_user(user_id)` | SELECT WHERE user_id = ? ORDER BY created_at DESC |
| Get by ID | `get_by_id(id, user_id)` | SELECT WHERE id = ? AND user_id = ? |
| Update | `update(id, user_id, fields)` | UPDATE WHERE id = ? AND user_id = ? |
| Delete | `delete(id, user_id)` | DELETE WHERE id = ? AND user_id = ? |

**Authorization Note**: All todo queries include `user_id` filter to enforce ownership.

## Migration Strategy

1. **Initial Migration**: Create `user` and `todo` tables with indexes
2. **Subsequent Migrations**: Use Alembic for schema changes
3. **Rollback Support**: Each migration must have down migration

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```
