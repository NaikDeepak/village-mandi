# Technical Debt & Security Issues

> **Issue tracker**: Log of identified issues from code reviews. Track resolution status here.

---

## Priority Legend

| Priority | Meaning | Timeline |
|----------|---------|----------|
| P0 | Critical — Security vulnerability or blocking bug | Before production |
| P1 | High — Significant issue affecting UX or reliability | Before public launch |
| P2 | Medium — Should fix but not blocking | Next sprint |
| P3 | Low — Nice to have, minor improvements | Backlog |

---

## P0 — Critical (Must Fix Before Production)

### SEC-001: No Rate Limiting on Auth Endpoints
- **Location**: `server/src/routes/auth.ts` (all endpoints)
- **Risk**: High
- **Description**: Unlimited requests allowed to `/auth/admin/login`, `/auth/request-otp`, `/auth/verify-otp`
- **Attack Vector**: Brute-force password attacks, OTP spam (SMS cost attack), credential stuffing
- **Fix**: Add `@fastify/rate-limit` — 5 attempts/15min for login, 3 OTP requests/hour per phone
- **Status**: Open
- **Added**: 2026-01-14

### SEC-002: OTP Stored as Plaintext
- **Location**: `server/src/routes/auth.ts:119`
- **Risk**: High
- **Description**: OTP code stored directly in database without hashing
- **Attack Vector**: Database breach exposes all active OTPs, enabling account takeover
- **Fix**: Hash OTP with bcrypt before storage, compare hashed values on verification
- **Status**: Open
- **Added**: 2026-01-14

### SEC-003: No OTP Attempt Limiting
- **Location**: `server/src/routes/auth.ts` (verify-otp endpoint)
- **Risk**: High
- **Description**: Unlimited OTP verification attempts allowed
- **Attack Vector**: 6-digit OTP brute-forceable in ~1M requests (~3 hours at 100 req/sec)
- **Fix**: Add `otpAttempts` counter to User model, max 3 attempts then invalidate OTP
- **Status**: Open
- **Added**: 2026-01-14

### SEC-004: Weak OTP Generation (Math.random)
- **Location**: `server/src/utils/password.ts:14`
- **Risk**: Medium
- **Description**: `Math.random()` is not cryptographically secure
- **Attack Vector**: Predictable OTP generation if attacker knows timing/state
- **Fix**: Use `crypto.randomInt(100000, 999999)` from Node.js crypto module
- **Status**: Open
- **Added**: 2026-01-14

### SEC-005: No Server-Side Token Revocation
- **Location**: JWT design (stateless)
- **Risk**: Medium
- **Description**: Logout only clears cookie client-side; JWT remains valid until expiry
- **Attack Vector**: Stolen token usable for 7 days even after user logs out
- **Fix**: Implement token blacklist (Redis) or switch to short-lived access + refresh tokens
- **Status**: Open
- **Added**: 2026-01-14

---

## P1 — High Priority

### BUG-001: AuthProvider Missing Finally Block
- **Location**: `web/src/components/auth/AuthProvider.tsx:30`
- **Risk**: Medium
- **Description**: If `authApi.me()` throws an exception, `setLoading(false)` never called
- **Impact**: Loading spinner stuck forever, app unusable
- **Fix**: Wrap in try/finally block to ensure `setLoading(false)` always runs
- **Status**: Open
- **Added**: 2026-01-14

### BUG-002: Phone State Lost on Page Refresh
- **Location**: `web/src/pages/VerifyOtpPage.tsx:30`
- **Risk**: Medium
- **Description**: Phone number passed via `location.state`, lost on browser refresh
- **Impact**: User must restart OTP flow from beginning
- **Fix**: Persist phone in `sessionStorage`, restore on mount
- **Status**: Open
- **Added**: 2026-01-14

### SEC-006: Debug Logging Contains Headers
- **Location**: `server/src/middleware/auth.ts:6`
- **Risk**: Medium
- **Description**: `request.log.info({ headers: request.headers })` logs all headers
- **Impact**: Potential PII/tokens in production logs
- **Fix**: Remove debug logging or sanitize sensitive headers before logging
- **Status**: Open
- **Added**: 2026-01-14

