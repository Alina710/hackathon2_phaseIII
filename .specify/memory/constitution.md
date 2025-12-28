<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (Initial ratification)
Modified principles: N/A (new constitution)
Added sections:
  - I. Spec-Driven Development
  - II. Agent Behavior Rules
  - III. Phase Governance
  - IV. Technology Constraints
  - V. Quality Principles
  - Technology Stack (detailed)
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible, references Constitution Check)
  - .specify/templates/spec-template.md ✅ (compatible)
  - .specify/templates/tasks-template.md ✅ (compatible)
Follow-up TODOs: None
-->

# Evolution of Todo Constitution

This constitution is the supreme governing document for all agents, humans, and processes
operating within the "Evolution of Todo" project across Phase I through Phase V.
All work MUST comply with this constitution. Non-compliance invalidates deliverables.

## Core Principles

### I. Spec-Driven Development

All implementation work MUST follow the Spec-Driven Development (SDD) methodology.
This principle is **NON-NEGOTIABLE** and applies to all phases.

**Mandatory Workflow**:
1. Constitution (this document) defines boundaries and rules
2. Specifications define WHAT to build (requirements, acceptance criteria)
3. Plans define HOW to build (architecture, design decisions)
4. Tasks define the executable work items (ordered, testable)
5. Implementation executes approved tasks ONLY

**Rules**:
- No agent may write production code without an approved specification
- No agent may write production code without approved tasks derived from the specification
- All specifications MUST be approved before planning begins
- All plans MUST be approved before task generation begins
- All tasks MUST be derived from approved plans
- Changes to requirements MUST flow through: Spec Amendment → Plan Update → Task Regeneration

**Rationale**: SDD ensures traceability, prevents scope creep, and enables verification of
all deliverables against explicit requirements. Ad-hoc coding produces unmaintainable systems.

### II. Agent Behavior Rules

All AI agents and human contributors MUST adhere to these behavioral constraints.

**Prohibited Actions**:
- **No Manual Coding by Humans**: Humans define specs and approve artifacts; agents implement
- **No Feature Invention**: Agents MUST NOT add features not explicitly specified
- **No Specification Deviation**: Implementation MUST match specification exactly
- **No Code-Level Refinement**: If implementation reveals spec issues, refinement occurs at
  the specification level, not through code workarounds

**Required Actions**:
- Agents MUST request clarification when specifications are ambiguous
- Agents MUST halt and escalate when encountering contradictory requirements
- Agents MUST document all assumptions in the relevant artifact (spec, plan, or task)
- Agents MUST create PHRs (Prompt History Records) for all significant interactions

**Rationale**: Strict agent boundaries prevent hallucinated features and ensure the system
matches stakeholder intent. Human oversight occurs at the specification layer, not in code reviews.

### III. Phase Governance

The Evolution of Todo project is organized into five distinct phases. Each phase has
immutable boundaries defined by its specification.

**Phase Definitions**:
- **Phase I**: Foundation - Core todo CRUD, local persistence
- **Phase II**: API Layer - REST API, database integration
- **Phase III**: Intelligence - AI agents, natural language processing
- **Phase IV**: Distribution - Multi-service architecture, event-driven
- **Phase V**: Scale - Kubernetes orchestration, observability, multi-tenancy

**Phase Isolation Rules**:
- Each phase is strictly scoped by its approved specification
- Future-phase features MUST NOT leak into earlier phases
- No agent may implement Phase N+1 functionality while executing Phase N tasks
- Architecture may evolve ONLY through updated specs and plans (never ad-hoc)
- Phase completion requires all acceptance criteria from the phase spec to pass

**Phase Transition Protocol**:
1. All Phase N tasks marked complete
2. All Phase N acceptance tests pass
3. Phase N retrospective documented
4. Phase N+1 specification approved
5. Phase N+1 planning initiated

**Rationale**: Phase isolation prevents premature complexity and ensures each increment
is stable before adding additional capabilities. Scope creep across phases is prohibited.

### IV. Technology Constraints

The following technology stack is mandated for the Evolution of Todo project.
Deviations require an approved ADR (Architecture Decision Record) and constitution amendment.

**Backend (All Phases)**:
- Language: Python 3.11+
- Framework: FastAPI
- ORM: SQLModel
- Database: Neon DB (PostgreSQL)
- Validation: Pydantic

**Frontend (Phase III+)**:
- Framework: Next.js 14+
- Language: TypeScript
- State Management: React Server Components / Context API

