# Village Mandi — Roadmap

## Milestone 1: MVP (v1.0)

> Batch-based agricultural marketplace with farmer management, product catalog, and ordering flow.

### Completed Phases

| Phase | Name | Status |
|-------|------|--------|
| 01 | System Foundation | ✅ Complete |
| 02 | Branding & Static Pages | ✅ Complete |
| 03 | Authentication & Access | ✅ Complete |
| 04 | Farmers & Products | ✅ Complete |
| 05 | Batch Management | ✅ Complete |
| 06 | Pricing & Scoping | ✅ Complete |
| 07 | Ordering Flow | ✅ Complete |
| 08 | Two-Stage Payments | ✅ Complete |
| 09 | Aggregation & Procurement | ✅ Complete |
| 10 | Packing & Distribution | ✅ Complete |
| 11 | Farmer Payouts | ✅ Complete |
| 12 | Order Status | ✅ Complete |
| 13 | Communication System | ✅ Complete |
| 14 | Order Editing | ✅ Complete |
| 15 | End-to-End Workflow Guide | ✅ Complete |

### Current Phase

| Phase | Name | Status |
|-------|------|--------|
| - | Milestone 1 Complete | 🎉 Complete |

### Next Milestone

| Phase | Name | Status |
|-------|------|--------|
| - | Post-MVP Enhancements | ⏳ Pending |

---

## Phase Details

### Phase 05 — Batch Management

**Goal:** Implement batch lifecycle with strict state transitions and cutoff enforcement.

**Scope:**
- Batch states: DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED
- Automatic cutoff locking (no orders after cutoff)
- State transition validation (no skipping states, no reopening)
- Audit logging for all state changes
- Admin UI for batch creation and management

**Key Files:**
- `server/src/routes/batches.ts` — Batch API endpoints
- `server/prisma/schema.prisma` — Batch model (already exists)
- `web/src/pages/admin/BatchesPage.tsx` — Batch list
- `web/src/pages/admin/BatchFormPage.tsx` — Create/edit batch

**Dependencies:**
- Requires: Farmers & Products (Phase 04) ✅
- Blocks: Pricing & Scoping (Phase 06)

---

### Phase 06 — Pricing & Scoping

**Goal:** Enable batch-specific pricing with facilitation fees and MOQ.

**Scope:**
- BatchProduct junction table (price, facilitation fee, MOQ per batch)
- Price locking when batch moves to OPEN
- Admin UI for scoping products into batch with pricing
- MOQ validation at order time

**Dependencies:**
- Requires: Batch Management (Phase 05)
- Blocks: Ordering Flow (Phase 07)

---

### Phase 07 — Ordering Flow

**Goal:** Buyer-facing product browsing and cart for current batch.

**Scope:**
- Current OPEN batch visibility for buyers
- Products grouped by farmer with stories
- Cart with MOQ enforcement
- Fulfilment preference (pickup/delivery)
- Order placement (creates order with PENDING status)

**Dependencies:**
- Requires: Pricing & Scoping (Phase 06)
- Blocks: Two-Stage Payments (Phase 08)

---

### Phase 08 — Two-Stage Payments

**Goal:** Implement commitment fee and final settlement tracking.

**Scope:**
- 10% commitment fee calculation at order placement
- Payment status: PENDING → COMMITMENT_PAID → FULLY_PAID
- Manual UPI payment logging by admin
- Final settlement calculation after procurement

**Dependencies:**
- Requires: Ordering Flow (Phase 07)
- Blocks: Aggregation & Procurement (Phase 09)

---

### Phase 09 — Aggregation & Procurement

**Goal:** Aggregate orders for procurement planning.

**Scope:**
- Quantity aggregation by batch/farmer/product
- Procurement lists for admin
- WhatsApp-ready messages for farmers
- Mark products as procured

**Dependencies:**
- Requires: Two-Stage Payments (Phase 08)
- Blocks: Packing & Distribution (Phase 10)

---

### Phase 10 — Packing & Distribution

**Goal:** Generate packing lists and manage distribution.

**Scope:**
- Buyer-wise packing lists (only for FULLY_PAID orders)
- Separation of pickup and delivery workflows
- Mark orders as packed/distributed

**Dependencies:**
- Requires: Aggregation & Procurement (Phase 09)
- Blocks: Farmer Payouts (Phase 11)

---

### Phase 11 — Farmer Payouts

**Goal:** Track farmer payments per batch.

**Scope:**
- Farmer ledger per batch
- Manual payout logging with reference IDs
- Audit trail for all payout actions

**Dependencies:**
- Requires: Packing & Distribution (Phase 10)

---

### Phase 12 — Order Status

**Goal:** Buyer-facing order tracking.

**Scope:**
- Real-time status for current order
- Order history (past batches)
- Payment status visibility

**Dependencies:**
- Requires: Two-Stage Payments (Phase 08)

---

### Phase 13 — Communication System

**Goal:** WhatsApp integration for buyer/farmer communication.

**Scope:**
- WhatsApp click-to-chat with pre-filled messages
- Event-driven message triggers (batch open, cutoff reminder, payment request)
- Comprehensive event logging

**Dependencies:**
- Requires: Order Status (Phase 12)

---

### Phase 14 — Order Editing

**Goal:** Allow buyers to edit placed orders before cutoff.

**Scope:**
- `PATCH /api/orders/:id` endpoint for order editing
- Editable only when: status = PLACED, batch = OPEN, before cutoff
- Allowed edits: add/remove items, change quantities, change fulfillment type
- Auto-cancel order if all items removed
- Audit logging for all edits
- Buyer UI for editing orders (reuse cart/shop components)
- Clear messaging about edit window availability

**Business Rules:**
- Only `PLACED` orders can be edited
- No edits after `COMMITMENT_PAID` (payment locks the order)
- No edits after batch cutoff
- Prices locked per batch (no changes during edit)
- Empty order = auto-cancel

**Dependencies:**
- Requires: Ordering Flow (Phase 07), Order Status (Phase 12)

---

### Phase 15 — End-to-End Workflow Guide

**Goal:** Create a comprehensive guide documenting the complete lifecycle of a batch from creation to settlement.

**Scope:**
- Create detailed step-by-step documentation for the entire batch lifecycle:
  - Batch creation and setup
  - Adding products to the batch
  - Opening the batch
  - Simulating customer orders (2-3 examples)
  - Farmer ordering/procurement generation
  - Packing and distribution workflow
  - Logging payments and settlements
- Verify the end-to-end flow works seamlessly

**Dependencies:**
- Requires: Phase 14 (Order Editing)

---

## Progress Summary

| Category | Completed | Remaining | Total |
|----------|-----------|-----------|-------|
| Phases | 15 | 0 | 15 |
| MVP Progress | 100% | 0% | 100% |

---

*Last updated: 2026-01-15*
