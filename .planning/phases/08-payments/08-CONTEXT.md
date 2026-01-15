# Phase 08 Context: Two-Stage Payments

## Objective
Implement a two-stage payment system where buyers pay a 10% commitment fee upfront and the remainder after final procurement. Admin will manually log these payments based on UPI transaction screenshots (external to the system).

## Business Rules
1. **Commitment Fee**: 10% of the `estimatedTotal` (rounded).
2. **Order Status Workflow**:
   - `PLACED`: Order just created, no payment yet.
   - `COMMITMENT_PAID`: Admin has verified the 10% commitment fee.
   - `FULLY_PAID`: Admin has verified the final balance payment.
3. **Payment Stages**:
   - `COMMITMENT`: First 10% payment.
   - `FINAL`: Remaining balance after procurement.
4. **Validation**:
   - Payment cannot be logged for `CANCELLED` orders.
   - `FINAL` payment cannot be logged before `COMMITMENT` payment.
   - `COMMITMENT` payment must be exactly 10% of `estimatedTotal` (or at least 10%).

## Technical Implementation
- **API**: `POST /orders/:id/payments` for admin to log payments.
- **Audit**: `EventLog` entries for every payment and status change.
- **Frontend**: Admin Order Management dashboard to track batch fulfillment and payments.

## Dependencies
- Requires: Phase 07 (Ordering Flow) ✅
- Blocks: Phase 09 (Aggregation & Procurement)