**AI/Agents (Phase III+)**:
- SDK: OpenAI Agents SDK
- Protocol: Model Context Protocol (MCP)
- Tool Framework: Function calling with structured outputs

**Infrastructure (Phase IV+)**:
- Containerization: Docker
- Orchestration: Kubernetes
- Messaging: Apache Kafka
- Sidecar Runtime: Dapr

**Non-Negotiable Constraints**:
- All services MUST be stateless (state in database or message broker only)
- All APIs MUST be versioned (URL path versioning: /v1/, /v2/)
- All secrets MUST use environment variables (never hardcoded)
- All database changes MUST use migrations (never manual DDL)

**Rationale**: A fixed technology stack enables predictable development, prevents
decision fatigue, and ensures all team members (human and AI) operate with shared context.

### V. Quality Principles

All code, documentation, and artifacts MUST adhere to these quality standards.

**Clean Architecture**:
- Strict separation: Domain → Application → Infrastructure → Presentation
- Dependencies point inward (outer layers depend on inner layers)
- Domain logic MUST NOT import from infrastructure or presentation layers
- Use dependency injection for all external dependencies

**Separation of Concerns**:
- One module = one responsibility
- API routes MUST NOT contain business logic
- Database queries MUST be encapsulated in repository classes
- Validation logic MUST be in dedicated validators or Pydantic models

**Stateless Services**:
- No in-memory state between requests (except caches with TTL)
- Session data stored in database or distributed cache
- Services MUST be horizontally scalable by design

**Cloud-Native Readiness**:
- 12-factor app compliance required
- Health check endpoints mandatory (/health, /ready)
- Graceful shutdown handling required
- Configuration via environment variables only
- Logs to stdout/stderr in structured JSON format

**Testing Standards**:
- Unit tests for all business logic
- Integration tests for all API endpoints
- Contract tests for all inter-service communication
- Minimum 80% code coverage for new code

**Rationale**: Quality principles prevent technical debt accumulation and ensure the
system remains maintainable as it evolves through all five phases.

## Technology Stack Summary

| Layer          | Technology                | Phase Introduced |
|----------------|---------------------------|------------------|
| Language       | Python 3.11+              | I                |
| API Framework  | FastAPI                   | II               |
| ORM            | SQLModel                  | II               |
| Database       | Neon DB (PostgreSQL)      | II               |
| Frontend       | Next.js + TypeScript      | III              |
| AI SDK         | OpenAI Agents SDK         | III              |
| Protocol       | MCP                       | III              |
| Containers     | Docker                    | IV               |
| Orchestration  | Kubernetes                | V                |
| Messaging      | Apache Kafka              | IV               |
| Sidecar        | Dapr                      | IV               |

## Development Workflow

All development MUST follow this workflow without exception:

```
┌─────────────────┐
│   CONSTITUTION  │  ← You are here (supreme authority)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SPECIFICATION  │  ← /sp.specify: Define WHAT to build
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      PLAN       │  ← /sp.plan: Define HOW to build
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     TASKS       │  ← /sp.tasks: Generate executable work items
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IMPLEMENTATION │  ← /sp.implement: Execute approved tasks ONLY
└─────────────────┘
```

**Workflow Rules**:
- Skipping steps is PROHIBITED
- Each artifact MUST be approved before proceeding to the next step
- Feedback loops go BACKWARD (implementation issues → task issues → plan issues → spec issues)
- Never fix upstream problems with downstream workarounds

## Governance

### Amendment Procedure

1. **Proposal**: Submit constitution amendment request with rationale
2. **Impact Analysis**: Document affected artifacts, phases, and stakeholders
3. **Review Period**: Minimum 24-hour review for non-critical amendments
4. **Approval**: Explicit human approval required for all amendments
5. **Migration**: Update all affected artifacts (specs, plans, tasks)
6. **Version Bump**: Update constitution version per semantic versioning rules

### Versioning Policy

- **MAJOR**: Backward-incompatible changes (principle removal, redefinition)
- **MINOR**: New principles, sections, or materially expanded guidance
- **PATCH**: Clarifications, typo fixes, non-semantic refinements

### Compliance Review

- All PRs MUST verify compliance with this constitution
- All specifications MUST include a constitution compliance checklist
- All plans MUST include a "Constitution Check" section
- Non-compliant work MUST be rejected regardless of code quality

### Supremacy Clause

This constitution supersedes all other project documentation in case of conflict.
Agent instructions, team conventions, and external guidelines yield to this document.

**Version**: 1.0.0 | **Ratified**: 2025-12-28 | **Last Amended**: 2025-12-28
