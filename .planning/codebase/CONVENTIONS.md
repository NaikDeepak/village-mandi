# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- PascalCase for React components: `Hero.tsx`, `Navbar.tsx`, `LandingPage.tsx`
- camelCase for utility files: `constants.ts`, `db.ts`, `index.ts`
- kebab-case for directories: `components/landing/`, `components/layout/`
- Examples: `web/src/components/landing/Features.tsx`, `server/db.ts`

**Functions:**
- camelCase for all functions
- No special prefix for async functions
- Named exports for React components: `export function Hero() {}`
- Example from `web/src/components/landing/Hero.tsx`

**Variables:**
- camelCase for regular variables
- SCREAMING_SNAKE_CASE for constants: `SYSTEM_RULES`, `BATCH_STATUS`
- No underscore prefix for private members
- Examples from `shared/constants.ts`

**Types:**
- PascalCase for interfaces, no I prefix
- PascalCase for type aliases
- PascalCase enum names, SCREAMING_SNAKE_CASE values
- Example from `server/prisma/schema.prisma`: `BatchStatus { DRAFT, OPEN, CLOSED }`

## Code Style

**Formatting:**
- 4 spaces indentation (consistent across TypeScript files)
- No Prettier configured (manual formatting)
- Single quotes for imports
- Semicolons required
- Example: `import { useState } from 'react';`

**Linting:**
- ESLint 9 with flat config (`web/eslint.config.js`)
- typescript-eslint for TypeScript rules
- eslint-plugin-react-hooks for React hooks rules
- eslint-plugin-react-refresh for Vite HMR
- Run: `npm run lint` (in web workspace)

## Import Organization

**Order:**
1. External packages (react, lucide-react, etc.)
2. Shared imports (@shared/constants)
3. Relative imports (./components, ../assets)
4. Type imports (when separated)

**Grouping:**
- No explicit blank lines between groups (inconsistent)
- No alphabetical sorting enforced

**Path Aliases:**
- `@/*` maps to `./src/*` in web (`web/tsconfig.app.json`)
- `@shared/*` maps to `../shared/*` in web (`web/vite.config.ts`)
- Example: `import { BATCH_STATUS } from '@shared/constants';`

## Error Handling

**Patterns:**
- Not yet established (early stage project)
- No custom error classes defined
- No try/catch patterns in current API code

**Error Types:**
- Not defined yet

## Logging

**Framework:**
- Pino logger installed in server (`server/package.json`)
- Not yet integrated into application code

**Patterns:**
- console.log used in development
- No structured logging established

## Comments

**When to Comment:**
- JSX comments for section markers: `{/* Background Image */}`
- Block comments for file headers (server files)
- Section separators in Prisma schema

**JSDoc/TSDoc:**
- Not widely used
- Some file-level block comments in `server/index.ts`

**TODO Comments:**
- None found in current codebase

**Example from `server/index.ts`:**
```typescript
/**
 * VIRTUAL MANDI SERVER
 * Non-negotiable rules check:
 * 1. Batch-based orders
 * ...
 */
```

**Example from `server/prisma/schema.prisma`:**
```prisma
//////////////////////
// USERS (ADMIN + BUYERS)
//////////////////////
```

## Function Design

**Size:**
- No explicit limit
- Components are reasonably sized (40-70 lines)

**Parameters:**
- Object destructuring in props
- Example: `export function Hero() {}` (no props yet)

**Return Values:**
- Explicit JSX returns in components
- No explicit return types annotated

## Module Design

**Exports:**
- Named exports for all components
- No default exports used
- Example: `export function Hero() {}`

**Barrel Files:**
- Not used (no index.ts re-exports in components)

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
