# Quickstart: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack-todo`
**Date**: 2025-12-29

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or pnpm
- Neon PostgreSQL account (free tier available)
- Git

## Project Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd todo-app
git checkout 001-phase-ii-fullstack-todo
```

### 2. Database Setup (Neon)

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
# BETTER_AUTH_SECRET=<generate-32-char-random-string>
# BETTER_AUTH_URL=http://localhost:8000
# FRONTEND_URL=http://localhost:3000

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at http://localhost:8000

### 4. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install
# or: pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start the development server
npm run dev
# or: pnpm dev
```

Frontend will be available at http://localhost:3000

## Verification

### Test Backend

```bash
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy"}

# Ready check (database connection)
curl http://localhost:8000/ready

# Expected response:
# {"status": "ready", "database": "connected"}
```

### Test Frontend

1. Open http://localhost:3000 in your browser
2. You should see the sign-in page
3. Click "Sign up" to create an account
4. After signup, you should be redirected to the todo list

## Development Workflow

### Running Both Services

**Terminal 1 (Backend)**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

### Running Tests

**Backend Tests**:
```bash
cd backend
pytest
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

### Database Migrations

**Create a new migration**:
```bash
cd backend
alembic revision --autogenerate -m "description of changes"
```

**Apply migrations**:
```bash
alembic upgrade head
```

**Rollback last migration**:
```bash
alembic downgrade -1
```

## Common Issues

### Database Connection Errors

- Ensure your Neon database is running
- Check that `DATABASE_URL` in `.env` is correct
- Verify `?sslmode=require` is in the connection string

### CORS Errors

- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default should be `http://localhost:3000`

### Authentication Issues

- Clear browser cookies and try again
- Ensure `BETTER_AUTH_SECRET` is set (at least 32 characters)
- Check that both backend and frontend are running

### Port Conflicts

- Backend default: 8000
- Frontend default: 3000
- Change ports if needed and update environment variables

## API Documentation

When the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | Neon PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes | Random string for session signing (32+ chars) |
| BETTER_AUTH_URL | Yes | Backend URL (http://localhost:8000) |
| FRONTEND_URL | Yes | Frontend URL for CORS (http://localhost:3000) |

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | Yes | Backend API URL (http://localhost:8000/api/v1) |

## Next Steps

1. Review the [API Contract](./contracts/api.md) for endpoint details
2. Review the [Data Model](./data-model.md) for entity structures
3. Run `/sp.tasks` to generate implementation tasks
