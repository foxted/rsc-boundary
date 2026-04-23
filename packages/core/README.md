# @rsc-boundary/core

Framework-agnostic core of [RSC Boundary](https://github.com/foxted/rsc-boundary).

This package contains the React fiber walking engine, highlight overlay, devtools UI components (pill, panel), and the `FrameworkAdapter` contract. It has no dependency on Next.js or TanStack Start.

**You do not need to install this package directly.** Install the adapter for your framework instead:

- [`@rsc-boundary/next`](https://www.npmjs.com/package/@rsc-boundary/next) — Next.js App Router
- [`@rsc-boundary/start`](https://www.npmjs.com/package/@rsc-boundary/start) — TanStack Start

## Building a custom adapter

If you want to support a different RSC framework, implement `FrameworkAdapter` and use `createRscBoundaryProvider`:

```ts
import type { FrameworkAdapter } from "@rsc-boundary/core";

export const myAdapter: FrameworkAdapter = {
  name: "my-framework",
  internals: new Set(["RouterProvider", "InternalComponent", /* ... */]),
  rootCandidates: () => [
    document.getElementById("app"),
    document.body,
    document.documentElement,
  ],
  resolveScanContainer: () =>
    document.getElementById("app") ?? document.body,
};
```

```tsx
// devtools.tsx  ("use client")
import { RscDevtools } from "@rsc-boundary/core";
import { myAdapter } from "./adapter";

export function RscDevtoolsMyFramework() {
  return <RscDevtools adapter={myAdapter} />;
}
```

```tsx
// provider.tsx  (no "use client" — server component)
import { createRscBoundaryProvider } from "@rsc-boundary/core";
import { RscDevtoolsMyFramework } from "./devtools";

export const RscBoundaryProvider = createRscBoundaryProvider(RscDevtoolsMyFramework);
```

## API

| Export | Description |
|---|---|
| `createRscBoundaryProvider(DevtoolsComponent)` | Factory that returns a server component provider |
| `RscDevtools` | Client component; accepts `adapter` prop |
| `RscServerBoundaryMarker` | Optional server component for explicit region labeling |
| `FrameworkAdapter` | Interface adapter objects must implement |
| `SERVER_BOUNDARY_DATA_ATTR` | Data attribute used by `RscServerBoundaryMarker` |

## Requirements

- React 19+
- react-dom 19+
