# Plan 15-01: Address PR #8 Review Comments

We are addressing valid feedback from the automated review of PR #8 (Product Scoping). The fixes span the API client, backend routes, and frontend UI.

## 1. Core & API

- [ ] **Fix 204 Handling in API Client**
  - **File:** `web/src/lib/api.ts`
  - **Issue:** `response.json()` throws on 204 No Content (used in DELETE requests).
  - **Fix:** Check `response.status === 204` before parsing JSON.

## 2. Backend Improvements

- [ ] **Batch Products: Audit Logs & Types**
  - **File:** `server/src/routes/batch-products.ts`
  - **Issue:** Missing `EventLog` for Create/Update/Delete. TypeScript error on `Prisma.BatchProductWhereInput`.
  - **Fix:** Add `logEvent` calls. Fix type import/usage.

- [ ] **Orders: Security & Error Handling**
  - **File:** `server/src/routes/orders.ts`
  - **Issue:** `POST /orders` missing explicit `ensureRole('BUYER')`. Uses `throw Error` instead of `reply.status(400)`.
  - **Fix:** Add `ensureRole`. Refactor validation to use `reply` object.

- [ ] **Packing: Status Logic**
  - **File:** `server/src/routes/packing.ts`
  - **Issue:** Allows invalid status downgrades (e.g., PACKED -> OPEN).
  - **Fix:** Implement validation logic to prevent backward transitions unless explicitly allowed (e.g., purely additive flow).

## 3. Frontend - Buyer Experience

- [ ] **Shop Page: Fulfillment Type**
  - **File:** `web/src/pages/buyer/ShopPage.tsx`
  - **Issue:** `fulfillmentType` state is not passed when navigating to Checkout.
  - **Fix:** Ensure state is passed correctly via `navigate`.

- [ ] **Cart Drawer: UX & A11y**
  - **File:** `web/src/components/shop/CartDrawer.tsx`
  - **Issue:** UI allows decrementing to negative numbers visually before API check. `Escape` key doesn't close drawer.
  - **Fix:** Clamp local quantity state to 0. Add `useHotkeys` or event listener for Escape.

- [ ] **Buyer Dashboard: Logging**
  - **File:** `web/src/pages/BuyerDashboardPage.tsx`
  - **Issue:** Support request logs as `entityType: 'ORDER'` but should be `USER` or global since it's a general inquiry.
  - **Fix:** Change `entityType` to `FARMER` (if related to specific farmer) or `BATCH`, or specific context. Actually, context implies general support, but `logsApi` requires valid types. Will set to `USER` context if available or generic.

## 4. Frontend - Admin Experience

- [ ] **Order Detail: Payments**
  - **File:** `web/src/pages/admin/OrderDetailPage.tsx`
  - **Issue:** Payment amount defaults/validation incorrect for `PLACED` orders. Negative amounts allowed.
  - **Fix:** default to `order.totalAmount`. Add `min(0)` validation to Zod schema.

- [ ] **Add Product to Batch: Max Qty**
  - **File:** `web/src/components/admin/AddProductToBatchDialog.tsx`
  - **Issue:** Logic to clear `maxOrderQty` is buggy (sends `null` incorrectly or UI doesn't reflect).
  - **Fix:** Ensure undefined/null handling is consistent with Zod schema (`optional`).

- [ ] **Orders Page: Error State**
  - **File:** `web/src/pages/admin/OrdersPage.tsx`
  - **Issue:** Error alerts persist even after successful refetch.
  - **Fix:** Clear error state on retry/refresh.
