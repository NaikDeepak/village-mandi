# Phase 10 — Packing & Distribution

## Goal
Generate buyer-wise packing lists and manage the distribution workflow (pickup/delivery).

## Context
After procurement is complete (Phase 09), the fresh produce must be sorted and packed for individual buyers. Only orders that are `FULLY_PAID` should be included in the packing and distribution workflow.

## Scope
- **Buyer-wise Packing Lists**: Generate lists of items per buyer for sorting.
- **Workflow Management**: Track which orders are packed and which are ready for distribution.
- **Fulfillment Types**:
  - **PICKUP**: Support hub-based collection.
  - **DELIVERY**: Support home delivery tracking.
- **Order Status Updates**: Transition orders from `FULLY_PAID` to `PACKED` to `DISTRIBUTED`.

## Dependencies
- Requires: Aggregation & Procurement (Phase 09) ✅
- Blocks: Farmer Payouts (Phase 11)

## Technical Strategy
- Backend:
  - Add `PACKED` and `DISTRIBUTED` statuses to `Order` model in Prisma.
  - Implement endpoints to bulk-update order status for packing/distribution.
  - Implement an endpoint to fetch packing data grouped by buyer.
- Frontend:
  - Create `BatchPackingPage` for admins to view all buyers and their items.
  - Implement "Mark as Packed" and "Mark as Distributed" actions.
  - Add print-optimized packing slips for individual buyers.

## Key Files
- `server/src/routes/packing.ts` (New)
- `web/src/pages/admin/BatchPackingPage.tsx` (New)
- `server/prisma/schema.prisma` (Update OrderStatus)
