# Data Model: Phase III - AI Chatbot Todo Management

**Date**: 2026-01-31
**Feature**: 002-phase-iii-ai-chatbot

## Overview

Phase III introduces two new entities to support conversational AI: `Conversation` and `Message`. These work alongside the existing `Todo` and `User` entities from Phase II.

---

## Entity Relationship Diagram

```text
┌──────────────────┐
│      User        │
│  (Phase II)      │
├──────────────────┤
│  id: UUID [PK]   │
│  email: string   │
│  name: string    │
│  ...             │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐         ┌──────────────────┐
│   Conversation   │         │      Todo        │
│  (Phase III)     │         │  (Phase II)      │
├──────────────────┤         ├──────────────────┤
│  id: UUID [PK]   │         │  id: UUID [PK]   │
│  user_id: UUID   │◀────────│  user_id: UUID   │
│  created_at      │  [FK]   │  title: string   │
│  last_activity   │         │  completed: bool │
└────────┬─────────┘         │  ...             │
         │                   └──────────────────┘
         │ 1:N
         ▼
┌──────────────────┐
│     Message      │
│  (Phase III)     │
├──────────────────┤
│  id: UUID [PK]   │
│  conversation_id │
│  role: enum      │
│  content: text   │
│  tool_calls: json│
│  created_at      │
└──────────────────┘
```

---

## New Entities

### Conversation

Represents a chat session between a user and the AI assistant.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| user_id | UUID | FK → user.id, NOT NULL, INDEX | Owner of the conversation |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When conversation started |
| last_activity | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last message timestamp |

**Relationships**:
- Belongs to one `User`
- Has many `Message` entities

**Indexes**:
- `idx_conversation_user_id` on `user_id`
- `idx_conversation_last_activity` on `last_activity` (for sorting)

---

### Message

Represents a single exchange within a conversation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| conversation_id | UUID | FK → conversation.id, NOT NULL, INDEX | Parent conversation |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('user', 'assistant', 'tool') | Message sender type |
| content | TEXT | NOT NULL | Message text content |
| tool_calls | JSONB | NULLABLE | Tool invocations (assistant only) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When message was created |

**Relationships**:
- Belongs to one `Conversation`

**Indexes**:
- `idx_message_conversation_id` on `conversation_id`
- `idx_message_created_at` on `created_at` (for ordering)

**Role Values**:
- `user`: Message from the human user
- `assistant`: Response from the AI agent
- `tool`: Result from an MCP tool invocation

**Tool Calls Schema** (JSONB):
```json
[
  {
    "tool": "add_task",
    "input": {"title": "buy groceries"},
    "output": {"task_id": "uuid", "title": "buy groceries", "created_at": "ISO"},
    "status": "success"
  }
]
```

---

## Existing Entities (Phase II - Unchanged)

### User

No changes required. Conversation links via `user_id` foreign key.

### Todo

No schema changes required. MCP tools interact with existing `Todo` entity through `TodoRepository`.

**Relevant Fields for Phase III**:
| Field | Type | Used By |
|-------|------|---------|
| id | UUID | update_task, delete_task, complete_task |
| title | VARCHAR(255) | add_task, update_task, list_tasks |
| completed | BOOLEAN | complete_task, list_tasks |
| user_id | UUID | All tools (ownership verification) |
| created_at | TIMESTAMP | list_tasks |

---

## Validation Rules

### Conversation
- `user_id` must reference existing user
- `created_at` immutable after creation
- `last_activity` updated on each new message

### Message
- `conversation_id` must reference existing conversation
- `role` must be one of: 'user', 'assistant', 'tool'
- `content` cannot be empty or whitespace-only
- `tool_calls` only populated for role='assistant'
- `created_at` immutable after creation

### Tool-Specific Validation
| Tool | Validation |
|------|------------|
| add_task | title: 1-500 chars, not empty |
| list_tasks | filter: 'all', 'completed', 'incomplete' |
| update_task | task_id: valid UUID, title: 1-500 chars |
| delete_task | task_id: valid UUID |
| complete_task | task_id: valid UUID, is_completed: boolean |

---

## State Transitions

### Conversation Lifecycle
```text
                ┌─────────────────┐
                │     ACTIVE      │
    Created ───▶│  (accepting     │
                │   messages)     │
                └────────┬────────┘
                         │
                         │ (No explicit close;
                         │  remains active indefinitely)
                         │
                         ▼
                ┌─────────────────┐
                │    INACTIVE     │
                │  (no messages   │
                │   for 30+ days) │
                └─────────────────┘
```

Note: Phase III does not implement conversation archival. All conversations remain queryable.

### Todo State (Unchanged from Phase II)
```text
┌────────────┐     complete_task      ┌────────────┐
│  PENDING   │ ───────────────────▶   │ COMPLETED  │
│(completed= │                        │(completed= │
│   false)   │ ◀───────────────────   │   true)    │
└────────────┘     complete_task      └────────────┘
                  (is_completed=false)
```

---

## Query Patterns

### Load Conversation History
```sql
SELECT m.*
FROM message m
WHERE m.conversation_id = :conversation_id
ORDER BY m.created_at ASC
LIMIT 20;
```

### List User Conversations
```sql
SELECT c.*
FROM conversation c
WHERE c.user_id = :user_id
ORDER BY c.last_activity DESC
LIMIT 10;
```

### Count User Conversations
```sql
SELECT COUNT(*)
FROM conversation
WHERE user_id = :user_id;
```

---

## Migration Script

```sql
-- Conversation table
CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversation_user_id ON conversation(user_id);
CREATE INDEX idx_conversation_last_activity ON conversation(last_activity DESC);

-- Message table
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_conversation_id ON message(conversation_id);
CREATE INDEX idx_message_created_at ON message(created_at);
```

---

## SQLModel Definitions

### Conversation Model
```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversation"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")
```

### Message Model
```python
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"

class Message(SQLModel, table=True):
    __tablename__ = "message"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True)
    role: MessageRole = Field(sa_column=Column(String(20)))
    content: str = Field(sa_column=Column(Text))
    tool_calls: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
```
