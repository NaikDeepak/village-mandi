# Phase 5: Batch Management - Context

**Gathered:** 2026-01-15
**Status:** Ready for planning

<vision>
## How This Should Work

Admins manage batches through a timeline/calendar view where the current batch is front and center. The UI is present-focused — what's active matters most, past batches are archived and accessible but not prominent.

When creating or managing a batch, the key interaction is setting the cutoff time and moving through the lifecycle states. The batch moves through DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED, with each transition being deliberate and irreversible.

Cutoff enforcement is strict — once a batch is past cutoff, it automatically locks to new orders. The system should feel trustworthy and predictable, like a well-run marketplace where the rules are clear.

</vision>

<essential>
## What Must Be Nailed

- **Strict state machine** — DRAFT → OPEN → CLOSED → COLLECTED → DELIVERED → SETTLED with no skipping states, no reopening, no shortcuts
- **Cutoff enforcement** — After cutoff time, batch automatically locks to new orders. No exceptions.
- **Audit trail** — Every state change logged with who/when for accountability. This is a business-critical system.

All three are foundational — the batch system's integrity depends on all of them working correctly.

</essential>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for the UI. The focus is on getting the backend state machine and enforcement logic bulletproof.

</specifics>

<notes>
## Additional Context

This is the backbone of the batch-based marketplace model. Everything downstream (pricing, ordering, payments, fulfillment) depends on batches having clear, enforced states and cutoffs.

Timeline/calendar view preference suggests batches should be visualized with their cutoff times prominent. Present-focused means the current OPEN batch (if any) should be the hero of the view.

</notes>

---

*Phase: 05-batch-management*
*Context gathered: 2026-01-15*
