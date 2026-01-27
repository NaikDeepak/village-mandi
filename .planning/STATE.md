# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** Farmer-centric experience (Trust & Transparency).
**Current focus:** v1.2 User Onboarding - Implementing controlled access and admin approval flow.

## Current Position

**Milestone:** v1.2 (User Onboarding) - Initializing
**Phase:** 27 (Identity & Security Foundation)
**Plan:** 27-03 (Completed)
**Status:** Phase complete
**Last activity:** 2026-01-19 — Completed 27-03: Frontend Blocking Experience

Progress: [████████████████████] 93%

## Performance Metrics
- **Requirement Coverage:** 9/9 (100% mapped)
- **Security Posture:** Registration State Machine & Frontend Blocking Implemented
- **System Integrity:** 12 Legacy Users Grandfathered

## Recent Progress

### Milestone v1.2: User Onboarding (In Progress)

**What shipped:**
- **Phase 27-03**: Frontend redirection and informational pages for users blocked by the registration approval system.
- **Phase 27-02**: Firebase Blocking Function implemented to enforce registration status at the edge.
- **Phase 27-01**: RegistrationStatus enum and User status fields implemented with zero downtime for existing users.

### Milestone v1.1: Production & Auth (Completed)

**What shipped:**
- Production deployment to Vercel (Phase 16).
- Robust Firebase Phone Auth with App Check (Phases 17-21).
- Auth flow cleanup and strict typing (Phase 22).
- Rebranding to Apna Khet and SEO optimization (Phases 23-24).
- Security hardening and comprehensive testing (Phases 20, 25, 26).

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| **Blocking at Edge** | Use Firebase Blocking Functions to prevent unapproved users from even getting a token | Research validated as highest security approach |
| **Single Source of Truth** | Store registration status directly on the `User` table via Prisma enum | Avoids ghost records and maintains integrity |
| **Manual First** | Focus on admin-driven approval before implementing automated rules | Better learning for eventual automation rules |
| Enforce `UserRole` in API | Roles were treated as generic strings in the API client | Improved type safety |
| Optimistic check in `AuthProvider` | UI would show "Loading..." or flicker | Smoother UX |

---

## Open Issues

**Security (P0):**
- [ ] SEC-005: No Server-Side Token Revocation (Open)
- [ ] SEC-008: No Explicit CSRF Protection (Open)
- [ ] SEC-009: Session Fixation Potential (Open)

**UX/Other (P2/P3):**
- [ ] UX-001: No JWT Refresh Mechanism (Open)
- [ ] UX-003: Browser confirm() Dialog (Open)

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
| 2026-01-19 | Initialized Milestone v1.2 (User Onboarding) |
| 2026-01-19 | Completed Milestone v1.1 (Production & Auth) |

---

## Session Continuity

**Last session:** 2026-01-19
**Stopped at:** Completed 27-03-PLAN.md
**Resume file:** None (Phase Complete)

---
*Last updated: 2026-01-19*
