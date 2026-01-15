# Plan 08-01 Summary: Payment Logging

Implemented the backend and frontend components for the administrative payment logging system.

## Changes

### Backend
- **Schema**: Created `server/src/schemas/payments.ts` for validating payment logs.
- **Routes**:
    - Created `server/src/routes/payments.ts` with `POST /orders/:id/payments`.
    - Restricted to `ADMIN` role.
    - Implements transactional logic: creates `Payment` record, updates `Order.status`, and logs an `EventLog`.
    - Added `GET /orders` and `GET /orders/:id` to `server/src/routes/orders.ts` for administrative views.
- **Tests**: Created `server/src/routes/payments.test.ts` with 8 comprehensive test cases (100% pass).
- **Registration**: Registered `paymentRoutes` in `server/index.ts` and updated test helpers.

### Frontend
- **API Client**: Updated `web/src/lib/api.ts` with `paymentsApi.logPayment` and administrative order fetchers.
- **Admin UI**:
    - `web/src/pages/admin/OrdersPage.tsx`: A list view for admins to see all orders with batch and status filtering.
    - `web/src/pages/admin/OrderDetailPage.tsx`: A detailed view for a single order showing items, payment history, and a form to log new payments (Commitment vs Final).
- **Routing**: Updated `web/src/App.tsx` and `AdminLayout.tsx` to include the new Order Management routes.

## Verification Results

### Backend Tests
```
✓ src/routes/payments.test.ts (8 tests)
```

### Manual Verification Steps (Recommended)
1. Login as Admin.
2. Navigate to "Orders".
3. Select an order in `PLACED` status.
4. Click "Log Payment", select "Commitment", and save.
5. Verify status changes to `COMMITMENT_PAID`.
6. Log "Final Payment" and verify status changes to `FULLY_PAID`.
