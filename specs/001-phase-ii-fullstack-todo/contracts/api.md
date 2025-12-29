# API Contract: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack-todo`
**Date**: 2025-12-29
**Version**: v1
**Base URL**: `/api/v1`

## Overview

This document defines the REST API contract for Phase II. All endpoints except health checks require authentication.

## Common Headers

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes (POST/PATCH) | `application/json` |
| Cookie | Yes (protected) | Session cookie from Better Auth |

### Response Headers

| Header | Description |
|--------|-------------|
| Content-Type | `application/json` |
| Set-Cookie | Session cookie (auth endpoints) |

## Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not authorized for resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate email) |
| SERVER_ERROR | 500 | Internal server error |

---

## Health Endpoints

### GET /health

Check if the service is running.

**Authentication**: None

**Response 200**:
```json
{
  "status": "healthy"
}
```

### GET /ready

Check if the service is ready to accept requests (database connected).

**Authentication**: None

**Response 200**:
```json
{
  "status": "ready",
  "database": "connected"
}
```

**Response 503**:
```json
{
  "status": "not_ready",
  "database": "disconnected"
}
```

---

## Authentication Endpoints

### POST /api/v1/auth/signup

Create a new user account.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Minimum 8 characters |

**Response 201** (Success):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-12-29T10:00:00Z"
  }
}
```

**Response 400** (Validation Error):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {"field": "password", "message": "Password must be at least 8 characters"}
    ]
  }
}
```

**Response 409** (Conflict):
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered"
  }
}
```

---

### POST /api/v1/auth/signin

Sign in to an existing account.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 200** (Success):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-12-29T10:00:00Z"
  }
}
```

**Set-Cookie Header**: Session cookie (httpOnly, secure, sameSite=strict)

**Response 401** (Invalid Credentials):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

---

### POST /api/v1/auth/signout

End the current session.

**Authentication**: Required

**Request Body**: None

**Response 200** (Success):
```json
{
  "message": "Signed out successfully"
}
```

**Set-Cookie Header**: Clears session cookie

**Response 401** (Not Authenticated):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated"
  }
}
```

---

### GET /api/v1/auth/session

Get current session information.

**Authentication**: Required

**Response 200** (Authenticated):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-12-29T10:00:00Z"
  }
}
```

**Response 401** (Not Authenticated):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated"
  }
}
```

---

## Todo Endpoints

### GET /api/v1/todos

List all todos for the current user.

**Authentication**: Required

**Response 200**:
```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Buy groceries",
      "completed": false,
      "created_at": "2025-12-29T10:00:00Z",
      "updated_at": "2025-12-29T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Read book",
      "completed": true,
      "created_at": "2025-12-29T09:00:00Z",
      "updated_at": "2025-12-29T11:00:00Z"
    }
  ],
  "total": 2
}
```

**Response 401** (Not Authenticated):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated"
  }
}
```

---

### POST /api/v1/todos

Create a new todo.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Buy groceries"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | Yes | 1-255 characters |

**Response 201** (Success):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries",
  "completed": false,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T10:00:00Z"
}
```

**Response 400** (Validation Error):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {"field": "title", "message": "Title is required"}
    ]
  }
}
```

---

### GET /api/v1/todos/{id}

Get a single todo by ID.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Todo identifier |

**Response 200** (Success):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries",
  "completed": false,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T10:00:00Z"
}
```

**Response 404** (Not Found):
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

**Note**: Returns 404 for both non-existent todos AND todos belonging to other users (security: don't leak existence).

---

### PATCH /api/v1/todos/{id}

Update an existing todo (title or completion status).

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Todo identifier |

**Request Body** (all fields optional):
```json
{
  "title": "Buy groceries and snacks",
  "completed": true
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | No | 1-255 characters if provided |
| completed | boolean | No | true or false |

**Response 200** (Success):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Buy groceries and snacks",
  "completed": true,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T12:00:00Z"
}
```

**Response 400** (Validation Error):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {"field": "title", "message": "Title cannot be empty"}
    ]
  }
}
```

**Response 404** (Not Found):
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

---

### DELETE /api/v1/todos/{id}

Delete a todo.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Todo identifier |

**Response 200** (Success):
```json
{
  "message": "Todo deleted successfully"
}
```

**Response 404** (Not Found):
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

---

## TypeScript Types (Frontend)

```typescript
// User types
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthResponse {
  user: User;
}

interface SignupRequest {
  email: string;
  password: string;
}

interface SigninRequest {
  email: string;
  password: string;
}

// Todo types
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TodoListResponse {
  todos: Todo[];
  total: number;
}

interface CreateTodoRequest {
  title: string;
}

interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

// Error types
interface ErrorDetail {
  field: string;
  message: string;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}
```

## Rate Limiting (Future Consideration)

Not implemented in Phase II. Consider for production:
- 100 requests/minute per IP for auth endpoints
- 1000 requests/minute per user for todo endpoints
