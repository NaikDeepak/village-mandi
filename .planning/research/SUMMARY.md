# Project Research Summary

**Project:** Village Mandi (v1.2) - User Onboarding & Waitlist System
**Domain:** User Access Control / Hyperlocal Marketplace
**Researched:** 2026-01-19
**Confidence:** HIGH

## Executive Summary

Village Mandi v1.2 focuses on implementing a robust, invite-only onboarding system to manage regional expansion. Experts in the field build these systems using identity-level gatekeeping rather than simple middleware checks. This ensures that unapproved users never receive a valid authentication token, significantly reducing the attack surface and preventing unauthorized access to backend resources from the start.

The recommended approach leverages **Firebase Identity Platform Blocking Functions** (`beforeSignIn` and `beforeCreate`) to intercept the authentication handshake and verify the user's approval status against a **Postgres (Prisma)** database. A single `User` table with a `RegistrationStatus` enum is favored over a separate waitlist table to maintain data integrity and avoid "ghost" authentication records. The management interface will be built using **TanStack Table** for high-performance lead handling in the admin panel.

The primary risks include the shift in Firebase billing (Identity Platform has different pricing tiers), potential synchronization issues between Firebase Auth and Postgres, and client-side "stale status" due to cached ID tokens. These will be mitigated through careful error handling in cloud functions and real-time status checks in the application frontend.

## Key Findings

### Recommended Stack

The stack prioritizes security at the edge and performant data management.

**Core technologies:**
- **Firebase Identity Platform**: Auth Blocking Functions — Prevents unapproved users from obtaining ID tokens.
- **Prisma (v7.x)**: Schema Management — Uses a `RegistrationStatus` enum on the existing `User` table for robust state management.
- **TanStack Table (v9)**: Admin UI — High-performance, headless table for managing thousands of pending leads.
- **Zod (v3.24+)**: Schema Validation — Specifically for India 6-digit pincode regex validation.

### Expected Features

The feature set covers the full lifecycle from interest registration to admin approval.

**Must have (table stakes):**
- **Verified Interest Form** — Phone verification (OTP) and pincode capture.
- **Blocking Gate UI** — User-facing feedback for "Pending" or "Rejected" status.
- **Admin Waitlist Dashboard** — Filterable list of pending registrations.
- **Manual Approval Toggle** — Admin capability to move users from PENDING to APPROVED.

**Should have (competitive):**
- **Pincode Lookup API** — Auto-filling district/state via `postalpincode.in`.
- **Automated Area Approval** — Instant approval for users in pre-defined "Serviceable" pincodes.
- **Approval Notifications** — SMS alerts when a user is granted access.

**Defer (v2+):**
- **Social Login** — Stick to Phone Auth to ensure high-quality contact data.
- **Waitlist Leaderboard** — Unnecessary complexity for the current hyperlocal MVP.

### Architecture Approach

A "Zero-Trust" identity architecture where the authentication provider acts as the primary firewall.

**Major components:**
1. **Blocking Functions** — Serverless logic that queries Postgres before issuing Firebase tokens.
2. **Postgres (Single Source of Truth)** — Central repository for user profile and registration status.
3. **Fastify API** — Standard application backend that only ever sees tokens from already-approved users.

### Critical Pitfalls

Top risks identified during research:

1. **Identity Platform Pricing** — Costs apply after 50k MAU. Monitor usage early to avoid billing surprises.
2. **The "Ghost" Auth Record** — Atomic sync between Firebase and Postgres is difficult; functions must handle missing DB profiles gracefully.
3. **Stale Token Status** — Firebase tokens last 1 hour. Approvals may not reflect instantly without a force-refresh or real-time check.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Identity & Security Foundation
**Rationale:** Establishing the gatekeeping mechanism is the highest priority and prerequisite for all other work.
**Delivers:** Firebase Identity Platform upgrade, Blocking Functions implementation, and Postgres schema migrations.
**Addresses:** Manual Approval Toggle, Blocking Gate UI.
**Avoids:** Identity Platform Pricing Surprise (setup monitoring early).

### Phase 2: Registration Flow
**Rationale:** Captures user interest and populates the database once the security layer is ready.
**Delivers:** Frontend Interest Form, Zod validation, and backend registration endpoints.
**Addresses:** Verified Interest Form, Pincode Validation.
**Uses:** Zod, Fastify.

### Phase 3: Admin Management UI
**Rationale:** Allows the business to begin processing the leads captured in Phase 2.
**Delivers:** Admin dashboard with TanStack Table for lead management.
**Addresses:** Admin Waitlist Dashboard.
**Implements:** TanStack Table integration.

### Phase 4: UX & Automation
**Rationale:** Optimizes the flow for scale once the manual process is proven.
**Delivers:** Pincode lookup API and Automated Area Approval logic.
**Addresses:** Automated Area Approval, Pincode Lookup.

### Phase Ordering Rationale

- **Security First**: By building the blocking functions before the form, we ensure no one can "accidentally" gain access during development.
- **Data Capture Second**: Getting the form live allows the business to start collecting leads even before the admin UI is fully polished.
- **Automation Last**: Manual approval provides the best learning for what the automated rules should eventually be.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Automation):** Needs a definitive list of "Serviceable Pincodes" and a fallback plan for the `postalpincode.in` API reliability.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Identity):** Follows standard Firebase documentation for Blocking Functions.
- **Phase 3 (Admin UI):** Standard TanStack Table implementation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on official Firebase and Prisma documentation. |
| Features | HIGH | Standard requirements for invite-only platforms. |
| Architecture | HIGH | Proven "Zero-Trust" identity pattern. |
| Pitfalls | HIGH | Well-documented pricing and sync issues in the Firebase ecosystem. |

**Overall confidence:** HIGH

### Gaps to Address

- **SMS Provider Selection**: If Firebase SMS is not preferred for India (due to DLT regulations), a separate research task for Msg91 or Twilio integration may be needed for "Approval Notifications".
- **Pincode Data Source**: Need to decide between using the external API or a local static JSON file for the initial launch.

## Sources

### Primary (HIGH confidence)
- [Firebase Documentation] — Blocking Functions and Identity Platform.
- [Prisma Documentation] — Enum support and schema management.
- [TanStack Documentation] — Table v9 features.

### Secondary (MEDIUM confidence)
- [India Post API] — `postalpincode.in` for pincode lookups.

---
*Research completed: 2026-01-19*
*Ready for roadmap: yes*
