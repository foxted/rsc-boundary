# rsc-boundary

Visualize the boundary between React Server Components and Client Components in Next.js (App Router). Wrap your root layout with a single provider and get automatic, zero-config highlighting of every client component boundary in your app.

## Quick start

```bash
pnpm add rsc-boundary
```

In your root layout:

```tsx
import { RscBoundaryProvider } from "rsc-boundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
      </body>
    </html>
  );
}
```

That's it. No changes needed to any other component.

## What it does

A small floating pill appears in the bottom-left corner of your page during development. Click it to toggle boundary highlighting:

- **Orange dashed outlines** around client component subtrees (`"use client"`)
- **Blue dashed outlines** around server-rendered regions
- **Labels** on each region showing the component name and render type
- **Panel** listing all detected components with counts

In production builds, `RscBoundaryProvider` renders only `{children}` — zero runtime cost, no extra DOM nodes, completely tree-shaken.

## How it works

React Server Components are resolved on the server and sent to the client as pre-rendered HTML. They have **no fibers** in the client-side React tree. Client Components are hydrated and **do** have fibers.

When you toggle the devtools on, `rsc-boundary` walks the React fiber tree (via the `__reactFiber$*` property that React attaches to DOM elements) and:

1. Finds every `FunctionComponent`, `ClassComponent`, `ForwardRef`, and `MemoComponent` fiber
2. Filters out Next.js framework internals (LayoutRouter, ErrorBoundary, etc.)
3. Maps each remaining user-defined component to its root DOM node(s) — these are your **client component boundaries**
4. Everything else in the DOM is **server component output**

A `MutationObserver` watches for DOM changes (route navigation, lazy loading) and re-scans automatically.

## Architecture

```
packages/rsc-boundary/src/
├── index.ts          # Public API: exports RscBoundaryProvider
├── provider.tsx      # Server component — renders children + <RscDevtools /> in dev
├── devtools.tsx      # "use client" — floating toggle pill + legend panel
├── fiber-utils.ts    # React fiber tree walking + component detection
├── highlight.ts      # DOM outline/label application + MutationObserver
├── styles.ts         # CSS-in-JS constants (no external CSS deps)
└── types.ts          # Shared interfaces
```

## Limitations

- **Uses React internals** (`__reactFiber$*`): same approach React DevTools uses. Dev-only, so stability risk is low.
- **Cannot name server components**: since they have no fibers, their DOM regions are labeled generically ("Server: div"). A future build-time transform could add named markers.
- **Next.js internal filtering**: maintains a list of known Next.js internal component names to exclude. May need updates when Next.js adds or renames internals.

## Requirements

- Next.js 14+ (App Router)
- React 19+
