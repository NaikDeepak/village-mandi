# Village Mandi

## What This Is

A batch-based, trust-driven agricultural marketplace connecting farmers directly to buyers. Unlike traditional e-commerce, orders are aggregated into discrete batches with strict cutoffs, two-stage payments, and farmer-centric product presentation emphasizing provenance and locality.

## Core Value

**Farmer-centric experience** — every product tells a farmer's story. Trust and transparency through visible farmer identity, locality, and relationship level. This drives buyer confidence and farmer dignity.

## Current Milestone: v1.2 User Onboarding

**Goal:** Implement controlled access via "Register Interest" flow and admin approval.

**Target features:**
- User registration of interest (Name, Phone, Pincode).
- Admin dashboard for manual approval of requests.
- User status check (login attempt reveals pending/approved state).
- Pincode-based location capture for serviceability planning.

## Requirements

### Validated

- ✓ Monorepo structure (web, server, shared workspaces) — v1.0
- ✓ React frontend with Vite, Tailwind, TypeScript — v1.0
- ✓ Fastify backend with Prisma/PostgreSQL — v1.0
- ✓ Database schema with core models (User, Farmer, Product, Batch, Order) — v1.0
- ✓ Shared system rules and constants — v1.0
- ✓ Vercel deployment configuration — v1.0
- ✓ AUTH-01: User can request OTP via SMS for a given phone number (Firebase SDK) — v1.1
- ✓ AUTH-02: User can verify 6-digit OTP code (Firebase SDK) — v1.1
- ✓ AUTH-03: User is verified via Invisible reCAPTCHA to prevent bots (with visible fallback) — v1.1
- ✓ AUTH-04: Client exchanges Firebase ID Token for internal Backend Session JWT (`POST /auth/firebase-verify`) — v1.1
- ✓ AUTH-05: Backend automatically creates Postgres User record if phone number is new (Sync-on-Login) — v1.1
- ✓ AUTH-06: UI enforces 60-second cooldown before "Resend OTP" is enabled — v1.1
- ✓ SEC-01: Developer/Reviewer phone numbers are whitelisted in Firebase Console (Bypass SMS/Cost) — v1.1
- ✓ SEC-02: Firebase App Check is enabled on Web client to prevent unauthorized API usage — v1.1
- ✓ SEC-03: Backend Rate Limiting is active on `/auth/firebase-verify` (e.g., 5 attempts per IP/hour) — v1.1
- ✓ SEC-04: Custom Auth Domain `auth.apnakhet.app` is configured for Safari/iOS compatibility — v1.1
- ✓ CMP-01: DLT Registration completed for Indian SMS delivery (Sender ID & Templates) — v1.1

<details>
<summary>Legacy v1.0 Requirements</summary>

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
</details>

### Active

**(New Requirements for v1.2 will be defined in REQUIREMENTS.md)**

### Out of Scope

- Native mobile apps (iOS/Android) — web-first, responsive
- Integrated payment gateways — manual UPI for control
- Real-time delivery tracking — pickup-first model
- Reviews/ratings — trust through farmer stories, not ratings
- Subscriptions/recurring orders — batch model only
- Multi-language — English/primary local as default
- Automatic farmer payouts — manual for accountability
- Direct buyer-farmer chat — admin-mediated
- Email Login for Buyers — Phone-first audience, simpler flow
- Social Login (Google/FB) — Not relevant for target rural/semi-urban buyer demographic
- Custom SMS Provider — Using Firebase default pipeline for V1 complexity reduction

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
- Auth: Firebase Auth (Phone), App Check (reCAPTCHA v3)

**Current State**:
- **Milestone v1.1 (Production & Auth) Complete** (v1.1)
- Core marketplace operational (Farmers, Batches, Ordering, Payments, Logistics)
- Production Auth: Firebase Phone Auth, App Check, Rate Limiting
- Branding: Apna Khet (apnakhet.app)
- E2E Verified: Setup → Batch → Order → Procurement → Fulfillment → Settlement
- Ready for next functional enhancements (v1.2)

## Constraints

- **Tech Stack**: React + TypeScript + Fastify + Prisma + PostgreSQL (locked per PRD)
- **Deployment**: Vercel (frontend + serverless), managed PostgreSQL
- **UI Framework**: shadcn/ui with Radix + Tailwind, zero animation policy
- **Payments**: Manual UPI only, no payment gateway integration
- **Auth Provider**: Firebase Auth (Phone) + App Check

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Batch-based model over open marketplace | Aggregation enables better farmer pricing, reduced logistics | ✅ Validated in Phase 05 |
| Manual UPI over payment gateway | Full control, no integration complexity for V1 | ✅ Implemented in Phase 08 |
| Phone + OTP for buyers | Mobile-first audience, no password management | ✅ Implemented in Phase 03 |
| No farmer login | Farmers are managed, not self-service for V1 | ✅ Maintained (Admin managed) |
| Pickup as default fulfilment | Reduces delivery complexity, buyers come to collection point | ✅ Implemented in Phase 10 |
| Refine PRD before execution | Fill gaps in EPICs to ensure clear execution | ✅ Completed |
| Enforce `UserRole` in API | Roles were treated as generic strings in the API client | ✅ Improved type safety |
| Optimistic check in `AuthProvider` | UI would show "Loading..." or flicker even if user was already authenticated | ✅ Smoother UX |
| Mock Firebase Admin in server tests | Need to test auth routes without real Firebase connection | ✅ Reliable CI tests |
| Use renderHook for hook testing | Need to test logic in usePhoneAuth without full component mount | ✅ Isolated hook logic |
| Rebrand to Apna Khet | Transition to a more generic/scalable brand name | ✅ Updated SEO assets/metadata |
| ReCaptcha V3 for App Check | Standard provider for web apps | ✅ Initialized in firebase.ts |
| Global App Check Header | Ensure all API calls are verified | ✅ Attached getToken() results |
| Conditional App Check Enforcement | Allow monitoring vs blocking | ✅ Use APP_CHECK_ENFORCED env var |
| Structured Security Metadata | Need for forensic/audit trail | ✅ Log IP, UserAgent, and Path |
| Items replacement strategy for order editing | Simplify API behavior and avoid complex merge logic | ✅ PATCH /orders/:id replaces all |
| Metadata typing for event logs | Prisma InputJsonValue type incompatibility | ✅ Build metadata object dynamically |
| Strict state machine for batches | Business integrity depends on predictable batch lifecycle | ✅ VALID_TRANSITIONS constant |
| EventLog for batch transitions | Accountability and audit trail required | ✅ Every state change creates EventLog |
| Cutoff validation at DRAFT→OPEN | Prevent opening batches past their cutoff window | ✅ Check cutoffAt > now |
| Update restrictions on batches | Prevent changing rules mid-batch | ✅ Only DRAFT batches can update |
| Soft delete for farmers/products | Preserve historical data for past batches | ✅ isActive flag, not hard delete |
| JWT in httpOnly cookies | Prevent XSS token theft | ✅ Secure, sameSite: lax |

---
*Last updated: 2026-01-19 after v1.1 milestone*
