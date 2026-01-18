# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Current Position

**Milestone:** 2 (Production & Enhancements)
**Phase:** 24 (Rebrand and Domain Migration to ApnaKhet.app)
**Plan:** 24-02 (Completed)
**Status:** In progress
**Next Phase:** TBD (Reviewing Roadmap)
**Last activity:** 2026-01-18 — Phase 24 Plan 02 complete (PWA Manifest & Domain Configuration)

Progress: █████████░ 89%

## Recent Progress

### Milestone 2: Production & Enhancements

#### Phase 24 — Rebrand and Domain Migration to ApnaKhet.app (In Progress)

**What shipped:**
- Plan 24-02: PWA Manifest & Domain Configuration (Completed)
  - Created PWA manifest with Apna Khet branding.
  - Linked manifest in index.html and set theme colors.
  - User-confirmed domain configuration in Vercel.
- Plan 24-01: Rebrand SEO Assets (Completed)
  - Updated SEOHead defaults to "Apna Khet" branding.
  - Updated robots.txt to point to apnakhet.app sitemap.
  - Updated sitemap.xml to use apnakhet.app domain.

#### Phase 23 — SEO and AI Bot friendly (Completed)

**What shipped:**
- Plan 23-01: SEO Assets & Landing Page Metadata (Completed)
- Plan 23-02: Dynamic SEO & Structured Data (Completed)

#### Phase 21 — App Check Integration (Completed)

**What shipped:**
- Plan 21-01: App Check Integration (Completed)
- Plan 21-02: Verification (Completed)

#### Phase 20 — Security Hardening (Completed)

**What shipped:**
- Plan 20-01: App Check & Security Logging (Completed)
- Plan 20-02: Rate Limit Tuning (Completed)

#### Phase 19 — Client Auth Integration (Completed)

**What shipped:**
- Plan 19-01: Client Auth Logic (Completed)
- Plan 19-02: Client Auth UI (Completed)
- Plan 19-03: End-to-End Verification (Completed)

#### Phase 18 — Backend Auth Foundation (Completed)

**What shipped:**
- Plan 18-01: Backend Auth Infrastructure (Completed)
- Plan 18-02: Security Hardening (Completed)

#### Phase 17 — Firebase Infrastructure (Completed)

**What shipped:**
- Plan 17-01: Firebase Infrastructure Configuration (Completed)
- Plan 17-02: Custom Domain Configuration (Completed)

#### Phase 16 — Deployment (Completed)

**What shipped:**
- Plan 16-01: Production Configuration (Completed)
- Plan 16-02: Production Deployment (Completed)

### Milestone 1: MVP (Completed 2026-01-15)

**What shipped:**
- Full batch-based agricultural marketplace.
- 15 Phases completed and verified.
- E2E Verified: Setup → Batch → Order → Procurement → Fulfillment → Settlement.
- Tagged `v1.0` release.

### Phase 15 — End-to-End Workflow Guide (Completed 2026-01-15)

### Phase 14 — Order Editing (Completed)

### Phase 13 — Communication System (Completed 2026-01-15)

### Phase 12 — Order Status (Completed 2026-01-15)

### Phase 11 — Farmer Payouts (Completed 2026-01-15)

### Phase 10 — Packing & Distribution (Completed 2026-01-15)

### Phase 09 — Aggregation & Procurement (Completed 2026-01-15)

### Phase 08 — Two-Stage Payments (Completed 2026-01-15)

### Phase 07 — Ordering (Completed 2026-01-15)

### Phase 06 — Pricing & Scoping (Completed 2026-01-15)

### Phase 05 — Batch Management (Completed 2026-01-15)

### Phase 04 — Farmers & Products (Completed 2026-01-14)

### Phase 03 — Authentication & Access (Completed 2026-01-14)

### Phase 02 — Branding & Static Pages (Completed 2026-01-14)

### Phase 01 — System Foundation (Completed prior)

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| Rebrand to Apna Khet | Transition to a more generic/scalable brand name | Updated SEO assets and metadata to apnakhet.app |
| ReCaptcha V3 for App Check | Standard provider for web apps | Initialized ReCaptchaV3Provider in firebase.ts |
| Global App Check Header | Ensure all API calls are verified | Attached getToken() results to X-Firebase-AppCheck in request wrapper |
| Conditional App Check Enforcement | Allow monitoring vs blocking | Use APP_CHECK_ENFORCED env var; log failures but allow through if false |
| Structured Security Metadata | Need for forensic/audit trail | Log IP, UserAgent, and Path for all security-relevant events |
| Items replacement strategy for order editing | Simplify API behavior and avoid complex merge logic | PATCH /orders/:id replaces all items, not partial update |
| Metadata typing for event logs | Prisma InputJsonValue type incompatibility with Record<string, unknown> | Build metadata object dynamically |
| Strict state machine for batches | Business integrity depends on predictable batch lifecycle | VALID_TRANSITIONS constant defines allowed transitions |
| EventLog for batch transitions | Accountability and audit trail required | Every state change creates EventLog entry |
| Cutoff validation at DRAFT→OPEN | Prevent opening batches past their cutoff window | Check cutoffAt > now when transitioning to OPEN |
| Update restrictions on batches | Prevent changing rules mid-batch | Only DRAFT batches can update name, cutoffAt, deliveryDate |
| Soft delete for farmers/products | Preserve historical data for past batches | isActive flag, not hard delete |
| JWT in httpOnly cookies | Prevent XSS token theft | Secure, sameSite: lax |

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
- User, Farmer, Product, Hub, Batch, Order, OrderItem, Payment, EventLog

---

## Roadmap Evolution

| Date | Change |
|------|--------|
| 2026-01-18 | Phase 24 added: Rebrand and Domain Migration to ApnaKhet.app |
| 2026-01-18 | Phase 23 added: SEO and AI Bot friendly |
| 2026-01-17 | Updated for Milestone 2 (Auth & Production) |

---

## Session Continuity

**Last session:** 2026-01-18
**Stopped at:** Completed 24-01-PLAN.md
**Resume file:** None

---
*Last updated: 2026-01-18*
