# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apna Khet (Village Mandi) is a batch-based agricultural aggregation system connecting farmers to buyers.
- **Core Concept**: Orders are aggregated in "Batches". Not an open marketplace.
- **Key Constraints**: Strict batch lifecycle, two-stage payments (commitment -> settlement), no farmer login.
- **Architecture**: Monorepo with `web` (React/Vite), `server` (Fastify/Node), and `shared` workspaces.

## Development Environment

### Common Commands

| Task | Command | Context |
|------|---------|---------|
| **Install Dependencies** | `npm install` | Root |
| **Start Frontend** | `npm run dev --workspace=web` | Root or /web |
| **Start Backend** | `npm run dev --workspace=server` | Root or /server |
| **Lint & Format** | `npm run check:fix` | Root (Uses Biome) |
| **Build All** | `npm run build` | Root |
| **Typecheck** | `npm run typecheck` | Root |

### Database (Prisma)

Commands should be run from `server/` or with `--workspace=server`.

| Task | Command |
|------|---------|
| **Generate Client** | `npm run prisma:generate` |
| **Studio GUI** | `npm run prisma:studio` |
| **Reset & Seed (Dev)** | `npm run db:reset` |
| **Deploy Migrations** | `npm run deploy` |

### Testing

| Task | Command |
|------|---------|
| **Unit Tests (Web)** | `npm run test --workspace=web` |
| **Unit Tests (Server)** | `npm run test --workspace=server` |
| **E2E Tests** | `npx playwright test` |
| **Run Single Test** | `npx vitest run <path/to/test>` |

## Code Architecture

### Structure
- `web/`: Frontend application (React 18, Vite, Tailwind 4, shadcn/ui).
- `server/`: Backend API (Fastify, Prisma, PostgreSQL).
- `shared/`: Shared Zod schemas and constants used by both web and server.
- `playwright/`: End-to-end tests.

### Key Architectural Patterns
- **Batch Lifecycle**: `DRAFT` -> `OPEN` -> `CLOSED` -> `COLLECTED` -> `DELIVERED` -> `SETTLED`. All orders must belong to a batch.
- **Authentication**:
  - **Admins**: Email/Password (bcrypt).
  - **Buyers**: Phone/OTP (Firebase Auth).
  - **Farmers**: No login access (managed by Admins).
- **Data Flow**: Frontend uses React Query for state management. Backend uses Fastify with Zod for validation.
- **Styling**: Tailwind CSS v4 with `shadcn/ui` components.

### Quality Standards
- **Strict Typing**: TypeScript is enforced. Avoid `any`.
- **Linting/Formatting**: Biome is the single source of truth for linting and formatting.
- **State Management**: Use Zustand for global client state, React Query for server state.
