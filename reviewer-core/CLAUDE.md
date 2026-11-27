# reviewer-core — `@devdigest/reviewer-core`

Pure review engine: **diff → prompt → LLM → grounded findings**. No DB, GitHub
or filesystem access. The only side effect is an LLM call through an injected
`LLMProvider`. Human overview, pipeline diagram and public API: [README.md](README.md).

## Commands (npm, run inside `reviewer-core/`)

- `npm test`: hermetic vitest with a stubbed `LLMProvider`
- `npm run typecheck`: this is the build; the package never emits JS

## Rules

- Keep it pure. No imports from `server/` internals, no I/O beyond the injected
  provider. If a feature needs data, the caller resolves it and passes a string in.
- All untrusted content (diff, PR body, code, skills, specs) is wrapped with
  `wrapUntrusted()`, and `INJECTION_GUARD` stays on every system prompt. Never
  keyword-scan untrusted text as a defense.
- Grounding is mandatory: `groundFindings()` drops findings that don't cite a
  real diff line, and the score is recomputed from the survivors.
- The public surface is `src/index.ts`. Export anything new there.
- The server consumes the TypeScript **source** via a path alias. A change here
  also triggers `server-unit` CI, so run the server typecheck too.

## Documentation (read before changing)

- Pipeline, prompt slots, public API → [README.md](README.md)
- Architecture decisions, deep dives → [docs/](docs/README.md)
- Feature specs (find the spec before coding) → [specs/](specs/README.md)
- Built-in reviewer prompts and model choice → [../docs/agent-prompts/](../docs/agent-prompts/README.md)
- Caller (`modules/reviews/run-executor.ts`) → [../server/CLAUDE.md](../server/CLAUDE.md)

## Insights

@INSIGHTS.md
