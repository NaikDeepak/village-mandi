---
status: resolved
trigger: "Click Logout. Redirect to home/login. Verify session is cleared (can't access dashboard). reported: http://localhost:5173/dashboard if I enter in browser address and click enter , no error , bot showing dashboard but not navigating to login as expected"
created: 2026-01-19T10:00:00Z
updated: 2026-01-19T10:15:00Z
---

## Current Focus

hypothesis: Session cookie not being cleared correctly or re-authenticated by AuthProvider.
test: Analyzed code for cookie clearing and auth hydration logic.
expecting: Found that AuthProvider re-verifies session even if local state was cleared, and cookie clearing might be inconsistent.
next_action: Provide root cause and fix.

## Symptoms

expected: After logout, accessing /dashboard should redirect to /login or home.
actual: Dashboard remains accessible via direct URL entry after logout.
errors: None reported.
reproduction: 1. Login. 2. Logout. 3. Manually enter /dashboard in browser.
started: Phase 22 UAT

## Eliminated

## Evidence

- 2026-01-19T10:05:00Z: Checked `useAuthStore`. It uses `persist` middleware. `logout` sets `isAuthenticated: false`.
- 2026-01-19T10:05:00Z: Checked `ProtectedRoute`. It redirects if `!isAuthenticated`.
- 2026-01-19T10:05:00Z: Checked `AuthProvider`. It calls `authApi.me()` on mount.
- 2026-01-19T10:10:00Z: Identified that `authApi.me()` will re-authenticate the user if the `token` cookie persists.
- 2026-01-19T10:12:00Z: Noticed backend `logout` manually sets cookie expiration instead of using `clearCookie`, which can lead to attribute mismatches.
- 2026-01-19T10:14:00Z: Confirmed Firebase `signOut()` is not called on the client.

## Resolution

root_cause: The session cookie is not reliably cleared on the server/browser during logout, and the `AuthProvider` performs an automatic session verification (`authApi.me()`) on every mount. If the cookie persists (e.g., due to path/domain mismatch or browser caching), `AuthProvider` re-authenticates the user even if they previously logged out.
fix: 1. Use `reply.clearCookie` in backend. 2. Call `auth.signOut()` (Firebase) on client. 3. Ensure store `logout()` is robust.
verification: Manual verification of cookie removal and AuthProvider behavior.
files_changed: [/server/src/routes/auth.ts, /web/src/stores/auth.ts, /web/src/components/layout/Navbar.tsx, /web/src/pages/BuyerDashboardPage.tsx, /web/src/pages/admin/AdminLayout.tsx]

root_cause: 
fix: 
verification: 
files_changed: []
