# RSC Boundary

Monorepo for **RSC Boundary**: devtools that visualize the boundary between **React Server Components** and **Client Components** in Next.js (App Router). Add a single provider to your root layout and get in-browser outlines, labels, and a panel that map server vs client regions—without touching individual components.

The published library lives under [`packages/rsc-boundary`](packages/rsc-boundary). The demo site, docs snippets, and playground live under [`apps/web`](apps/web).

![RSC Boundary devtools on the demo site: blue outlines for server regions, orange for client components](apps/web/public/screenshot.png)

## Install in your Next.js app

Requirements: **Next.js 16+** (App Router), **React 19+**.

Install the npm package (name is `rsc-boundary`):

```bash
pnpm add rsc-boundary
# or: npm install rsc-boundary
# or: yarn add rsc-boundary
```

In your **root** `app/layout.tsx` (or `src/app/layout.tsx`), wrap `children` with `RscBoundaryProvider`:

```tsx
import { RscBoundaryProvider } from "rsc-boundary";

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

You do not need to change any other components. In development, a small control appears so you can toggle server/client boundary highlights. In production builds the provider renders only `children` (no extra cost); pass `enabled` if you need devtools on a deployed site (for example this repo’s demo).

More detail—behavior, optional APIs, architecture, and limitations—is in **[`packages/rsc-boundary/README.md`](packages/rsc-boundary/README.md)**.

To work on this repository (layout, local dev, where to put changes), see **[`CONTRIBUTING.md`](CONTRIBUTING.md)** and [`AGENTS.md`](AGENTS.md).

## Releases

Versioning and publishing use [Changesets](https://github.com/changesets/changesets). From the repo root:

```bash
pnpm changeset        # describe changes
pnpm version-packages # bump versions from changesets
pnpm release          # build package and publish (maintainers)
```

## License

See [LICENSE](LICENSE). The `rsc-boundary` package includes its own [LICENSE](packages/rsc-boundary/LICENSE).
