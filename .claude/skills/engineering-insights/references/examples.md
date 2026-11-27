# Entry format and examples

## Format

One line, at most two sentences:

```
- **YYYY-MM-DD · <short title>** → <why / cause> → <ALWAYS/NEVER do X>. _(evidence: path/to/file.ts `symbol`)_
```

- Lead with the symptom or fact, then why, then the action.
- Name concrete files, functions, commands, error text.
- A reader who has never seen the session must know what to do ("actionable cold").
- Test: if it would be obvious to anyone reading the code — don't write it.

## Good

```
- **2026-03-24 · Promise.all times out on ingest** → Promise.all() on the ingestion pipeline times out after ~30 items → ALWAYS use Promise.allSettled() in batches of 10 here. _(evidence: pipeline/ingest.ts `ingestAll`)_
```
Why it works: exact API, exact threshold, exact replacement, scoped to a place.

```
- **2026-11-22 · `relation ... does not exist` on first run** → migrations are not applied on boot → run `pnpm db:migrate` inside `server/`. _(evidence: server/src/db `migrate`)_
```
Why it works: quotes the real error text, gives the cause and the one command.

```
- **2026-11-22 · @devdigest/shared exists twice** → `server/src/vendor/shared` and `client/src/vendor/shared` have drifted; reviewer-core reads the server copy → ALWAYS update both and diff them when changing a shared contract.
```
Why it works: names both paths and the non-obvious consumer.

```
- **2026-03-24 · Checkout state lives in Zustand** → the cart is shared by 3 components; local state desyncs → ALWAYS go through `cartStore.ts`.
```
Why it works: the decision plus its reason.

## Bad

```
- Promises can be tricky
```
Why it fails: a truism, zero discovered knowledge.

```
- Be careful with async
```
Why it fails: no place, no symptom, no action.

```
- Fixed a bug on line 47 of parser.ts
```
Why it fails: line 47 will move; it's a change log, not a lesson.

```
- Renamed `runReview` to `executeReview`
```
Why it fails: an implementation detail, visible in git history.

## Supersede (never edit old entries)

```
- **2026-12-01 · Supersedes: "Promise.all times out on ingest"** → the ingest client now streams; batching is no longer needed → use `ingestStream()`. _(evidence: pipeline/ingest.ts `ingestStream`)_
```
