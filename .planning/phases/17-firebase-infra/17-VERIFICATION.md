---
phase: 17-firebase-infra
verified: 2026-01-17T14:30:00Z
status: gaps_found
score: 1/3 must-haves verified
gaps:
  - truth: "Custom domain auth.apnakhet.app resolves to Firebase"
    status: failed
    reason: "Domain auth.apnakhet.app returns NXDOMAIN and .env is using the default firebaseapp.com domain instead."
    artifacts:
      - path: ".env"
        issue: "VITE_FIREBASE_AUTH_DOMAIN is set to apnakhet-app.firebaseapp.com instead of auth.apnakhet.app"
    missing:
      - "DNS A/CNAME records for auth.apnakhet.app"
      - "Correct VITE_FIREBASE_AUTH_DOMAIN value in .env"
  - truth: "Test phone number login works"
    status: failed
    reason: "Cannot be verified programmatically without a client implementation (Phase 19), but the infrastructure setup (custom domain) which supports this is not fully resolved."
    missing:
      - "Functional client to test login flow (Phase 19)"
  - truth: "Real phone number receives SMS (manual verification)"
    status: human_needed
    reason: "Requires manual trigger and physical device check. Execution logs do not provide evidence of this specific test success."
---

# Phase 17: Firebase Infrastructure Verification Report

**Phase Goal:** Configure Firebase project, custom domain, and test access
**Verified:** 2026-01-17
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth   | Status     | Evidence       |
| --- | ------- | ---------- | -------------- |
| 1   | Custom domain `auth.apnakhet.app` resolves | ✗ FAILED   | `nslookup` returns `NXDOMAIN`. |
| 2   | Test phone number login works | ✗ FAILED   | Infrastructure (domain) incomplete; requires Phase 19 client. |
| 3   | Real phone receives SMS | ? HUMAN_NEEDED | Manual verification required. |

**Score:** 0/3 truths verified (1/3 if counting environment variable existence)

### Required Artifacts

| Artifact | Expected    | Status | Details |
| -------- | ----------- | ------ | ------- |
| `.env`   | Firebase credentials | ✓ VERIFIED | Contains `VITE_FIREBASE_*` and service account. |
| `.env`   | Custom domain config | ✗ FAILED | `VITE_FIREBASE_AUTH_DOMAIN` points to default domain. |

### Key Link Verification

| From | To  | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `.env` | Firebase Project | API Key/App ID | ✓ VERIFIED | Keys appear valid and match `apnakhet-app`. |
| `.env` | Custom Domain | `VITE_FIREBASE_AUTH_DOMAIN` | ✗ FAILED | Points to `firebaseapp.com` instead of `auth.apnakhet.app`. |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
| ----------- | ------ | -------------- |
| SEC-01      | PARTIAL| Env vars present but domain config mismatched. |
| SEC-04      | PARTIAL| Custom domain not resolving. |
| CMP-01      | PARTIAL| Infrastructure setup incomplete for Safari/iOS compatibility. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `.env` | 6 | Default domain used | ⚠️ Warning | Prevents testing of custom domain auth flow. |

### Human Verification Required

### 1. SMS Delivery Test

**Test:** Use a Firebase testing tool or temporary client to send a real SMS.
**Expected:** SMS arrives on physical device with correct Sender ID.
**Why human:** Requires physical device and manual interaction.

### Gaps Summary

The core goal of this phase was to establish the Firebase infrastructure, specifically the custom domain `auth.apnakhet.app` to avoid Safari ITP issues. While the Firebase project exists and keys are in `.env`, the custom domain does not resolve (`NXDOMAIN`), and the `.env` file is still configured to use the default `firebaseapp.com` domain. This blocks reliable testing for the intended production environment.

---

_Verified: 2026-01-17_
_Verifier: Claude (gsd-verifier)_
