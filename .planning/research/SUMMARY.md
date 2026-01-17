# Research Summary: Firebase Phone Authentication

**Researched:** 2026-01-17
**Domain:** Authentication & Identity
**Context:** Adding SMS OTP to existing React/Fastify/Postgres app (Village Mandi)

## Executive Summary

The research confirms that a **Hybrid Token Exchange** architecture is the optimal approach for Village Mandi. This allows us to leverage Firebase's reliable SMS delivery and "Invisible" reCAPTCHA while maintaining our existing PostgreSQL database as the single source of truth for user data and roles.

**Key Decisions:**
1.  **Architecture:** Client verifies OTP with Firebase → Sends ID Token to Backend → Backend verifies & issues internal JWT.
2.  **Stack:** Firebase v11 (Modular SDK) for React, Firebase Admin v13 for Fastify.
3.  **Critical Constraint:** Must use a **Custom Auth Domain** to prevent Safari ITP issues.
4.  **India Specifics:** Requires DLT registration for production scale; Test numbers essential for dev/review.

## Key Findings

### Stack & Tools
-   **Frontend:** `firebase` ^11.2.0 (Modular)
-   **Backend:** `firebase-admin` ^13.0.0, `@fastify/jwt`
-   **Infrastructure:** Google Cloud Identity Platform (underlying engine)

### Architecture: Token Exchange Pattern
We will **not** replace our internal JWT system. Instead, we use Firebase as an external identity provider.
1.  Client: `signInWithPhoneNumber()` → gets `firebase_token`
2.  Backend: `POST /auth/firebase-verify` → validates token → `SELECT * FROM users WHERE phone = ...`
3.  Response: Backend issues existing `access_token` (JWT) with roles.

### Critical Pitfalls to Avoid
1.  **Safari ITP:** The default `firebaseapp.com` domain often fails on iOS. We MUST configure `auth.villagemandi.com`.
2.  **SMS Fraud:** "SMS Pumping" is a major risk. We must implement rate limiting on the verify endpoint and enable Firebase App Check.
3.  **UX Friction:** "Invisible" reCAPTCHA is mandatory. Fallback to visible challenge only on high risk.

---

## Implications for Roadmap

Based on research, the implementation should be broken down as follows:

### Phase 1: Infrastructure & Configuration
-   **Rationale:** Foundation must be secure before code. Safari support requires DNS changes which take time to propagate.
-   **Tasks:**
    -   Create Firebase Project & Upgrade to Blaze (for SMS).
    -   Configure **Custom Auth Domain** (DNS).
    -   Generate Service Account for Backend.
    -   Whitelist Test Phone Numbers (Development & App Review).

### Phase 2: Backend Foundation
-   **Rationale:** The API must be ready to accept tokens before the frontend can be switched over.
-   **Tasks:**
    -   **Migration:** Add `firebase_uid` column to `User` table (unique, nullable).
    -   **Middleware:** Implement `fastify-firebase` plugin (Admin SDK).
    -   **Endpoint:** Create `POST /auth/firebase-verify` with "Upsert" logic (Find or Create User).

### Phase 3: Frontend Implementation
-   **Rationale:** React components need the backend endpoint to complete the login loop.
-   **Tasks:**
    -   Create `usePhoneAuth` hook (manage Recaptcha & ConfirmationResult).
    -   Replace Mock OTP page with real Firebase OTP input.
    -   Handle "User Not Registered" vs "Login" flows gracefully.

### Phase 4: Security Hardening (Pre-Production)
-   **Rationale:** Prevent financial loss from SMS fraud before going live.
-   **Tasks:**
    -   Enable **Firebase App Check** (Web).
    -   Configure `fastify-rate-limit` on verify endpoint.
    -   Set up Budget Alerts in Google Cloud Console.

**Research Flags:**
-   **DLT Registration (India):** This is an external bureaucratic process. If strict SMS templates are needed immediately, this might block "Production" release but not development.
-   **Safari Testing:** Requires a deployed environment (staging) with the custom domain; difficult to test on localhost.
