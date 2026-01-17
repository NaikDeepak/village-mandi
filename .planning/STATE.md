# Village Mandi — Project State

> **Living memory**: Accumulated context across sessions. Updated after each phase completion.

---

## Current Position

**Milestone:** 2 (Production & Enhancements)
**Phase:** 19 (Client Auth Integration)
**Plan:** 19-03 (Completed)
**Status:** Phase 19 Complete
**Next Phase:** 20 (Security Hardening)
**Last activity:** 2026-01-17 — Phase 19 complete; Client-side Firebase Auth integrated and verified E2E

Progress: ▓▓▓▓▓▓▓▓▓░ 85%

## Recent Progress

### Milestone 2: Production & Enhancements

#### Phase 19 — Client Auth Integration (Completed)

**What shipped:**
- Plan 19-01: Client Auth Logic (Completed)
  - Installed `firebase` SDK in web workspace.
  - Initialized Firebase client instance.
  - Implemented `usePhoneAuth` hook for OTP lifecycle.
- Plan 19-02: Client Auth UI (Completed)
  - Implemented `PhoneLoginForm` with reCAPTCHA.
  - Updated `api.ts` for backend sync.
  - Replaced legacy mock OTP flow.
- Plan 19-03: End-to-End Verification (Completed)
  - Verified real SMS delivery and login flow.
  - Confirmed user session persistence and backend user creation.

#### Phase 18 — Backend Auth Foundation (Completed)

**What shipped:**
- Plan 18-01: Backend Auth Infrastructure (Completed)
  - Integrated Firebase Admin SDK.
  - Added `firebaseUid` to User model with unique index.
  - Implemented `POST /auth/firebase-verify` for token exchange.
  - Baselined database schema with `0_init` migration.
- Plan 18-02: Security Hardening (Completed)
  - Configured global and route-specific rate limits.
  - Hardened auth endpoints against brute force and SMS pumping.
  - Enabled security headers via Helmet.

#### Phase 17 — Firebase Infrastructure (Completed)

**What shipped:**
- Plan 17-01: Firebase Infrastructure Configuration (Completed)
  - Created Firebase project "apnakhet-app".
  - Enabled Phone Authentication with test numbers.
  - Configured custom domain `auth.apnakhet.app`.
  - Synced `VITE_FIREBASE_*` and `FIREBASE_SERVICE_ACCOUNT_JSON` to Vercel production.
  - Updated local `.env` with Firebase credentials.
- Plan 17-02: Custom Domain Configuration (Completed)
  - Corrected `VITE_FIREBASE_AUTH_DOMAIN` in `.env` to `auth.apnakhet.app`.
  - Updated `.env.production.example` and `web/.env.example` templates.
  - Verified DNS resolution for the custom domain.

#### Phase 16 — Deployment (Completed)

**What shipped:**
- Plan 16-01: Production Configuration (Completed)
  - Created idempotent production seed script `server/scripts/seed.ts`.
  - Created `.env.production.example` for environment variable management.
  - Optimized `vercel.json` for SPA routing and monorepo deployment.
- Plan 16-02: Production Deployment (Completed)
  - Successfully deployed to Vercel: https://village-mandi.vercel.app/
  - Verified landing page is live.

### Milestone 1: MVP (Completed 2026-01-15)

**What shipped:**
- Full batch-based agricultural marketplace.
- 15 Phases completed and verified.
- E2E Verified: Setup → Batch → Order → Procurement → Fulfillment → Settlement.
- Tagged `v1.0` release.

### Phase 15 — End-to-End Workflow Guide (Completed 2026-01-15)

**What shipped:**
- Plan 15-01: Workflow Documentation & Verification
- Created `docs/WORKFLOW_GUIDE.md`: Comprehensive 5-phase operational guide.
- Created `server/scripts/verify-e2e.ts`: Automated script verifying the full batch lifecycle.
- Validated Happy Path: Setup → Batch → Order → Procurement → Fulfillment → Settlement.

### Phase 14 — Order Editing (Completed)

**What shipped:**
- Plan 14-01: Order Editing API (Completed)
- Plan 14-02: Order Editing UI (Completed)
  - Implemented `editOrder` method in `ordersApi`.
  - Added "Edit" button to `OrderCard` with cutoff logic.
  - Created `EditOrderPage` with item management and fulfillment selection.
  - Integrated order cancellation flow with confirmation.
  - Registered routing for the edit page.

**Key files added/modified:**
- `web/src/lib/api.ts` — Added `editOrder`
- `web/src/components/buyer/OrderCard.tsx` — Added Edit button and cutoff logic
- `web/src/pages/buyer/EditOrderPage.tsx` — New page for order management
- `web/src/App.tsx` — Added route for `EditOrderPage`

