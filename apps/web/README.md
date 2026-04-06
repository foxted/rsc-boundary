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

The documentation **Examples** page uses static outline components (`FakeServerChrome` / `FakeClientChrome`) that reuse `COLORS` from `rsc-boundary` so deployed docs can preview the look without mounting devtools in production.
