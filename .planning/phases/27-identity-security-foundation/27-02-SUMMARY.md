---
phase: 27-identity-security-foundation
plan: 02
subsystem: functions
tags: [firebase, blocking-functions, prisma, auth, identity-platform]

# Dependency graph
requires:
  - phase: 27-identity-security-foundation
    plan: 01
    provides: "Database schema with RegistrationStatus"
provides:
  - "Firebase Blocking Function for identity enforcement"
  - "Custom claims for user role and status"
affects: [27-03-identity-security-foundation]

# Tech tracking
tech-stack:
  added: ["firebase-functions v2", "firebase-admin", "@prisma/client"]
  patterns: ["Identity Platform Blocking Functions for edge security"]

key-files:
  created: ["functions/src/index.ts", "functions/package.json", "functions/tsconfig.json", "functions/firebase.json"]
  modified: []

key-decisions:
  - "Used Firebase Identity Platform Blocking Functions to reject unapproved users before a JWT is issued."
  - "Re-used Prisma Client in Functions environment to query the shared PostgreSQL database."
  - "Implemented informative error codes (ACCOUNT_PENDING, ACCOUNT_REJECTED) for frontend consumption."

patterns-established:
  - "Edge Authentication Blocking: Validating user status in the auth pipeline rather than just in the application logic."

# Metrics
duration: 15min
completed: 2026-01-19
---

# Phase 27 Plan 02: Firebase Blocking Function Summary

**Implemented and deployed a Firebase Blocking Function that queries the Postgres database to permit or deny sign-in based on the user's registration status.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-19T16:15:00Z
- **Completed:** 2026-01-19T16:30:00Z
- **Tasks:** 3
- **Files created/modified:** 6

## Accomplishments

- Initialized Firebase Functions environment with TypeScript and Prisma support.
- Implemented `beforeUserSignedIn` hook using Firebase Functions v2.
- Secured the sign-in flow by checking `RegistrationStatus` in PostgreSQL.
- Configured custom claims (`role`, `status`) to be injected into the Firebase ID token.
- Verified blocking logic handles `PENDING`, `REJECTED`, and `APPROVED` states correctly.

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize Functions Directory** - `078f8eb` (feat)
2. **Task 2: Implement beforeSignIn Hook** - `819c2b6` (feat)

## Files Created/Modified

- `functions/package.json` - Dependencies for Firebase Functions
- `functions/tsconfig.json` - TS configuration for Functions
- `functions/src/index.ts` - Blocking function implementation
- `functions/firebase.json` - Firebase project configuration
- `functions/.firebaserc` - Firebase project mapping
- `functions/prisma/schema.prisma` - Symlinked/Copied schema for Prisma Client

## Decisions Made

- **Prisma in Functions:** Decided to use Prisma directly within the Firebase Function to maintain a single source of truth for database access, despite the cold-start overhead.
- **Blocking at Edge:** Chose to block at the `beforeSignIn` stage to prevent unauthorized users from obtaining a valid Firebase token, reducing the attack surface.
- **Error Propagation:** Encoded rejection reasons into the `HttpsError` to allow the frontend to display specific messages to the user.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Identity enforcement is active at the Firebase level.
- Ready for Task 27-03: Implement Registration UI and Admin Approval interface.

---
*Phase: 27-identity-security-foundation*
*Completed: 2026-01-19*
