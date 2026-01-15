# Phase 13: Communication System - Context

## Overview
The goal of this phase is to streamline communication between the Virtual Mandi admins, buyers, and farmers. While Phase 09 introduced basic WhatsApp templates for farmers, Phase 13 expands this to buyers and implements a more structured event-driven communication approach.

## Key Communication Points

### Buyer Communication
1. **Batch Open**: Notify all registered buyers that a new batch is open for orders.
2. **Cutoff Warning**: Notify buyers who haven't finished their orders 24h before cutoff.
3. **Commitment Payment**: Request 10% advance after an order is placed.
4. **Final Payment**: Request remaining balance after procurement is complete and prices are finalized.
5. **Collection/Delivery**: Notify buyers that their produce is ready for pickup or out for delivery.

### Farmer Communication
1. **Procurement Request**: Send aggregated lists of products needed (Phase 09).
2. **Payout Confirmation**: Send payment confirmation once payout is logged.

## Technical Strategy
- **WhatsApp Click-to-Chat**: Use the `https://wa.me/` protocol for one-click messaging from the Admin UI.
- **Message Templates**: Maintain standardized templates for consistency.
- **Event Logging**: Every notification sent should be recorded in the `EventLog` table for auditability.
- **Buyer Storefront**: Add "Contact Support" or "WhatsApp Hub Manager" links for buyers.

## Dependencies
- Phase 12 (Order Status) provides the necessary buyer-facing state.
- Phase 08 (Payments) provides the payment state.
