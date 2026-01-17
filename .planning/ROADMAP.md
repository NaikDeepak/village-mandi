# Roadmap: Village Mandi

## Overview

A batch-based, trust-driven agricultural marketplace connecting farmers directly to buyers. Milestone 1 (MVP) is complete. Milestone 2 focuses on production readiness and enhancements, starting with deployment and robust Firebase Phone Authentication.

## Milestones

- ✅ **v1.0 MVP** - Phases 1-15 (shipped 2026-01-15)
- 🚧 **v1.1 Production & Auth** - Phases 16-20 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-15) - SHIPPED 2026-01-15</summary>

### Phase 1: System Foundation
**Goal**: Repository structure and core configuration
**Status**: Complete

### Phase 2: Branding & Static Pages
**Goal**: Public facing landing pages
**Status**: Complete

### Phase 3: Authentication & Access
**Goal**: Initial auth system (mock OTP)
**Status**: Complete

### Phase 4: Farmers & Products
**Goal**: Core data management
**Status**: Complete

### Phase 5: Batch Management
**Goal**: Batch lifecycle logic
**Status**: Complete

### Phase 6: Pricing & Scoping
**Goal**: Dynamic pricing model
**Status**: Complete

### Phase 7: Ordering Flow
**Goal**: Buyer purchasing experience
**Status**: Complete

### Phase 8: Two-Stage Payments
**Goal**: Payment tracking system
**Status**: Complete

### Phase 9: Aggregation & Procurement
**Goal**: Fulfillment logic
**Status**: Complete

### Phase 10: Packing & Distribution
**Goal**: Logistics management
**Status**: Complete

### Phase 11: Farmer Payouts
**Goal**: Financial settlement
**Status**: Complete

### Phase 12: Order Status
**Goal**: Buyer transparency
**Status**: Complete

### Phase 13: Communication System
**Goal**: WhatsApp integration
**Status**: Complete

### Phase 14: Order Editing
**Goal**: Admin flexibility
**Status**: Complete

### Phase 15: End-to-End Workflow Guide
**Goal**: Documentation
**Status**: Complete

</details>

### 🚧 v1.1 Production & Auth (In Progress)

**Milestone Goal:** Production deployment and robust SMS authentication.

#### Phase 16: Deployment
**Goal**: Deploy MVP to Vercel production environment
**Depends on**: Phase 15
**Requirements**: (Deployment)
**Research**: Likely (Infrastructure config)
**Status**: Complete

#### Phase 17: Firebase Infrastructure
**Goal**: Configure Firebase project, custom domain, and test access
**Depends on**: Phase 16
**Requirements**: SEC-01, SEC-04, CMP-01
**Success Criteria**:
  1. Developer can access Firebase Console
  2. Custom domain `auth.apnakhet.app` resolves
  3. Test phone numbers work in simulation
**Research**: Unlikely (Configuration only)
**Status**: Complete

#### Phase 18: Backend Auth Foundation
**Status**: Complete
**Goal**: Establish server-side token verification and user sync
**Depends on**: Phase 17
**Requirements**: AUTH-04, AUTH-05, SEC-03
**Success Criteria**:
  1. API accepts valid Firebase ID tokens
  2. New phone numbers auto-create user records in Postgres
  3. API rejects invalid/expired tokens
  4. Rate limits enforce maximum attempts per IP
**Research**: Unlikely (Standard pattern)
**Status**: Pending

#### Phase 19: Client Auth Integration
**Goal**: Replace mock OTP with real Firebase SMS flow
**Depends on**: Phase 18
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-06
**Success Criteria**:
  1. User can request and receive real SMS OTP
  2. User completes login with 6-digit code
  3. Invisible reCAPTCHA handles verification silently
  4. "Resend OTP" button enforces cooldown
**Research**: Unlikely (Client SDK)
**Status**: Pending

#### Phase 20: Security Hardening
**Goal**: Secure the production auth pipeline
**Depends on**: Phase 19
**Requirements**: SEC-02
**Success Criteria**:
  1. App Check rejects requests from unauthorized clients
  2. Rate limiting prevents SMS pumping
**Research**: Likely (Security config)
**Research topics**: App Check enforcement, fastify-rate-limit tuning
**Status**: Complete

#### Phase 21: App Check & Security Integration
**Goal**: Enable App Check on frontend and enforce on backend
**Depends on**: Phase 20
**Requirements**: SEC-02
**Gap Closure**: Closes integration gap (Client -> Backend App Check token flow)
**Status**: Complete

#### Phase 22: Auth Flow Cleanup
**Goal**: Remove legacy auth and fix redundant UX
**Depends on**: Phase 21
**Requirements**: AUTH-06
**Gap Closure**: Closes redundant flow gap and cleans up tech debt
**Status**: Pending

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 16. Deployment | v1.1 | 2/2 | Complete | 2026-01-15 |
| 17. Firebase Infra | v1.1 | 2/2 | Complete | 2026-01-17 |
| 18. Backend Auth | v1.1 | 2/2 | Complete | 2026-01-17 |
| 19. Client Auth | v1.1 | 3/3 | Complete | 2026-01-17 |
| 20. Security | v1.1 | 2/2 | Complete | 2026-01-17 |
| 21. App Check & Security | v1.1 | 1/1 | Complete | 2026-01-17 |
| 22. Auth Flow Cleanup | v1.1 | 0/TBD | Pending | - |
