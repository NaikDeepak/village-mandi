# Phase 20: Security Hardening - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

We want to implement standard security hardening to lock down API access and prevent abuse.
This involves enforcing Firebase App Check to ensure only our authorized web client can call the authentication endpoints, tuning rate limits to prevent brute force and SMS pumping attacks, and ensuring we have visibility into security events.

</vision>

<essential>
## What Must Be Nailed

- **App Check Enforcement** - We must verify that requests to our sensitive endpoints are coming from our actual application, not curl or bots.
- **Rate Limit Tuning** - We need to balance strict limits on auth (to save money/prevent abuse) with usability for legitimate users.
- **Security Auditing** - We need to know when security events happen (blocked requests, rate limit hits).

</essential>

<specifics>
## Specific Ideas

- No specific requirements beyond standard best practices.
- We want to avoid over-engineering; standard in-memory rate limiting is acceptable for V1 if Redis adds too much complexity, but we should be aware of the trade-offs. (Note: Phase 18 already set up basic rate limiting, this phase is about tuning and App Check).

</specifics>

<notes>
## Additional Context

- This is the final phase of Milestone 2 (Production & Auth).
- App Check requires registering the web app in Firebase Console (which we did partially in Phase 17, but likely need to enable App Check specifically).
- We need to handle the App Check token on the client and verify it on the server.

</notes>

---
*Phase: 20-security-hardening*
*Context gathered: 2026-01-17*
