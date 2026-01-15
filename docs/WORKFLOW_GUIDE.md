# Village Mandi — End-to-End Workflow Guide

This guide documents the complete operational lifecycle of the Village Mandi marketplace. It covers the weekly cycle from setting up a batch, receiving orders, procuring produce, to final distribution and settlement.

## System Roles

*   **Admin**: Manages farmers, products, batches, pricing, and fulfillment.
*   **Buyer**: Browses the shop, places orders, and tracks status.
*   **Farmer**: Provides produce (managed by Admin in the system).

---

## Phase 0: System Setup (Prerequisites)

Before running a weekly batch, the foundational data must be in place.

### 1. Hub Creation
Hubs are physical locations where aggregation and distribution happen.
*   **Action**: Create a Hub.
*   **Admin UI**: `Settings > Hubs` (or seeded data).
*   **Data**: Name (e.g., "Village Mandi Main"), Address.

### 2. Farmer Onboarding
Register farmers who supply produce.
*   **Action**: Add Farmer profiles.
*   **Admin UI**: `Farmers > Add Farmer`.
*   **Data**: Name, Location, Description, Relationship Level (Self, Family, Friend, Referred).

### 3. Product Catalog
Define the universe of products available from farmers.
*   **Action**: Create Products linked to Farmers.
*   **Admin UI**: `Products > Add Product`.
*   **Data**: Name (e.g., "Alphonso Mango"), Unit (KG, Dozen), Description.
*   **Note**: Products are tied to specific farmers. If two farmers sell mangoes, create two product entries (e.g., "Ramesh's Mangoes", "Suresh's Mangoes").

---

## Phase 1: Batch Planning (The Start of the Week)

The cycle begins by defining what is available for the upcoming week.

### 1. Create Draft Batch
*   **Action**: Initialize a new batch for the week.
*   **Admin UI**: `Batches > Create Batch`.
*   **Fields**:
    *   **Hub**: Select the distribution hub.
    *   **Name**: E.g., "Week 24 - May 2025".
    *   **Cutoff Time**: When ordering closes (e.g., Thursday 10:00 PM).
    *   **Delivery Date**: When distribution happens (e.g., Saturday 5:00 PM).
*   **Status**: Created as `DRAFT`.

### 2. Scope & Price Products
Decide which products are available this week and at what price.
*   **Action**: Add products to the batch.
*   **Admin UI**: `Batches > [Select Batch] > Products`.
*   **Fields per Product**:
    *   **Price**: Base price payable to farmer.
    *   **Facilitation Fee**: % markup for the mandi operations.
    *   **Min/Max Qty**: Optional limits (e.g., MOQ 5 KG).
*   **Outcome**: Products appear in the batch list. Prices are now set for this specific batch.

### 3. Open the Batch
*   **Action**: Make the batch live for buyers.
*   **Admin UI**: `Batches > [Select Batch] > Transition to OPEN`.
*   **Validation**: System checks if cutoff time is in the future.
*   **Notification**: Buyers can now see the shop.

---

## Phase 2: Ordering Window (Buyer Action)

Buyers place their orders during the open window.

### 1. Buyer Access
*   **Action**: Login.
*   **Method**: Phone number + OTP.
*   **Constraint**: Buyer must be "Invited" by admin to access.

### 2. Shopping
*   **Action**: Browse and Add to Cart.
*   **Buyer UI**: `Shop`.
*   **Features**:
    *   See products grouped by Farmer.
    *   Read farmer stories.
    *   Add quantities (respecting MOQ).

### 3. Checkout
*   **Action**: Place Order.
*   **Buyer UI**: `Cart > Checkout`.
*   **Options**:
    *   **Fulfillment**: Pickup or Delivery (if enabled).
*   **Outcome**: Order created with status `PLACED`.

### 4. Order Editing (Optional)
*   **Condition**: Before cutoff time and before payment.
*   **Action**: Buyer modifies order.
*   **Buyer UI**: `Orders > Active > Edit`.
*   **Capabilities**: Add/remove items, change quantities. Emptying cart cancels the order.

---

## Phase 3: Procurement (Post-Cutoff)

Once the cutoff time passes, the admin prepares for sourcing.

### 1. Close the Batch
*   **Action**: Stop new orders.
*   **Admin UI**: `Batches > [Select Batch] > Transition to CLOSED`.
*   **Effect**: Shop closes for this batch. No new orders.

### 2. Payment Verification (Stage 1)
*   **Action**: Verify Commitment Fees.
*   **Admin UI**: `Orders`.
*   **Process**:
    *   Buyer sends 10% commitment via UPI.
    *   Admin verifies receipt.
    *   Admin marks order as `COMMITMENT_PAID`.
    *   Only `COMMITMENT_PAID` orders are counted for procurement.

### 3. Aggregation & Procurement List
*   **Action**: Generate farmer shopping lists.
*   **Admin UI**: `Batches > [Select Batch] > Procurement`.
*   **Features**:
    *   View total quantities required per product.
    *   View breakdown by Farmer.
    *   **WhatsApp**: Click "Copy for WhatsApp" to send requirements to farmers.

---

## Phase 4: Fulfillment (Distribution Day)

Produce arrives at the hub.

### 1. Packing
*   **Action**: Sort produce into buyer crates.
*   **Admin UI**: `Batches > [Select Batch] > Packing`.
*   **Process**:
    *   Select a Buyer.
    *   View their packing list.
    *   Verify items and quantities.
    *   **Status Update**: Mark order as `PACKED`.

### 2. Distribution (Pickup/Delivery)
*   **Action**: Hand over goods to buyer or runner.
*   **Admin UI**: `Batches > [Select Batch] > Packing` (or dedicated Distribution view).
*   **Process**:
    *   Buyer arrives.
    *   Admin marks order as `DISTRIBUTED`.
*   **Batch Status**: Transition batch to `COLLECTED` or `DELIVERED`.

---

## Phase 5: Finance & Settlement

Closing the books for the week.

### 1. Final Payments (Stage 2)
*   **Action**: Log remaining payments from buyers.
*   **Admin UI**: `Orders > [Select Order] > Payments`.
*   **Process**:
    *   Buyer pays balance (Cash/UPI).
    *   Admin logs payment.
    *   Order status becomes `FULLY_PAID`.

### 2. Farmer Payouts
*   **Action**: Pay farmers their share.
*   **Admin UI**: `Batches > [Select Batch] > Payouts`.
*   **Process**:
    *   View "To Pay" balance for each farmer.
    *   Make transfer.
    *   Log payout in system.

### 3. Settle Batch
*   **Action**: Close the cycle.
*   **Admin UI**: `Batches > [Select Batch] > Transition to SETTLED`.
*   **Effect**: Batch is archived. Financials are finalized.

---

## Verification Checklist

Use this checklist to verify the system's health.

- [ ] **Setup**: Can create a dummy farmer and product?
- [ ] **Batch**: Can create a batch and open it?
- [ ] **Ordering**: Can a buyer place an order?
- [ ] **Logic**: Does the system reject orders after cutoff?
- [ ] **Procurement**: Does the aggregation match the orders?
- [ ] **Status**: Do order statuses update correctly (Placed -> Paid -> Packed)?
- [ ] **Payouts**: are farmer balances calculated correctly?
