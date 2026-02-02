# Implementation Plan: Phase III - AI Chatbot Todo Management

**Branch**: `002-phase-iii-ai-chatbot` | **Date**: 2026-01-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-phase-iii-ai-chatbot/spec.md`
**Constitution**: v1.2.0

## Summary

Phase III adds an AI-powered conversational interface to the existing Phase II todo application. Users will interact with a natural language chatbot to manage their todos instead of using the traditional web forms. The system uses the OpenAI Agents SDK for natural language understanding and the Model Context Protocol (MCP) to expose todo operations as tools the AI agent can invoke.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK (Python), SQLModel, Pydantic v2
**Frontend Dependencies**: OpenAI ChatKit, React, Next.js 14+
**Storage**: Neon Serverless PostgreSQL (existing Phase II database)
**Testing**: pytest (backend), Jest/Vitest (frontend)
**Target Platform**: Linux server (backend), Modern web browsers (frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <5s response for chat messages, <3s for list operations
**Constraints**: Stateless server, no streaming, no background workers
**Scale/Scope**: Single-user sessions, ~100 concurrent users initially

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status | Notes |
|------|------------|--------|-------|
| AI Gate | OpenAI Agents SDK allowed in Phase III | ✅ PASS | Constitution v1.2.0 §IV |
| MCP Gate | MCP tools allowed in Phase III | ✅ PASS | Constitution v1.2.0 §IV |
| Stateless Gate | Server must be stateless | ✅ PASS | All state in PostgreSQL |
| Orchestration Gate | No Kubernetes/Kafka/Dapr | ✅ PASS | Not using any |
| Technology Stack | Phase III approved technologies only | ✅ PASS | Using approved stack |
| Phase Isolation | No Phase IV/V features | ✅ PASS | No streaming, no K8s |

**Non-Negotiable Constraints Verified**:
- ✅ All services stateless (state in database only)
- ✅ APIs versioned (/v1/)
- ✅ Secrets via environment variables
- ✅ Database changes via migrations

## Project Structure

### Documentation (this feature)

```text
specs/002-phase-iii-ai-chatbot/
├── spec.md              # Feature specification (created)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── chat-api.yaml    # OpenAPI spec for chat endpoint
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── chat.py              # NEW: Chat endpoint
│   │       └── router.py            # UPDATE: Add chat routes
│   ├── models/
│   │   ├── todo.py                  # EXISTING: Todo model
│   │   ├── conversation.py          # NEW: Conversation model
│   │   └── message.py               # NEW: Message model
│   ├── repositories/
│   │   ├── todo.py                  # EXISTING: Todo repository
│   │   ├── conversation.py          # NEW: Conversation repository
│   │   └── message.py               # NEW: Message repository
│   ├── services/
│   │   ├── todo.py                  # EXISTING: Todo service
│   │   ├── agent.py                 # NEW: OpenAI agent service
│   │   └── chat.py                  # NEW: Chat orchestration service
│   ├── mcp/
│   │   ├── __init__.py              # NEW: MCP package
│   │   ├── server.py                # NEW: MCP server setup
│   │   └── tools/
│   │       ├── __init__.py          # NEW: Tools package
│   │       ├── add_task.py          # NEW: add_task tool
│   │       ├── list_tasks.py        # NEW: list_tasks tool
│   │       ├── update_task.py       # NEW: update_task tool
│   │       ├── delete_task.py       # NEW: delete_task tool
│   │       └── complete_task.py     # NEW: complete_task tool
│   └── schemas/
│       ├── chat.py                  # NEW: Chat request/response schemas
│       ├── conversation.py          # NEW: Conversation schemas
│       └── message.py               # NEW: Message schemas
└── tests/
    ├── unit/
    │   ├── test_agent.py            # NEW: Agent service tests
    │   └── test_mcp_tools.py        # NEW: MCP tool tests
    └── integration/
        └── test_chat_api.py         # NEW: Chat endpoint tests

