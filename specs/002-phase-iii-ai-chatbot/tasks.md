# Tasks: Phase III - AI Chatbot Todo Management

**Input**: Design documents from `/specs/002-phase-iii-ai-chatbot/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/chat-api.yaml
**Branch**: `002-phase-iii-ai-chatbot`
**Constitution**: v1.2.0

**Organization**: Tasks are organized sequentially as specified. No Kubernetes, no future phase tasks.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Backend Structure)

**Purpose**: Initialize chatbot backend structure and dependencies

- [x] T001 Initialize chatbot backend structure - create `backend/app/mcp/` directory and `backend/app/mcp/__init__.py`
- [x] T002 [P] Create chat schemas package - create `backend/app/schemas/chat.py` for ChatRequest/ChatResponse
- [x] T003 [P] Create conversation schemas - create `backend/app/schemas/conversation.py` for ConversationSummary/ConversationDetailResponse
- [x] T004 [P] Create message schemas - create `backend/app/schemas/message.py` for Message/ToolCall schemas
- [x] T005 Add Phase III dependencies to `backend/requirements.txt` (openai, mcp)

**Checkpoint**: Backend structure ready for model and service implementation

---

## Phase 2: Database Models & Repositories

**Purpose**: Create database models for conversations and messages

### Models

- [x] T006 Create Conversation database model in `backend/app/models/conversation.py` (id, user_id, created_at, last_activity)
- [x] T007 Create Message database model in `backend/app/models/message.py` (id, conversation_id, role, content, tool_calls, created_at)
- [x] T008 Update models __init__.py to export Conversation and Message models in `backend/app/models/__init__.py`

### Repositories

- [x] T009 Create ConversationRepository in `backend/app/repositories/conversation.py` (create, get_by_id, get_by_user, update_last_activity)
- [x] T010 Create MessageRepository in `backend/app/repositories/message.py` (create, get_by_conversation, get_history)
- [x] T011 Update repositories __init__.py to export new repositories in `backend/app/repositories/__init__.py`

### Database Migration

- [x] T012 Create Alembic migration for conversation and message tables in `backend/alembic/versions/`

**Checkpoint**: Database layer ready - can persist conversations and messages

---

## Phase 3: MCP Server & Tools

**Purpose**: Initialize MCP server and define todo operation tools

### MCP Server Setup

- [x] T013 Initialize MCP server module in `backend/app/mcp/server.py` (server setup, tool registry)
- [x] T014 Create MCP tools package in `backend/app/mcp/tools/__init__.py`

### MCP Tools Implementation

- [x] T015 Define add_task MCP tool in `backend/app/mcp/tools/add_task.py` (title input, returns task_id/title/created_at)
- [x] T016 Define list_tasks MCP tool in `backend/app/mcp/tools/list_tasks.py` (filter input, returns tasks[]/count)
- [x] T017 Define update_task MCP tool in `backend/app/mcp/tools/update_task.py` (task_id/title input, returns old/new title)
- [x] T018 Define delete_task MCP tool in `backend/app/mcp/tools/delete_task.py` (task_id input, returns task_id/title)
- [x] T019 Define complete_task MCP tool in `backend/app/mcp/tools/complete_task.py` (task_id/is_completed input, returns status)

### MCP-Database Connection

- [x] T020 Connect MCP tools to TodoRepository - inject user context and database session in each tool module
- [x] T021 Update `backend/app/mcp/tools/__init__.py` to export all tools and create tool registry

**Checkpoint**: MCP tools ready - can perform todo operations via tool calls

---

## Phase 4: OpenAI Agent Integration

**Purpose**: Initialize and configure OpenAI Agent with MCP tools

### Agent Service

- [x] T022 Initialize OpenAI Agent service in `backend/app/services/agent.py` (OpenAI client setup, API key config)
- [x] T023 Configure agent instructions in `backend/app/services/agent.py` (system prompt for todo management)
- [x] T024 Register MCP tools with agent in `backend/app/services/agent.py` (function tool definitions)
- [x] T025 Implement agent.process_message() method - accept user message + history, return response + tool_calls

### Tool Execution

- [x] T026 Implement tool call execution in `backend/app/services/agent.py` - route tool calls to MCP tools and collect results

**Checkpoint**: Agent ready - can process natural language and execute tools

---

## Phase 5: Chat API Endpoint

**Purpose**: Implement the chat orchestration service and API endpoint

### Chat Service

- [x] T027 Create ChatService in `backend/app/services/chat.py` (orchestration between repositories and agent)
- [x] T028 Implement load conversation history per request in `backend/app/services/chat.py` (get or create conversation, load messages)
- [x] T029 Implement persist user and assistant messages in `backend/app/services/chat.py` (save to database after agent response)
- [x] T030 Implement return structured chat response in `backend/app/services/chat.py` (format ChatResponse with tool_calls)

### Chat Endpoint

- [x] T031 Implement POST /api/v1/chat endpoint in `backend/app/api/v1/chat.py` (request validation, auth, call ChatService)
- [x] T032 Implement GET /api/v1/conversations endpoint in `backend/app/api/v1/chat.py` (list user conversations)
- [x] T033 Implement GET /api/v1/conversations/{id} endpoint in `backend/app/api/v1/chat.py` (get conversation with messages)
- [x] T034 Update API router to include chat routes in `backend/app/api/v1/router.py`

### Error Handling

- [x] T035 Implement error handling for task not found (404) in `backend/app/api/v1/chat.py`
- [x] T036 Implement error handling for invalid input (400) in `backend/app/api/v1/chat.py`
- [x] T037 Implement error handling for OpenAI API errors (503) in `backend/app/services/agent.py`
- [x] T038 Implement error handling for rate limiting (429) in `backend/app/api/v1/chat.py`

**Checkpoint**: Backend complete - chat API fully functional

---

## Phase 6: Frontend Chat UI

**Purpose**: Setup ChatKit UI and chat page

### Chat Components

- [x] T039 Setup ChatKit UI - install dependencies and create `frontend/src/components/chat/` directory
- [x] T040 Create ChatContainer component in `frontend/src/components/chat/ChatContainer.tsx` (main chat wrapper)
- [x] T041 Create MessageList component in `frontend/src/components/chat/MessageList.tsx` (display messages)
- [x] T042 Create MessageInput component in `frontend/src/components/chat/MessageInput.tsx` (text input + send button)
- [x] T043 Create ToolCallIndicator component in `frontend/src/components/chat/ToolCallIndicator.tsx` (show tool invocations)

### Chat Page

- [x] T044 Create auth-protected chat page in `frontend/src/app/(protected)/chat/page.tsx`
- [x] T045 Create useChat hook in `frontend/src/hooks/useChat.ts` (state management for messages, loading, errors)
- [x] T046 Create chat API client in `frontend/src/lib/chat-api.ts` (sendMessage, getConversations, getConversation)

### Message Flows

- [x] T047 Implement message send flow in `frontend/src/hooks/useChat.ts` (optimistic UI update, API call, response handling)
- [x] T048 Implement message receive & render in `frontend/src/components/chat/MessageList.tsx` (display assistant responses)
- [x] T049 Implement conversation resume handling in `frontend/src/hooks/useChat.ts` (load history on page load)
- [x] T050 Implement error and empty state UI in `frontend/src/components/chat/ChatContainer.tsx` (error display, empty conversation)

**Checkpoint**: Frontend complete - chat interface functional

---

## Phase 7: Integration & Validation

**Purpose**: Connect frontend to backend and validate end-to-end

### Frontend-Backend Integration

- [x] T051 Frontend to Chat API integration - configure API base URL and auth headers in `frontend/src/lib/chat-api.ts`
- [x] T052 JWT token handling - ensure auth token passed with all chat API requests in `frontend/src/lib/chat-api.ts`

### Validation

- [x] T053 Run quickstart.md validation - verify all example interactions work end-to-end
- [x] T054 Validate error scenarios - test auth failure, invalid input, task not found responses

**Checkpoint**: Phase III complete - AI chatbot fully functional

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Models)**: Depends on Phase 1 (schemas created)
- **Phase 3 (MCP)**: Depends on Phase 2 (repositories available)
- **Phase 4 (Agent)**: Depends on Phase 3 (tools available)
- **Phase 5 (API)**: Depends on Phase 4 (agent available)
- **Phase 6 (Frontend)**: Depends on Phase 5 (API available)
- **Phase 7 (Integration)**: Depends on Phase 5 & 6 (both backend and frontend ready)

### Sequential Execution

Tasks MUST be executed in order T001 → T054. Each task builds on previous tasks.

### Parallel Opportunities

Within each phase, tasks marked [P] can run in parallel:
- T002, T003, T004 (schemas) can run in parallel
- T015, T016, T017, T018, T019 (tools) can run in parallel after T014

---

## Task Summary

| Phase | Description | Tasks | Count |
|-------|-------------|-------|-------|
| 1 | Setup | T001-T005 | 5 |
| 2 | Database Models | T006-T012 | 7 |
| 3 | MCP Server & Tools | T013-T021 | 9 |
| 4 | OpenAI Agent | T022-T026 | 5 |
| 5 | Chat API | T027-T038 | 12 |
| 6 | Frontend Chat UI | T039-T050 | 12 |
| 7 | Integration | T051-T054 | 4 |
| **Total** | | | **54** |

---

## Reference Documents

- **Specification**: [spec.md](./spec.md) - User stories and acceptance criteria
- **Plan**: [plan.md](./plan.md) - Architecture and technical decisions
- **Data Model**: [data-model.md](./data-model.md) - Conversation and Message entities
- **API Contract**: [contracts/chat-api.yaml](./contracts/chat-api.yaml) - OpenAPI specification
- **Research**: [research.md](./research.md) - Technology decisions
- **Quickstart**: [quickstart.md](./quickstart.md) - Setup and testing guide

---

## Notes

- All tasks are sequential as per user requirements
- No Kubernetes deployment tasks included
- No Phase IV/V features (streaming, background workers)
- All coding performed via Claude Code
- JWT authentication reuses Phase II infrastructure
- Stateless server architecture maintained per Constitution v1.2.0
