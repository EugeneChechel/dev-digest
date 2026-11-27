# client — `@devdigest/web`

Next.js 15 (App Router) + React 19 studio UI. Data comes from TanStack Query
hooks over the Fastify API. Human overview and UI route map: [README.md](README.md).

## Commands (pnpm, run inside `client/`)

- `pnpm dev`: web on `:3000` (expects the API on `NEXT_PUBLIC_API_BASE`, default `:3001`)
- `pnpm test`: vitest + jsdom, `fetch` mocked, no API needed
- `pnpm typecheck` · `pnpm build`

## Rules

- Pages (`src/app/**/page.tsx`) stay thin. Feature logic goes in colocated
  `_components/<Name>/` folders, each with its own `*.test.tsx`.
- All API access goes through `src/lib/api.ts` and a hook in `src/lib/hooks/*`.
  No raw `fetch` in components.
- UI strings go through `next-intl` (`messages/<locale>/*.json`). Don't hardcode copy.
- UI primitives come from `@devdigest/ui` (`src/vendor/ui`). Contracts come from
  `@devdigest/shared` (`src/vendor/shared`).
- Cross-cutting chrome (nav, breadcrumbs, shortcuts) lives in `src/components/app-shell`.

## Documentation (read before changing)

- Route map and the API each route uses → [README.md](README.md)
- UI primitives → [src/vendor/ui/README.md](src/vendor/ui/README.md)
- Architecture decisions, deep dives → [docs/](docs/README.md)
- Feature specs (find the spec before coding) → [specs/](specs/README.md)
- API this UI talks to → [../server/CLAUDE.md](../server/CLAUDE.md)
- Browser journeys covering these screens → [../e2e/CLAUDE.md](../e2e/CLAUDE.md)
- Test strategy → [../TESTING.md](../TESTING.md)

## Insights

@INSIGHTS.md
