---
phase: 22-auth-cleanup
plan: 01
subsystem: Auth
tags: [auth, cleanup, firebase]
requires: [21-02]
provides: [Streamlined buyer login flow]
affects: [Future auth enhancements]
tech-stack.added: []
tech-stack.patterns: [Single OTP login flow]
key-files.created: []
key-files.modified: [server/src/routes/auth.ts, server/src/schemas/auth.ts, server/src/utils/password.ts, web/src/lib/api.ts, web/src/pages/BuyerLoginPage.tsx, web/src/App.tsx]
key-files.deleted: [web/src/pages/VerifyOtpPage.tsx]
decisions:
  - Removed legacy mock OTP flow to simplify codebase and UX.
  - Consolidated buyer login to a single screen using Firebase Phone Auth.
metrics:
  duration: 10m
  completed: 2026-01-17
---

# Phase 22 Plan 01: Auth Flow Cleanup Summary

## Substantive One-Liner
Removed legacy mock OTP infrastructure and consolidated buyer login into a single-screen Firebase Phone Auth flow.

## What Shipped
- **Consolidated Login UX**: Buyer login now uses `PhoneLoginForm` directly in `BuyerLoginPage`, eliminating the need for a separate verification page.
- **Legacy Code Removal**: Deleted `VerifyOtpPage.tsx` and removed all mock OTP logic from both client (`api.ts`) and server (`auth.ts`, `auth.ts` schemas, `password.ts` utils).
- **Backend Hardening**: Removed unused `/auth/request-otp` and `/auth/verify-otp` endpoints, reducing attack surface.
- **Verified Cooldown Logic**: Confirmed that rate limiting/cooldown for SMS resending is correctly handled in `usePhoneAuth` hook.

## Deviations from Plan
None - plan executed exactly as written.

## Tech Debt Handled
- Removed legacy mock OTP implementation which was confusing and redundant after Firebase integration.
- Cleaned up unused Zod schemas and utility functions in the backend.

## Next Phase Readiness
- Project is now using a single, clean authentication flow for buyers.
- Ready for any further UI/UX enhancements or security hardening.
