---
phase: 24-rebrand-and-domain-migration-to-apnakhet-app
verified: 2026-01-18T16:30:00Z
status: passed
score: 7/7 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 4/7
  gaps_closed:
    - "User-facing text reflects 'Apna Khet' branding across all pages"
    - "Communication templates reflect new brand"
    - "SEO tags reflect new domain consistently (overrides fixed)"
  gaps_remaining: []
  regressions: []
---

# Phase 24: Rebrand and Domain Migration Verification Report

**Phase Goal:** Update branding to ApnaKhet and migrate domain to apnakhet.app
**Verified:** 2026-01-18
**Status:** ✓ PASSED
**Re-verification:** Yes — after gap closure

## Goal Achievement

### Observable Truths

| #   | Truth                                      | Status      | Evidence                                                                 |
| --- | ------------------------------------------ | ----------- | ------------------------------------------------------------------------ |
| 1   | SEO tags reflect new domain                | ✓ VERIFIED  | `SEOHead.tsx` defaults and `sitemap.xml` updated to `apnakhet.app`.      |
| 2   | Robots.txt points to correct sitemap       | ✓ VERIFIED  | `robots.txt` points to `https://apnakhet.app/sitemap.xml`.               |
| 3   | Sitemap uses apnakhet.app domain           | ✓ VERIFIED  | All `<loc>` entries in `sitemap.xml` use the new domain.                 |
| 4   | PWA manifest exists with correct branding  | ✓ VERIFIED  | `manifest.json` uses "Apna Khet" name and branding colors.               |
| 5   | Vercel rewrites support custom domain      | ✓ VERIFIED  | `vercel.json` configured; user confirmed domain setup in Vercel.         |
| 6   | User-facing text reflects "Apna Khet"      | ✓ VERIFIED  | No "Village Mandi" matches in `web/src`. `brand.ts` used for dynamic name.|
| 7   | Communication templates reflect new brand  | ✓ VERIFIED  | `communication.ts` updated with "Apna Khet" templates.                   |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                     | Expected                      | Status      | Details                                                                 |
| ---------------------------- | ----------------------------- | ----------- | ----------------------------------------------------------------------- |
| `web/src/components/seo/SEOHead.tsx` | Updated metadata defaults     | ✓ VERIFIED  | Defaults to Apna Khet and apnakhet.app.                                 |
| `web/public/robots.txt`      | Correct sitemap directive     | ✓ VERIFIED  | Points to new domain sitemap.                                           |
| `web/public/sitemap.xml`     | Correct domain URLs           | ✓ VERIFIED  | All URLs updated to apnakhet.app.                                       |
| `web/public/manifest.json`   | PWA branding                  | ✓ VERIFIED  | Valid JSON with Apna Khet branding.                                     |
| `web/src/config/brand.ts`    | Centralized brand config      | ✓ VERIFIED  | Name: 'Apna Khet', Email: 'hello@apnakhet.app'.                         |
| `web/src/pages/LandingPage.tsx` | Branding update               | ✓ VERIFIED  | `SEOHead` title updated to "Apna Khet...".                              |
| `web/src/pages/RulesPage.tsx`   | Branding update               | ✓ VERIFIED  | No hardcoded "Village Mandi"; uses `brand.name` or "Apna Khet".         |
| `web/src/lib/communication.ts`  | Branding update               | ✓ VERIFIED  | All WhatsApp templates updated.                                         |

### Key Link Verification

| From          | To             | Via                 | Status      | Details                                      |
| ------------- | -------------- | ------------------- | ----------- | -------------------------------------------- |
| `robots.txt`  | `sitemap.xml`  | Sitemap directive   | ✓ VERIFIED  | `https://apnakhet.app/sitemap.xml`           |
| `index.html`  | `manifest.json`| `<link>` tag        | ✓ VERIFIED  | Linked correctly on line 10.                 |
| `SEOHead.tsx` | `apnakhet.app` | Canonical/OG tags   | ✓ VERIFIED  | Uses `https://apnakhet.app`.                 |

### Anti-Patterns Found

None. A recursive grep for "Village Mandi" in the `web/` directory returned no results in source files.

### Human Verification Required

| Test                                      | Expected                                  | Why Human                               |
| ----------------------------------------- | ----------------------------------------- | --------------------------------------- |
| Verify `apnakhet.app` loads in browser    | Site loads correctly with SSL             | Requires external network access.       |
| Verify "Add to Home Screen" on mobile     | PWA shows "Apna Khet" name and icon       | Requires physical device testing.       |
| Verify DNS propagation for `auth.apnakhet.app` | Resolves to Firebase                      | External DNS check.                     |

### Gaps Summary

All previously identified gaps have been closed. The transition from "Village Mandi" to "Apna Khet" is complete across all user-facing components, SEO metadata, PWA configuration, and external communication templates. The system is structurally ready for the production migration to the new domain.

---

_Verified: 2026-01-18_
_Verifier: Claude (gsd-verifier)_
