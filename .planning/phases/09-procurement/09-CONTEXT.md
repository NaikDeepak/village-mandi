# Phase 09 Context: Aggregation & Procurement

## Objective
Enable administrators to aggregate all confirmed orders (COMMITMENT_PAID) for a batch into procurement lists grouped by farmer and product. This phase provides the data needed to actually go and buy the items from the farmers.

## Business Rules
1.  **Selection Criteria**: Only orders with status `COMMITMENT_PAID` or `FULLY_PAID` should be included in aggregation. `PLACED` orders are considered unconfirmed.
2.  **Aggregation Logic**: Sum `orderedQty` for each `BatchProduct` across all confirmed orders in a specific batch.
3.  **Procurement Status**: Admins should be able to see "Target Quantity" (aggregated orders) vs "Actual Procured Quantity".
4.  **Communication**: Generate formatted text strings for WhatsApp to send to individual farmers (e.g., "Farmer X, we need 50kg of Tomatoes and 20kg of Onions for Batch Y").

## Technical Implementation
- **API**: `GET /batches/:id/aggregation` - Returns aggregated totals for a batch.
- **Frontend**: Admin "Procurement" view for a specific batch.
- **Data Model**: No new Prisma models needed yet, but we might use `finalQty` in `OrderItem` to record actual procurement later (it's already in the schema as an optional field).

## Dependencies
- Requires: Two-Stage Payments (Phase 08) ✅
- Blocks: Packing & Distribution (Phase 10)
