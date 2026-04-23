# @rsc-boundary/next

Next.js App Router adapter for [RSC Boundary](https://github.com/foxted/rsc-boundary) — visualize the boundary between React Server Components and Client Components in your browser.

## Quick start

```bash
pnpm add @rsc-boundary/next
# or: npm install @rsc-boundary/next
# or: yarn add @rsc-boundary/next
```

In your root layout (`app/layout.tsx`):

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
} from "@rsc-boundary/next";
```

Wrap a server-rendered subtree with `<RscServerBoundaryMarker label="MyRegion">` to give it a stable name in the panel instead of the heuristic host-tag label.

The marker uses an `asChild`-style pattern: it does **not** render a wrapper element. Instead it injects `data-rsc-boundary-server="MyRegion"` onto its single child element during development. In production builds it is a pure pass-through — no cloning, no attribute, no extra DOM — so forgetting a marker in production has zero impact on the shipped HTML or CSS.

Pass a single React element as children. For reliable detection prefer a host element (e.g. `<section>`, `<div>`); custom components only propagate the attribute if they spread unknown props onto their root DOM node.

## Migrating from `rsc-boundary`

Replace the import:

```bash
pnpm remove rsc-boundary && pnpm add @rsc-boundary/next
```

```diff
-import { RscBoundaryProvider } from "rsc-boundary";
+import { RscBoundaryProvider } from "@rsc-boundary/next";
```

The API is identical.

## Requirements

- Next.js 16+ (App Router)
- React 19+
