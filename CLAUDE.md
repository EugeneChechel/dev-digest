# DevDigest — agent guide

Local-first AI pull-request review. Human overview, architecture diagram and
roadmap: [README.md](README.md). Test strategy and CI lanes: [TESTING.md](TESTING.md).

## Modules

Each module has its own `CLAUDE.md` (loaded when you work inside it). Read it
before changing that module.

| Module | Package | What it is | Agent guide |
|--------|---------|------------|-------------|
| `server/` | `@devdigest/api` | Fastify 5 API + Drizzle/Postgres (pgvector), repo-intel | [server/CLAUDE.md](server/CLAUDE.md) |
| `client/` | `@devdigest/web` | Next.js 15 studio UI | [client/CLAUDE.md](client/CLAUDE.md) |
| `reviewer-core/` | `@devdigest/reviewer-core` | Pure engine: diff → prompt → LLM → grounded findings | [reviewer-core/CLAUDE.md](reviewer-core/CLAUDE.md) |
| `e2e/` | `@devdigest/e2e` | Deterministic browser e2e (agent-browser) | [e2e/CLAUDE.md](e2e/CLAUDE.md) |

## Global rules

- **No monorepo workspace.** Every module is a standalone package with its own
  lockfile. Install and run commands from inside the module directory.
  `server/` and `client/` use **pnpm**; `reviewer-core/` and `e2e/` use **npm**.
- **Cross-package code is shared through tsconfig path aliases**, not published
  packages (`@devdigest/shared`, `@devdigest/reviewer-core`, `@devdigest/ui`).
- **Zod contracts live in `@devdigest/shared`.** Don't redefine a contract
  locally; extend the shared one.
- **Secrets never go in git or the DB.** Keys go through the server's
  `SecretsProvider` (`~/.devdigest/secrets.json`) with `process.env` as a fallback.
- **Tests stay hermetic.** No real LLM or GitHub calls in any suite.
- **Dev bootstrap:** `./scripts/dev.sh`. Hermetic e2e: `./scripts/e2e.sh`.
  Never run `docker compose down -v` against the dev DB; it deletes real data.

## Documentation layout (every module)

| Path | Purpose | When to read / write |
|------|---------|----------------------|
| `<module>/README.md` | Human overview, diagrams, commands | Read first for orientation |
| `<module>/docs/` | Deep dives, architecture decisions (ADRs) | Read before structural changes; add an ADR for non-obvious decisions |
| `<module>/specs/` | Feature specs per milestone (`M<N>-<feature>.md`) | Find or write the spec **before** implementing a feature |
| `<module>/INSIGHTS.md` | Gotchas and lessons learned (7 fixed sections, append-only) | Imported into the module's CLAUDE.md; written only via the `engineering-insights` skill |

Repo-wide docs: [docs/agent-prompts/](docs/agent-prompts/README.md) (built-in
reviewer prompts, model choice).

## Session protocol

1. **Before work** (after the user's prompt): use the `engineering-insights` skill
   to read the target module's `INSIGHTS.md` and state the top 3 points relevant
   to the task.
2. **Before finishing a non-trivial task**: run `engineering-insights`. Write
   only what is new and non-obvious; writing nothing is fine. Do not skip this step.
3. `INSIGHTS.md` is **append-only**: never edit or delete existing entries.

## Workflow

1. Find the spec in `<module>/specs/` (or write one from
   [the template](server/specs/README.md) if the feature has none).
2. Read the module's `CLAUDE.md`, `README.md` and the relevant `docs/`.
3. Implement and test inside the module; keep CI lanes green (see TESTING.md).
4. Learned something a future session would trip over? Run the
   `engineering-insights` skill to append it to `<module>/INSIGHTS.md`.
   Behaviour changed? Update the README or `docs/`.
