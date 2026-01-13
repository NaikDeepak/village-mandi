# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- TypeScript ~5.9.3 - All application code (`package.json`, `web/package.json`, `server/package.json`)

**Secondary:**
- JavaScript - Build scripts, config files

## Runtime

**Environment:**
- Node.js (version not pinned - no `.nvmrc` or engines field)
- Browser runtime for React SPA

**Package Manager:**
- npm 10.x with workspaces
- Lockfile: `package-lock.json` present
- Monorepo structure: `web`, `server`, `shared` workspaces

## Frameworks

**Core:**
- React 19.2.0 - Frontend UI framework (`web/package.json`)
- Fastify 5.6.2 - Backend API server (`server/package.json`)
- Prisma 7.2.0 - Database ORM (`server/package.json`)

**Testing:**
- Not configured - No test framework installed

**Build/Dev:**
- Vite 7.2.4 - Frontend bundler (`web/vite.config.ts`)
- TypeScript ~5.9.3 - Compilation
- PostCSS + Autoprefixer - CSS processing (`web/postcss.config.js`)

## Key Dependencies

**Frontend (`web/package.json`):**
- `react-router-dom ^7.12.0` - Client-side routing
- `@tanstack/react-query ^5.90.16` - Server state management (installed, not yet used)
- `zustand ^5.0.10` - Client state management (installed, not yet used)
- `react-hook-form ^7.71.0` + `@hookform/resolvers ^5.2.2` - Form handling
- `zod ^4.3.5` - Schema validation
- `lucide-react ^0.562.0` - Icon library
- `tailwindcss ^4.1.18` - Utility CSS framework

**Backend (`server/package.json`):**
- `@prisma/client ^7.2.0` - Database ORM client
- `@prisma/adapter-pg` - PostgreSQL adapter with driver
- `pg` - PostgreSQL driver
- `pino ^10.1.1` + `pino-pretty ^13.1.3` - Logging
- `zod ^4.3.5` - Schema validation
- `@supabase/supabase-js ^2.90.1` - Supabase SDK (installed, not actively used)

**Dev Dependencies:**
- `typescript-eslint ^8.46.4` - TypeScript linting
- `eslint-plugin-react-hooks ^7.0.1` - React hooks linting
- `eslint-plugin-react-refresh ^0.4.24` - Vite HMR linting
- `ts-node ^10.9.2` - TypeScript execution

## Configuration

**Environment:**
- `.env` files for environment variables (gitignored)
- `server/.env.example` - DATABASE_URL, API_KEY (Gemini), SENTRY_DSN, ADMIN_PASSWORD, JWT_SECRET, S3 credentials, LOG_LEVEL
- `web/.env.example` - VITE_API_URL, VITE_WHATSAPP_NUMBER, VITE_SENTRY_DSN

**Build:**
- `web/vite.config.ts` - Vite bundler with path aliases (@, @shared)
- `web/tsconfig.json`, `web/tsconfig.app.json`, `web/tsconfig.node.json` - Frontend TypeScript
- `server/tsconfig.json` - Backend TypeScript (CommonJS output)
- `web/eslint.config.js` - ESLint flat config
- `web/postcss.config.js` - PostCSS with Tailwind
- `server/prisma.config.ts`, `server/prisma/schema.prisma` - Prisma configuration

## Platform Requirements

**Development:**
- Any platform with Node.js
- PostgreSQL database (local or remote)
- No Docker required

**Production:**
- Vercel - Frontend and serverless API (`api/index.ts`, `.vercel/` directory)
- Managed PostgreSQL (Supabase)

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
