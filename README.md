# Virtual Mandi - Trust & Transparency

A batch-based, trust-driven aggregation system for connecting farmers directly to buyers.

## 🌿 Philosophy
**"Trust & Transparency"** is our core. Unlike standard e-commerce, every product is linked to a specific, known Farmer. We operate as a facilitator, not just a marketplace.

## 🏗 System Architecture
- **Web (Frontend):** React + TypeScript (Mobile-responsive, Admin-first).
- **Server (Backend):** Fastify + Prisma + PostgreSQL.
- **Shared:** Common schemas and constants.

## 📝 Non-Negotiable Rules (The Guardrails)
1. **Batch-Based Ordering:** All orders MUST belong to a specific aggregate batch.
2. **Hard Cutoffs:** Orders lock automatically at the batch cutoff time. No edits allowed after locking.
3. **Two-Stage Payment:**
    - **Stage 1:** 10% commitment fee (Facilitation Fee).
    - **Stage 2:** Final settlement (Farmer's base price + delivery).
4. **Farmer Traceability:** Products are strictly tied to a Farmer. No anonymous listings.
5. **No Farmer Login:** Farmers do not manage the system; admins handle all farmer data/listings.
6. **No Direct Communication:** No private buyer-farmer chat. WhatsApp is for event-driven updates only.
7. **Nominal Facilitation Fee:** We charge a small fee on top of the Farmer's Base Price.
8. **Pickup Default:** Pickup is the default mode. Delivery is optional and paid.

## ⏳ Batch Lifecycle
1. **Draft:** Admin prepares the batch and products.
2. **Active:** Open for buyer orders.
3. **Locked:** Cutoff reached. No more orders or edits.
4. **Processing/Procurement:** Goods being sourced from farmers.
5. **Fulfilled:** Final settlement paid and goods delivered/picked up.

## ⚖️ Payment Model
- ** Commitment (10%):** Paid via manual UPI to confirm intent.
- ** Settlement:** Balance paid once the exact weights/quantity are confirmed at procurement.
