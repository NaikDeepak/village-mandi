# Phase 19: Client Auth Integration - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

We will implement the standard Firebase Phone Auth flow using the `firebase` web SDK.
1. User enters phone number.
2. Invisible reCAPTCHA verifies they are human (no friction unless suspicious).
3. Firebase sends SMS with OTP.
4. User enters OTP.
5. Client gets ID Token from Firebase.
6. Client sends ID Token to our backend (`POST /auth/firebase-verify`) to get the session JWT.

The goal is to replace the current "mock" OTP flow with this real implementation while keeping the UI clean and simple.

</vision>

<essential>
## What Must Be Nailed

- **Real SMS Delivery** - The transition from mock to real SMS must be seamless.
- **Invisible reCAPTCHA** - This is critical for UX. We don't want users clicking hydrants unless absolutely necessary.
- **Secure Token Exchange** - The handshake with our backend must be robust, handling errors (like invalid tokens) gracefully.

</essential>

<specifics>
## Specific Ideas

- **Resend Cooldown:** The UI MUST enforce a 60-second cooldown on the "Resend OTP" button. This is a vital guardrail against spam/abuse and costs.
- **Error Handling:** If the token exchange fails (e.g., backend down), the user should know, rather than being stuck in a "verified but not logged in" state.

</specifics>

<notes>
## Additional Context

- We are using the `VITE_FIREBASE_*` environment variables configured in Phase 17.
- The backend endpoint `/api/auth/firebase-verify` is already built in Phase 18.
- This is a frontend-heavy phase (React + Firebase SDK).

</notes>

---
*Phase: 19-client-auth*
*Context gathered: 2026-01-17*
