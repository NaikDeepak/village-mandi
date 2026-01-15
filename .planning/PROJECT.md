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

### Completed

**EPIC 0: System Foundation** ✅
- [x] Repository structure with clear frontend/backend separation
- [x] Strict environment variable handling
- [x] Hardcoded system guardrails and constants

**EPIC 1: Branding & Static Pages** ✅
- [x] Landing page explaining the batch model
- [x] Rules page (cutoffs, payments, fulfilment)
- [x] Visual identity (colors, typography)
- [x] Our Story section

**EPIC 2: Authentication & Access** ✅
- [x] Admin email/password auth (JWT, httpOnly cookies)
- [x] Buyer phone + OTP auth
- [x] Invite-only access control
- [x] Route protection by role
- [x] Biome linting + GitHub Actions CI

**EPIC 3: Farmers & Products** ✅
- [x] Farmer management (name, location, relationship level)
- [x] Product management (name, unit, season, farmer association)
- [x] Farmer deactivation with historical preservation
- [x] Farmer detail view with products

**EPIC 4: Batch Management** ✅
- [x] Batch states: DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED
- [x] Automatic cutoff locking
- [x] State transition audit logging

**EPIC 5: Pricing & Scoping** ✅
- [x] Batch-specific pricing and facilitation fees
- [x] MOQ (minimum order quantity) enforcement
- [x] Price locking when batch opens

**EPIC 6-7: Ordering Flow** ✅
- [x] Current batch visibility for buyers
- [x] Products grouped by farmer with stories
- [x] Cart with MOQ enforcement
- [x] Fulfilment preference (pickup/delivery)

**EPIC 8: Two-Stage Payments** ✅
- [x] 10% commitment fee at order
- [x] Final settlement after procurement
- [x] Manual UPI tracking

**EPIC 9: Aggregation & Procurement** ✅
- [x] Quantity aggregation by batch/farmer/product
- [x] Procurement lists
- [x] WhatsApp-ready farmer messages

**EPIC 10: Packing & Distribution** ✅
- [x] Buyer-wise packing lists
- [x] Pickup vs delivery workflow separation

**EPIC 11: Farmer Payouts** ✅
- [x] Farmer ledgers per batch
- [x] Manual payout logging with audit

**EPIC 12: Order Status** ✅
- [x] Real-time buyer status tracking
- [x] Order history access

**EPIC 13: Communication System** ✅
- [x] WhatsApp click-to-chat integration
- [x] Event-driven message triggers
- [x] Comprehensive event logging

### Active

**(None - Milestone 1 Complete)**

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
- **Milestone 1 (MVP) Complete** (v1.0)
- Core marketplace operational (Farmers, Batches, Ordering, Payments, Logistics)
- E2E Verified: Setup → Batch → Order → Procurement → Fulfillment → Settlement
- Ready for production deployment / pilot run

## Constraints

- **Tech Stack**: React + TypeScript + Fastify + Prisma + PostgreSQL (locked per PRD)
- **Deployment**: Vercel (frontend + serverless), managed PostgreSQL
- **UI Framework**: shadcn/ui with Radix + Tailwind, zero animation policy
- **Payments**: Manual UPI only, no payment gateway integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Batch-based model over open marketplace | Aggregation enables better farmer pricing, reduced logistics | ✅ Validated in Phase 05 |
| Manual UPI over payment gateway | Full control, no integration complexity for V1 | ✅ Implemented in Phase 08 |
| Phone + OTP for buyers | Mobile-first audience, no password management | ✅ Implemented in Phase 03 |
| No farmer login | Farmers are managed, not self-service for V1 | ✅ Maintained (Admin managed) |
| Pickup as default fulfilment | Reduces delivery complexity, buyers come to collection point | ✅ Implemented in Phase 10 |
| Refine PRD before execution | Fill gaps in EPICs to ensure clear execution | ✅ Completed |

---
*Last updated: 2026-01-15 (Milestone 1 Complete)*