frontend/
├── src/
│   ├── app/
│   │   └── (protected)/
│   │       └── chat/
│   │           └── page.tsx         # NEW: Chat page
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx    # NEW: Main chat component
│   │       ├── MessageList.tsx      # NEW: Message display
│   │       ├── MessageInput.tsx     # NEW: Message input
│   │       └── ToolCallIndicator.tsx # NEW: Tool invocation display
│   ├── hooks/
│   │   └── useChat.ts               # NEW: Chat state hook
│   └── lib/
│       └── chat-api.ts              # NEW: Chat API client
└── tests/
    └── chat/
        └── ChatContainer.test.tsx   # NEW: Chat component tests
```

**Structure Decision**: Extends existing Phase II web application structure. New code organized in dedicated directories (`mcp/`, `components/chat/`) to maintain separation of concerns.

## Architecture Overview

### Request Flow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                             │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  ChatKit UI  │───▶│  useChat()   │───▶│  chat-api.ts │                  │
│  │              │◀───│    Hook      │◀───│    Client    │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                 │                           │
└─────────────────────────────────────────────────│───────────────────────────┘
                                                  │
                                          POST /api/v1/chat
                                                  │
┌─────────────────────────────────────────────────│───────────────────────────┐
│                              BACKEND (FastAPI)  ▼                           │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │ chat.py      │───▶│ ChatService  │───▶│ AgentService │                  │
│  │ (endpoint)   │◀───│ (orchestrate)│◀───│ (OpenAI SDK) │                  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘                  │
│                             │                    │                          │
│                             │            ┌───────▼───────┐                  │
│                             │            │   MCP Server  │                  │
│                             │            │  ┌─────────┐  │                  │
│                             │            │  │add_task │  │                  │
│                             │            │  │list_task│  │                  │
│                             │            │  │update   │  │                  │
│                             │            │  │delete   │  │                  │
│                             │            │  │complete │  │                  │
│                             │            │  └────┬────┘  │                  │
│                             │            └───────│───────┘                  │
│                             │                    │                          │
│                             ▼                    ▼                          │
│                      ┌─────────────────────────────────────┐               │
│                      │         Repositories Layer          │               │
│                      │  ConversationRepo │ MessageRepo │   │               │
│                      │        TodoRepo (existing)          │               │
│                      └─────────────────────────────────────┘               │
│                                         │                                   │
└─────────────────────────────────────────│───────────────────────────────────┘
                                          │
                                          ▼
                               ┌──────────────────┐
                               │ Neon PostgreSQL  │
                               │  (conversation,  │
                               │   message, todo) │
                               └──────────────────┘
```

### Stateless Request Handling

Each request is self-contained:

1. **Request arrives** with `user_id`, `message`, optional `conversation_id`
2. **Load context** from database:
   - If `conversation_id` provided: load conversation history
   - If not: create new conversation
3. **Build agent context**: Conversation history passed to OpenAI agent
4. **Agent processes**: Interprets intent, selects tools, executes
5. **Store results**: User message + assistant response saved to database
6. **Return response**: JSON with assistant message, conversation_id, tool_calls

### MCP Tool Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     MCP Server                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Tool Registry                      │   │
│  │                                                      │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │ add_task  │  │list_tasks │  │update_task│       │   │
│  │  │           │  │           │  │           │       │   │
│  │  │ Input:    │  │ Input:    │  │ Input:    │       │   │
│  │  │  title    │  │  filter   │  │  task_id  │       │   │
│  │  │           │  │           │  │  title    │       │   │
│  │  │ Output:   │  │ Output:   │  │           │       │   │
│  │  │  task_id  │  │  tasks[]  │  │ Output:   │       │   │
│  │  │  title    │  │  count    │  │  old/new  │       │   │
│  │  │  created  │  │           │  │  title    │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘       │   │
│  │                                                      │   │
│  │  ┌───────────┐  ┌─────────────┐                     │   │
│  │  │delete_task│  │complete_task│                     │   │
│  │  │           │  │             │                     │   │
│  │  │ Input:    │  │ Input:      │                     │   │
│  │  │  task_id  │  │  task_id    │                     │   │
│  │  │           │  │  is_complete│                     │   │
│  │  │ Output:   │  │             │                     │   │
│  │  │  task_id  │  │ Output:     │                     │   │
│  │  │  title    │  │  task_id    │                     │   │
│  │  │           │  │  status     │                     │   │
│  │  └───────────┘  └─────────────┘                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│                  ┌─────────────────┐                        │
│                  │  User Context   │                        │
│                  │  (injected per  │                        │
│                  │   request)      │                        │
│                  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Agent Configuration

