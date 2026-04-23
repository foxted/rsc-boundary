# rsc-boundary

## 1.0.0

### Major Changes

- Add TanStack Start support and split into framework adapter packages.
  - Introduce `@rsc-boundary/core`: framework-agnostic fiber walk, highlights engine, devtools UI, and `FrameworkAdapter` contract.
  - Introduce `@rsc-boundary/next`: Next.js App Router adapter. Drop-in replacement for `rsc-boundary`.
  - Introduce `@rsc-boundary/start`: TanStack Start / TanStack Router adapter.
  - `rsc-boundary` becomes a back-compat shim re-exporting `@rsc-boundary/next`. Existing imports continue to work unchanged.

### Patch Changes

- Updated dependencies
  - @rsc-boundary/next@1.0.0

## 0.2.0

### Minor Changes

- 1160eaf: Redesign **RscDevtools** with a panel, legend, pills, and dedicated client/server entries; add stable update comparison for scanned fibers.

  Improve **server-boundary highlighting** (captions, host labels, fiber/DOM handling) and expand tests for server-region detection.

  Export **`HighlightKind`** for overlay styling.

  Declare an optional **`next` peer dependency** for clearer Next.js integration.

  ### Breaking changes (pre-1.0)
  - Rename exported type **`ComponentInfo`** to **`ClientComponentInfo`**.
  - **`HighlightState`** now uses **`clientComponents`** instead of **`components`**.

  README and usage docs updated for **RscBoundaryProvider** and examples.

## 0.1.0

### Minor Changes

- b0d9ca0: Initial stable API release: visualize React Server Component vs client boundaries in Next.js App Router.
