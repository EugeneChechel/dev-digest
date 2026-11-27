# M1 — Severity counters & filter on findings (client)

Status: done

## Goal
On the PR page → Agent runs → Review runs, an expanded run lists its findings as
cards. To know how many are critical you had to scroll and count. A row of
per-severity counters ("3 CRITICAL · 5 WARNING · 2 SUGGESTION") above the list
shows the distribution at once; clicking a level filters the list to it.

## Scope
- `FindingsPanel` (body of `ReviewRunAccordion`): new `SeverityCounters` row in the
  toolbar, left of "Hide low confidence".
- Counting and filtering are pure client-side over the findings the panel already
  has (`usePrReviews` → `GET /pulls/:id/reviews`). **No new route, table, request or
  model call.**
- Colours/icons from `SEV` (`@devdigest/ui`); labels in `messages/en/prReview.json`.
- Not to be confused with "N blockers" in the accordion header (unaccepted CRITICAL).

## Behaviour
- Counts = findings of each level **in the current list** (i.e. after "Hide low
  confidence"), so numbers always match what is shown.
- Click a level → only that level is listed; the active counter is filled with its
  `SEV` colour, the other two are muted (independent of hover).
- Click another level → selection moves; click the active one again → filter cleared.
- A level with 0 findings shows `0` and is not clickable.
- Severity filter and "Hide low confidence" combine (AND).
- Nothing left after filtering → the panel's existing empty state.
- Accept/dismiss doesn't remove findings, so counts stay in sync without reload.

## Contracts
None changed. Uses `FindingRecord.severity` (`Severity` = CRITICAL | WARNING | SUGGESTION).

## Acceptance criteria
- [x] Expanded run shows counters for all three levels (`3 CRITICAL`, `5 WARNING`, `2 SUGGESTION`).
- [x] Counts equal the number of findings of each level in that run's list.
- [x] Clicking a level leaves only that level's findings; clicking it again restores the full list.
- [x] Active level is visually marked; only one level is active at a time.
- [x] Works together with Hide low confidence (both conditions apply).
- [x] Zero level shows `0` without breaking the row.
- [x] Empty result shows the existing empty state.
- [x] Clicking a counter issues no network request (pure state; covered by tests with no fetch).

## Out of scope
- Persisting the filter in the URL / across runs.
- The Findings icons + hover popover on the PR list (existing, untouched).
