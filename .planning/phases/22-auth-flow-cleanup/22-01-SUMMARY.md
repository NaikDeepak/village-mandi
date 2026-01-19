---
phase: 22-auth-flow-cleanup
plan: 01
subsystem: auth
tags: [auth, types, refactor]
requires: [21-02]
provides: [standardized-auth-types, centralized-phone-normalization]
affects: [all-auth-flows]
tech-stack:
  added: []
  patterns: [utility-centralization]
key-files:
  created: [server/src/utils/phone.ts]
  modified: [web/src/stores/auth.ts, web/src/lib/utils.ts, server/src/routes/auth.ts, server/src/routes/users.ts, web/src/components/auth/PhoneLoginForm.tsx, web/src/pages/AdminDashboardPage.tsx]
metrics:
  duration: 10m
  completed: 2026-01-19
---

# Phase 22 Plan 01: Auth Flow Cleanup Summary

## One-liner
Standardized User types across frontend and backend, and centralized phone normalization logic into shared utilities.

## Success Criteria
- [x] No duplicate phone logic: Centralized in `normalizePhone` utilities.
- [x] Types are strictly aligned: Frontend `User` type now matches backend `UserResponse`.
- [x] Logout is cleaner: Verified Zustand store handles state reset correctly.

## Decisions Made
| Decision | Context | Outcome |
|----------|---------|---------|
| Centralize phone normalization | Redundant regex logic was scattered across frontend components and backend routes | Created `normalizePhone` in `web/src/lib/utils.ts` and `server/src/utils/phone.ts` |
| Make phone required in User type | Backend schema expects phone, but frontend had it as nullable | Updated store interface to `phone: string` to avoid unnecessary null checks |

## Deviations from Plan
### Auto-fixed Issues
**1. [Rule 2 - Missing Critical] Found additional phone normalization sites**
- **Found during:** Task 2 verification (Grep)
- **Issue:** `server/src/routes/users.ts` and `web/src/pages/AdminDashboardPage.tsx` also had duplicate phone normalization logic.
- **Fix:** Refactored these files to use the new `normalizePhone` utility.
- **Files modified:** `server/src/routes/users.ts`, `web/src/pages/AdminDashboardPage.tsx`
- **Commit:** 2529268

## Next Phase Readiness
- All auth-related types are now consistent.
- Phone number handling is predictable across the stack.
- Ready for any future auth flow enhancements.

## Commits
- 5e5a00d: feat(22-01): standardize User type in auth store
- 2529268: feat(22-01): centralize phone normalization logic
