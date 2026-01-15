---
phase: 14-order-editing
plan: 01
subsystem: api
tags: [fastify, zod, prisma, order-editing, validation, transactional-updates]

# Dependency graph
requires:
  - phase: 07-ordering
    provides: Order creation API and schemas
  - phase: 08-payments
    provides: Order status transitions and event logging pattern
provides:
  - PATCH /orders/:id endpoint for editing placed orders
  - editOrderSchema for validation
  - Order cancellation via empty items array
  - Audit logging for ORDER_EDITED and ORDER_CANCELLED events
affects: [buyer-ui, order-management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Transactional order editing with item replacement
    - Auto-cancel when all items removed
    - Dynamic metadata for event logging

key-files:
  created:
    - .planning/phases/14-order-editing/14-01-SUMMARY.md
  modified:
    - server/src/schemas/orders.ts
    - server/src/routes/orders.ts
    - server/src/routes/orders.test.ts
    - server/src/tests/helpers.ts

key-decisions:
  - "Items array replaces all items (not partial update) for simplicity"
  - "qty=0 means remove item, empty array cancels order"
  - "Only PLACED orders can be edited (before any payment)"
  - "Metadata built dynamically to avoid type errors with Prisma Json fields"

patterns-established:
  - "Comprehensive validation before transaction (ownership, status, cutoff)"
  - "Separate handling for cancellation vs. edit scenarios"
  - "Event logging with descriptive metadata for audit trail"

issues-created: []

# Metrics
duration: 35min
completed: 2026-01-15
---

# Phase 14-01: Order Editing API Summary

**PATCH /orders/:id endpoint enables buyers to edit PLACED orders before cutoff with comprehensive validation, item replacement, auto-cancel, and audit logging**

## Performance

- **Duration:** 35 min
- **Started:** 2026-01-15T19:25:00Z
- **Completed:** 2026-01-15T20:00:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Implemented PATCH /orders/:id with authentication and ownership validation
- Order editing restricted to PLACED status and before batch cutoff
- Items replacement with MOQ/MaxOQ validation and total recalculation
- Auto-cancel when all items removed (qty=0 or empty array)
- Comprehensive event logging for ORDER_EDITED and ORDER_CANCELLED actions
- 13 new test cases covering all validation and edge cases (121 total tests passing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create order editing schema** - `6f993ed` (feat)
2. **Task 2: Implement PATCH /orders/:id endpoint** - `5ea95f0` (feat)
3. **Task 3: Add comprehensive tests for order editing** - `76e2a65` (test)

## Files Created/Modified
- `server/src/schemas/orders.ts` - Added editOrderSchema with optional fulfillmentType and items array
- `server/src/routes/orders.ts` - Added PATCH /orders/:id endpoint with full validation and transactional updates
- `server/src/routes/orders.test.ts` - Added 13 comprehensive test cases for all edit scenarios
- `server/src/tests/helpers.ts` - Added orderItem.deleteMany and createMany mocks

## Decisions Made
- **Items replacement strategy:** Chose to replace all items rather than partial updates for simplicity and consistency. This avoids complex merge logic and makes the API behavior predictable.
- **Metadata typing:** Built metadata object dynamically with explicit types to avoid TypeScript errors with Prisma's Json field type. This pattern matches existing code in payments.ts and batches.ts.
- **Cancellation trigger:** Empty items array or all items with qty=0 triggers auto-cancel. This provides a clean way for buyers to cancel orders without a separate endpoint.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript metadata typing:** Initial approach using `Record<string, unknown>` for event metadata caused type errors with Prisma's InputJsonValue type. Resolved by building metadata object with explicit optional properties, matching patterns used in existing event logging code.

## Next Phase Readiness
- Order editing API complete and tested
- Ready for buyer UI integration
- Event logging provides full audit trail for order modifications
- Pattern established for future order operations

---
*Phase: 14-order-editing*
*Completed: 2026-01-15*
