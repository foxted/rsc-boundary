# @rsc-boundary/start

## 0.3.1

### Patch Changes

- Updated dependencies [d8a73d0]
  - @rsc-boundary/core@0.3.1

## 0.3.0

### Minor Changes

- ce5f31a: Initial release of the scoped packages. Migrate from `rsc-boundary` to the framework adapter that matches your stack: `@rsc-boundary/next` (Next.js) or `@rsc-boundary/start` (TanStack Start). Each adapter pulls in `@rsc-boundary/core` transitively — no separate install needed.

### Patch Changes

- Updated dependencies [ce5f31a]
  - @rsc-boundary/core@0.3.0

## 1.0.0

### Minor Changes

- Add TanStack Start support and split into framework adapter packages.
  - Introduce `@rsc-boundary/core`: framework-agnostic fiber walk, highlights engine, devtools UI, and `FrameworkAdapter` contract.
  - Introduce `@rsc-boundary/next`: Next.js App Router adapter. Drop-in replacement for `rsc-boundary`.
  - Introduce `@rsc-boundary/start`: TanStack Start / TanStack Router adapter.
  - `rsc-boundary` becomes a back-compat shim re-exporting `@rsc-boundary/next`. Existing imports continue to work unchanged.

### Patch Changes

- Updated dependencies
  - @rsc-boundary/core@1.0.0
