# Completed Work

> **Long-term memory**: Archive of completed epics with their tasks. When an epic is fully done, move its items from `wip.md` to this file.

---

## EPIC-0 — System Foundation ✅

**Completed: Prior to 2026-01-14**

### Tasks Completed

- [x] Repository structure with clear frontend/backend separation (monorepo with web, server, shared workspaces)
- [x] Strict environment variable handling
- [x] Hardcoded system guardrails and constants reflecting non-negotiable rules
- [x] React frontend with Vite, Tailwind, TypeScript
- [x] Fastify backend with Prisma/PostgreSQL
- [x] Database schema with core models (User, Farmer, Product, Batch, Order)
- [x] Shared system rules and constants
- [x] Vercel deployment configuration

### Artifacts

- `/web` — React 19 + Vite + Tailwind frontend
- `/server` — Fastify 5 + Prisma 7 backend
- `/shared` — Shared constants and types
- `vercel.json` — Deployment configuration

---

## EPIC-1 — Branding & Static Pages ✅

**Completed: 2026-01-14**

### Tasks Completed

- [x] **Landing Page** — Explains the Virtual Mandi model, batch cycles, and facilitation fees
  - [x] Hero section with headline and CTA
  - [x] Story section ("Our Story" - personal narrative)
  - [x] Stats section (key numbers/metrics)
  - [x] Steps section (how it works)
  - [x] Features section (key features/benefits)
  - [x] Navbar component
  - [x] Footer component

- [x] **Rules Page** — Detailed breakdown of cutoff enforcement, 2-stage payments, and fulfilment
  - [x] Batch lifecycle states (DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED)
  - [x] Cutoff enforcement rules
  - [x] Two-stage payment system explanation
  - [x] Fulfilment options (Pickup vs Delivery)
  - [x] Farmer policy section
  - [x] CTA section

- [x] **Visual Identity** — Minimalist, factual branding
  - [x] Color palette defined (mandi-green, mandi-earth, mandi-cream, mandi-dark, mandi-muted)
  - [x] Typography (Inter font family)
  - [x] CSS theme variables configured
  - [x] Text-based branding (formal logo deferred)

- [x] **Our Story Section** — Personal narrative explaining the "why" behind Virtual Mandi
  - [x] Story component with Deepak's personal narrative
  - [x] Quote highlight block
  - [x] CTA to join as buyer

### Artifacts

- `/web/src/pages/Home.tsx` — Landing page with all sections
- `/web/src/pages/Rules.tsx` — Rules page
- `/web/src/components/layout/` — Navbar and Footer components
- `/web/src/index.css` — Theme variables and color palette

### Notes

- Formal logo asset (SVG/PNG) deferred — currently using text-based branding

---

## EPIC-2 — Authentication & Access ✅

**Completed: 2026-01-14**

### Tasks Completed

- [x] **Admin Authentication** — Email/Password login for system management
  - [x] Backend: Auth routes (register, login, logout, me)
  - [x] Backend: Password hashing (bcrypt)
  - [x] Backend: JWT token generation and validation
  - [x] Backend: httpOnly cookie handling
  - [x] Frontend: Admin login page
  - [x] Frontend: Auth context/state management (Zustand)
  - [x] Frontend: Protected route wrapper

- [x] **Buyer Authentication** — Phone + OTP login
  - [x] Backend: OTP generation and storage
  - [x] Backend: OTP verification endpoint
  - [x] Backend: Phone number validation
  - [x] Frontend: Phone input page
  - [x] Frontend: OTP verification page
  - [x] Integration: Mock OTP for dev (console logging)

- [x] **Access Control** — Role-based route protection
  - [x] Backend: Role middleware (ADMIN, BUYER)
  - [x] Backend: Protected API routes
  - [x] Frontend: Role-based navigation
  - [x] Frontend: Unauthorized redirect handling
  - [x] Invite-only flag enforcement for buyers

- [x] **Session Management**
  - [x] Token refresh mechanism
  - [x] Logout and session invalidation
  - [x] Persistent auth state (localStorage)

- [x] **Developer Tooling**
  - [x] Biome for linting and formatting
  - [x] Husky + lint-staged for pre-commit hooks
  - [x] GitHub Actions CI workflow
  - [x] Root scripts for check/lint/format/typecheck

### Artifacts

- `/server/src/routes/auth.ts` — Auth API routes
- `/server/src/middleware/auth.ts` — JWT verification middleware
- `/server/src/plugins/jwt.ts` — JWT plugin
- `/web/src/stores/auth.ts` — Zustand auth store
- `/web/src/lib/api.ts` — API utilities
- `/web/src/pages/AdminLoginPage.tsx` — Admin login
- `/web/src/pages/BuyerLoginPage.tsx` — Buyer phone input
- `/web/src/pages/VerifyOtpPage.tsx` — OTP verification
- `/web/src/components/auth/ProtectedRoute.tsx` — Route guard
- `/web/src/components/auth/AuthProvider.tsx` — Session check on load
- `biome.json` — Linting configuration
- `.husky/pre-commit` — Git pre-commit hook
- `.github/workflows/ci.yml` — GitHub Actions CI

### Notes

- OTP is logged to console in dev mode (real SMS integration deferred)
- Security TODOs: Rate limiting, max OTP attempts, OTP hashing (for production OTP integration)

---

## Completed Epics Summary

| Epic | Name | Status | Date Completed |
|------|------|--------|----------------|
| EPIC-0 | System Foundation | ✅ Complete | Prior to 2026-01-14 |
| EPIC-1 | Branding & Static Pages | ✅ Complete | 2026-01-14 |
| EPIC-2 | Authentication & Access | ✅ Complete | 2026-01-14 |

---

*Last updated: 2026-01-14*
