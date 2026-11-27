# server — `@devdigest/api`

Fastify 5 + Drizzle ORM over Postgres (pgvector). Imports repos and PRs, indexes
them with repo-intel, stores agents, runs reviews through `reviewer-core`.
Human overview, request/DI flow, API map and env vars: [README.md](README.md).

## Commands (pnpm, run inside `server/`)

- `pnpm dev`: API on `:3001`
- `pnpm typecheck`
- Unit (hermetic): `pnpm exec vitest run --exclude '**/*.it.test.ts'`
- Integration (Docker): `pnpm exec vitest run .it.test`
- `pnpm db:migrate`: **not** applied on boot. `pnpm db:seed` is idempotent.
- `pnpm db:generate`: after changing the Drizzle schema in `src/db/`

## Rules

- A new feature is a self-contained `src/modules/<name>/` plugin with its own
  `routes.ts`, registered statically in `src/modules/index.ts`.
- Routes declare Zod `params`/`body` schemas from `@devdigest/shared`
  (`src/vendor/shared`). Don't hand-roll `Schema.parse(req.body)` in handlers.
- External systems (LLM, GitHub, git, ast-grep, secrets) are adapters resolved
  through the DI container (`src/platform/container.ts`). Tests use
  `src/adapters/mocks.ts`.
- Errors go through `AppError` and the shared error handler. Don't send ad-hoc
  error shapes.
- A test that imports `test/helpers/pg.ts` **must** be named `*.it.test.ts`.
- Secrets are read only through `LocalSecretsProvider`
  (`src/adapters/secrets/local.ts`).

## Documentation (read before changing)

- Request flow, API map, env, review context → [README.md](README.md)
- Architecture decisions, deep dives → [docs/](docs/README.md)
- Feature specs (find the spec before coding) → [specs/](specs/README.md)
- repo-intel indexer → [src/modules/repo-intel/README.md](src/modules/repo-intel/README.md)
- Built-in agent prompts → [../docs/agent-prompts/](../docs/agent-prompts/README.md)
- Test strategy and CI lanes → [../TESTING.md](../TESTING.md)
- Engine the server calls → [../reviewer-core/CLAUDE.md](../reviewer-core/CLAUDE.md)

## Insights

@INSIGHTS.md
