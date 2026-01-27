# Phase 27: Identity & Security Foundation - Context

**Gathered:** 2026-01-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Secure the application by intercepting authentication and enforcing approval status at the identity level using Firebase Blocking Functions. This phase delivers the server-side gatekeeping logic and database schema updates.
</domain>

<decisions>
## Implementation Decisions

### Blocking Behavior
- **Hard Block Strategy:** Use Firebase `beforeSignIn` Blocking Function to throw an error if the user's status is not `APPROVED`. Users should never receive a valid ID token if they are `PENDING` or `REJECTED`.
- **Error Feedback:** Throw specific error messages (e.g., `HttpsError`) so the client UI can distinguish between "Pending Approval" and "Account Rejected" to show the appropriate message.
- **Legacy Migration:** All existing users in the database must be migrated to `APPROVED` status (`RegistrationStatus` enum) immediately to prevent locking out current users.
- **Admin Safety:** Explicitly check for `ADMIN` role and allow bypass if needed (safety hatch), though admins should inherently be `APPROVED`.

### Stale Token / Status Check
- **Re-login Required:** Since login is blocked, the "Check Status" mechanism is effectively the user attempting to log in again.
- **Transition:** Upon approval, the next login attempt will succeed. There is no "auto-refresh" or polling because no session exists.
- **Timeout:** Standard Firebase auth timeout applies if they ever get in, but irrelevant for blocked users.

### Audit & Observability
- **Log Level:** Minimal logging of blocked attempts to avoid log spam.
- **Error Code:** Map blocking actions to `401 Unauthorized` semantics where applicable in the protocol (or specific Firebase Auth error codes).
- **Reason Logging:** Log the specific rejection reason (e.g., "Pincode not serviceable", "Manual Rejection") in system logs for debugging.
- **Monitoring:** Rely on standard Firebase/Google Cloud dashboards; no active alerting/paging required.

### Claude's Discretion
- Specific error code strings (e.g., `functions/permission-denied` vs custom codes).
- Exact implementation details of the Cloud Function (using `firebase-functions/v2`).
- Directory structure for Cloud Functions within the monorepo (likely `server/functions` or root `functions`).

</decisions>

<specifics>
## Specific Ideas

- "I want the login to just fail if they aren't approved yet." (Hard Block approach)
- "Admins should never be locked out."
- "Grandfather existing users so we don't break production."

</specifics>

<deferred>
## Deferred Ideas

- Automated SMS on approval (Phase 30).
- Waitlist leaderboard (Out of scope).
- Public registration form (Phase 28).

</deferred>

---
*Phase: 27-identity-security-foundation*
*Context gathered: 2026-01-19*
