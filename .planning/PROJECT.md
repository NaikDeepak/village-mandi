# Village Mandi

## What This Is

A batch-based, trust-driven agricultural marketplace connecting farmers directly to buyers. Unlike traditional e-commerce, orders are aggregated into discrete batches with strict cutoffs, two-stage payments, and farmer-centric product presentation emphasizing provenance and locality.

## Core Value

**Farmer-centric experience** — every product tells a farmer's story. Trust and transparency through visible farmer identity, locality, and relationship level. This drives buyer confidence and farmer dignity.

## Requirements

### Validated

- ✓ Monorepo structure (web, server, shared workspaces) — existing
- ✓ React frontend with Vite, Tailwind, TypeScript — existing
- ✓ Fastify backend with Prisma/PostgreSQL — existing
- ✓ Database schema with core models (User, Farmer, Product, Batch, Order) — existing
- ✓ Shared system rules and constants — existing
- ✓ Vercel deployment configuration — existing

### Active

**Phase 0: PRD Refinement**
- [ ] Fill gaps in EPIC definitions
- [ ] Clarify ambiguous requirements
- [ ] Ensure each EPIC is execution-ready

**EPIC 1: Branding & Static Pages**
- [ ] Landing page explaining the batch model
- [ ] Rules page (cutoffs, payments, fulfilment)
- [ ] Visual identity (logo, colors, typography)

**EPIC 2: Authentication & Access**
- [ ] Admin email/password auth
- [ ] Buyer phone + OTP auth
- [ ] Invite-only access control
- [ ] Route protection by role

**EPIC 3: Farmers & Products**
- [ ] Farmer management (name, location, relationship level)
- [ ] Product management (name, unit, season, farmer association)
- [ ] Farmer deactivation with historical preservation

**EPIC 4: Batch Management**
- [ ] Batch states: DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED
- [ ] Automatic cutoff locking
- [ ] State transition audit logging

**EPIC 5: Pricing & Scoping**
- [ ] Batch-specific pricing and facilitation fees
- [ ] MOQ (minimum order quantity) enforcement
- [ ] Price locking when batch opens

**EPIC 6-7: Ordering Flow**
- [ ] Current batch visibility for buyers
- [ ] Products grouped by farmer with stories
- [ ] Cart with MOQ enforcement
- [ ] Fulfilment preference (pickup/delivery)

**EPIC 8: Two-Stage Payments**
- [ ] 10% commitment fee at order
- [ ] Final settlement after procurement
- [ ] Manual UPI tracking

**EPIC 9: Aggregation & Procurement**
- [ ] Quantity aggregation by batch/farmer/product
- [ ] Procurement lists
- [ ] WhatsApp-ready farmer messages

**EPIC 10: Packing & Distribution**
- [ ] Buyer-wise packing lists
- [ ] Pickup vs delivery workflow separation

**EPIC 11: Farmer Payouts**
- [ ] Farmer ledgers per batch
- [ ] Manual payout logging with audit

**EPIC 12: Order Status**
- [ ] Real-time buyer status tracking
- [ ] Order history access

**EPIC 13: Communication System**
- [ ] WhatsApp click-to-chat integration
- [ ] Event-driven message triggers
- [ ] Comprehensive event logging

### Out of Scope

- Native mobile apps (iOS/Android) — web-first, responsive
- Integrated payment gateways — manual UPI for control
- Real-time delivery tracking — pickup-first model
- Reviews/ratings — trust through farmer stories, not ratings
- Subscriptions/recurring orders — batch model only
- Multi-language — English/primary local as default
- Automatic farmer payouts — manual for accountability
- Direct buyer-farmer chat — admin-mediated

## Context

**Domain**: Agricultural marketplace, batch-based aggregation
**Users**:
- Admin (single role, email/password)
- Buyers (invite-only, phone + OTP)
- Farmers (no login, managed by admin)

**PRD Reference**: `docs/prd.md` contains full EPIC specifications

**Existing Codebase**:
- Frontend: React 19, Vite, Tailwind, React Router
- Backend: Fastify 5, Prisma 7, PostgreSQL
- State: TanStack Query + Zustand (installed, not yet used)
- Forms: React Hook Form + Zod
- Observability: Pino logging (configured, not integrated)

**Current State**:
- EPIC 0 (System Foundation) complete
- Database schema defined with seed data
- Landing page components exist (need refinement)
- Auth not yet implemented

## Constraints

- **Tech Stack**: React + TypeScript + Fastify + Prisma + PostgreSQL (locked per PRD)
- **Deployment**: Vercel (frontend + serverless), managed PostgreSQL
- **UI Framework**: shadcn/ui with Radix + Tailwind, zero animation policy
- **Payments**: Manual UPI only, no payment gateway integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Batch-based model over open marketplace | Aggregation enables better farmer pricing, reduced logistics | — Pending |
| Manual UPI over payment gateway | Full control, no integration complexity for V1 | — Pending |
| Phone + OTP for buyers | Mobile-first audience, no password management | — Pending |
| No farmer login | Farmers are managed, not self-service for V1 | — Pending |
| Pickup as default fulfilment | Reduces delivery complexity, buyers come to collection point | — Pending |
| Refine PRD before execution | Fill gaps in EPICs to ensure clear execution | — Pending |

---
*Last updated: 2026-01-14 after initialization*
