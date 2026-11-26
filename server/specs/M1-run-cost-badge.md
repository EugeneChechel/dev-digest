# M1 — Run Cost Badge (server)

Status: done

Client side: [client/specs/M1-run-cost-badge.md](../../client/specs/M1-run-cost-badge.md)

## Goal
Show the USD cost and the input/output tokens of every reviewer-agent run, so a user
can see how much a review costs per run and per PR. Data comes from the `usage`
already in the LLM response (OpenRouter `usage.cost`, else tokens × price from
`PriceBook` / `pricing.ts`). **Zero additional model calls.**

## Scope
- Persist `ReviewOutcome.costUsd` (already returned by reviewer-core) — today it is
  dropped in `src/modules/reviews/run-executor.ts`.
- Group the runs of one `ReviewService.runReview` call into a **round** so the PR
  list can show the cost of the latest round.
- Expose cost in the GET routes the UI reads.

## Contracts
**DB** — `agent_runs` (migration `0010_*`):
- `cost_usd double precision NULL` — total USD for the run; `NULL` = unknown
  (failed/cancelled run, unpriced model, rows older than this migration).
- `round_id uuid NULL` — shared by all runs created in one `runReview` call.

**`@devdigest/shared`** (update **both** `server/src/vendor/shared` and
`client/src/vendor/shared`):
- `RunStats.cost_usd: z.number().nullish()` — in the `run_traces.trace` jsonb;
  nullish because older traces lack the field.
- `RunSummary.cost_usd: z.number().nullish()`.
- `PrMeta.cost_usd: z.number().nullish()` — list endpoint only (like `score`).

**Routes**
- `GET /pulls/:id/runs` → each `RunSummary` carries `cost_usd`.
- `GET /runs/:id/trace` → `trace.stats.cost_usd`.
- `GET /repos/:id/pulls` → `PrMeta.cost_usd` = sum of non-null `cost_usd` over the
  runs of the PR's latest round (by `ran_at`); `null` if the PR has no round or no
  run in it has a known cost.

## Acceptance criteria
- [x] A successful run stores `agent_runs.cost_usd` = `ReviewOutcome.costUsd` and the
      same value in `trace.stats.cost_usd` (mock LLM → `0.001`).
- [x] A run whose model has no known price stores `cost_usd = NULL`.
- [x] Failed / cancelled runs (diff-load failure, per-agent error) store `cost_usd = NULL`.
- [x] All runs created by one `POST /pulls/:id/review` share one non-null `round_id`.
- [x] `GET /pulls/:id/runs` returns `cost_usd` per run.
- [x] `GET /repos/:id/pulls`: with two rounds, `cost_usd` equals the sum of the latest
      round only; a PR without runs returns `cost_usd: null`.
- [x] No extra LLM call is made to obtain cost.
- [x] `test/contracts.test.ts` covers the new nullish fields (old trace without
      `cost_usd` still parses).

## Out of scope
- Partial usage of runs that fail mid-review (reviewer-core throws without usage).
- Per-agent / per-model cost aggregates (Agent Performance, M8).
- Backfilling cost for runs created before the migration.
