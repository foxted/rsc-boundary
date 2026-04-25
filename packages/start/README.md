# @rsc-boundary/start

TanStack Start adapter for [RSC Boundary](https://github.com/foxted/rsc-boundary) — visualize the boundary between React Server Components and Client Components in your browser.

## Quick start

```bash
pnpm add @rsc-boundary/start
# or: npm install @rsc-boundary/start
# or: yarn add @rsc-boundary/start
```

In your root route (`app/routes/__root.tsx`):

```tsx
import { RscBoundaryProvider } from "@rsc-boundary/start";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        <RscBoundaryProvider>
          <Outlet />
        </RscBoundaryProvider>
        <Scripts />
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

In production builds, `RscBoundaryProvider` renders only `{children}` — no devtools UI, no extra DOM nodes, and no scanning work.

## Optional API

```tsx
import {
  RscServerBoundaryMarker, // explicit server region labeling
  SERVER_BOUNDARY_DATA_ATTR, // raw data attribute
} from "@rsc-boundary/start";
```

Wrap a server-rendered subtree with `<RscServerBoundaryMarker label="MyRegion">` to give it a stable name in the panel instead of the heuristic host-tag label.

The marker uses an `asChild`-style pattern: it does **not** render a wrapper element. Instead it injects `data-rsc-boundary-server="MyRegion"` onto its single child element during development. In production builds it is a pure pass-through — no cloning, no attribute, no extra DOM — so forgetting a marker in production has zero impact on the shipped HTML or CSS.

Pass a single React element as children. For reliable detection prefer a host element (e.g. `<section>`, `<div>`); custom components only propagate the attribute if they spread unknown props onto their root DOM node.

## Internals filter

The adapter ships with a curated list of TanStack Router / Start internal component names that are excluded from the client-component scan (e.g. `RouterProvider`, `Outlet`, `Match`, `Scripts`). If you spot a TanStack internal still appearing in the panel, [open an issue](https://github.com/foxted/rsc-boundary/issues) with the component name.

## Requirements

- `@tanstack/react-start` 1+
- React 19+
