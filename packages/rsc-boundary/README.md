# rsc-boundary

> **This package is a back-compatibility shim.** It re-exports everything from
> [`@rsc-boundary/next`](https://www.npmjs.com/package/@rsc-boundary/next).
> Existing code that imports from `rsc-boundary` continues to work with no
> changes. For new projects, install `@rsc-boundary/next` directly.

## Upgrade

Replace the package:

```bash
# Remove the shim
pnpm remove rsc-boundary

# Install the Next.js adapter
pnpm add @rsc-boundary/next
```

Then update imports (one global find-and-replace is enough):

```diff
-import { RscBoundaryProvider } from "rsc-boundary";
+import { RscBoundaryProvider } from "@rsc-boundary/next";
```

Nothing else changes — the API surface is identical.

## TanStack Start

For TanStack Start, use [`@rsc-boundary/start`](https://www.npmjs.com/package/@rsc-boundary/start) instead.

## Documentation

Full docs live in the
[`@rsc-boundary/next` README](https://github.com/foxted/rsc-boundary/tree/main/packages/rsc-boundary-next)
and the [repository README](https://github.com/foxted/rsc-boundary).
