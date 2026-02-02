---
id: 003
title: Phase III Technology Stack Amendment
stage: constitution
date: 2026-01-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-phase-ii-fullstack-todo
user: human
command: /sp.constitution
labels: ["constitution", "phase-iii", "technology-matrix", "ai-agents", "mcp"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Amend the global constitution technology matrix to reflect Phase III requirements as follows:

Phase III:
- Frontend: OpenAI ChatKit (conversational UI)
- Backend: Python FastAPI
- AI Framework: OpenAI Agents SDK
- Tool Protocol: Official MCP SDK
- Architecture: Stateless AI chatbot with MCP tools
- Persistence: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)

Phase II remains:
- Full-stack web app
- REST APIs
- No AI or agents

Phase I remains:
- In-memory console application only

Rules:
- AI agents are allowed starting Phase III only
- MCP tools are allowed starting Phase III only
- Stateless server architecture is mandatory in Phase III
- Conversation state must persist in database
- No Kubernetes, Kafka, Dapr, or cloud orchestration yet

This amendment must preserve strict phase isolation and act as the authoritative technology policy.

## Response snapshot

Constitution amended from v1.1.0 → v1.2.0 (MINOR version bump).

Key changes:
1. **Phase III definition updated**: "Stateless AI chatbot with MCP tools, OpenAI Agents SDK, ChatKit UI"
2. **New Phase III section added**: Full technology breakdown including:
   - Frontend: OpenAI ChatKit (conversational UI)
   - Backend: FastAPI (Stateless architecture)
   - AI Framework: OpenAI Agents SDK
   - Tool Protocol: MCP (Official SDK)
   - Persistence: Neon PostgreSQL (conversation history)
   - Authentication: Better Auth (JWT-based)
3. **Phase Technology Gate Rules table added**: Explicit enforcement rules for AI Gate, MCP Gate, Stateless Gate, Orchestration Gate
4. **Mandatory Phase III Constraints**: Server statelessness, database conversation persistence, self-contained requests
5. **Technology matrices updated**: Both summary and detailed tables reflect Phase III specifics

Phase I and Phase II specifications preserved unchanged. Strict phase isolation maintained.

## Outcome

- ✅ Impact: Constitution v1.2.0 now serves as authoritative technology policy for Phase III
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md (modified)
- 🔁 Next prompts: /sp.specify for Phase III feature specification
- 🧠 Reflection: Clean amendment preserving phase isolation while adding comprehensive Phase III technology guidance

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard constitution amendment
- Next experiment (smallest change to try): None needed
