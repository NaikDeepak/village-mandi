# Village Mandi — Phase 17, Plan 01 Summary

## Objective
Configure Firebase infrastructure for Phone Authentication.

## Status
Completed ✅

## Accomplishments
- **Firebase Project Created**: Initialized "apnakhet-app" project in Firebase Console.
- **Phone Auth Enabled**: Configured Phone Authentication with test numbers (+91 9999999999).
- **Custom Domain Linked**: Added `auth.apnakhet.app` to Firebase Authorized Domains.
- **Environment Configured**:
    - Updated local `.env` with `VITE_FIREBASE_*` keys and `FIREBASE_SERVICE_ACCOUNT_JSON`.
    - Synced all 5 environment variables to **Vercel Production** environment via CLI.
- **Verification**: Confirmed domain resolution to Firebase Auth handler.

## Decisions & Changes
- **Vercel Sync**: Proactively added the environment variables to Vercel to ensure production deployment matches local infrastructure.
- **Service Account**: Stored the full JSON in `FIREBASE_SERVICE_ACCOUNT_JSON` for use in backend token verification (Phase 18).

## Next Steps
- **Phase 18**: Implement Backend Auth Foundation (Firebase Admin SDK integration).
