# Testing Patterns

**Analysis Date:** 2026-01-14

## Test Framework

**Runner:**
- Not configured - No test framework installed

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
# No test commands available
# Recommended setup:
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## Test File Organization

**Location:**
- No test files exist in project source
- Recommended: Co-located tests (`*.test.tsx` alongside source)

**Naming:**
- Not established
- Recommended: `ComponentName.test.tsx`, `module.test.ts`

**Structure:**
```
# Recommended structure:
src/
  components/
    landing/
      Hero.tsx
      Hero.test.tsx
  lib/
    utils.ts
    utils.test.ts
```

## Test Structure

**Suite Organization:**
- Not established

**Recommended Pattern:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

## Mocking

**Framework:**
- Not configured

**Patterns:**
- Not established

**What to Mock (when implemented):**
- API calls (fetch, axios)
- Router context
- Shared constants for edge cases

## Fixtures and Factories

**Test Data:**
- `server/prisma/seed.ts` provides comprehensive test data (618 lines)
- Can be used as reference for test fixtures

**Location:**
- Recommended: `tests/fixtures/` for shared test data

## Coverage

**Requirements:**
- Not configured
- No coverage thresholds

**Configuration:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented
- Priority targets:
  - `shared/constants.ts` - Business rules
  - React components - UI behavior
  - Utility functions (when added)

**Integration Tests:**
- Not implemented
- Priority targets:
  - API endpoints
  - Database operations

**E2E Tests:**
- Not configured
- Recommended: Playwright for user flows

## Common Patterns

**Current State:**
- No testing patterns established
- Project is in early development phase

**Recommendations:**

1. **Install Vitest for unit/integration tests:**
```bash
cd web && npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. **Add vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

3. **Add test script to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Linting (Current Tooling)

**Available:**
- ESLint 9 with flat config
- TypeScript strict mode enabled
- React hooks linting

**Run:**
```bash
cd web && npm run lint
```

---

*Testing analysis: 2026-01-14*
*Update when test patterns are established*
