# reviewer-core — insights

Gotchas and lessons learned. Imported into CLAUDE.md, so keep it lean (~80 lines).
**Append-only**, written by the `engineering-insights` skill (`.claude/skills/engineering-insights`).
Format: `- **YYYY-MM-DD · title** → why → ALWAYS/NEVER do X. _(evidence: path + symbol)_` (one line, no line numbers).
Never edit or delete entries in a session; supersede with a new dated entry. Pruning is a human task.

## What Works

## What Doesn't Work
- **Prompt-injection defense is the shared `INJECTION_GUARD`, not text filtering** → a keyword denylist only catches one phrasing, in one language.

## Codebase Patterns
- **`@devdigest/shared` resolves to `../server/src/vendor/shared`** → a server contract change can break this package's typecheck.

## Tool & Library Notes
- **Uses npm, not pnpm** (`package-lock.json`) → don't add a pnpm lockfile.

## Recurring Errors & Fixes

## Session Notes

## Open Questions
