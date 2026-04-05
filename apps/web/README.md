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

The root layout wraps the app with `RscBoundaryProvider enabled` so RSC Boundary devtools work in production on this site.
