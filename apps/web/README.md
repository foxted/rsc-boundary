# web

Documentation and demo site for **RSC Boundary**, built with Next.js App Router.

## Scripts

From repo root:

```bash
pnpm --filter web dev
pnpm --filter web build
```

Or from `apps/web`:

```bash
pnpm dev
pnpm build
```

This app depends on **`@rsc-boundary/next`** (same as recommended for Next.js users). TanStack Start apps should use **`@rsc-boundary/start`**. The legacy unscoped **`rsc-boundary`** package is a shim that re-exports `@rsc-boundary/next`.

The documentation **Examples** page uses static outline components (`FakeServerChrome` / `FakeClientChrome` in `components/examples/boundary-chrome.tsx`, plus `HeroToolSurface` on the home page) that reuse `COLORS` from `@rsc-boundary/next` so deployed docs can preview the look without mounting devtools in production.
