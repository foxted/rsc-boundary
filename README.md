# RSC Boundary

**See where Server Components end and Client Components begin**—directly in the browser, on your real app.

RSC Boundary is a lightweight devtool for **React Server Component** apps. Add one provider to your root layout and you get outlines, labels, and a panel that map **server-rendered regions** vs **client subtrees**—no annotations on every file, no guessing from the file tree alone.

The published packages live under `packages/`; the **demo site and playground** live under `apps/web`. Minimal adapter smoke-tests live under `playgrounds/`.

![RSC Boundary devtools on the demo site: blue outlines for server regions, orange for client components](apps/web/public/screenshot.png)

## Why use it

- **Make the RSC mental model concrete.** Server Components have no client fibers; Client Components hydrate. That split is easy to lose when you're deep in JSX—this tool surfaces it on the page you're building.
- **Onboard and review faster.** Spot accidental client boundaries, nested server islands, and where interactivity actually lives without spelunking through `"use client"` directives.
- **Zero ceremony in production.** In production builds the provider is a pass-through: no extra DOM, no runtime cost. Highlights run only in development.

## What you get (dev mode)

- **Orange** dashed outlines around client component roots (`"use client"`).
- **Blue** dashed outlines around server regions (heuristic detection, plus optional explicit markers when you need precision).
- **Labels** and a **panel** with component names and provenance—so you can correlate the UI with your source.

## Install

### Next.js (App Router)

**Requirements:** Next.js **16+** (App Router), React **19+**.

```bash
pnpm add @rsc-boundary/next
# or: npm install @rsc-boundary/next
# or: yarn add @rsc-boundary/next
```

Wrap `children` in your **root** `app/layout.tsx`:

```tsx
import { RscBoundaryProvider } from "@rsc-boundary/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
      </body>
    </html>
  );
}
```

### TanStack Start

**Requirements:** `@tanstack/react-start` **1+**, React **19+**.

```bash
pnpm add @rsc-boundary/start
```

Wrap `children` in your root route (`app/routes/__root.tsx`):

```tsx
import { RscBoundaryProvider } from "@rsc-boundary/start";
```

See [`packages/rsc-boundary-start/README.md`](packages/rsc-boundary-start/README.md) for the full integration guide.

### Migrating from `rsc-boundary`

The legacy `rsc-boundary` package is now a back-compat shim for `@rsc-boundary/next`. Existing code keeps working — when you're ready, migrate in two steps:

```bash
pnpm remove rsc-boundary && pnpm add @rsc-boundary/next
```

```diff
-import { RscBoundaryProvider } from "rsc-boundary";
+import { RscBoundaryProvider } from "@rsc-boundary/next";
```

## Packages

| Package | Description |
|---|---|
| [`@rsc-boundary/core`](packages/rsc-boundary-core) | Framework-agnostic: fiber walk, highlighting engine, devtools UI, adapter contract |
| [`@rsc-boundary/next`](packages/rsc-boundary-next) | Next.js App Router adapter + `RscBoundaryProvider` |
| [`@rsc-boundary/start`](packages/rsc-boundary-start) | TanStack Start adapter + `RscBoundaryProvider` |
| [`rsc-boundary`](packages/rsc-boundary) | Back-compat shim — re-exports `@rsc-boundary/next` |

For behavior details, optional APIs (`RscDevtools`, explicit server markers), architecture, and limitations, read the per-package READMEs.

## Agent skill (`install`)

This repo includes coding-agent skills that walk through the integration steps:

- **Next.js:** [`skills/install-next`](skills/install-next)
- **TanStack Start:** [`skills/install-start`](skills/install-start)

```bash
npx skills add foxted/boundary --skill install-next
npx skills add foxted/boundary --skill install-start
```

## Contributing

Layout, local dev, and where to put changes: **[`CONTRIBUTING.md`](CONTRIBUTING.md)** and [`AGENTS.md`](AGENTS.md).

## Releases

Versioning and publishing use [Changesets](https://github.com/changesets/changesets). All four publishable packages are versioned together (same version at every release). From the repo root:

```bash
pnpm changeset        # describe changes
pnpm version-packages # bump versions from changesets
pnpm release          # build packages and publish (maintainers)
```

## License

See [LICENSE](LICENSE). Each package includes its own LICENSE file.
