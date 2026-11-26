# server — insights

Gotchas and lessons learned. Imported into CLAUDE.md, so keep it lean (~80 lines).
**Append-only**, written by the `engineering-insights` skill (`.claude/skills/engineering-insights`).
Format: `- **YYYY-MM-DD · title** → why → ALWAYS/NEVER do X. _(evidence: path + symbol)_` (one line, no line numbers).
Never edit or delete entries in a session; supersede with a new dated entry. Pruning is a human task.

## What Works

## What Doesn't Work

## Codebase Patterns
- **`@devdigest/shared` exists twice** (`server/src/vendor/shared` and `client/src/vendor/shared`) and the copies have drifted → reviewer-core reads the **server** copy → when you change a contract used by both sides, update both and diff them.
- **Unindexed repo = diff-only review** → repo map and blast-radius sections only populate after indexing → check the Indexed badge before debugging "missing context".

## Tool & Library Notes
- **`server/package.json` is `skip-worktree`** → a local variant differs from the committed file → CI calls `pnpm exec vitest run …` directly. Don't rely on `test:unit` / `test:integration` scripts.
- **Rate limit is off under `NODE_ENV=test`** → a limit bug won't show up in tests → cover per-route caps explicitly.

## Recurring Errors & Fixes
- **API errors on first run (`relation ... does not exist`)** → migrations don't run on boot → run `pnpm db:migrate`.

## Session Notes

## Open Questions
