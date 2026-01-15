# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Current Position

**Milestone:** 1 (MVP v1.0)
**Phase:** 07 — Ordering
**Plan:** 1 of 1 in current phase
**Status:** In Progress
**Last activity:** 2026-01-15 - Starting 07-01-PLAN.md

Progress: ████████░░ 80%

## Recent Progress

### Phase 06 — Pricing & Scoping (Completed 2026-01-15)

**What shipped:**
- Plan 06-01: Batch Product Management
- BatchProduct CRUD for DRAFT batches
- Pricing (base price + facilitation %)
- Order limits (minOrderQty, maxOrderQty)
- Relationship validation (Product → Farmer)
- 78 passing tests total

**Key files added:**
- `server/src/routes/batch-products.ts` — Batch Product API
- `server/src/schemas/batch-products.ts` — Zod schemas
- `server/src/routes/batch-products.test.ts` — Integration tests (20 tests)
- `web/src/pages/admin/BatchProductsPage.tsx` — Management UI
- `web/src/components/admin/AddProductToBatchDialog.tsx` — Dialog component

### Phase 05 — Batch Management (Completed 2026-01-15)

**What shipped:**
- Plan 05-01: Hub and Batch backend API
- Hub CRUD with admin-only access
- Batch API with strict state machine (DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED)
- State transition validation (no skipping, no backwards)
- Cutoff enforcement (cannot open batch if cutoff passed)
- EventLog audit trail for all batch state changes
- 58 passing tests including comprehensive state machine tests
- Plan 05-02: Batch Admin UI
- BatchesPage with hero section for current OPEN batch
- Batch list with status badges and filter tabs
- BatchFormPage for create/edit with validation
- Admin navigation link to Batches

**Key files added:**
- `server/src/routes/hubs.ts` — Hub API
- `server/src/routes/batches.ts` — Batch API with state machine
- `server/src/schemas/hubs.ts` — Hub validation
- `server/src/schemas/batches.ts` — Batch validation with VALID_TRANSITIONS
- `server/src/routes/hubs.test.ts` — Hub tests (9 tests)
- `server/src/routes/batches.test.ts` — Batch tests (22 tests)
- `web/src/pages/admin/BatchesPage.tsx` — Batch list with hero
- `web/src/pages/admin/BatchFormPage.tsx` — Create/edit form

### Phase 04 — Farmers & Products (Completed 2026-01-14)

**What shipped:**
- Farmer CRUD with relationship levels (SELF, FAMILY, FRIEND, REFERRED)
- Product CRUD with farmer association
- Soft delete (isActive flag) preserving historical data
- Farmer detail view with associated products
- Backend tests for farmers and products API

**Key files added:**
- `server/src/routes/farmers.ts` — Farmer API
- `server/src/routes/products.ts` — Product API
- `web/src/pages/admin/FarmersPage.tsx` — Farmer list
- `web/src/pages/admin/FarmerFormPage.tsx` — Create/edit farmer
- `web/src/pages/admin/FarmerDetailPage.tsx` — Farmer with products
- `web/src/pages/admin/ProductsPage.tsx` — Product list
- `web/src/pages/admin/ProductFormPage.tsx` — Create/edit product

### Phase 03 — Authentication & Access (Completed 2026-01-14)

**What shipped:**
- Admin email/password login with JWT + httpOnly cookies
- Buyer phone + OTP login flow
- Invite-only buyer access control
- Role-based route protection (ADMIN, BUYER)
- Zustand auth store with persistence
- Biome linting + Husky pre-commit hooks
- GitHub Actions CI workflow

**Key files:**
- `server/src/routes/auth.ts` — Auth endpoints
- `server/src/middleware/auth.ts` — JWT verification
- `web/src/stores/auth.ts` — Auth state
- `web/src/components/auth/ProtectedRoute.tsx` — Route guard

### Phase 02 — Branding & Static Pages (Completed 2026-01-14)

**What shipped:**
- Landing page with hero, story, stats, steps, features
- Rules page with batch lifecycle, payments, fulfilment
- Color palette (mandi-green, mandi-earth, mandi-cream)
- Typography (Inter font family)

### Phase 01 — System Foundation (Completed prior)

**What shipped:**
- Monorepo structure (web, server, shared)
- React 19 + Vite + Tailwind frontend
- Fastify 5 + Prisma 7 backend
- PostgreSQL database schema
- Vercel deployment config

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| Strict state machine for batches | Business integrity depends on predictable batch lifecycle | VALID_TRANSITIONS constant defines allowed transitions, validation rejects invalid with 400 |
| EventLog for batch transitions | Accountability and audit trail required | Every state change creates EventLog entry with from/to metadata |
| Cutoff validation at DRAFT→OPEN | Prevent opening batches past their cutoff window | Check cutoffAt > now when transitioning to OPEN, reject if past |
| Update restrictions on batches | Prevent changing rules mid-batch | Only DRAFT batches can update name, cutoffAt, deliveryDate |
| Soft delete for farmers/products | Preserve historical data for past batches | isActive flag, not hard delete |
| JWT in httpOnly cookies | Prevent XSS token theft | Secure, sameSite: lax |
| OTP stored plaintext | MVP speed | **Tech debt** — needs hashing |
| No rate limiting | MVP speed | **Tech debt** — security gap |
| Biome over ESLint+Prettier | Single tool, faster | Working well |
| React Router nested routes | Admin layout with outlet | Clean structure |

---

## Open Issues

**Security (P0):**
- [ ] SEC-001: No rate limiting on auth endpoints
- [ ] SEC-002: OTP stored plaintext
- [ ] SEC-003: No OTP attempt limiting
- [ ] SEC-004: Math.random() for OTP generation

**Bugs (P1):**
- [ ] BUG-001: AuthProvider missing finally block
- [ ] BUG-002: Phone state lost on page refresh

**Full list:** See `docs/todo.md`

---

## Technical Context

**Stack:**
- Frontend: React 19, Vite, Tailwind, React Router, Zustand, React Hook Form + Zod
- Backend: Fastify 5, Prisma 7, PostgreSQL, JWT (@fastify/jwt)
- Tooling: Biome, Husky, GitHub Actions

**Database Models (defined):**
- User (id, role, name, email, phone, passwordHash, otpCode, isActive, isInvited)
- Farmer (id, name, location, description, relationshipLevel, isActive)
- Product (id, farmerId, name, unit, description, seasonStart, seasonEnd, isActive)
- Hub (id, name, address, isActive) — implemented in API
- Batch (id, hubId, name, status, cutoffAt, deliveryDate) — implemented in API with state machine
- Order, OrderItem, Payment — not yet implemented

**Codebase map:** See `.planning/codebase/` for detailed analysis

---

## Session Continuity

**Last session:** 2026-01-15
**Work completed:**
- Completed 05-01-PLAN.md: Hub and Batch backend API
- Hub CRUD with admin-only access
- Batch API with strict state machine and audit logging
- 58 passing tests including comprehensive state machine tests
- Completed 05-02-PLAN.md: Batch Admin UI
- BatchesPage with hero section for current batch
- BatchFormPage for create/edit
- Admin navigation link added
- All tasks committed atomically (5bd325e, 1d6c728, d9a8e8d)

**Next actions:**
1. `/gsd:execute-phase 06` — Execute Phase 06: Pricing & Scoping

---

*Last updated: 2026-01-15*
