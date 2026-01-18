---
phase: 23
plan: 23-01
subsystem: SEO
tags: [seo, robots, sitemap, meta-tags, schema]
requires: [22-01]
provides: [seo-assets]
affects: [indexing]
tech-stack:
  added: []
  patterns: [JSON-LD, SEOHead component]
key-files:
  created: []
  modified: [web/public/robots.txt, web/public/sitemap.xml, web/src/components/seo/SEOHead.tsx, web/src/pages/LandingPage.tsx]
decisions:
  - "Explicitly allow popular AI crawlers (GPTBot, etc.) to improve LLM discovery."
  - "Use village-mandi.vercel.app as the primary canonical URL for now."
metrics:
  duration: "89s"
  completed: "2026-01-18"
---

# Phase 23 Plan 01: SEO and AI Bot Discovery Summary

## Objective
Optimize core SEO assets and landing page metadata for search engines and AI agents.

## What Shipped
- **Robots.txt Optimization**: Added explicit allow rules for major AI bots (GPTBot, ChatGPT-User, Google-Extended, CCBot, Anthropic-AI, Claude-Web) and blocked sensitive admin/API paths.
- **Enhanced Sitemap**: Updated `sitemap.xml` with correct production URLs, `lastmod` dates, and logical priorities for better crawl efficiency.
- **Metadata & Schema**: 
  - Added `keywords` meta tag support to `SEOHead`.
  - Updated `SEOHead` with Village Mandi branding and correct canonical URLs.
  - Integrated rich metadata into the Landing Page.
  - Updated JSON-LD Organization schema for better structured data representation.

## Deviations from Plan
None - plan executed exactly as written.

## Decisions Made
- **AI Bot Strategy**: Proactively welcoming AI agents instead of blocking them, ensuring our marketplace content is discoverable by LLM-based search engines.
- **Canonical URLs**: Standardized on the Vercel production domain to ensure consistency across search indices.

## Next Phase Readiness
- Core SEO assets are in place.
- Future plans can focus on dynamic product-level SEO.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
