# Phase 27: Identity & Security Foundation - Research

**Researched:** 2026-01-19
**Domain:** Firebase Identity Platform / Cloud Functions v2 / Prisma Auth
**Confidence:** HIGH

## Summary

This phase focuses on shifting the application's security perimeter from the application layer (API) to the identity layer (Firebase Auth). By leveraging **Firebase Blocking Functions (v2)**, we can prevent unapproved users from obtaining a valid ID token entirely. This "Hard Block" strategy ensures that no client-side state or API requests can be made by users who are in a `PENDING` or `REJECTED` state.

**Primary recommendation:** Use Firebase Identity Platform `beforeSignIn` triggers with the `firebase-functions/v2` SDK to validate user status against the Prisma database before allowing a session to be established.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `firebase-functions` | `v2` | Cloud Function triggers | Native support for Identity Platform blocking hooks. |
| `firebase-admin` | `^13.0.0` | Server-side Firebase SDK | Required for verifying user claims and interacting with Auth. |
| `@prisma/client` | `^7.0.0` | Database ORM | Current project standard for database access. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `dotenv` | `^16.x` | Env management | Loading DB credentials in local emulator. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Blocking Functions | API Middleware | API middleware allows token generation; users can still hit the server. Blocking functions are more secure. |
| Firestore only | Prisma/Postgres | We must stay consistent with the "Single Source of Truth" decision (Prisma). |

**Installation:**
```bash
# In the functions directory (to be created)
npm install firebase-functions@latest firebase-admin@latest @prisma/client@latest
```

## Architecture Patterns

### Recommended Project Structure
```
/ (root)
├── functions/           # New Firebase Functions directory
│   ├── src/
│   │   └── index.ts     # blocking function definitions
│   ├── package.json
│   └── tsconfig.json
├── server/              # Existing Fastify backend
└── web/                 # Existing React frontend
```

### Pattern 1: Identity Blocking (Hard Gate)
**What:** Intercepting the `beforeSignIn` event to check the user's `registrationStatus` in the Postgres database via Prisma.
**When to use:** Every sign-in attempt (Phone Auth).
**Example:**
```typescript
// Source: https://firebase.google.com/docs/auth/extend-with-blocking-functions
import { beforeUserSignedIn, HttpsError } from "firebase-functions/v2/identity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateUserApproval = beforeUserSignedIn(async (event) => {
  const user = event.data;
  const dbUser = await prisma.user.findUnique({
    where: { phone: user.phoneNumber } // Phone is verified by Firebase before this hook
  });

  if (!dbUser || dbUser.status === 'PENDING') {
    throw new HttpsError('permission-denied', 'ACCOUNT_PENDING');
  }
  
  if (dbUser.status === 'REJECTED') {
    throw new HttpsError('permission-denied', 'ACCOUNT_REJECTED');
  }

  return {
    customClaims: {
      role: dbUser.role,
      status: dbUser.status
    }
  };
});
```

### Anti-Patterns to Avoid
- **DB Polling in Hook:** Don't implement complex logic or multiple lookups in the blocking function; it blocks the user's login experience.
- **Leaking PII in Errors:** Only return generic error codes (e.g., `ACCOUNT_PENDING`) rather than specific database details.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token Validation | Custom JWT verification | `beforeSignIn` | Firebase handles the crypto; we just provide the logic. |
| Status Checking | Polling API | Successive Login | If blocked, the user just tries logging in again later. |

## Common Pitfalls

### Pitfall 1: Cold Starts & Timeout
**What goes wrong:** Database connection initialization can be slow in serverless functions.
**Why it happens:** Prisma Client instantiation and TCP handshake with Postgres on every cold start.
**How to avoid:** Use a connection pooler (like Supabase's built-in pooler or PgBouncer) and keep the Prisma client instance global (cached outside the handler).

### Pitfall 2: Circular Dependency (Auth -> DB -> Auth)
**What goes wrong:** User exists in Auth but not yet in DB during the very first registration.
**Why it happens:** `beforeSignIn` fires before the user is fully "created" in some flows, or before the client can sync them to the DB.
**How to avoid:** Coordinate with Phase 28 (Registration) to ensure the `User` record is created in Prisma *before* the first `beforeSignIn` succeeds, or handle the "Not Found" case as `PENDING`.

## Code Examples

### Prisma Schema Update
```prisma
enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  // ... existing fields
  status RegistrationStatus @default(PENDING)
}
```

### Migration Strategy (SQL/Prisma)
```typescript
// To be run once to grandfather existing users
await prisma.user.updateMany({
  where: { isInvited: true },
  data: { status: 'APPROVED' }
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| API-level checks | Blocking Functions | Auth v2 / GCIP | Zero unauthorized traffic hits the app servers. |

## Open Questions

1. **Exact Error Codes:** How will the client differentiate between a blocked login and a network error?
   - *Recommendation:* Firebase SDK returns an error object; we must inspect the `code` and `message` properties.
2. **Infrastructure for Functions:** Should we use the existing `vercel.json` functions or a dedicated Google Cloud Functions project?
   - *Recommendation:* Dedicated Firebase Functions project allows better integration with Identity Platform triggers.

## Sources

### Primary (HIGH confidence)
- [Firebase Documentation](https://firebase.google.com/docs/auth/extend-with-blocking-functions) - Blocking Functions API
- [Prisma Documentation](https://www.prisma.io/docs/orm/prisma-schema/data-model/enums) - Enum definitions
- [Google Cloud Identity Platform](https://cloud.google.com/identity-platform/docs/blocking-functions) - Security best practices

### Secondary (MEDIUM confidence)
- Community threads on Prisma in Cloud Functions - Connection management advice.

## Metadata
**Research date:** 2026-01-19
**Valid until:** 2026-07-19
