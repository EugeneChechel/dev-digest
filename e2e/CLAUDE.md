# e2e — `@devdigest/e2e`

Deterministic browser end-to-end flows driven by the agent-browser CLI. No
Playwright, no LLM, no API key. How flows work, env knobs and coverage table:
[README.md](README.md).

## Commands (npm, run inside `e2e/`)

- `./scripts/e2e.sh` (from the repo root), or `npm run e2e:hermetic`: isolated,
  freshly seeded stack on :5433/:3101/:3100. **Use this by default.**
- `npm test`: runs against an already running stack. Only safe when the DB holds
  just the seeded repo.
- `npm run typecheck`

## Rules

- Flows live in `flows/NN-name.flow.json` and run in lexical order. They are
  test code. Feature specs go in `specs/`.
- Locators are deterministic only: `--url`, `--text`, `find role|text|label`.
  Never use the AI `chat` command.
- Flows target read-only seeded data (`acme/payments-api`, PR #482, the built-in
  agents). Don't submit forms or trigger reviews.
- A new flow means a new row in the README coverage table.

## Documentation (read before changing)

- Flow format, running, coverage → [README.md](README.md)
- Architecture decisions, deep dives → [docs/](docs/README.md)
- Feature specs (what a journey must prove) → [specs/](specs/README.md)
- Screens under test → [../client/CLAUDE.md](../client/CLAUDE.md)
- Seed data → `../server/src/db/seed.ts`
- CI workflow → `../.github/workflows/e2e-web.yml` · strategy → [../TESTING.md](../TESTING.md)

## Insights

@INSIGHTS.md
