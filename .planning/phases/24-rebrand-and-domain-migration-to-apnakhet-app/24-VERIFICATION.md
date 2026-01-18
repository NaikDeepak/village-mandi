---
phase: 24-rebrand-and-domain-migration-to-apnakhet-app
verified: 2026-01-18T16:00:00Z
status: gaps_found
score: 4/7 must-haves verified
gaps:
  - truth: "User-facing text reflects 'Apna Khet' branding across all pages"
    status: failed
    reason: "Multiple pages still have hardcoded 'Village Mandi' strings in SEO overrides and content."
    artifacts:
      - path: "web/src/pages/LandingPage.tsx"
        issue: "SEOHead title prop still says 'Village Mandi'"
      - path: "web/src/pages/buyer/ShopPage.tsx"
        issue: "SEOHead title and hardcoded farmer attribution still use 'Village Mandi'"
      - path: "web/src/pages/RulesPage.tsx"
        issue: "SEOHead, FAQ JSON-LD, and section headers still use 'Village Mandi'"
      - path: "web/src/lib/communication.ts"
        issue: "WhatsApp message templates still use 'Village Mandi'"
    missing:
      - "Update SEOHead titles in LandingPage, ShopPage, and RulesPage"
      - "Replace 'Village Mandi' with 'Apna Khet' in RulesPage content"
      - "Update WhatsApp templates in communication.ts"
      - "Update hardcoded strings in Admin pages (Packing, Payouts)"
  - truth: "SEO tags reflect new domain consistently"
    status: partial
    reason: "While SEOHead defaults are updated, page-specific overrides often omit the new branding."
    artifacts:
      - path: "web/src/pages/LandingPage.tsx"
        issue: "Uses old branding in SEO title"
    missing:
      - "Audit all SEOHead usage for branding consistency"
---

# Phase 24: Rebrand and Domain Migration Verification Report

**Phase Goal:** Update branding to ApnaKhet and migrate domain to apnakhet.app
**Verified:** 2026-01-18
**Status:** ✗ GAPS FOUND
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                      | Status      | Evidence                                                                 |
| --- | ------------------------------------------ | ----------- | ------------------------------------------------------------------------ |
| 1   | SEO tags reflect new domain                | ✓ VERIFIED  | `SEOHead.tsx` defaults and `sitemap.xml` updated to `apnakhet.app`.      |
| 2   | Robots.txt points to correct sitemap       | ✓ VERIFIED  | `robots.txt` points to `https://apnakhet.app/sitemap.xml`.               |
| 3   | Sitemap uses apnakhet.app domain           | ✓ VERIFIED  | All `<loc>` entries in `sitemap.xml` use the new domain.                 |
| 4   | PWA manifest exists with correct branding  | ✓ VERIFIED  | `manifest.json` uses "Apna Khet" name and branding colors.               |
| 5   | Vercel rewrites support custom domain      | ✓ VERIFIED  | User confirmed domain configuration in Vercel.                           |
| 6   | User-facing text reflects "Apna Khet"      | ✗ FAILED    | Hardcoded "Village Mandi" found in `LandingPage`, `ShopPage`, `RulesPage`. |
| 7   | Communication templates reflect new brand  | ✗ FAILED    | `communication.ts` still uses "Village Mandi" in templates.              |

**Score:** 4/7 truths verified

### Required Artifacts

| Artifact                     | Expected                      | Status      | Details                                                                 |
| ---------------------------- | ----------------------------- | ----------- | ----------------------------------------------------------------------- |
| `web/src/components/seo/SEOHead.tsx` | Updated metadata defaults     | ✓ VERIFIED  | Defaults to Apna Khet and apnakhet.app.                                 |
| `web/public/robots.txt`      | Correct sitemap directive     | ✓ VERIFIED  | Points to new domain sitemap.                                           |
| `web/public/sitemap.xml`     | Correct domain URLs           | ✓ VERIFIED  | All URLs updated to apnakhet.app.                                       |
| `web/public/manifest.json`   | PWA branding                  | ✓ VERIFIED  | Valid JSON with Apna Khet branding.                                     |
| `web/src/config/brand.ts`    | Centralized brand config      | ✓ VERIFIED  | Name: 'Apna Khet', Email: 'hello@apnakhet.app'.                         |
| `web/src/pages/LandingPage.tsx` | Branding update               | ✗ PARTIAL   | SEOHead title still says 'Village Mandi'.                               |
| `web/src/pages/RulesPage.tsx`   | Branding update               | ✗ PARTIAL   | Multiple instances of 'Village Mandi' in headers and FAQ.               |
| `web/src/lib/communication.ts`  | Branding update               | ✗ PARTIAL   | WhatsApp templates still use 'Village Mandi'.                           |

### Key Link Verification

| From          | To             | Via                 | Status      | Details                                      |
| ------------- | -------------- | ------------------- | ----------- | -------------------------------------------- |
| `robots.txt`  | `sitemap.xml`  | Sitemap directive   | ✓ VERIFIED  | `https://apnakhet.app/sitemap.xml`           |
| `index.html`  | `manifest.json`| `<link>` tag        | ✓ VERIFIED  | Linked correctly.                            |
| `SEOHead.tsx` | `apnakhet.app` | Canonical/OG tags   | ✓ VERIFIED  | Uses `https://apnakhet.app`.                 |

### Anti-Patterns Found

| File                         | Line | Pattern      | Severity | Impact                                      |
| ---------------------------- | ---- | ------------ | -------- | ------------------------------------------- |
| `web/src/pages/LandingPage.tsx` | 16   | Hardcoded brand| ⚠️ Warning| Inconsistent branding in search results.    |
| `web/src/pages/RulesPage.tsx`   | 29   | Hardcoded brand| 🛑 Blocker| User confusion due to mixed branding.       |
| `web/src/lib/communication.ts`  | 19   | Hardcoded brand| 🛑 Blocker| Brand dilution in external communications.  |

### Human Verification Required

| Test                                      | Expected                                  | Why Human                               |
| ----------------------------------------- | ----------------------------------------- | --------------------------------------- |
| Verify `apnakhet.app` loads in browser    | Site loads correctly with SSL             | Requires external network access.       |
| Verify "Add to Home Screen" on mobile     | PWA shows "Apna Khet" name and icon       | Requires physical device testing.       |
| Verify DNS propagation for `auth.apnakhet.app` | Resolves to Firebase                      | External DNS check.                     |

### Gaps Summary

The core infrastructure and SEO metadata (defaults, robots, sitemap) have been successfully migrated to the new `apnakhet.app` domain and "Apna Khet" branding. However, the rebranding of the application content is incomplete. Several major pages (`LandingPage`, `ShopPage`, `RulesPage`) still contain hardcoded "Village Mandi" strings, particularly in `SEOHead` prop overrides and static text content. Additionally, the WhatsApp communication templates have not been updated. These gaps create a fragmented user experience where the new brand name and old brand name coexist.

---

_Verified: 2026-01-18_
_Verifier: Claude (gsd-verifier)_
