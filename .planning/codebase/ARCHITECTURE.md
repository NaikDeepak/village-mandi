# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Monorepo with Layered Architecture

**Key Characteristics:**
- npm workspaces monorepo (web, server, shared)
- Clear separation between frontend, backend, and shared code
- Serverless-compatible API design (Vercel functions)
- Batch-based domain model for agricultural marketplace

## Layers

**Presentation Layer:**
- Purpose: React SPA for buyer-facing UI
- Contains: Pages, components, routing, styling
- Location: `web/src/`
- Depends on: Shared constants, API endpoints
- Used by: End users (buyers)

**API Layer:**
- Purpose: HTTP endpoints for data operations
- Contains: Fastify routes, request handlers
- Location: `server/index.ts`, `api/index.ts`
- Depends on: Data layer, shared validation
- Used by: Presentation layer

**Data Layer:**
- Purpose: Database access and ORM
- Contains: Prisma client, schema, migrations
- Location: `server/db.ts`, `server/prisma/`
- Depends on: PostgreSQL database
- Used by: API layer

**Shared Layer:**
- Purpose: Cross-cutting business rules and constants
- Contains: System rules, enums, validation schemas
- Location: `shared/constants.ts`
- Depends on: Nothing (leaf dependency)
- Used by: All layers

## Data Flow

**Frontend Request Flow:**

1. Entry: `web/index.html` loads `web/src/main.tsx`
2. React Router (`web/src/App.tsx`) matches route
3. Page component renders (e.g., `web/src/pages/LandingPage.tsx`)
4. Components compose from `web/src/components/`
5. State: Zustand (local) + TanStack Query (server state) - not yet implemented

**Backend Request Flow:**

1. Entry: `server/index.ts` or `api/index.ts` (Vercel)
2. Fastify handles HTTP request
3. Route handler validates input
4. Database access via `server/db.ts` (Prisma)
5. Response returned to client

**State Management:**
- File-based: Business rules in `shared/constants.ts`
- Database: PostgreSQL via Prisma ORM
- Frontend: React state (local), planned Zustand + React Query

## Key Abstractions

**System Rules (`shared/constants.ts`):**
- Purpose: Non-negotiable business guardrails
- Examples: `SYSTEM_RULES`, `BATCH_STATUS`, `PAYMENT_STAGES`
- Pattern: Frozen objects with TypeScript typing

**Data Models (`server/prisma/schema.prisma`):**
- Purpose: Database entities and relationships
- Examples: `User`, `Farmer`, `Product`, `Batch`, `Order`
- Pattern: Prisma schema with relations and enums

**React Components (`web/src/components/`):**
- Purpose: Reusable UI elements
- Examples: `Hero`, `Navbar`, `Features`, `Footer`
- Pattern: Named exports, functional components with Tailwind

## Entry Points

**Web App Entry:**
- Location: `web/src/main.tsx`
- Triggers: Browser navigation
- Responsibilities: Mount React app to DOM

**Server Entry (Local):**
- Location: `server/index.ts`
- Triggers: `npm run dev` in server workspace
- Responsibilities: Start Fastify server, register routes

**Server Entry (Vercel):**
- Location: `api/index.ts`
- Triggers: Vercel serverless invocation
- Responsibilities: Handle HTTP request, return response

**Database Client:**
- Location: `server/db.ts`
- Triggers: Import in API handlers
- Responsibilities: Initialize Prisma with pg adapter

## Error Handling

**Strategy:** Not yet established (early stage project)

**Current Patterns:**
- Fastify default error handling
- No custom error middleware
- No error boundaries in React

**Recommendations:**
- Add Fastify error handler for API
- Add React error boundaries for UI
- Integrate Sentry for production monitoring

## Cross-Cutting Concerns

**Logging:**
- Pino logger configured in `server/package.json`
- Not yet integrated into handlers

**Validation:**
- Zod available for schema validation
- Not yet implemented at API boundaries

**Authentication:**
- JWT secret configured in env
- No middleware implemented yet

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
