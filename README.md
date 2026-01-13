# Virtual Mandi - Trust & Transparency

Virtual Mandi is a batch-based, trust-driven aggregation system designed to facilitate the sale of agricultural products directly from farmers to buyers. Unlike traditional e-commerce marketplaces, it operates on a "batch" model where orders are aggregated and fulfilled in cycles.

## 🌿 Core Philosophy
- **Batch-Based Aggregation**: Not an open marketplace. All activities are centered around discrete batches.
- **Trust & Transparency**: A commitment-driven system where buyers and farmers rely on clear rules and enforcement.
- **Farmer-Centric**: Products are always tied to a specific farmer, emphasizing their story and locality.

## 🏗 Technical Stack (V1)
- **Frontend**: React 18 + TypeScript + shadcn/ui + Tailwind 4.
- **Backend**: Node.js + Fastify + Prisma.
- **Database**: Managed PostgreSQL.
- **Authentication**: Email/Password (Admin), Phone/OTP (Buyer).
- **Payments**: Manual UPI (Two-Stage: 10% commitment -> settlement).
- **Communication**: WhatsApp Click-to-Chat (Event-driven).

## 📝 Non-Negotiable Rules (System Guardrails)
1. **Batch Ownership**: Every order MUST belong to an active batch.
2. **Cutoff Enforcement**: Orders lock automatically at cutoff. No edits or new orders after this point.
3. **Two-Stage Payment**: 10% facilitation fee first, then final settlement after procurement.
4. **Farmer Traceability**: Products are strictly tied to a farmer. No anonymous listings.
5. **No Farmer Login**: Farmers do not manage the system; admins handle all data.
6. **No Direct Buyer–Farmer Chat**: WhatsApp is for event-driven updates only.
7. **Pickup Default**: Pickup is the default mode. Delivery is optional and paid.

## ⏳ Batch Lifecycle
1. **DRAFT**: Admin prepares the batch and products.
2. **OPEN**: Open for buyer orders. Pricing is locked.
3. **CLOSED**: Cutoff reached. Orders are locked.
4. **COLLECTED**: Goods being sourced from farmers. Quantities aggregated.
5. **DELIVERED**: Goods distributed to buyers.
6. **SETTLED**: Final payments recorded and ledger closed.

## ⚖️ Payment Model
- **Stage 1 (Commitment)**: 10% fee paid via manual UPI to confirm intent. status = `COMMITMENT_PAID`.
- **Stage 2 (Settlement)**: Final balance paid once exact weights/quantities are confirmed. status = `FULLY_PAID`.

---

## 🛠 Project Structure
- `/web`: Frontend application (Vite + React).
- `/server`: Backend API (Fastify + Prisma).
- `/shared`: Shared Zod schemas and constants.
- `/docs`: Project documentation and PRD.
