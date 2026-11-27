# e2e — insights

Gotchas and lessons learned. Imported into CLAUDE.md, so keep it lean (~80 lines).
**Append-only**, written by the `engineering-insights` skill (`.claude/skills/engineering-insights`).
Format: `- **YYYY-MM-DD · title** → why → ALWAYS/NEVER do X. _(evidence: path + symbol)_` (one line, no line numbers).
Never edit or delete entries in a session; supersede with a new dated entry. Pruning is a human task.

## What Works

## What Doesn't Work
- **Never `docker compose down -v` to reset** → it deletes the `devdigest_pgdata` volume with real imported repos.

## Codebase Patterns
- **Flows moved from `specs/` to `flows/`** (2026-11-22) → `specs/` is now for feature specs, like in other modules.

## Tool & Library Notes

## Recurring Errors & Fixes
- **Flows 02/04/05 fail against a normal dev DB** → they follow the redirect to the *first* repo and assume only the seeded one exists → use `./scripts/e2e.sh` (hermetic stack).

## Session Notes

## Open Questions
