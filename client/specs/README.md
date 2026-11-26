# client — specs

Feature specs for `client/`, one file per feature: `M<N>-<feature>.md` (the
milestone from the [roadmap](../../README.md#roadmap)). Write or update the spec
**before** implementing, and link it from the PR.

## Template

```markdown
# M<N> — <Feature name>

Status: draft | in progress | done

## Goal
What problem this solves and for whom.

## Scope
What changes in this module. Link related specs in other modules.

## Contracts
API routes, Zod contracts in @devdigest/shared, DB tables, UI routes.

## Acceptance criteria
- [ ] Testable statements; each maps to a test.

## Out of scope
What we deliberately are not doing.
```

## Index

- [M1 — Run Cost Badge](M1-run-cost-badge.md) — per-run / per-PR cost and tokens