```text
┌─────────────────────────────────────────────────────────────┐
│                     AI Agent Setup                          │
│                                                             │
│  System Prompt:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ You are a helpful todo management assistant.         │   │
│  │ Help users add, list, update, delete, and complete   │   │
│  │ their tasks using natural language.                  │   │
│  │                                                      │   │
│  │ Guidelines:                                          │   │
│  │ - Always confirm actions you take                    │   │
│  │ - Ask for clarification if intent is unclear         │   │
│  │ - Stay focused on todo management                    │   │
│  │ - Be concise and friendly                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Model: gpt-4o (or gpt-4o-mini for cost optimization)      │
│  Temperature: 0.7 (balanced creativity/consistency)         │
│  Max Tokens: 500 (sufficient for confirmations)             │
│                                                             │
│  Tools Available:                                           │
│  - add_task: Create new task                                │
│  - list_tasks: Retrieve tasks with filtering                │
│  - update_task: Modify task title                           │
│  - delete_task: Remove task                                 │
│  - complete_task: Toggle completion status                  │
└─────────────────────────────────────────────────────────────┘
```

## Backend Implementation Plan

### 1. Chat Endpoint (`/api/v1/chat`)

**Responsibilities**:
- Authenticate user via JWT token
- Parse incoming chat message
- Load or create conversation
- Delegate to ChatService
- Return structured response

**Request Schema**:
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": "uuid (optional)"
}
```

**Response Schema**:
```json
{
  "response": "I've added 'buy groceries' to your list!",
  "conversation_id": "uuid",
  "tool_calls": [
    {
      "tool": "add_task",
      "input": {"title": "buy groceries"},
      "output": {"task_id": "uuid", "title": "buy groceries", "created_at": "ISO"}
    }
  ]
}
```

### 2. Conversation Lifecycle

```text
Request Flow:
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   Incoming   │     │  conversation_id  │     │    Create New    │
│   Request    │────▶│   provided?       │─NO─▶│   Conversation   │
└──────────────┘     └───────────────────┘     └────────┬─────────┘
                              │ YES                      │
                              ▼                          │
                     ┌───────────────────┐               │
                     │  Load existing    │               │
                     │  conversation     │◀──────────────┘
                     │  + messages       │
                     └───────────────────┘
                              │
                              ▼
                     ┌───────────────────┐
                     │  Verify ownership │
                     │  (user_id match)  │
                     └───────────────────┘
                              │
                              ▼
                     ┌───────────────────┐
                     │  Build message    │
                     │  history for      │
                     │  agent context    │
                     └───────────────────┘
```

### 3. OpenAI Agent Integration

**AgentService** responsibilities:
- Initialize OpenAI client with API key
- Configure agent with system prompt
- Register MCP tools
- Process user message with conversation context
- Return agent response with tool invocations

**Stateless Execution**:
- Agent created fresh per request
- Conversation history loaded from DB
- No in-memory caching of agent state

### 4. MCP Server & Tools

**Server Initialization**:
- Create MCP server instance per request
- Register all 5 tools with schemas
- Inject user context (user_id) into tools

**Tool Implementation Pattern**:
```text
Tool Function:
1. Validate input parameters
2. Get user_id from injected context
3. Call TodoRepository method
4. Format output for agent
5. Return structured result
```

### 5. Database Persistence

**Per-Request Flow**:
1. Save user message to `message` table
2. Execute agent (may create tool calls)
3. Save assistant message to `message` table
4. Save tool call records (if any)
5. Update conversation `last_activity`

## Frontend Implementation Plan

### 1. ChatKit UI Setup

**Component Hierarchy**:
```text
ChatPage
└── ChatContainer
    ├── MessageList
    │   └── MessageItem (repeated)
    │       └── ToolCallIndicator (conditional)
    └── MessageInput
