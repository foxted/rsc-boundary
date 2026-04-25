# @rsc-boundary/core

## 1.0.0

### Minor Changes

- Add TanStack Start support and split into framework adapter packages.
  - Introduce `@rsc-boundary/core`: framework-agnostic fiber walk, highlights engine, devtools UI, and `FrameworkAdapter` contract.
  - Introduce `@rsc-boundary/next`: Next.js App Router adapter. Drop-in replacement for `rsc-boundary`.
  - Introduce `@rsc-boundary/start`: TanStack Start / TanStack Router adapter.
  - `rsc-boundary` becomes a back-compat shim re-exporting `@rsc-boundary/next`. Existing imports continue to work unchanged.
