# Virtual Mandi - Product Requirements Document (PRD)

## 1. Project Overview
Virtual Mandi is a batch-based, trust-driven aggregation system designed to facilitate the sale of agricultural products directly from farmers to buyers. Unlike traditional e-commerce marketplaces, it operates on a "batch" model where orders are aggregated and fulfilled in cycles.

### 1.1 Core Philosophy
- **Batch-Based Aggregation**: Not an open marketplace. All activities are centered around discrete batches.
- **Trust & Transparency**: A commitment-driven system where buyers and farmers rely on clear rules and enforcement.
- **Farmer-Centric**: Products are always tied to a specific farmer, emphasizing their story and locality.

---

## 2. Technical Stack (V1)
The following stack is selected to enforce rules, minimize ops load, and support solo execution.

### 2.1 Form Factor
- **Web Application**: Mobile-responsive, Admin-first. Single URL, invite-only.

### 2.2 Frontend
- **Framework**: React 18 + TypeScript.
- **UI**: **shadcn/ui** (Radix + Tailwind) - Dense, predictable
- **State**: TanStack Query (Server), Zustand (Local).
- **Forms**: React Hook Form + Zod.

### 2.3 Backend
- **Runtime**: Node.js (LTS).
- **API**: Fastify (Schema-first, predictable).
- **ORM**: Prisma (Explicit migrations, strong relational guarantees).
- **Validation**: Zod (Shared schemas with Frontend).

### 2.4 Database
- **Primary**: PostgreSQL (Managed). Strong constraints & transactions are non-negotiable.

### 2.5 Authentication
- **Admin**: Email + Password (Hardcoded single role).
- **Buyer**: Phone number + OTP (Invite-only flag).
- **Implementation**: Auth.js *or* custom Fastify auth with JWT (httpOnly cookies).

### 2.6 Payments & Communication
- **Payments**: Manual UPI (Two-Stage). System calculates and records, but does not move money or auto-settle.
- **Communication**: WhatsApp Click-to-Chat (Pre-filled, event-driven).
- **Storage**: S3-compatible (AWS S3 / R2 / Supabase Storage).

### 2.7 Infrastructure & Ops
- **Hosting**: Vercel (FE), Railway/Render (BE), Managed Postgres.
- **Observability**: Sentry (Errors), Winston/Pino (Logs), Event Log table (Business events).

---

## 3. Non-Negotiable Rules
- **Batch Ownership**: Every order must belong to an active batch.
- **Cutoff Enforcement**: Orders are locked at the batch cutoff time. No edits or new orders allowed after this point.
- **Two-Stage Payment**:
    - **Stage 1**: 10% commitment fee paid at order placement.
    - **Stage 2**: Final settlement paid after procurement and before packing/delivery.
- **Farmer Restrictions**: No farmer login; no direct buyer-farmer communication.
- **Fulfilment**: Pickup is the default; delivery is an optional, paid service.
- **No Substitutions**: The system does not support product substitutions once an order is locked.

---

## 3. Product Architecture

### 3.1 EPIC 0 — System Foundation
- Repository structure with clear frontend/backend separation.
- Strict environment variable handling.
- Hardcoded system guardrails and constants reflecting non-negotiable rules.

### 3.2 EPIC 1 — Branding & Static Pages ✅ DONE
- **Landing Page**: Explains the Virtual Mandi model, batch cycles, and facilitation fees.
- **Rules Page**: Detailed breakdown of cutoff enforcement, 2-stage payments, and fulfilment.
- **Visual Identity**: Minimalist, factual branding (Logo, Color Palette, Typography).
- **Our Story**: Personal narrative explaining the "why" behind Virtual Mandi.

### 3.3 EPIC 2 — Authentication & Access
- **Admin**: Email/Password authentication for system management.
- **Buyer**: Phone + OTP authentication.
- **Access Control**: Strict route protection based on roles. Invite-only access for buyers.
- **Note**: No farmer authentication or role-editing UI.

### 3.4 EPIC 3 — Farmers & Products
- **Farmer Management**: Name, location, relationship level, and active status.
- **Product Management**: Name, unit, season windows, and mandatory farmer association.
- **Lifecycle**: Deactivating a farmer excludes them from future batches while preserving historical data.

---

## 4. Operational Lifecycle

### 4.1 EPIC 4 — Batch Management (Core)
- **States**: `DRAFT` → `OPEN` → `CLOSED` → `COLLECTED` → `DELIVERED` → `SETTLED`.
- **Enforcement**: Automatic locking at cutoff; no state skipping; no reopening batches.
- **Audit**: Logging of all state transitions.

### 4.2 EPIC 5 — Pricing & Scoping
- Batch-specific pricing, facilitation fees, and MOQs.
- Prices are locked once the batch moves to `OPEN`.

### 4.3 EPIC 6 & 7 — Ordering Flow
- **Visibility**: Buyers see only the current `OPEN` batch.
- **Product Display**: Grouped by farmer with "Farmer Stories" and price breakdowns.
- **Cart**: Enforces MOQ; calculates estimated totals; collects fulfilment preference.
- **Note**: Fulfilment type (Pickup/Delivery) cannot change after cutoff.

---

## 5. Payments & Procurement

### 5.1 EPIC 8 — Two-Stage Payments
- **Commitment (10%)**: Captured at order placement. Status: `COMMITMENT_PAID`.
- **Final Settlement**: Calculated after physical procurement (including delivery). Status: `FULLY_PAID`.
- **Constraint**: No automated refunds or auto-settlement.

### 5.2 EPIC 9 — Aggregation & Procurement
- Aggregation of quantities by batch, farmer, and product.
- Tooling for generating procurement lists and WhatsApp-ready procurement messages for farmers.

---
---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
## 6. Distribution & Payouts

### 6.1 EPIC 10 — Packing & Distribution
- Buyer-wise packing lists generated for `FULLY_PAID` orders only.
- Separation of pickup and delivery workflows.

### 6.2 EPIC 11 — Farmer Payouts
- Farmer ledgers tracking payables per batch.
- Manual payout logging with reference IDs and audit trails.

### 6.3 EPIC 12 — Order Status
- Real-time status tracking for buyers (current stage, payment status, fulfilment type).
- Access to order history (past batches).

---

## 7. Communication System

### 7.1 EPIC 13 — Event Logging & Triggers
- **WhatsApp Integration**: Event-driven messages for batch opening, cutoff reminders, payment requests, and distribution notifications.
- **Log**: Comprehensive event logging for all critical system actions.
- **Tone**: Factual, reference-heavy communication (No conversational chat).

---

## 8. What Is Explicitly OUT of Scope (V1)
The following features are not part of the initial version (V1) to maintain focus and minimize operational complexity:
- Native mobile applications (iOS/Android).
- Integrated third-party payment gateways (using manual UPI instead).
- Real-time location or delivery tracking.
- Product reviews, ratings, or feedback systems.
- Subscription models or recurring orders.
- Multi-language support (English/Primary Local Language as default).
- Automatic payouts to farmers (handled manually).
- Direct buyer–farmer chat or communication.

---

## 9. Stack Summary
> **React + TypeScript (Web) + Fastify (Node) + Prisma + PostgreSQL + WhatsApp + Manual UPI**
