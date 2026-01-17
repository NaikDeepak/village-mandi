# Requirements: Village Mandi - Firebase Auth Integration

**Defined:** 2026-01-17
**Core Value:** Farmer-centric experience (Trust & Transparency). Reliable auth ensures buyers can access this trusted marketplace.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication Core

- [ ] **AUTH-01**: User can request OTP via SMS for a given phone number (Firebase SDK)
- [ ] **AUTH-02**: User can verify 6-digit OTP code (Firebase SDK)
- [ ] **AUTH-03**: User is verified via Invisible reCAPTCHA to prevent bots (with visible fallback)
- [ ] **AUTH-04**: Client exchanges Firebase ID Token for internal Backend Session JWT (`POST /auth/firebase-verify`)
- [ ] **AUTH-05**: Backend automatically creates Postgres User record if phone number is new (Sync-on-Login)
- [ ] **AUTH-06**: UI enforces 60-second cooldown before "Resend OTP" is enabled

### Security & Infrastructure

- [ ] **SEC-01**: Developer/Reviewer phone numbers are whitelisted in Firebase Console (Bypass SMS/Cost)
- [ ] **SEC-02**: Firebase App Check is enabled on Web client to prevent unauthorized API usage
- [ ] **SEC-03**: Backend Rate Limiting is active on `/auth/firebase-verify` (e.g., 5 attempts per IP/hour)
- [ ] **SEC-04**: Custom Auth Domain `auth.apnakhet.app` is configured for Safari/iOS compatibility

### Compliance

- [ ] **CMP-01**: DLT Registration completed for Indian SMS delivery (Sender ID & Templates)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Authentication
- **AUTH-V2-01**: WhatsApp-based OTP fallback (via alternative provider)
- **AUTH-V2-02**: Biometric login (Passkeys)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Email Login for Buyers | Phone-first audience, simpler flow |
| Social Login (Google/FB) | Not relevant for target rural/semi-urban buyer demographic |
| Custom SMS Provider | Using Firebase default pipeline for V1 complexity reduction |

## Traceability

Which phases cover which requirements. Updated by create-roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | - | Pending |
| AUTH-02 | - | Pending |
| AUTH-03 | - | Pending |
| AUTH-04 | - | Pending |
| AUTH-05 | - | Pending |
| AUTH-06 | - | Pending |
| SEC-01 | - | Pending |
| SEC-02 | - | Pending |
| SEC-03 | - | Pending |
| SEC-04 | - | Pending |
| CMP-01 | - | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 0
- Unmapped: 11 ⚠️

---
*Requirements defined: 2026-01-17*
