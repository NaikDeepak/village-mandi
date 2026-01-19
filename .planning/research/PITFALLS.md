# Domain Pitfalls: User Onboarding & Invite Systems

**Domain:** User Access Control / Invite-only Systems
**Researched:** 2026-01-19
**Overall Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: "Identity Platform" Pricing Surprise
**What goes wrong:** Upgrading Firebase Auth to Identity Platform for Blocking Functions changes the billing model.
**Why it happens:** Standard Firebase Auth is free for most usage, but Identity Platform has a 50,000 MAU free tier, after which it becomes paid.
**Consequences:** Unexpected costs if the app scales rapidly or experiences bot attacks.
**Prevention:** Monitor MAU in Google Cloud Console and set budget alerts. Use Firebase App Check to mitigate bot registration.

### Pitfall 2: The "Ghost" Auth Record
**What goes wrong:** A user is created in Firebase Auth but the Postgres write fails during the registration step.
**Why it happens:** Non-atomic operations between Firebase (external) and Postgres (internal).
**Consequences:** User exists in Auth but has no profile in DB, causing Blocking Functions to fail or return 500s.
**Prevention:** In the `beforeSignIn` function, handle the "User not found in DB" case gracefully—either auto-create a shell record or redirect to a registration flow.

### Pitfall 3: Stale Status in Client
**What goes wrong:** Admin approves a user, but the client-side app doesn't know until the user re-authenticates.
**Why it happens:** Firebase ID tokens are cached for 1 hour.
**Prevention:** Implement a "Check Status" button or use a Firestore document to sync status changes in real-time if instant access is required.

## Moderate Pitfalls

### Pitfall 1: Pincode Typos
**What goes wrong:** Users enter invalid pincodes, making regional approval impossible.
**Prevention:** Use Zod for 6-digit regex AND integrate a lookup API (like `postalpincode.in`) to verify the district/state during entry.

### Pitfall 2: Blocking Function Latency
**What goes wrong:** Cold starts in Cloud Functions cause slow login times.
**Prevention:** Use Firebase Functions v2 and consider setting `minInstances: 1` if login latency is critical.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Auth Setup** | Forgetting to enable Identity Platform. | Must manually upgrade in Firebase Console before functions will deploy. |
| **Admin Table** | Loading thousands of leads. | Use TanStack Table with server-side pagination from day one. |

## Sources
- [Google Cloud Identity Platform Pricing](https://cloud.google.com/identity-platform/pricing)
- [Firebase Blocking Functions Troubleshooting](https://firebase.google.com/docs/auth/extend-with-blocking-functions#troubleshooting)
