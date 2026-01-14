# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Current Position

**Milestone:** 1 (MVP v1.0)
**Phase:** 05 — Batch Management (Next)
**Status:** Ready to plan

---

## Recent Progress

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
- Batch (id, name, cutoffTime, state, createdAt) — not yet implemented in API
- Order, OrderItem, Payment — not yet implemented

**Codebase map:** See `.planning/codebase/` for detailed analysis

---

## Session Continuity

**Last session:** 2026-01-14
**Work completed:**
- Completed Farmer detail view with products
- Principal Engineer review of Epic-2 (Auth)
- Created `docs/todo.md` with 19 tracked issues
- Synced GSD planning structure

**Next actions:**
1. `/gsd:plan-phase 5` — Create detailed plan for Batch Management
2. `/gsd:execute-plan` — Execute the plan

---

*Last updated: 2026-01-14*
