# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Current Position

**Milestone:** 2 (Production & Enhancements)
**Phase:** 26 (Add testcases for uncovered code)
**Plan:** 26-01 (Completed)
**Status:** Phase complete
**Next Phase:** Phase 27 (TBD)
**Last activity:** 2026-01-19 — Phase 26 Plan 01 complete (Add testcases for uncovered code)

Progress: █████████░ 91%

## Recent Progress

### Milestone 2: Production & Enhancements

#### Phase 26 — Add testcases for uncovered code (Completed)
**What shipped:**
- Plan 26-01: Add testcases for uncovered code (Completed)
  - Created server tests for auth, users, and logs routes.
  - Created web tests for usePhoneAuth hook.
  - Improved server test helpers and fixed regressions in order tests.

#### Phase 24 — Rebrand and Domain Migration to ApnaKhet.app (Completed)

**What shipped:**
- Plan 24-03: Rebrand Hardcoded Strings (Completed)
- Plan 24-02: PWA Manifest & Domain Configuration (Completed)
- Plan 24-01: Rebrand SEO Assets (Completed)

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

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| Mock Firebase Admin in server tests | Need to test auth routes without real Firebase connection | Decorated Fastify instance with mock auth provider |
| Use renderHook for hook testing | Need to test logic in usePhoneAuth without full component mount | Isolated hook logic and mocked Firebase Auth calls |
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

**Pending Todos (1):**
- 2026-01-18: Build is failing (tooling)

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
| 2026-01-19 | Phase 26 added: Add testcases for uncovered code |
| 2026-01-18 | Phase 24 added: Rebrand and Domain Migration to ApnaKhet.app |
| 2026-01-18 | Phase 23 added: SEO and AI Bot friendly |
| 2026-01-17 | Updated for Milestone 2 (Auth & Production) |

---

## Session Continuity

**Last session:** 2026-01-19
**Stopped at:** Completed 26-01-PLAN.md
**Resume file:** None

---
*Last updated: 2026-01-19*
