---
phase: 24-rebrand-and-domain-migration-to-apnakhet-app
plan: 01
subsystem: SEO
tags: [seo, branding, migration]
requires: [23-02]
provides: [rebranded-seo-assets]
affects: [production-deployment]
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified: [web/src/components/seo/SEOHead.tsx, web/public/robots.txt, web/public/sitemap.xml]
decisions: []
metrics:
  duration: 39s
  completed: 2026-01-18
---

# Phase 24 Plan 01: Rebrand and Domain Migration Summary

## One-liner
Updated SEO assets and metadata to reflect the new domain (apnakhet.app) and Apna Khet branding.

## Strategy
Replaced all occurrences of "Village Mandi" with "Apna Khet" and "village-mandi.vercel.app" with "apnakhet.app" in the critical SEO components and configuration files.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update SEOHead defaults | a1ae75a | web/src/components/seo/SEOHead.tsx |
| 2 | Update robots.txt and sitemap | 2e69eef | web/public/robots.txt, web/public/sitemap.xml |

## Deviations from Plan
None - plan executed exactly as written.

## Verification Results
- `grep "apnakhet.app" web/src/components/seo/SEOHead.tsx`: Confirmed updated URLs and branding.
- `grep "apnakhet.app" web/public/robots.txt`: Confirmed sitemap directive points to new domain.
- `grep "apnakhet.app" web/public/sitemap.xml`: Confirmed all location entries use the new domain.

## Next Phase Readiness
The SEO assets are now ready for the domain migration to apnakhet.app.
