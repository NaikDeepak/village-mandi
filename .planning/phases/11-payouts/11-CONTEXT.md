# Phase 11: Farmer Payouts - Context

## Objective
Calculate final amounts owed to farmers for a specific batch and provide a mechanism for admins to log manual payouts (UPI/Cash) with audit trails.

## Background
In the Village Mandi workflow:
1. Buyers place orders (Phase 07).
2. Admins aggregate orders to tell farmers what to harvest (Phase 09).
3. Farmers deliver products to the Hub (Phase 09/10).
4. Admins pack and distribute products (Phase 10).
5. **Phase 11**: Admins calculate the final payout for each farmer based on the actual quantities procured and distributed, and record the payments made to them.

## Requirements

### 1. Payout Calculation Logic
- For a given Batch, identify all Farmers who contributed products.
- For each Farmer, calculate:
  - **Gross Payable**: Sum of (`OrderItem.finalQty` OR `OrderItem.orderedQty` * `BatchProduct.pricePerUnit`) for all items belonging to that farmer's products in that batch.
  - **Paid Amount**: Sum of existing `FarmerPayout` entries for this farmer and batch.
  - **Balance Due**: Gross Payable - Paid Amount.

### 2. Payout Logging
- Admins must be able to log a payout manually.
- Data required: `farmerId`, `batchId`, `amount`, `upiReference` (or "CASH"), `paidAt`.
- Status transition: Logging a payout should create an `EventLog` entry.

### 3. User Interface
- **Batch Payouts Page**:
  - Summary card: Total Payouts Owed vs. Total Paid for the batch.
  - Table of Farmers: Name, Total Owed, Total Paid, Balance, Actions (Log Payment).
  - Payout History: A list of all recorded payouts for the batch.
- **Farmer Payout Modal**:
  - Form to record amount and reference ID.

## Technical Considerations
- **Transactional Integrity**: Recording a payout should be atomic.
- **Rounding**: Ensure Indian Rupee (INR) rounding (2 decimal places) is handled consistently.
- **Permissions**: Only ADMINs can view or log payouts.

## Success Criteria
- [ ] Admin can see a clear breakdown of how much is owed to each farmer for a batch.
- [ ] Admin can record a payout with a reference ID.
- [ ] Payouts are reflected immediately in the farmer's balance for that batch.
- [ ] Audit logs (EventLog) are created for every payout.