### UX-001: No JWT Refresh Mechanism
- **Location**: JWT design
- **Risk**: Low
- **Description**: Token expires after 7 days with no refresh flow
- **Impact**: Active users forced to re-login weekly
- **Fix**: Implement refresh token rotation pattern
- **Status**: Open
- **Added**: 2026-01-14

---

## P2 — Medium Priority

### SEC-007: Timing Attack on Login
- **Location**: `server/src/routes/auth.ts:32-46`
- **Risk**: Low
- **Description**: Early return when user not found vs. password mismatch has different timing
- **Impact**: Attacker can enumerate valid email addresses
- **Fix**: Use constant-time comparison, always run password check (against dummy hash if no user)
- **Status**: Open
- **Added**: 2026-01-14

### SEC-008: No Explicit CSRF Protection
- **Location**: Cookie-based auth design
- **Risk**: Low
- **Description**: Relies on `sameSite: lax` only, no explicit CSRF tokens
- **Impact**: Potential CSRF on state-changing GET requests (if any added)
- **Fix**: Add CSRF token for mutations, or ensure all mutations are POST/PUT/DELETE
- **Status**: Open
- **Added**: 2026-01-14

### SEC-009: Session Fixation Potential
- **Location**: `server/src/routes/auth.ts` (login endpoints)
- **Risk**: Low
- **Description**: Token not regenerated if user was already logged in
- **Impact**: Pre-authentication session could be reused
- **Fix**: Always issue new token on successful login, invalidate old
- **Status**: Open
- **Added**: 2026-01-14

### UX-002: AdminDashboardPage Duplicates Header
- **Location**: `web/src/pages/AdminDashboardPage.tsx`
- **Risk**: Low
- **Description**: Page renders its own header, but AdminLayout already provides one
- **Impact**: Redundant UI, inconsistent logout behavior
- **Fix**: Remove duplicate header from AdminDashboardPage
- **Status**: Open
- **Added**: 2026-01-14

### UX-003: Browser confirm() Dialog
- **Location**: `web/src/pages/admin/FarmersPage.tsx:30`
- **Risk**: Low
- **Description**: Uses native `confirm()` for deactivation confirmation
- **Impact**: Poor UX on mobile, not accessible, not styled
- **Fix**: Replace with custom modal component
- **Status**: Open
- **Added**: 2026-01-14

### UX-004: Hardcoded Stats Values
- **Location**: `web/src/components/landing/Stats.tsx:4`
- **Risk**: Low
- **Description**: Stats section shows hardcoded numbers, not real data
- **Impact**: Misleading in production
- **Fix**: Fetch from API or make configurable
- **Status**: Open
- **Added**: 2026-01-14

---

## P3 — Low Priority (Backlog)

### CODE-001: Duplicate Comment in App.tsx
- **Location**: `web/src/App.tsx:29-30`
- **Risk**: Trivial
- **Description**: `{/* Protected admin routes */}` comment appears twice
- **Fix**: Remove duplicate comment
- **Status**: Open
- **Added**: 2026-01-14

### UX-005: No Empty State UI
- **Location**: `FarmersPage.tsx`, `ProductsPage.tsx`
- **Risk**: Low
- **Description**: No UI message when farmer/product lists are empty
- **Fix**: Add empty state illustration and CTA
- **Status**: Open
- **Added**: 2026-01-14

### UX-006: Minimal Loading States
- **Location**: Various pages
- **Risk**: Low
- **Description**: Loading states show plain "Loading..." text
- **Fix**: Add skeleton loaders or spinner components
- **Status**: Open
- **Added**: 2026-01-14

### INFRA-001: No React Error Boundaries
- **Location**: `web/src/App.tsx`
- **Risk**: Medium
- **Description**: No error boundaries around route components
- **Impact**: Uncaught errors crash entire app
- **Fix**: Add ErrorBoundary component around routes
- **Status**: Open
- **Added**: 2026-01-14

---

## Summary

| Priority | Open | Resolved | Total |
|----------|------|----------|-------|
| P0 | 5 | 0 | 5 |
| P1 | 4 | 0 | 4 |
| P2 | 6 | 0 | 6 |
| P3 | 4 | 0 | 4 |
| **Total** | **19** | **0** | **19** |

---

## Resolution Log

| ID | Resolved Date | Resolution Notes |
|----|---------------|------------------|
| — | — | No items resolved yet |

---

*Last updated: 2026-01-14*