### Phase 13 — Communication System (Completed 2026-01-15)

**What shipped:**
- Implemented `web/src/lib/communication.ts` with standardized WhatsApp templates.
- Created `POST /api/logs/communication` for audit tracking of outreach.
- Integrated communication buttons across Admin (Batches, Packing, Procurement, Payouts) and Buyer (Dashboard, OrderCard) interfaces.
- Added Communication History feed to Admin `OrderDetailPage`.
- Handled edge cases for missing phone numbers with "OPEN_CHAT" logging.

**Key files added:**
- `web/src/lib/communication.ts` — Utility library
- `server/src/routes/logs.ts` — Backend logging API
- `server/src/schemas/logs.ts` — Zod validation schemas

### Phase 12 — Order Status (Completed 2026-01-15)

**What shipped:**
- Plan 12-01: Buyer Dashboard & Order History
- Implemented `BuyerDashboardPage` with "Active" and "History" views.
- `OrderStatusBar` component for visual tracking of order stages.
- `OrderCard` component with detailed item lists and financial balance summary.
- Standardized `OrderItem` types across frontend and backend (`orderedQty`, `unitPrice`, etc.).
- Patched all Admin and Checkout views to support type changes.

**Key files added:**
- `web/src/components/buyer/OrderStatusBar.tsx` — Progress UI
- `web/src/components/buyer/OrderCard.tsx` — Detailed order summary
- `web/src/pages/BuyerDashboardPage.tsx` — Dashboard implementation

### Phase 11 — Farmer Payouts (Completed 2026-01-15)

**What shipped:**
- Plan 11-01: Farmer Payouts API & UI
- Implemented `GET /batches/:id/payouts` for financial standing per farmer.
- Implemented `POST /batches/:id/payouts` for manual payout logging.
- Integrated with `EventLog` for audit trail.
- Admin `BatchPayoutsPage` with balances table and payout history.

### Phase 10 — Packing & Distribution (Completed 2026-01-15)

**What shipped:**
- Plan 10-01: Packing API & UI
- Added `PACKED` and `DISTRIBUTED` statuses to order lifecycle.
- Created `GET /batches/:id/packing` for buyer-wise packing lists.
- Admin `BatchPackingPage` with quick status updates and print-friendly packing slips.
- 5/5 passing integration tests for packing logic.

### Phase 09 — Aggregation & Procurement (Completed 2026-01-15)

**What shipped:**
- Plan 09-01: Aggregation API & Procurement UI
- Implemented `GET /batches/:id/aggregation` for procurement planning.
- Logic groups confirmed orders (`COMMITMENT_PAID`, `FULLY_PAID`) by farmer and product.
- Admin `BatchProcurementPage` with summary stats and detailed farmer lists.
- "Copy for WhatsApp" feature for easy farmer communication.
- Print-friendly layout for physical procurement checklists.
- Automated tests for aggregation logic (4 tests).

**Key files added:**
- `server/src/routes/aggregation.test.ts` — Integration tests
- `web/src/pages/admin/BatchProcurementPage.tsx` — Procurement UI

### Phase 08 — Two-Stage Payments (Completed 2026-01-15)

**What shipped:**
- Plan 08-01: Payment Logging API & Admin UI
- Implemented `POST /orders/:id/payments` for manual UPI/Cash payment verification.
- Transactional integrity for payment logging, order status updates, and event logging.
- Admin `OrdersPage` with batch and status filtering.
- Admin `OrderDetailPage` with detailed items view and payment form.
- Automated tests for payment status transitions (8 tests).
- Updated frontend API client and shared types.

**Key files added:**
- `server/src/routes/payments.ts` — Payment API
- `server/src/schemas/payments.ts` — Payment validation
- `server/src/routes/payments.test.ts` — Payment integration tests
- `web/src/pages/admin/OrdersPage.tsx` — Order list UI
- `web/src/pages/admin/OrderDetailPage.tsx` — Order details & payment logging UI

### Phase 07 — Ordering (Completed 2026-01-15)

