# Codebase Concerns

**Analysis Date:** 2026-01-14

## Tech Debt

**Duplicate Server Files:**
- Issue: `server/index.ts` and `api/index.ts` are 100% identical
- Files: `server/index.ts`, `api/index.ts`
- Why: One for local dev, one for Vercel serverless
- Impact: Changes must be made in two places, easy to get out of sync
- Fix approach: Create shared module imported by both, or use single entry point with conditional logic

**Type Suppressions in Database Client:**
- Issue: Two `@ts-ignore` comments to suppress Prisma 7 adapter type errors
- Files: `server/db.ts` (lines 28, 33)
- Why: Prisma 7 driver adapter is experimental
- Impact: Type safety reduced for database operations
- Fix approach: Monitor Prisma updates for stable adapter types, then remove suppressions

**Untyped Vercel Handler:**
- Issue: Handler exports use `any` type for request/response
- Files: `server/index.ts` (line 41), `api/index.ts` (line 41)
- Why: Quick setup without Vercel type definitions
- Impact: No type safety for serverless handler
- Fix approach: Install `@vercel/node` types and use proper types

**Installed but Unused Dependencies:**
- Issue: Several packages installed but not used in code
- Files: `web/package.json`
- Packages: `@tanstack/react-query`, `zustand`, `@supabase/supabase-js`
- Impact: Bundle size, confusion about architecture
- Fix approach: Either implement or remove unused dependencies

## Known Bugs

**Markdown Code Fences in Source File:**
- Symptoms: TypeScript compilation error (syntax error)
- Trigger: Building or running web application
- Files: `web/src/components/layout/Navbar.tsx` (lines 1 and 83)
- Workaround: Manually remove the triple backticks
- Root cause: Markdown formatting accidentally included in source file
- Fix: Remove lines 1 and 83 (the ``` markers) from Navbar.tsx

## Security Considerations

**No Authentication Middleware:**
- Risk: API endpoints have no authentication enforcement
- Files: `server/index.ts` - no auth middleware registered
- Current mitigation: Only `/health` endpoint exists (public)
- Recommendations:
  - Add JWT verification middleware before building protected routes
  - Use `ADMIN_PASSWORD` and `JWT_SECRET` from env
  - Implement role-based access (ADMIN vs BUYER per schema)

**No CORS Configuration:**
- Risk: API cannot be called from frontend on different origin
- Files: `server/index.ts` - no CORS plugin
- Current mitigation: None (will fail when frontend calls API)
- Recommendations: Add `@fastify/cors` plugin with appropriate origins

**No Input Validation:**
- Risk: API endpoints vulnerable to malformed input
- Files: `server/index.ts` - only health endpoint, no validation
- Current mitigation: Minimal API surface
- Recommendations: Use Zod schemas from shared for request validation

## Performance Bottlenecks

**No Current Issues:**
- Project is in early stage with minimal functionality
- Database uses appropriate indexes via Prisma schema
- No performance concerns identified yet

## Fragile Areas

**Prisma Driver Adapter Setup:**
- Files: `server/db.ts`
- Why fragile: Uses experimental Prisma 7 features with type suppressions
- Common failures: Type mismatches, adapter compatibility issues
- Safe modification: Test database operations after any Prisma updates
- Test coverage: None

## Scaling Limits

**No Current Limits:**
- Project not deployed to production yet
- Supabase free tier limits apply when deployed:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth/month

## Dependencies at Risk

**React 19 (Release Candidate):**
- Risk: Using cutting-edge React version
- Files: `web/package.json` - React 19.2.0
- Impact: Potential breaking changes, ecosystem compatibility issues
- Migration plan: Monitor React 19 stable release, update when available

**Prisma 7 (Experimental Features):**
- Risk: Using driver adapters preview feature
- Files: `server/prisma/schema.prisma`, `server/db.ts`
- Impact: API may change in minor versions
- Migration plan: Monitor Prisma releases for stable driver adapter support

## Missing Critical Features

**No Test Coverage:**
- Problem: Zero test files in project
- Current workaround: Manual testing only
- Blocks: CI/CD pipeline, confident refactoring
- Implementation complexity: Medium (need to set up Vitest + Testing Library)

**No API Routes:**
- Problem: Only `/health` endpoint exists
- Current workaround: None (frontend has no API to call)
- Blocks: Core application functionality
- Implementation complexity: High (need auth, validation, business logic)

## Test Coverage Gaps

**All Areas Untested:**
- What's not tested: Everything
- Risk: Regressions undetected, business rules not verified
- Priority: High
- Difficulty to test: Medium (standard React + Node testing)

**Priority Testing Targets:**
1. `shared/constants.ts` - Business rules (10% fee, batch status)
2. API endpoints (when built) - CRUD operations
3. React components - User interactions
4. Prisma seed - Data integrity

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
