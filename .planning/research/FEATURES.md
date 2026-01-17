# Feature Landscape: Firebase Phone Auth Integration

**Domain:** Authentication / SMS OTP
**Researched:** 2026-01-17
**Confidence:** HIGH

## Overview
This document outlines the specific features and configurations required for a reliable and low-friction Phone+OTP login experience for Village Mandi buyers in India.

## 1. Core Phone Auth Features (Table Stakes)

| Feature | Description | Implementation Detail |
|---------|-------------|-----------------------|
| **Phone OTP** | User enters phone, receives 6-digit code. | Firebase Client SDK (`signInWithPhoneNumber`). |
| **Invisible reCAPTCHA** | Risk-based bot protection without visible challenges. | `RecaptchaVerifier` with `size: 'invisible'`. |
| **Test Whitelisting** | Bypass real SMS for dev/testing/review. | Firebase Console > Auth > Test phone numbers. |
| **Token Exchange** | Swap Firebase ID Token for Backend JWT. | Custom Fastify `/auth/exchange` route. |

## 2. Configuration Deep-Dive

### A. Invisible reCAPTCHA
To ensure a seamless buyer experience, we use the invisible mode. This minimizes friction by only showing a challenge if the user's risk score is high.

**Implementation Pattern:**
```javascript
const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-button-id', {
  'size': 'invisible',
  'callback': (token) => {
    // Proceed to send OTP
  }
});
```

### B. Test Phone Numbers (Limit: 10)
Mandatory for bypassing SMS quotas during development and ensuring Apple/Google App Store reviewers can login without a physical Indian SIM.

- **Format:** E.164 (e.g., `+919876543210`).
- **Fixed Code:** e.g., `123456`.
- **Note:** These numbers do not count against SMS quotas but are limited to 10 per project.

### C. India-Specific Delivery (DLT)
Indian regulations (TRAI) require DLT registration for transactional SMS.
- **Default:** Firebase uses international routes (best effort).
- **High Reliability:** For the "Mandi" scale, we may need to upgrade to **Identity Platform** to use custom Sender IDs (Headers) and register templates on DLT portals (e.g., Vilpower).

## 3. Quotas and Pricing (2026 Estimates)

| Tier | Limit | Cost (India) |
|------|-------|--------------|
| **Free Tier** | 50 SMS / day | $0 |
| **Blaze Plan** | First 50/day free | ~$0.01 - $0.06 per SMS after |
| **Identity Platform** | 50,000 MAU (non-SMS) | SMS always billed per msg after daily free tier |

## 4. Anti-Features (What We Are NOT Doing)
- **Visible Captcha:** Avoid unless invisible verification fails repeatedly.
- **Firebase User Profiles:** We do not store names/photos in Firebase; Postgres is the source of truth.
- **Long OTP Expiry:** OTPs should expire in 5 minutes; UI should have a 60s cooldown for resending.

## 5. Integration Strategy (Downstream Requirements)
- **UID Mapping:** The `firebase_uid` must be stored in the Postgres `users` table.
- **Auto-Registration:** If the UID doesn't exist in Postgres after a successful OTP, the backend must create the user record automatically.

## Sources
- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth) (HIGH)
- [Firebase Pricing 2026](https://firebase.google.com/pricing) (HIGH)
- [Google Cloud Identity Platform - SMS](https://cloud.google.com/identity-platform/docs/web/phone-auth) (HIGH)
- [TRAI DLT Guidelines](https://www.trai.gov.in/) (MEDIUM)