```

### 2. Auth Integration

- Reuse existing Phase II auth hooks (`useAuth`)
- Protect `/chat` route (redirect unauthenticated users)
- Include JWT token in API requests

### 3. Message Send/Receive Flow

```text
User types message
       │
       ▼
┌──────────────┐
│ MessageInput │
│  onSubmit()  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  useChat()   │────▶│  API call    │
│  sendMessage │     │  POST /chat  │
└──────────────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ Optimistic   │     │   Backend    │
│ UI update    │     │  processes   │
│ (pending)    │     │              │
└──────────────┘     └──────┬───────┘
       │                    │
       └────────────────────┘
                │
                ▼
       ┌──────────────┐
       │ Update state │
       │ with response│
       └──────────────┘
```

### 4. Conversation Resume

- On page load, fetch conversation history via API
- Store `conversation_id` in component state
- Include `conversation_id` in subsequent requests
- Display previous messages on refresh

## Database Migration Plan

### New Tables

**conversation**:
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → user.id, INDEX |
| created_at | TIMESTAMP | DEFAULT now() |
| last_activity | TIMESTAMP | DEFAULT now() |

**message**:
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| conversation_id | UUID | FK → conversation.id, INDEX |
| role | VARCHAR(20) | 'user' | 'assistant' | 'tool' |
| content | TEXT | NOT NULL |
| tool_calls | JSONB | NULLABLE (for assistant messages) |
| created_at | TIMESTAMP | DEFAULT now() |

### Migration Strategy

1. Create Alembic migration script
2. Add tables without modifying existing `todo` table
3. Apply migration in dev, then staging, then prod
4. No data migration needed (new tables only)

## Error Handling Strategy

| Error Type | User Message | Technical Action |
|------------|--------------|------------------|
| Auth failure | "Please sign in to continue" | Return 401, redirect to login |
| OpenAI API error | "I'm having trouble processing that. Please try again." | Log error, return 503 |
| Tool execution error | "[tool] failed: [reason]" | Log error, inform user |
| Database error | "Something went wrong. Please try again." | Log error, return 500 |
| Invalid input | "I couldn't understand that. Could you rephrase?" | Return validation details |
| Rate limit | "You're sending messages too quickly. Please wait." | Return 429 |

## Testing Strategy

### Unit Tests
- AgentService: Mock OpenAI API, verify tool selection
- MCP Tools: Mock repository, verify input/output
- ChatService: Mock dependencies, verify orchestration

### Integration Tests
- Chat endpoint: Full request/response cycle
- Conversation persistence: Multi-message conversations
- Auth integration: Protected routes

### E2E Tests (Manual)
- Natural language interpretation accuracy
- Conversation resume after refresh
- Error handling scenarios

## Complexity Tracking

No constitution violations identified. Design follows all Phase III constraints:
- Stateless architecture ✅
- No streaming ✅
- No background workers ✅
- Database-only state ✅

## Dependencies

### Python Packages (New)
- `openai` - OpenAI SDK
- `mcp` - Model Context Protocol SDK

### Environment Variables (New)
- `OPENAI_API_KEY` - OpenAI API authentication

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API latency | User experience degradation | Set reasonable timeout, show loading state |
| Natural language ambiguity | Incorrect tool selection | Agent asks clarifying questions |
| Conversation state loss | Data integrity issues | Transactional DB operations |
| Token costs | Unexpected expenses | Use gpt-4o-mini, limit history length |

## Next Steps

1. ✅ Phase 0: Research complete
2. → Phase 1: Generate data-model.md, contracts/, quickstart.md
3. → Phase 2: Generate tasks.md via `/sp.tasks`
4. → Implementation: Execute tasks via `/sp.implement`
