# RSC Boundary

Visualize the boundary between React Server Components and Client Components in Next.js (App Router). Wrap your root layout with a single provider and get automatic, zero-config highlighting of every client component boundary in your app.

## Quick start

```bash
pnpm add rsc-boundary
```

In your root layout:

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

That's it. No changes needed to any other component.

## What it does

A small floating pill appears in the bottom-left corner of your page during development. Click it to toggle boundary highlighting:

- **Orange dashed outlines** around client component subtrees (`"use client"`)
- **Blue dashed outlines** around server-rendered regions (heuristic **~** or optional **explicit** markers)
- **Labels** on each region showing the component name / host tag and provenance
- **Panel** listing client components and server regions with explicit vs heuristic badges

In production builds, `RscBoundaryProvider` renders only `{children}` — zero runtime cost, no extra DOM nodes, completely tree-shaken.

To force devtools in production (e.g. a documentation site), pass `enabled`:

```tsx
<RscBoundaryProvider enabled>{children}</RscBoundaryProvider>
```

The package also exports `RscDevtools` for advanced wiring, and optional `RscServerBoundaryMarker` / `SERVER_BOUNDARY_DATA_ATTR` for explicit server regions; most apps should rely on the provider only.

## How it works

React Server Components are resolved on the server and sent to the client as pre-rendered HTML. They have **no fibers** in the client-side React tree. Client Components are hydrated and **do** have fibers.

When you toggle the devtools on, RSC Boundary walks the React fiber tree (via the `__reactFiber$*` property that React attaches to DOM elements) and:

1. Finds every `FunctionComponent`, `ClassComponent`, `ForwardRef`, and `MemoComponent` fiber
2. Filters out Next.js framework internals (LayoutRouter, ErrorBoundary, etc.)
3. Maps each remaining user-defined component to its root DOM node(s) — these are your **client component boundaries**
4. Collects **explicit** regions: elements with `data-rsc-boundary-server` (e.g. `RscServerBoundaryMarker`)
5. Derives **heuristic** regions by walking the app root: nodes outside every client subtree, minus wrappers that strictly contain a client root — including **nested** server islands, not only top-level siblings

A `MutationObserver` watches for DOM changes (route navigation, lazy loading) and re-scans automatically.

## Architecture

```
packages/rsc-boundary/src/
├── index.ts                  # Public API
├── constants.ts              # data attribute name for explicit markers
├── provider.tsx              # Server component — children + <RscDevtools /> in dev
├── server-boundary-marker.tsx # Optional explicit server region wrapper
├── devtools.tsx              # "use client" — pill, panel, scan trigger
├── fiber-utils.ts            # Fiber walk + server region detection
├── highlight.ts              # Outlines, labels, MutationObserver
├── styles.ts
└── types.ts
```

## Limitations

- **Uses React internals** (`__reactFiber$*`): same approach React DevTools uses. Dev-only, so stability risk is low.
- **Heuristic server names**: regions outside client subtrees are labeled by host tag / id unless you add `data-rsc-boundary-server` or `RscServerBoundaryMarker` for an explicit label.
- **Slots inside client trees**: DOM passed as children into a client component is still under that client root for highlighting; use explicit markers if you need a named server region there.
- **Next.js internal filtering**: maintains a list of known Next.js internal component names to exclude. May need updates when Next.js adds or renames internals.

## Requirements

- Next.js 16+ (App Router)
- React 19+
