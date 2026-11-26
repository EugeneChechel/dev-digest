# M1 — Run Cost Badge (client)

Status: done

Server side: [server/specs/M1-run-cost-badge.md](../../server/specs/M1-run-cost-badge.md)
Design reference: `DevDigest Design (standalone).html` → `CostBadge`, artboard
"Pull Requests · Run Review + auto-status + Cost".

## Goal
Show what each reviewer run (and the latest review round of a PR) cost, in USD and
tokens, wherever runs are shown.

## Scope
1. **`RunCostBadge`** (`src/components/RunCostBadge/`) — two variants:
   - `compact` → `$0.014`
   - `full` → `$0.014 · 8.2K→1.3K` (tokens muted)
   - `usd == null` → muted `—` (never `$0.00`). `mono tnum`, i18n tooltip.
2. **Formatters** (`src/lib/format.ts`): `formatUsd` (`≥1` → 2 dp, `≥0.01` → 3 dp,
   else 4 dp; null → `—`) and `formatTokenPair` (`8.2K→1.3K`). Replaces the drawer's
   local `formatTokens`.
3. **Pull Requests list** (`/repos/[repoId]/pulls`) — new **COST** column between
   Status and Updated: `<RunCostBadge variant="compact" usd={pr.cost_usd} />`.
4. **PR detail → Agent runs → Timeline** (`RunHistory`) — under the run time:
   `RunCostBadge variant="full"`; only for settled, non-error runs.
5. **Run trace drawer** (`TraceBody` Stats) — fourth tile **COST** between Tokens and
   Findings: `formatUsd(stats.cost_usd)`.
6. **Verdict banner** (`VerdictBanner`) — under the PR SCORE ring: `$` icon +
   `RunCostBadge variant="full"` for the review's run (joined client-side:
   `ReviewRecord.run_id` → `RunSummary` from `usePrRuns`).

## Contracts
- `GET /repos/:id/pulls` → `PrMeta.cost_usd` (latest round total, nullish)
- `GET /pulls/:id/runs` → `RunSummary.cost_usd` (nullish)
- `GET /runs/:id/trace` → `RunStats.cost_usd` (nullish)
- i18n (`messages/en`): `prReview.list.columns.cost`, `common.cost.tooltip`,
  `runs.trace.stat.cost`

## Acceptance criteria
- [x] `formatUsd`: `0.0142 → $0.014`, `0.0013 → $0.0013`, `1.5 → $1.50`, `null → —`.
- [x] `formatTokenPair(8200, 1300) → 8.2K→1.3K`; small counts are not shown as `0K`.
- [x] `RunCostBadge` renders both variants and `—` for null/undefined cost.
- [x] PR list shows a COST header and a cost cell per row; `—` when `cost_usd` is null.
- [x] Timeline run card shows `$… · …K→…K` for a done run and nothing for an error run.
- [x] Trace drawer Stats shows a COST tile; a trace without `cost_usd` shows `—`.
- [x] Verdict banner shows cost + tokens under PR SCORE when the run is known, `—` otherwise.

## Out of scope
- Cost in the ReviewRunAccordion header.
- Agent Performance / cost dashboards.
- e2e flow (the seed has no `agent_runs`).
