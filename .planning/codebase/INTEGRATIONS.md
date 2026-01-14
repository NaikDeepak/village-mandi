# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**AI/LLM (Planned):**
- Google Gemini API - For AI features
  - SDK/Client: Not yet integrated
  - Auth: API key in `API_KEY` env var (`server/.env.example`)
  - Status: Configured but not implemented

**Communication:**
- WhatsApp Click-to-Chat - Event-driven buyer notifications
  - Integration method: URL-based (no API)
  - Config: `VITE_WHATSAPP_NUMBER` env var (`web/.env.example`)
  - Referenced in: `shared/constants.ts`

## Data Storage

**Database:**
- PostgreSQL on Supabase - Primary data store
  - Connection: via `DATABASE_URL` env var
  - Client: Prisma ORM v7.2.0 with `@prisma/adapter-pg` (`server/db.ts`)
  - Schema: `server/prisma/schema.prisma` (12 models)
  - Migrations: Prisma migrate in `server/prisma/migrations/`

**File Storage (Planned):**
- S3-compatible storage - User uploads
  - SDK/Client: Not yet integrated
  - Auth: `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` env vars (`server/.env.example`)
  - Status: Configured but not implemented

**Caching:**
- None currently configured

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication (planned)
  - Implementation: Not yet built
  - Config: `JWT_SECRET`, `ADMIN_PASSWORD` env vars (`server/.env.example`)
  - Per README: Email/Password (Admin), Phone/OTP (Buyer)

**Supabase SDK:**
- `@supabase/supabase-js ^2.90.1` - Installed in `server/package.json`
  - Status: Not actively used in current code

## Monitoring & Observability

**Error Tracking (Planned):**
- Sentry - Server and client error tracking
  - DSN: `SENTRY_DSN` env var (server), `VITE_SENTRY_DSN` (web)
  - Status: Configured but not implemented

**Analytics:**
- None configured

**Logs:**
- Pino logger (`server/package.json`)
  - Config: `LOG_LEVEL` env var (`server/.env.example`)

## CI/CD & Deployment

**Hosting:**
- Vercel - Frontend and serverless API
  - Deployment: Git-based (`.vercel/` directory present)
  - Serverless entry: `api/index.ts`
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- Not configured (no GitHub Actions workflows found)

## Environment Configuration

**Development:**
- Required env vars: `DATABASE_URL` (server), `VITE_API_URL` (web)
- Secrets location: `.env` files (gitignored)
- Templates: `server/.env.example`, `web/.env.example`

**Production:**
- Secrets management: Vercel environment variables
- Database: Supabase managed PostgreSQL

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

## Payment Integration

**UPI (Manual):**
- Two-stage payment model defined in schema (`server/prisma/schema.prisma`)
  - PaymentMethod enum: UPI, BANK_TRANSFER, CASH
  - PaymentStage enum: COMMITMENT, SETTLEMENT
  - No payment gateway integration (manual verification)

## Delivery Integration

**Providers (Planned):**
- Dunzo, Porter - Defined in schema as `DeliveryProvider` enum
  - Status: Schema only, no API integration

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
