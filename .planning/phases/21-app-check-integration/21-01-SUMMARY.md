---
phase: 21-app-check-integration
plan: 01
subsystem: Security
tags: [firebase, app-check, security, frontend]
requires: [20-01]
provides: [frontend-app-check-verification]
affects: [backend-security-enforcement]
tech-stack:
  added: [firebase/app-check]
  patterns: [App Check token injection in fetch wrapper]
key-files:
  created: []
  modified: [web/src/lib/firebase.ts, web/src/lib/api.ts, web/.env.example]
decisions:
  - use ReCaptchaV3Provider for App Check
  - inject App Check token into all API requests via base request function
metrics:
  duration: 10m
  completed: 2026-01-17
---

# Phase 21 Plan 01: App Check Integration Summary

## Objective
Implement Firebase App Check on the frontend to authenticate the application's legitimacy to the backend.

## One-liner
Integrated Firebase App Check into the web frontend and configured the API client to automatically attach App Check tokens to all outgoing requests.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install App Check Dependency | N/A | web/package.json |
| 2 | Initialize App Check | 2b85e91 | web/src/lib/firebase.ts, web/.env.example |
| 3 | Attach Token to API Requests | cf39304 | web/src/lib/api.ts |

## Deviations from Plan
None - plan executed exactly as written.

## Decisions Made
- **ReCaptcha V3**: Used `ReCaptchaV3Provider` as it's the standard for App Check web integrations.
- **Global Header Injection**: Decided to inject the token in the base `request` function in `api.ts` to ensure all API calls (auth, orders, etc.) are protected without individual route modifications.

## Next Phase Readiness
- Frontend is now sending `X-Firebase-AppCheck` headers.
- Backend can now safely flip `APP_CHECK_ENFORCED=true` in production once the site key is configured.
