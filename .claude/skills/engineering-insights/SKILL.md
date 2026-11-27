---
name: engineering-insights
description: Reads and appends non-obvious engineering insights in the INSIGHTS.md of the dev-digest module being worked on (server, client, reviewer-core, e2e). Use before starting any task in a module to load its insights, whenever something non-obvious is discovered mid-session (a fix that took more than one attempt, a user correction, a dead end, a dependency quirk, a decision with a reason), and before finishing a task. Triggers on "record insights", "wrap up", "what did we learn", "запиши інсайти", "engineering insights".
---

<!-- TOKEN BUDGET: keep this file under ~60 lines. Details live in references/. -->

# Engineering Insights

Per-module, append-only learnings loop. Each module keeps its lessons in
`<module>/INSIGHTS.md` with fixed sections (see [references/rubrics.md](references/rubrics.md)).

## Workflow

1. **Route.** Map touched paths to a module: `server/**`, `client/**`, `reviewer-core/**`, `e2e/**`
   (`server/src/modules/repo-intel` → `server`). Several modules → each insight goes to the module
   whose behaviour it describes. No module fits → don't write; tell the user.
2. **Read first.** Before work, read `<module>/INSIGHTS.md` in full and state the top 3 points
   relevant to the task (or "nothing relevant"). Apply them.
3. **Notice.** Watch for capture signals, strongest first: user correction → fix that took more
   than one attempt / abandoned approach → unexpected library or tool behaviour → build/test failure
   cause → decision with a trade-off → discovered project convention.
4. **Gate + filter.** Trivial session → stop, write nothing. Otherwise keep only entries that are
   not obvious from the code, not already in INSIGHTS/README/docs, would save 5+ minutes next time,
   are project-specific, fit in ≤2 sentences, and cite no line numbers. Writing nothing is valid.
5. **Dedupe.** Re-read the file right before writing. Same lesson in other words = duplicate → skip.
   Refines or contradicts an entry → append a new dated entry starting `Supersedes: "<old title>"`.
   NEVER edit or delete an existing entry.
6. **Write.** One line per insight in the format from [references/examples.md](references/examples.md),
   only through the script (NEVER Write/Edit on INSIGHTS.md):
   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/append-insight.mjs" --module server \
     --section "What Doesn't Work" --entry "- **2026-11-23 · <title>** → <why> → <ALWAYS/NEVER …>. _(evidence: path `symbol`)_"
   ```
   Exit 1 on "duplicate" means it's already recorded — fine, move on.
7. **Session note.** Only if at least one entry was written: append one dated line to `Session Notes`.
8. **Report.** One line per action: added (module § section), skipped as duplicate, size warning.
   Don't prune — consolidation is a human task.

## When NOT to use

- Trivial sessions: a quick answer, a typo, a rename.
- Transient issues (network blip, flaky Docker start).
- Decisions that deserve an ADR in `<module>/docs/` or a spec in `<module>/specs/`.
- Open bugs to track — that's the issue tracker, not a lesson.
- Never write learnings into this skill's own files.
