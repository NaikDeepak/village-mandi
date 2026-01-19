---
phase: 23
plan: 23-02
subsystem: SEO
tags: [dynamic-seo, product-schema, faq-schema, json-ld]
requires: [23-01]
provides: [dynamic-metadata]
affects: [indexing, rich-snippets]
tech-stack:
  added: []
  patterns: [Dynamic SEOHead props, FAQPage Schema, ItemList Schema]
key-files:
  created: []
  modified: [web/src/pages/buyer/ShopPage.tsx, web/src/pages/RulesPage.tsx]
decisions:
  - "Implemented ItemList and Product schema on ShopPage to enable rich snippets in search results."
  - "Added FAQPage schema to RulesPage to improve search visibility for operational questions."
metrics:
  duration: "70s"
  completed: "2026-01-18"
---

# Phase 23 Plan 02: Dynamic SEO and Structured Data Summary

## Objective
Implement dynamic SEO for product listings and rules page to enable rich snippets and better indexing.

## What Shipped
- **Dynamic Shop SEO**:
  - Integrated `SEOHead` into `ShopPage`.
  - Implemented dynamic titles and descriptions that reflect the current batch name and delivery date.
  - Added JSON-LD `ItemList` and `Product` schemas to provide structured data for all items in the current batch.
- **Rules Page Optimization**:
  - Integrated `SEOHead` into `RulesPage`.
  - Added JSON-LD `FAQPage` schema covering key operational questions (Batch lifecycle, Cutoff enforcement, Payments).
  - Set specific meta tags for better discovery of commitment rules.

## Deviations from Plan
None - plan executed exactly as written.

## Decisions Made
- **Schema Selection**: Chose `ItemList` for the shop page to represent the collection of products effectively to search engines.
- **Dynamic Context**: Prioritized including the delivery date and batch name in titles to distinguish between different active batches in search results.

## Next Phase Readiness
- SEO foundation for core buyer-facing pages is complete.
- The project is now better prepared for AI bot discovery and search engine rich snippets.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
