# Roadmap: Village Mandi

## Milestones

- ✅ **v1.0 MVP** - Phases 1-15 (shipped 2026-01-15)
- ✅ **v1.1 Production & Auth** - Phases 16-26 (shipped 2026-01-19)
- 🚧 **v1.2 User Onboarding** - Phases 27-30 (Planned)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-15) - SHIPPED 2026-01-15</summary>

- [x] Phase 1: System Foundation (Complete)
- [x] Phase 2: Branding & Static Pages (Complete)
- [x] Phase 3: Authentication & Access (Complete)
- [x] Phase 4: Farmers & Products (Complete)
- [x] Phase 5: Batch Management (Complete)
- [x] Phase 6: Pricing & Scoping (Complete)
- [x] Phase 7: Ordering Flow (Complete)
- [x] Phase 8: Two-Stage Payments (Complete)
- [x] Phase 9: Aggregation & Procurement (Complete)
- [x] Phase 10: Packing & Distribution (Complete)
- [x] Phase 11: Farmer Payouts (Complete)
- [x] Phase 12: Order Status (Complete)
- [x] Phase 13: Communication System (Complete)
- [x] Phase 14: Order Editing (Complete)
- [x] Phase 15: End-to-End Workflow Guide (Complete)

</details>

<details>
<summary>✅ v1.1 Production & Auth (Phases 16-26) - SHIPPED 2026-01-19</summary>

- [x] Phase 16: Deployment (1 plan)
- [x] Phase 17: Firebase Infrastructure (2 plans)
- [x] Phase 18: Backend Auth Foundation (2 plans)
- [x] Phase 19: Client Auth Integration (3 plans)
- [x] Phase 20: Security Hardening (2 plans)
- [x] Phase 21: App Check & Security Integration (2 plans)
- [x] Phase 22: Auth Flow Cleanup (3 plans)
- [x] Phase 23: SEO and AI Bot friendly (2 plans)
- [x] Phase 24: Rebrand and Domain Migration to ApnaKhet.app (3 plans)
- [x] Phase 25: Security & Reliability Refinement (1 plan)
- [x] Phase 26: Add testcases for uncovered code (1 plan)

</details>

### 🚧 v1.2 User Onboarding (Planned)

#### Phase 27: Identity & Security Foundation
**Goal:** Secure the application by intercepting authentication and enforcing approval status at the identity level.

**Plans:** 3 plans
Plans:
- [x] 27-01-PLAN.md — Update Prisma schema for registration status
- [x] 27-02-PLAN.md — Implement Firebase Blocking Functions
- [x] 27-03-PLAN.md — Frontend handling for blocked users

- **Requirements:**
  - ONBOARD-02: Blocking Gate UI for unapproved users
  - ONBOARD-03: Login feedback for Pending/Rejected status
- **Dependencies:** None
- **Success Criteria:**
  - Users with `PENDING` status see a dedicated "Waitlist" screen upon login.
  - Users with `REJECTED` status are blocked from obtaining a session and see the rejection reason.
  - Firebase Blocking Functions (`beforeSignIn`) correctly query the Postgres database for user status.

#### Phase 28: Registration Flow
**Goal:** Enable prospective buyers to submit their interest and contact details via a verified, validated flow.

- **Requirements:**
  - ONBOARD-01: Register interest with Name, Phone, and Pincode
  - ONBOARD-04: 6-digit India Pincode validation
- **Dependencies:** Phase 27
- **Success Criteria:**
  - Public registration form captures Name, Phone, and Pincode.
  - Phone number is verified via OTP before registration is saved to the database.
  - Form provides immediate UI feedback for invalid Indian Pincode formats.

#### Phase 29: Admin Management UI
**Goal:** Provide admins with high-performance tools to manage the waitlist and process leads.

- **Requirements:**
  - ADMIN-01: Dashboard of pending user registrations
  - ADMIN-02: Individual manual approval
  - ADMIN-03: Individual manual rejection with optional reason
  - ADMIN-04: Bulk approval/rejection capability
- **Dependencies:** Phase 28
- **Success Criteria:**
  - Admin dashboard displays a searchable, filterable table of all registration requests.
  - Admin can change user status (Approved/Rejected) with audit logs created.
  - Bulk actions can process multiple users simultaneously without UI lag.

#### Phase 30: Notifications & Final UX
**Goal:** Automate user communication and polish the onboarding experience.

- **Requirements:**
  - NOTIF-01: SMS notification on approval
- **Dependencies:** Phase 29
- **Success Criteria:**
  - Approved users receive an automated "Welcome" SMS notification via the configured SMS provider.
  - System logs every notification event for delivery tracking.

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-15 | v1.0 | 15/15 | Complete | 2026-01-15 |
| 16-26 | v1.1 | 18/18 | Complete | 2026-01-19 |
| 27-30 | v1.2 | 0/4 | In Progress | - |