**What shipped:**
- Plan 07-01: Order Placement & Access Control
- Updated access control to allow BUYER role to view current batches and products.
- Implemented `POST /orders` with strict validation (OPEN status, cutoff window, MOQ/MaxOQ).
- Transactional order creation with `OrderItem` and `EventLog` audit trail.
- Implemented `GET /orders/my` for buyer order history.
- 86 passing tests total (including 8 new ordering tests).
- Plan 07-02: Buyer Storefront
- Built responsive Shop page for buyers to browse current batch.
- Grouped products by farmer with custom `ProductCard` component.
- Implemented quantity selection with MOQ/MaxOQ validation.
- Connected storefront to backend `POST /orders` API.
- Plan 07-03: Cart & Checkout Flow
- Persistent `useCartStore` with Zustand and localStorage.
- `CartDrawer` component for side-panel cart management.
- `CheckoutPage` with fulfillment selection and order review.
- `OrderSuccessPage` confirmation view.
- Refactored `ShopPage` to integrate with Checkout flow.

**Key files added:**
- `server/src/routes/orders.ts` — Ordering API
- `server/src/schemas/orders.ts` — Zod schemas for ordering
- `server/src/routes/orders.test.ts` — Integration tests for ordering
- `web/src/pages/buyer/ShopPage.tsx` — Buyer shop interface
- `web/src/pages/buyer/CheckoutPage.tsx` — Checkout interface
- `web/src/pages/buyer/OrderSuccessPage.tsx` — Confirmation view
- `web/src/components/shop/ProductCard.tsx` — Product display component
- `web/src/components/shop/CartDrawer.tsx` — Cart overlay component
- `web/src/stores/cart.ts` — Persistent cart state
- `web/src/components/ui/card.tsx`, `badge.tsx`, `separator.tsx` — UI components
- `web/src/hooks/use-toast.ts` — Notification hook

### Phase 06 — Pricing & Scoping (Completed 2026-01-15)

**What shipped:**
- Plan 06-01: Batch Product Management
- BatchProduct CRUD for DRAFT batches
- Pricing (base price + facilitation %)
- Order limits (minOrderQty, maxOrderQty)
- Relationship validation (Product → Farmer)
- 78 passing tests total

**Key files added:**
- `server/src/routes/batch-products.ts` — Batch Product API
- `server/src/schemas/batch-products.ts` — Zod schemas
- `server/src/routes/batch-products.test.ts` — Integration tests (20 tests)
- `web/src/pages/admin/BatchProductsPage.tsx` — Management UI
- `web/src/components/admin/AddProductToBatchDialog.tsx` — Dialog component

### Phase 05 — Batch Management (Completed 2026-01-15)

**What shipped:**
- Plan 05-01: Hub and Batch backend API
- Hub CRUD with admin-only access
- Batch API with strict state machine (DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED)
- State transition validation (no skipping, no backwards)
- Cutoff enforcement (cannot open batch if cutoff passed)
- EventLog audit trail for all batch state changes
- 58 passing tests including comprehensive state machine tests
- Plan 05-02: Batch Admin UI
- BatchesPage with hero section for current OPEN batch
- Batch list with status badges and filter tabs
- BatchFormPage for create/edit with validation
- Admin navigation link to Batches

**Key files added:**
- `server/src/routes/hubs.ts` — Hub API
- `server/src/routes/batches.ts` — Batch API with state machine
- `server/src/schemas/hubs.ts` — Hub validation
- `server/src/schemas/batches.ts` — Batch validation with VALID_TRANSITIONS
- `server/src/routes/hubs.test.ts` — Hub tests (9 tests)
- `server/src/routes/batches.test.ts` — Batch tests (22 tests)
- `web/src/pages/admin/BatchesPage.tsx` — Batch list with hero
- `web/src/pages/admin/BatchFormPage.tsx` — Create/edit form

### Phase 04 — Farmers & Products (Completed 2026-01-14)

**What shipped:**
- Farmer CRUD with relationship levels (SELF, FAMILY, FRIEND, REFERRED)
- Product CRUD with farmer association
- Soft delete (isActive flag) preserving historical data
- Farmer detail view with associated products
- Backend tests for farmers and products API

**Key files added:**
- `server/src/routes/farmers.ts` — Farmer API
- `server/src/routes/products.ts` — Product API
- `web/src/pages/admin/FarmersPage.tsx` — Farmer list
- `web/src/pages/admin/FarmerFormPage.tsx` — Create/edit farmer
- `web/src/pages/admin/FarmerDetailPage.tsx` — Farmer with products
- `web/src/pages/admin/ProductsPage.tsx` — Product list
- `web/src/pages/admin/ProductFormPage.tsx` — Create/edit product

### Phase 03 — Authentication & Access (Completed 2026-01-14)

**What shipped:**
- Admin email/password login with JWT + httpOnly cookies
- Buyer phone + OTP login flow
- Invite-only buyer access control
- Role-based route protection (ADMIN, BUYER)
- Zustand auth store with persistence
- Biome linting + Husky pre-commit hooks
- GitHub Actions CI workflow

