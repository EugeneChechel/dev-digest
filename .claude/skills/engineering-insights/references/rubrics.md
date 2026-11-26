# Rubrics — what goes where

Every `<module>/INSIGHTS.md` has these `##` sections, in this order. Pick the one that best fits;
when two fit, prefer the one higher in the priority column.

| Section | Put here | Priority |
|---------|----------|----------|
| What Doesn't Work | Dead ends, abandoned approaches, antipatterns — and what to do instead. The most valuable and most often skipped section. | 1 |
| Recurring Errors & Fixes | An error message / symptom seen more than once → cause → fix. Quote the error text. | 2 |
| Tool & Library Notes | Quirks of dependencies and tooling (Fastify, Drizzle, Next, vitest, pnpm/npm, agent-browser, Docker). | 3 |
| Codebase Patterns | Conventions and architecture decisions that aren't obvious from one file (with the reason). | 4 |
| What Works | Approaches that proved themselves here and should be repeated. | 5 |
| Open Questions | Something unresolved a future session should check. Phrase as a question. | 6 |
| Session Notes | One dated line per session that wrote entries: `- YYYY-MM-DD — <task>: <what was learned>`. | — |

## Capture signals (strongest first)

1. The user corrected the agent ("no, do it this way", "that's wrong").
2. A fix needed more than one attempt, or an approach was abandoned.
3. A library/API/tool behaved unexpectedly.
4. A build, typecheck or test failure had a non-obvious cause.
5. A decision was made with a trade-off ("chose X over Y because…").
6. A project convention was discovered that isn't written down.

## Do not add

- General programming knowledge or anything in official docs.
- Anything inferable by reading the code, or already in the module's README, `docs/`, CLAUDE.md or INSIGHTS.md.
- Transient issues (network errors, a flaky container start).
- One-off task details, code-change logs ("renamed x to y"), personal style preferences.
- Line numbers or temporary file paths — they rot. Cite `path` + symbol instead.
- Vague advice ("be careful with async") — see examples.md.
