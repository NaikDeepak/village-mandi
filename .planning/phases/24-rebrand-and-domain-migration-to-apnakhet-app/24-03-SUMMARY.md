---
phase: 24-rebrand-and-domain-migration-to-apnakhet-app
plan: 03
subsystem: Branding
tags: [rebranding, seo, communication, admin]
requires: [24-02]
provides: [Consistent Apna Khet branding across UI and communications]
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified:
    - web/src/pages/LandingPage.tsx
    - web/src/pages/buyer/ShopPage.tsx
    - web/src/pages/RulesPage.tsx
    - web/src/lib/communication.ts
    - web/src/pages/admin/BatchPackingPage.tsx
    - web/src/pages/admin/BatchPayoutsPage.tsx
duration: 15m
completed: 2026-01-18
---

# Phase 24 Plan 03: Rebrand Hardcoded Strings Summary

## One-liner
Replaced all remaining "Village Mandi" occurrences with "Apna Khet" in SEO titles, user pages, communication templates, and admin reports to ensure brand consistency.

## Decisions Made
- **Farmer Attribution:** Updated fallback farmer name in `ShopPage.tsx` to "Apna Khet Farmer".
- **Communication Templates:** Updated all WhatsApp templates in `communication.ts` to reflect the new brand, ensuring a consistent voice for automated messages.
- **Admin Reports:** Updated receipt footers and notification defaults in admin pages to ensure internal tools also reflect the rebrand.

## Deviations from Plan
None - plan executed exactly as written.

## Verification Results
- `grep -r "Village Mandi" web/src/pages/` confirmed no occurrences remain in page components (excluding `brand.ts` which might hold the original name for reference or is managed separately).
- `grep "Village Mandi" web/src/lib/communication.ts` confirmed all templates are updated.
- Visual inspection of `RulesPage.tsx` confirmed both SEO and visible content (FAQ) use the new brand.

## Next Phase Readiness
The rebrand is now complete across SEO assets, PWA manifest, and hardcoded UI strings. The application is fully prepared for the domain migration to `apnakhet.app`.
