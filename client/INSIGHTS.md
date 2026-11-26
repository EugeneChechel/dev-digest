# client — insights

Gotchas and lessons learned. Imported into CLAUDE.md, so keep it lean (~80 lines).
**Append-only**, written by the `engineering-insights` skill (`.claude/skills/engineering-insights`).
Format: `- **YYYY-MM-DD · title** → why → ALWAYS/NEVER do X. _(evidence: path + symbol)_` (one line, no line numbers).
Never edit or delete entries in a session; supersede with a new dated entry. Pruning is a human task.

## What Works

## What Doesn't Work

## Codebase Patterns
- **`@devdigest/shared` is a vendored copy** (`src/vendor/shared`) that has drifted from `server/src/vendor/shared` → contract changes need both copies updated.
- **2026-11-23 · Shared RunCostBadge reads the `common` i18n namespace** → component tests that wrap NextIntlClientProvider with only their own namespace (e.g. `prReview`) miss its tooltip key → ALWAYS pass `{ <ns>, common }` messages when the tree renders RunCostBadge. _(evidence: src/components/run-cost-badge/RunCostBadge.tsx `RunCostBadge`)_

## Tool & Library Notes
- **Component tests mock `fetch`** → a green `pnpm test` doesn't prove the API shape → the e2e suite covers real journeys.

## Recurring Errors & Fixes

## Session Notes
- **2026-11-23** · M1 Run Cost Badge: RunCostBadge + lib/format, cost on PR list, timeline, trace drawer, verdict banner.

## Open Questions
