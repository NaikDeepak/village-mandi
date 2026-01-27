# Architecture Patterns: User Onboarding & Invite System

**Domain:** User Access Control / Invite System
**Researched:** 2026-01-19
**Overall Confidence:** HIGH

## Recommended Architecture: Identity-Level Gatekeeping

The system uses **Firebase Identity Platform Blocking Functions** as the primary security layer. This architecture ensures that unapproved users never receive a valid Firebase ID token, preventing them from even making requests to protected backend routes.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Firebase Auth** | Handles Phone OTP and blocking logic. | Frontend, Blocking Function |
| **Blocking Function** | Intercepts sign-in; checks Postgres status. | Firebase Auth, Postgres (Prisma) |
| **Fastify API** | Serves app data; verifies tokens. | Postgres, Frontend |
| **Postgres (Prisma)** | Single source of truth for `User.status`. | Blocking Function, Fastify |

### Data Flow

1. **Sign-In Interception**:
   - User verifies phone via OTP.
   - Firebase Auth triggers `beforeSignIn` Blocking Function.
   - **Blocking Function** queries Postgres: `SELECT status FROM User WHERE phone = ...`.
   - If `status !== APPROVED`, function returns `HttpsError`, aborting sign-in.
2. **Post-Auth Registration**:
   - For new users (no record in Postgres), Blocking Function allows `beforeCreate`.
   - Frontend detects successful auth but missing profile.
   - User fills "Register Interest" form -> `POST /v1/users/register`.
   - Fastify creates User record with `status: PENDING`.
3. **Approval**:
   - Admin updates status to `APPROVED` in Postgres.
   - On next login, Blocking Function allows sign-in.

## Schema Patterns (Prisma 7)

```prisma
enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id        String             @id @default(cuid())
  phone     String             @unique
  name      String?
  pincode   String?
  status    RegistrationStatus @default(PENDING)
  createdAt DateTime           @default(now())
}
```

## Anti-Patterns to Avoid

### Anti-Pattern: Middleware-Only Enforcement
**Why bad:** Users can still obtain valid Firebase tokens and potentially probe endpoints or utilize App Check quotas even if 403ed by the backend.
**Instead:** Use Blocking Functions to stop token issuance entirely for unapproved users.

### Anti-Pattern: Separate Waitlist Table
**Why bad:** Managing foreign keys between a `WaitlistEntry` and a `User` record after approval creates unnecessary complexity and race conditions.
**Instead:** Use a single `User` table with a `status` column.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Status Check** | Direct DB query. | DB query with index on `phone`. | Identity Platform MAU costs (50k free). |
| **Pincode Lookup**| External API. | Local JSON mapping. | Cached Geo-service. |

## Sources
- [Firebase Blocking Functions Architecture](https://firebase.google.com/docs/auth/extend-with-blocking-functions)
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
