# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** Farmer-centric experience (Trust & Transparency).
**Current focus:** Planning next milestone (v1.2).

## Current Position

**Milestone:** v1.1 (Production & Auth) - Complete
**Phase:** 26 (Add testcases for uncovered code) - Complete
**Plan:** 26-01 - Complete
**Status:** Milestone Complete
**Last activity:** 2026-01-19 — v1.1 milestone complete

Progress: ██████████ 100%

## Recent Progress

### Milestone v1.1: Production & Auth (Completed)

**What shipped:**
- Production deployment to Vercel (Phase 16).
- Robust Firebase Phone Auth with App Check (Phases 17-21).
- Auth flow cleanup and strict typing (Phase 22).
- Rebranding to Apna Khet and SEO optimization (Phases 23-24).
- Security hardening and comprehensive testing (Phases 20, 25, 26).

### Milestone v1.0: MVP (Completed)

**What shipped:**
- Core batch-based marketplace (Phases 1-15).
- Farmers, Products, Orders, Payments, Logistics.

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| Enforce `UserRole` in API | Roles were treated as generic strings in the API client | Improved type safety and reduced bugs from role mismatch |
| Optimistic check in `AuthProvider` | UI would show "Loading..." or flicker even if user was already authenticated in local storage | Smoother UX during page refreshes and hydration |
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
- [ ] SEC-005: No Server-Side Token Revocation (Open)
- [ ] SEC-008: No Explicit CSRF Protection (Open)
- [ ] SEC-009: Session Fixation Potential (Open)

**UX/Other (P2/P3):**
- [ ] UX-001: No JWT Refresh Mechanism (Open)
- [ ] UX-003: Browser confirm() Dialog (Open)
- [ ] UX-004: Hardcoded Stats Values (Open)
- [ ] UX-005: No Empty State UI (Open)
- [ ] UX-006: Minimal Loading States (Open)
- [ ] INFRA-001: No React Error Boundaries (Open)

---

## Technical Context

**Stack:**
- Frontend: React 19, Vite, Tailwind, React Router, Zustand, React Hook Form + Zod
- Backend: Fastify 5, Prisma 7, PostgreSQL, JWT (@fastify/jwt)
- Auth: Firebase Auth (Phone), App Check (reCAPTCHA v3)
- Tooling: Biome, Husky, GitHub Actions

**Database Models (defined):**
- User, Farmer, Product, Hub, Batch, Order, OrderItem, Payment, EventLog

---

## Roadmap Evolution

| Date | Change |
|------|--------|
| 2026-01-19 | Completed Milestone v1.1 (Production & Auth) |
| 2026-01-19 | Phase 26 added: Add testcases for uncovered code |
| 2026-01-18 | Phase 24 added: Rebrand and Domain Migration to ApnaKhet.app |
| 2026-01-18 | Phase 23 added: SEO and AI Bot friendly |
| 2026-01-17 | Updated for Milestone 2 (Auth & Production) |

---

## Session Continuity

**Last session:** 2026-01-19
**Stopped at:** Completed Milestone v1.1
**Resume file:** None

---
*Last updated: 2026-01-19*
