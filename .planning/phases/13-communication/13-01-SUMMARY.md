# Phase 13 Summary: Communication System

## Objective
Implement a lightweight, audit-capable communication layer using WhatsApp click-to-chat to facilitate coordination between admins, buyers, and farmers.

## Key Accomplishments

### 1. WhatsApp Communication Utility
- Created `web/src/lib/communication.ts` with standardized message templates:
    - `batchOpen`: For notifying buyers when a new batch is available.
    - `paymentRequest`: For requesting commitment (10%) or final (balance) payments.
    - `orderPacked`: For notifying buyers when their order is ready for collection.
    - `payoutConfirmation`: For notifying farmers of sent payments.
    - `supportRequest`: Standard template for buyers seeking help.
- Implemented `getWhatsAppLink` utility to handle URL encoding and formatting.

### 2. Backend Communication Logging
- Created `server/src/routes/logs.ts` with endpoints:
    - `POST /api/logs/communication`: Records a `COMMUNICATION_SENT` event in the `EventLog` table.
    - `GET /api/logs/communication/:entityType/:entityId`: Retrieves history for a specific order, batch, or farmer.
- Integrated with Prisma `EventLog` model to provide a unified audit trail.

### 3. Admin Integration
- **Batches**: Added "Notify Buyers" button to the active batch hero section.
- **Orders**:
    - Added "Request Payment" button with dynamic template selection.
    - Added "Communication History" feed to `OrderDetailPage` to track outreach.
- **Packing**: Added "Notify" button to mark packed orders and message buyers.
- **Procurement**: Added "WhatsApp Farmer" to the aggregation list for easy coordination.
- **Payouts**: Added notification trigger after logging a farmer payout.

### 4. Buyer Integration
- Added "Support" button to the main dashboard.
- Added "Help & Support" button to each `OrderCard` for order-specific queries.

## Verification Results
- [x] WhatsApp links generate correctly with encoded templates.
- [x] Communication attempts are logged to the database via `logsApi`.
- [x] Admin can view the history of messages sent for any specific order.
- [x] Dynamic payment request amount calculation (Advance vs. Balance).

## Technical Notes
- **Channel**: Currently defaults to "WHATSAPP".
- **Recipient Handling**: If a phone number is missing (e.g., in some aggregation views), the system opens a blank WhatsApp chat ("OPEN_CHAT") to allow the admin to select the contact manually.
- **Audit Strategy**: Uses the existing `EventLog` table with a custom `action` and JSON metadata to minimize schema changes while maintaining full transparency.
