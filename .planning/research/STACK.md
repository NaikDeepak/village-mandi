# Technology Stack: User Onboarding & Waitlist System

**Project:** Village Mandi (v1.2)
**Researched:** 2026-01-19
**Confidence:** HIGH

## Recommended Stack

### Auth Enforcement (The "Gatekeeper")
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Firebase Identity Platform** | N/A | Auth blocking functions | Required to intercept `beforeSignIn` and `beforeCreate` events to check approval status in Postgres. |
| **Firebase Cloud Functions** | v2 | Backend enforcement | Executes the logic to query Postgres via Prisma during the auth handshake. |

### Data Layer
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Prisma** | 7.x | Schema management | Using a `RegistrationStatus` enum on the `User` table is more robust for auth-blocking than a separate waitlist table. |

### Admin UI & Validation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **TanStack Table** | v9 | Admin Data Table | Headless, highly performant for React 19, and works perfectly with Tailwind. |
| **Zod** | v3.24+ | Schema Validation | Standard for React 19 / Fastify; excellent regex support for India-specific validations. |

## Data Modeling Approach

### Recommendation: Single 'User' Table with Status
Instead of a separate `Waitlist` table, add a `status` field to the existing `User` table.

**Rationale:**
1. **Auth Integration**: Firebase Auth creates a record on first phone OTP verify. If you use a separate table, you'll have "ghost" users in Firebase that don't exist in your `User` table.
2. **State Management**: Simplifies the frontend logic for "Your application is pending approval" vs "Access Denied".

```prisma
enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

model User {
  id                String             @id @default(cuid())
  phone             String             @unique
  name              String?
  pincode           String?
  status            RegistrationStatus @default(PENDING)
  createdAt         DateTime           @default(now())
  approvedAt        DateTime?
}
```

## Implementation Details

### 1. Firebase Auth Blocking (Critical Path)
To prevent unapproved users from accessing the app, you must upgrade to **Firebase Authentication with Identity Platform**.

*   **Logic**: In the `beforeSignIn` blocking function:
    1. Extract `phoneNumber` from the event.
    2. Query Postgres (via a shared Prisma client or internal API).
    3. If `status !== 'APPROVED'`, throw a `HttpsError` which prevents the client from receiving an ID token.

### 2. Pincode Validation & Lookup
*   **Validation**: Use Zod regex for 6-digit India pincodes.
    ```typescript
    const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, "Invalid India Pincode");
    ```
*   **Lookup API**:
    *   **Option A (Free)**: `https://api.postalpincode.in/pincode/{PINCODE}`. No API key required, returns Office Name, District, and State.
    *   **Option B (Local)**: For v1.2, a static JSON mapping of target Pincodes is recommended for reliability.

### 3. Admin UI Components
*   **Data Table**: Use `@tanstack/react-table` for the "Leads/Users" list.
*   **Actions**: Implement "Approve" and "Reject" as simple Prisma updates.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Auth** | Blocking Functions | Middleware Check | Middleware checks are easier to implement but Blocking Functions prevent the user from even getting a token, which is more secure. |
| **Data** | Single User Table | Waitlist Table | Separate tables create sync issues between Firebase UIDs and your DB records. |

## Installation

```bash
# Admin UI
npm install @tanstack/react-table

# Firebase Blocking Functions (in /functions directory)
npm install firebase-admin firebase-functions
```

## Sources
- [Firebase Identity Platform Blocking Functions](https://firebase.google.com/docs/auth/extend-with-blocking-functions)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [India Post Pincode API](https://postalpincode.in/Api-Details)
- [Zod String Validation](https://zod.dev/?id=strings)
