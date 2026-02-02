# Quickstart: Phase III - AI Chatbot Todo Management

**Date**: 2026-01-31
**Feature**: 002-phase-iii-ai-chatbot

## Prerequisites

1. Phase II completed and running
2. Python 3.11+ installed
3. Node.js 18+ installed
4. OpenAI API key

## Setup

### 1. Install Backend Dependencies

```bash
cd backend
pip install openai mcp
```

### 2. Configure Environment Variables

Add to `.env`:
```bash
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

### 3. Run Database Migration

```bash
cd backend
alembic upgrade head
```

### 4. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

### 5. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

## Usage

### Access Chat Interface

1. Navigate to `http://localhost:3000`
2. Sign in with your account
3. Click "Chat" in navigation
4. Start typing natural language commands

### Example Interactions

**Adding a Task**:
```
User: Add a task to buy groceries
Assistant: I've added "buy groceries" to your task list!
```

**Listing Tasks**:
```
User: Show me my tasks
Assistant: Here are your tasks:
1. buy groceries (pending)
2. finish report (completed)
3. call mom (pending)
```

**Completing a Task**:
```
User: Mark buy groceries as done
Assistant: Great! I've marked "buy groceries" as complete.
```

**Updating a Task**:
```
User: Change "call mom" to "call mom about birthday"
Assistant: I've updated the task from "call mom" to "call mom about birthday".
```

**Deleting a Task**:
```
User: Delete the groceries task
Assistant: I've removed "buy groceries" from your list.
```

## API Testing

### Send Chat Message

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'
```

Expected Response:
```json
{
  "response": "I've added 'buy groceries' to your task list!",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "tool_calls": [
    {
      "tool": "add_task",
      "input": {"title": "buy groceries"},
      "output": {"task_id": "...", "title": "buy groceries", "created_at": "..."},
      "status": "success"
    }
  ]
}
```

### Continue Conversation

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Now mark it as done",
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### List Conversations

```bash
curl http://localhost:8000/api/v1/conversations \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Conversation History

```bash
curl http://localhost:8000/api/v1/conversations/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Troubleshooting

### OpenAI API Errors

**"Invalid API Key"**:
- Verify `OPENAI_API_KEY` in `.env`
- Ensure key has API access enabled

**"Rate Limited"**:
- Wait a moment and retry
- Check OpenAI dashboard for usage limits

### Database Errors

**"Table does not exist"**:
- Run `alembic upgrade head`
- Check migration logs for errors

### Authentication Errors

**"401 Unauthorized"**:
- Ensure you're logged in
- Check JWT token validity
- Token may have expired (sign in again)

## Development Tips

### Testing MCP Tools Directly

```python
from app.mcp.tools import add_task, list_tasks

# Test add_task
result = add_task(title="test task", user_id="your-user-uuid")
print(result)

# Test list_tasks
tasks = list_tasks(filter="all", user_id="your-user-uuid")
print(tasks)
```

### Viewing Conversation History in DB

```sql
SELECT m.role, m.content, m.created_at
FROM message m
JOIN conversation c ON m.conversation_id = c.id
WHERE c.user_id = 'your-user-uuid'
ORDER BY m.created_at DESC
LIMIT 20;
```

## Architecture Notes

- **Stateless**: Each request loads context from database
- **No Streaming**: Responses return complete (no SSE)
- **Tool Transparency**: Tool calls visible in response
- **Conversation Resume**: Refresh page, history loads