**Key files:**
- `server/src/routes/auth.ts` — Auth endpoints
- `server/src/middleware/auth.ts` — JWT verification
- `web/src/stores/auth.ts` — Auth state
- `web/src/components/auth/ProtectedRoute.tsx` — Route guard

### Phase 02 — Branding & Static Pages (Completed 2026-01-14)

**What shipped:**
- Landing page with hero, story, stats, steps, features
- Rules page with batch lifecycle, payments, fulfilment
- Color palette (mandi-green, mandi-earth, mandi-cream)
- Typography (Inter font family)

### Phase 01 — System Foundation (Completed prior)

**What shipped:**
- Monorepo structure (web, server, shared)
- React 19 + Vite + Tailwind frontend
- Fastify 5 + Prisma 7 backend
- PostgreSQL database schema
- Vercel deployment config

---

## Key Decisions

| Decision | Context | Outcome |
|----------|---------|---------|
| Items replacement strategy for order editing | Simplify API behavior and avoid complex merge logic | PATCH /orders/:id replaces all items, not partial update. qty=0 removes item, empty array cancels order |
| Metadata typing for event logs | Prisma InputJsonValue type incompatible with Record<string, unknown> | Build metadata object dynamically with explicit optional properties matching existing patterns |
| Strict state machine for batches | Business integrity depends on predictable batch lifecycle | VALID_TRANSITIONS constant defines allowed transitions, validation rejects invalid with 400 |
| EventLog for batch transitions | Accountability and audit trail required | Every state change creates EventLog entry with from/to metadata |
| Cutoff validation at DRAFT→OPEN | Prevent opening batches past their cutoff window | Check cutoffAt > now when transitioning to OPEN, reject if past |
| Update restrictions on batches | Prevent changing rules mid-batch | Only DRAFT batches can update name, cutoffAt, deliveryDate |
| Soft delete for farmers/products | Preserve historical data for past batches | isActive flag, not hard delete |
| JWT in httpOnly cookies | Prevent XSS token theft | Secure, sameSite: lax |
| OTP stored plaintext | MVP speed | **Tech debt** — needs hashing |
| No rate limiting | MVP speed | **Tech debt** — security gap |
| Biome over ESLint+Prettier | Single tool, faster | Working well |
| React Router nested routes | Admin layout with outlet | Clean structure |

---

## Open Issues

**Security (P0):**
- [ ] SEC-001: No rate limiting on auth endpoints
- [ ] SEC-002: OTP stored plaintext
- [ ] SEC-003: No OTP attempt limiting
- [ ] SEC-004: Math.random() for OTP generation

**Bugs (P1):**
- [ ] BUG-001: AuthProvider missing finally block
- [ ] BUG-002: Phone state lost on page refresh

**Full list:** See `docs/todo.md`

---

## Technical Context

**Stack:**
- Frontend: React 19, Vite, Tailwind, React Router, Zustand, React Hook Form + Zod
- Backend: Fastify 5, Prisma 7, PostgreSQL, JWT (@fastify/jwt)
- Tooling: Biome, Husky, GitHub Actions

**Database Models (defined):**
- User (id, role, name, email, phone, passwordHash, otpCode, isActive, isInvited)
- Farmer (id, name, location, description, relationshipLevel, isActive)
- Product (id, farmerId, name, unit, description, seasonStart, seasonEnd, isActive)
- Hub (id, name, address, isActive) — implemented in API
- Batch (id, hubId, name, status, cutoffAt, deliveryDate) — implemented in API with state machine
- Order, OrderItem, Payment — not yet implemented

**Codebase map:** See `.planning/codebase/` for detailed analysis

---

## Roadmap Evolution

| Date | Change |
|------|--------|
| 2026-01-17 | Updated for Milestone 2 (Auth & Production) |
| 2026-01-15 | Phase 16 added: Deployment (Milestone 2 start) |
| 2026-01-15 | Phase 15 added: End-to-End Workflow Guide |
| 2026-01-15 | Phase 14 added: Order Editing (allow buyers to edit PLACED orders before cutoff) |

---

## Session Continuity

**Last session:** 2026-01-17
**Work completed:**
- Researched Firebase Auth architecture.
- Defined requirements for Milestone 2.
- Updated Roadmap with 4 new phases (17-20).
- Confirmed Phase 16 Deployment is complete.
- Executed Phase 17: Firebase Infrastructure.
- Configured Custom Auth Domain and verified DNS.

**Next actions:**
1. Execute Phase 18: Backend Auth Foundation.

---
*Last updated: 2026-01-17*
