# Codebase Structure

**Analysis Date:** 2026-01-14

## Directory Layout

```
village-mandi/
├── package.json              # Root monorepo config (npm workspaces)
├── package-lock.json         # Dependency lockfile
├── README.md                 # Project documentation
├── .gitignore                # Git ignore patterns
│
├── web/                      # Frontend workspace (React + Vite)
│   ├── package.json          # Web dependencies
│   ├── index.html            # HTML entry point
│   ├── vite.config.ts        # Vite bundler config
│   ├── tsconfig.json         # TypeScript config root
│   ├── tsconfig.app.json     # App TypeScript config
│   ├── tsconfig.node.json    # Node TypeScript config
│   ├── postcss.config.js     # PostCSS/Tailwind config
│   ├── eslint.config.js      # ESLint flat config
│   ├── .env.example          # Environment template
│   └── src/
│       ├── main.tsx          # React entry point
│       ├── App.tsx           # Root component + routing
│       ├── App.css           # App-specific styles
│       ├── index.css         # Global styles (Tailwind)
│       ├── vite-env.d.ts     # Vite type definitions
│       ├── assets/           # Static assets
│       │   └── hero-bg.png   # Hero background image
│       ├── components/
│       │   ├── landing/      # Landing page components
│       │   │   ├── Hero.tsx
│       │   │   ├── Features.tsx
│       │   │   └── Steps.tsx
│       │   └── layout/       # Layout components
│       │       ├── Navbar.tsx
│       │       └── Footer.tsx
│       └── pages/
│           └── LandingPage.tsx
│
├── server/                   # Backend workspace (Fastify + Prisma)
│   ├── package.json          # Server dependencies
│   ├── index.ts              # Fastify server entry
│   ├── db.ts                 # Prisma client setup
│   ├── tsconfig.json         # TypeScript config
│   ├── prisma.config.ts      # Prisma configuration
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Server-specific ignores
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (12 models)
│   │   └── seed.ts           # Database seeding script
│   └── generated/            # Prisma generated client
│
├── shared/                   # Shared workspace
│   └── constants.ts          # System rules, enums, types
│
├── api/                      # Vercel serverless functions
│   └── index.ts              # API entry point
│
├── docs/                     # Documentation
│   ├── prd.md                # Product Requirements Document
│   └── deployment.md         # Deployment instructions
│
├── .vercel/                  # Vercel deployment config
├── .claude/                  # Claude AI configuration
├── .agents/                  # Agent configurations
├── .planning/                # Planning documents
└── .qodo/                    # Qodo configuration
```

## Directory Purposes

**web/**
- Purpose: React single-page application
- Contains: Components, pages, styles, assets
- Key files: `src/main.tsx` (entry), `src/App.tsx` (root)
- Subdirectories: `src/components/`, `src/pages/`, `src/assets/`

**server/**
- Purpose: Backend API server
- Contains: Fastify routes, database client, Prisma schema
- Key files: `index.ts` (entry), `db.ts` (database), `prisma/schema.prisma`
- Subdirectories: `prisma/`, `generated/`

**shared/**
- Purpose: Cross-cutting code shared between web and server
- Contains: Business rules, constants, enums
- Key files: `constants.ts`
- Subdirectories: None (flat)

**api/**
- Purpose: Vercel serverless function adapter
- Contains: Single entry point mirroring server
- Key files: `index.ts`
- Subdirectories: None

**docs/**
- Purpose: Project documentation
- Contains: PRD, deployment guides
- Key files: `prd.md`, `deployment.md`

## Key File Locations

**Entry Points:**
- `web/src/main.tsx` - React app entry
- `server/index.ts` - Fastify server entry
- `api/index.ts` - Vercel serverless entry

**Configuration:**
- `package.json` - Root monorepo config
- `web/vite.config.ts` - Frontend bundler
- `web/tsconfig.json` - Frontend TypeScript
- `server/tsconfig.json` - Backend TypeScript
- `server/prisma/schema.prisma` - Database schema

**Core Logic:**
- `server/db.ts` - Database connection
- `shared/constants.ts` - Business rules
- `server/prisma/seed.ts` - Test data

**Testing:**
- Not yet configured

**Documentation:**
- `README.md` - Project overview
- `docs/prd.md` - Requirements
- `.env.example` files - Environment templates

## Naming Conventions

**Files:**
- `PascalCase.tsx` - React components (Hero.tsx, Navbar.tsx)
- `camelCase.ts` - Utility files (constants.ts, db.ts)
- `kebab-case.md` - Documentation files

**Directories:**
- `lowercase` - All directories (web, server, shared)
- `kebab-case` - Multi-word directories (if any)
- Semantic grouping: `components/landing/`, `components/layout/`

**Special Patterns:**
- `*.config.ts` - Configuration files
- `*.example` - Template files for secrets
- `index.ts` - Entry points

## Where to Add New Code

**New Feature:**
- Primary code: `web/src/components/` or `web/src/pages/`
- API endpoint: `server/index.ts` (add routes)
- Shared types: `shared/constants.ts`

**New Component:**
- Implementation: `web/src/components/{feature}/ComponentName.tsx`
- Types: Inline or in `shared/`
- Tests: Not yet established

**New API Route:**
- Definition: `server/index.ts` (register with Fastify)
- Handler: Inline or extract to `server/routes/`
- Validation: Use Zod schemas

**Utilities:**
- Shared helpers: `shared/`
- Web-only: `web/src/lib/` (create if needed)
- Server-only: `server/lib/` (create if needed)

## Special Directories

**generated/**
- Purpose: Prisma generated client code
- Source: Auto-generated by `prisma generate`
- Committed: No (in `.gitignore`)

**node_modules/**
- Purpose: Installed dependencies
- Source: npm install
- Committed: No

**.planning/**
- Purpose: GSD planning documents
- Source: Created by GSD workflow
- Committed: Yes

---

*Structure analysis: 2026-01-14*
*Update when directory structure changes*
