# Phase 12: Order Status — Context

## Goal
Provide buyers with a clear view of their current order status and full order history across different batches.

## User Stories
- As a **Buyer**, I want to see the status of my active order (Placed, Paid, Packed, Distributed) so I know when to collect it.
- As a **Buyer**, I want to see how much I have paid and if there is any balance left for my current order.
- As a **Buyer**, I want to see a history of all my past orders from previous batches.

## Technical Scope

### 1. Data Model & API
- Use existing `GET /orders/my` endpoint which already returns orders with items, batch, and hub information.
- Ensure the API returns payment history for each order so the buyer can see their payment status.
- Current `Order` status transitions: `PLACED` -> `COMMITMENT_PAID` -> `FULLY_PAID` -> `PACKED` -> `DISTRIBUTED`.

### 2. Frontend Components
- **BuyerDashboardPage**: The main landing page for buyers after login.
  - Active Order section: Show the most recent order if the batch is not yet `SETTLED`.
  - Order History section: List of all past orders.
- **OrderSummaryCard**: A reusable component to show order status, total, and items.
- **PaymentStatusBadge**: Visual indicator of payment progress (10% vs 100%).

### 3. Business Rules
- Orders are "active" if the associated batch is not in `SETTLED` status.
- Payment status should be derived from the `status` field and `payments` array.
