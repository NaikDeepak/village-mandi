---
phase: 27-identity-security-foundation
plan: 03
subsystem: auth
tags: [firebase-auth, react, zustand, fastify]

# Dependency graph
requires:
  - phase: 27-identity-security-foundation
    provides: Firebase Blocking Function (27-02)
provides:
  - Frontend redirection logic for PENDING/REJECTED users
  - Informational Waitlist and Rejected pages
  - Error mapping from Firebase Auth SDK to UI states
affects: [28-admin-user-management]

# Tech tracking
tech-stack:
  added: []
  patterns: [Error mapping from Firebase Auth SDK, Centralized registration status handling in AuthProvider]

key-files:
  created:
    - web/src/pages/auth/WaitlistPage.tsx
    - web/src/pages/auth/RejectedPage.tsx
  modified:
    - web/src/hooks/usePhoneAuth.ts
    - web/src/components/auth/AuthProvider.tsx
    - web/src/stores/auth.ts
    - server/src/routes/auth.ts

key-decisions:
  - "Catch specific error messages from Firebase SDK and map them to application states (PENDING/REJECTED) to provide a seamless transition to status pages."
  - "Expose the 'rejectionReason' in the /rejected route via state or error parsing to explain denial to users."

patterns-established:
  - "Blocking Error Mapping: Using partial string matches on Firebase Auth errors to detect backend-enforced blocking rules."

# Metrics
duration: 15min
completed: 2026-01-19
---

# Phase 27 Plan 03: Frontend Blocking Experience Summary

**Frontend redirection and informational pages for users blocked by the registration approval system**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-19T17:05:00Z
- **Completed:** 2026-01-19T17:20:00Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Implemented error handling in `usePhoneAuth` to detect `ACCOUNT_PENDING` and `ACCOUNT_REJECTED` errors from Firebase.
- Created `WaitlistPage` to inform users their application is under review.
- Created `RejectedPage` to display specific reasons for application denial.
- Updated `AuthProvider` to handle blocked states when verifying sessions via `/me`.
- Integrated status pages into the main routing table and login flows.

## Task Commits

Each task was committed atomically:

1. **Task 1: Handle Auth Errors in Hooks** - `ed7fee6` (feat)
2. **Task 2: Create Informational Pages** - `ba16be3` (feat)
3. **Task 3: checkpoint:human-verify** - (No commit, manual verification)

## Files Created/Modified
- `web/src/hooks/usePhoneAuth.ts` - Maps Firebase errors to store state
- `web/src/components/auth/AuthProvider.tsx` - Handles blocking logic on session verification
- `web/src/stores/auth.ts` - Added `registrationStatus` to global state
- `web/src/pages/auth/WaitlistPage.tsx` - New informational page for PENDING users
- `web/src/pages/auth/RejectedPage.tsx` - New informational page for REJECTED users
- `server/src/routes/auth.ts` - Updated `/me` to return specific error for blocked users
- `web/src/App.tsx` - Added routes for status pages
- `web/src/lib/api.ts` - Updated API client to handle rejection reasons
- `web/src/pages/BuyerLoginPage.tsx` - Added redirection on login failure
- `web/src/components/auth/PhoneLoginForm.tsx` - Added redirection on login failure

## Decisions Made
- Used string matching for Firebase errors as it's the only way to get custom error messages through the Blocking Function's `AuthUserRecord` rejection.
- Chose to use dedicated routes (`/waitlist`, `/rejected`) rather than conditional rendering in the login page for cleaner state management and bookmarkability.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None.

## User Setup Required
None - no external service configuration required beyond the Firebase Functions deployed in 27-02.

## Next Phase Readiness
- Registration status flow is fully implemented (Backend, Firebase Function, and Frontend).
- Ready for Admin UI to manage these statuses (Phase 28).

---
*Phase: 27-identity-security-foundation*
*Completed: 2026-01-19*
