# Architecture: Firebase Auth & Postgres Integration

**Researched:** 2026-01-17
**Domain:** Authentication & Identity Management
**Confidence:** HIGH

## Summary
The recommended architecture for integrating Firebase Auth (Phone OTP) into the existing Fastify/Postgres backend is the **Token Exchange Pattern**. Firebase will be used as the Identity Provider (IdP) for the OTP handshake, but the backend will remain the source of truth for user sessions, roles, and relational data.

**Primary recommendation:** Use Firebase strictly for credential verification (OTP) and exchange the resulting Firebase ID Token for a local backend-issued JWT containing Postgres user metadata and roles.

---

## Token Exchange Pattern

This pattern allows the backend to verify the user's identity via Firebase and then issue a session token that the backend fully controls.

### Authentication Flow
1.  **Client-Side OTP:** The client (Mobile/Web) uses the Firebase Client SDK to perform Phone OTP verification.
2.  **ID Token Receipt:** Upon successful OTP, Firebase returns an `idToken` to the client.
3.  **Exchange Request:** The client sends the `idToken` to a specific backend endpoint: `POST /v1/auth/firebase-verify`.
4.  **Backend Verification:**
    -   Backend uses `firebase-admin` SDK to verify the token.
    -   `admin.auth().verifyIdToken(idToken)` returns the `phone_number` and `uid`.
5.  **User Sync/Lookup:**
    -   Backend queries Postgres for a user matching the `phone_number`.
    -   If found: Link `firebase_uid` if not already present.
    -   If not found: Create a new record in the `User` table with the phone number and default role (e.g., `BUYER`).
6.  **Internal JWT Issuance:**
    -   Backend generates a local JWT using `@fastify/jwt`.
    -   **Payload:** `{ "sub": user.id, "role": user.role, "phone": user.phone }`.
7.  **Session Start:** Client receives the internal JWT and uses it for all subsequent API requests.

### Sequence Diagram (Text-Based)
```
Client          Firebase SDK          Fastify Backend          Postgres
  |                  |                      |                     |
  |-- 1. Start OTP ->|                      |                     |
  |<-- 2. Verify Code|                      |                     |
  |-- 3. Success ----|                      |                     |
  |<- 4. Firebase JWT|                      |                     |
  |                  |                      |                     |
  |---------- 5. POST /auth/verify(Token) ->|                     |
  |                  |                      |                     |
  |                  |<-- 6. verifyIdToken -|                     |
  |                  |--- 7. Decoded UID -->|                     |
  |                  |                      |                     |
  |                  |                      |-- 8. Find/Create -->|
  |                  |                      |<- 9. User Record ---|
  |                  |                      |                     |
  |<--------- 10. Internal JWT (200 OK) ----|                     |
  |                  |                      |                     |
```

---

## User Data Model Impact

### Postgres Schema Changes
To support this integration, the `User` table requires one addition:

| Column | Type | Purpose |
|--------|------|---------|
| `firebase_uid` | `VARCHAR(128)` | Unique identifier from Firebase. Used to prevent duplicate accounts if a user changes their phone number later or uses a different sign-in method. |

**Important:** Keep `phone` as the primary lookup for the initial sync, as OTP is bound to the number.

---

## Middleware & Security

### 1. Verification vs. Session Management
-   **Authentication Route:** Only the `/auth/firebase-verify` route needs the `firebase-admin` logic.
-   **Protected Routes:** All other routes (e.g., `/orders`, `/profile`) continue to use the existing `fastify.authenticate` decorator which checks the **Internal JWT**.

### 2. Handling Roles
Since roles (Admin/Buyer) live in Postgres, they are injected into the Internal JWT during the exchange. This avoids the complexity of syncing roles to Firebase "Custom Claims."

### 3. Token Lifecycles
-   **Firebase ID Token:** Short-lived (~1 hour). Only used once during the exchange.
-   **Internal JWT:** Configurable (e.g., 7 days). Can be revoked or refreshed according to your existing Fastify implementation.

---

## Comparison: Token Exchange vs. Firebase Only

| Feature | Token Exchange (Recommended) | Firebase-Only Token |
|---------|-----------------------------|----------------------|
| **User Data** | Stays in Postgres | Partial split (some in Firebase) |
| **Roles** | Managed in DB, fast lookup | Must sync to Firebase Claims |
| **Backend Load** | One-time verify overhead | Verify on *every* request |
| **Dependency** | Loose (Firebase is just a tool) | Tight (Every API call hits Firebase keys) |
| **Implementation** | Medium | Easy (initially) |

---

## Implementation Checklist
- [ ] Install `firebase-admin`.
- [ ] Initialize Firebase Admin with Service Account credentials.
- [ ] Add `firebase_uid` to Postgres `User` table.
- [ ] Create `POST /auth/firebase-verify` endpoint.
- [ ] Update `User` creation logic to handle the new field.

## Sources
- [Firebase Admin Node.js SDK Documentation](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Fastify JWT Documentation](https://github.com/fastify/fastify-jwt)
- [Ecosystem Research: Authentication Best Practices 2026]

## Metadata
**Confidence breakdown:**
- Token Exchange Flow: HIGH (Standard industry practice)
- Fastify Integration: HIGH (Well-supported via plugins)
- Postgres Sync: HIGH (Simple linking table pattern)
