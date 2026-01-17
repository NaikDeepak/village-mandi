# Phase 17: Firebase Infrastructure - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

We set up the project manually in the Firebase console, configure the custom domain `auth.apnakhet.app` to ensure Safari/iOS compatibility, and verify the setup by sending a real SMS to a physical phone number.

The goal is to prove the infrastructure is sound before writing any code. I want to see the SMS arrive on my phone, confirming that the pipes are connected and the Sender ID (if possible) is correct.

</vision>

<essential>
## What Must Be Nailed

- **Custom Domain Resolution** - `auth.apnakhet.app` MUST resolve correctly. This is the critical fix for Safari ITP issues.
- **SMS Delivery Reliability** - We need to see an actual SMS arrive. Test numbers are fine for dev, but this phase must prove the "Real World" path works.
- **Unblocking Development** - We need the API keys and Service Account credentials generated so the next phases (Backend/Client Auth) aren't blocked.

</essential>

<specifics>
## Specific Ideas

- **Real SMS Verification:** While we use test numbers for development, this infrastructure phase should include a manual test with a real number to validate the carrier path.
- No specific requirements otherwise - standard Firebase setup is fine.

</specifics>

<notes>
## Additional Context

- The domain `apnakhet.app` is registered at name.com.
- We are building this for the "Village Mandi" project, but using the "apnakhet" domain for the public face.
- DLT registration is a separate compliance step, but basic SMS might work via international routes for verification.

</notes>

---
*Phase: 17-firebase-infra*
*Context gathered: 2026-01-17*
