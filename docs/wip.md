# Work In Progress (WIP)

> **Short-term memory**: Track tasks for the current epic. Once the epic is complete, move completed items to `completed.md` and clear this file.

---

## Current Epic: EPIC-3 — Farmers & Products

### Tasks

- [x] **Farmer Management** — Admin CRUD for farmers
  - [x] Backend: GET /farmers (list all farmers)
  - [x] Backend: GET /farmers/:id (get single farmer)
  - [x] Backend: POST /farmers (create farmer)
  - [x] Backend: PUT /farmers/:id (update farmer)
  - [x] Backend: DELETE /farmers/:id (soft delete - set isActive=false)
  - [x] Frontend: Farmer list page (admin)
  - [x] Frontend: Farmer create/edit form
  - [ ] Frontend: Farmer detail view with products

- [x] **Product Management** — Admin CRUD for products (farmer-bound)
  - [x] Backend: GET /products (list all products, filter by farmer)
  - [x] Backend: GET /products/:id (get single product)
  - [x] Backend: POST /products (create product with required farmerId)
  - [x] Backend: PUT /products/:id (update product)
  - [x] Backend: DELETE /products/:id (soft delete - set isActive=false)
  - [x] Frontend: Product list page (admin)
  - [x] Frontend: Product create/edit form
  - [x] Frontend: Farmer dropdown for product assignment

- [x] **Data Validation & Business Rules**
  - [x] Validate farmer fields (name required, location required, relationship level enum)
  - [x] Validate product fields (name required, unit required, farmerId required)
  - [x] Ensure products cannot be created without farmer association
  - [x] Soft delete preserves historical data (isActive=false, not hard delete)

---

## Summary

| Category | Completed | Pending | Total |
|----------|-----------|---------|-------|
| Farmer Management | 7 | 1 | 8 |
| Product Management | 8 | 0 | 8 |
| Data Validation | 4 | 0 | 4 |
| **Total** | **19** | **1** | **20** |

---

## Senior Engineer UI Review (2026-01-14)

### Architecture Strengths

- **Clean separation of concerns**: Auth logic in Zustand stores, API layer abstracted in `lib/api.ts`, components well-organized
- **Type safety**: Zod schemas for form validation (admin login, buyer phone, OTP), TypeScript throughout
- **Accessibility**: ARIA labels on interactive elements, keyboard navigation, focus-visible rings, reduced motion support
- **Security**: httpOnly cookies for JWT, invite-only buyer system, role-based route protection via `ProtectedRoute`
- **Progressive enhancement**: Hero image fallback, smooth scrolling with preference detection

### Edge Cases & Issues Identified

| Area | Issue | Severity | Status |
|------|-------|----------|--------|
| `AuthProvider.tsx:30` | Missing `setLoading(false)` in finally block - if `authApi.me()` throws, loading state stays true forever | Medium | Open |
| `AdminDashboardPage.tsx` | Duplicates `AdminLayout` header - redundant logout logic, inconsistent with nested route pattern | Low | Open |
| `VerifyOtpPage.tsx:30` | Phone stored in `location.state` - lost on page refresh, user must restart flow | Medium | Open |
| `FarmersPage.tsx:30` | Uses browser `confirm()` dialog - not accessible, poor UX on mobile | Low | Open |
| `Stats.tsx:4` | Hardcoded stats values - should fetch from API in production | Low | Open |
| `App.tsx:29-30` | Duplicate comment `{/* Protected admin routes */}` | Trivial | Open |

### Production-Readiness Gaps

1. **Rate limiting**: Not implemented for auth endpoints (OTP spam risk)
2. **OTP security**: No max attempts enforcement, no hashing, no expiry countdown display
3. **Error boundaries**: No React error boundaries around routes
4. **Empty states**: No UI when farmer/product lists are empty
5. **Loading states**: Some pages have minimal loading UI (just text)

---

## Notes

- Database schema already exists (Farmer, Product models in Prisma)
- Farmers have: name, location, description, relationshipLevel (SELF/FAMILY/FRIEND/REFERRED), isActive
- Products have: name, unit, description, seasonStart, seasonEnd, isActive, farmerId (required)
- Deactivating farmer should NOT auto-deactivate products (handled at batch level)
- Admin-only routes (ADMIN role required)
- Backend routes and tests added in `server/src/routes/farmers.ts` and `server/src/routes/products.ts`

---

*Last updated: 2026-01-14*
