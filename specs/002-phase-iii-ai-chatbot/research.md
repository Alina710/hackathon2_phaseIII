# Research: Phase III - AI Chatbot Todo Management

**Date**: 2026-01-31
**Feature**: 002-phase-iii-ai-chatbot

## Research Summary

This document consolidates research findings for Phase III implementation decisions.

---

## 1. OpenAI Agents SDK Integration

### Decision
Use OpenAI Agents SDK with function calling for tool invocation.

### Rationale
- Native support for tool/function calling
- Structured output for consistent parsing
- Built-in conversation history management
- Well-documented Python SDK

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| LangChain | Additional abstraction layer adds complexity; constitution specifies OpenAI Agents SDK |
| Raw OpenAI API | Requires manual tool orchestration; SDK provides this built-in |
| Claude API | Constitution mandates OpenAI for Phase III |

### Implementation Notes
- Use `openai.Client` for synchronous calls (no streaming per constitution)
- Pass conversation history as messages array
- Configure function tools matching MCP tool definitions

---

## 2. MCP (Model Context Protocol) SDK

### Decision
Use Official MCP Python SDK for tool definition and execution.

### Rationale
- Constitution v1.2.0 mandates Official MCP SDK
- Provides standardized tool schema definition
- Integrates with OpenAI function calling format
- Supports typed inputs/outputs

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| Custom tool framework | Non-standard; MCP required by constitution |
| LangChain tools | Different protocol; MCP required |

### Implementation Notes
- Define tools using MCP `@tool` decorator pattern
- Map MCP tool outputs to OpenAI function response format
- Inject user context via tool parameters (stateless)

---

## 3. Conversation Persistence Strategy

### Decision
Store all conversation state in PostgreSQL with separate `conversation` and `message` tables.

### Rationale
- Stateless server requirement (constitution §IV)
- Each request self-contained with DB context
- Supports conversation resume after refresh
- Enables future analytics (out of scope for Phase III)

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| Redis session store | Constitution requires PostgreSQL for all state |
| In-memory with periodic flush | Violates stateless requirement |
| File-based storage | Not scalable; PostgreSQL available |

### Implementation Notes
- Conversation created on first message (no explicit "start" action)
- Messages stored with role (user/assistant/tool)
- Tool calls embedded in assistant messages as JSONB
- Limit history sent to agent (last 20 messages) for token efficiency

---

## 4. Chat API Design

### Decision
Single POST endpoint `/api/v1/chat` accepting message and optional conversation_id.

### Rationale
- Simple interface (one endpoint for all chat operations)
- Matches common chat API patterns
- Stateless request handling
- Conversation_id enables resume

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| WebSocket | Requires persistent connection; violates stateless |
| Server-Sent Events | Streaming prohibited in Phase III |
| Separate endpoints per action | Defeats natural language interface purpose |

### Implementation Notes
- GET `/api/v1/conversations` for listing user's conversations
- GET `/api/v1/conversations/{id}/messages` for history
- POST `/api/v1/chat` for sending messages

---

## 5. Frontend Chat UI

### Decision
Use OpenAI ChatKit components with custom styling.

### Rationale
- Constitution specifies OpenAI ChatKit for Phase III
- Pre-built message list, input, and styling
- Consistent chat UX patterns
- Integrates with existing Next.js app

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| Custom chat components | More development effort; ChatKit available |
| Third-party chat widget | Constitution specifies ChatKit |

### Implementation Notes
- Wrap ChatKit in custom container for auth integration
- Custom hook `useChat` for state management
- Display tool calls as indicators (not full details)

---

## 6. Agent Behavior Configuration

### Decision
System prompt with explicit behavioral guidelines + function tool definitions.

### Rationale
- Predictable agent responses
- Guides clarification behavior
- Enforces todo-only scope
- Human-friendly confirmations

### System Prompt Design
```text
You are a helpful todo management assistant. Help users manage their tasks through natural conversation.

Your capabilities:
- Add new tasks
- List existing tasks (all, completed, or incomplete)
- Update task titles
- Delete tasks
- Mark tasks as complete or incomplete

Guidelines:
1. Always confirm actions you take with friendly, clear messages
2. If the user's intent is unclear, ask a clarifying question
3. Stay focused on todo management - politely redirect off-topic questions
4. When listing tasks, format them in a readable way
5. Be concise but friendly
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| No system prompt | Inconsistent behavior |
| Verbose prompt | Higher token costs, slower responses |
| Multi-agent setup | Complexity; single agent sufficient |

---

## 7. Error Handling Strategy

### Decision
Graceful degradation with user-friendly error messages.

### Rationale
- AI errors should not crash the chat
- Users need actionable guidance
- Technical errors logged for debugging
- Maintains conversation flow

### Error Categories
| Category | User Message | Log Level |
|----------|--------------|-----------|
| OpenAI API timeout | "I'm taking too long. Please try again." | WARNING |
| OpenAI API error | "I'm having trouble right now. Please try again." | ERROR |
| Tool execution failure | "I couldn't [action]. [reason]" | ERROR |
| Invalid input | "I didn't understand that. Could you rephrase?" | INFO |
| Auth failure | "Please sign in to continue." | WARNING |
| Rate limit | "You're sending messages too quickly." | INFO |

---

## 8. Token and Cost Management

### Decision
Use gpt-4o-mini as default model, limit conversation history to 20 messages.

### Rationale
- gpt-4o-mini is cost-effective for simple tool selection
- 20 messages provides sufficient context
- Reduces token costs significantly
- Can upgrade to gpt-4o if accuracy issues arise

### Estimates
- Average request: ~1000 tokens (history + response)
- gpt-4o-mini: ~$0.0001 per request
- At 100 users, 10 messages/day: ~$0.10/day

---

## 9. Security Considerations

### Decision
JWT token validation + user_id scoping for all operations.

### Rationale
- Reuses Phase II auth infrastructure
- Prevents cross-user data access
- Stateless authentication
- Tools receive user_id, not full token

### Implementation Notes
- Extract user_id from JWT in endpoint
- Pass user_id to ChatService and tools
- All repository queries filter by user_id
- No conversation_id guessing (UUID + ownership check)

---

## Dependencies Confirmed

### Python Packages
```text
openai>=1.0.0          # OpenAI Agents SDK
mcp>=0.1.0             # Model Context Protocol SDK
```

### Environment Variables
```text
OPENAI_API_KEY         # Required for OpenAI API access
OPENAI_MODEL           # Optional, defaults to gpt-4o-mini
```

---

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Which OpenAI model? | gpt-4o-mini (cost-effective, upgradable) |
| Conversation history limit? | 20 messages |
| Tool call visibility in UI? | Show indicator, not full details |
| Multiple conversations? | Supported via conversation_id |
