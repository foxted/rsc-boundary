# @rsc-boundary/core

## 0.3.2

### Patch Changes

- 3e5be91: Switch build tooling from `tsc` to `tsup`. Output is ESM with proper `.js` import extensions, `"use client"` directives preserved on client-side chunks, and separate entry points for server/client boundaries. Fixes `ERR_MODULE_NOT_FOUND` in Node ESM consumers (TanStack Start and similar) more robustly than the `rewriteRelativeImportExtensions` workaround.

## 0.3.1

### Patch Changes

- d8a73d0: Fix ERR_MODULE_NOT_FOUND when consuming the package in Node ESM environments (e.g. TanStack Start) by enabling `rewriteRelativeImportExtensions` in the TypeScript build config. This ensures relative imports in emitted output have `.js` extensions as required by Node's ESM resolver.

## 0.3.0

### Minor Changes

- ce5f31a: Initial release of the scoped packages. Migrate from `rsc-boundary` to the framework adapter that matches your stack: `@rsc-boundary/next` (Next.js) or `@rsc-boundary/start` (TanStack Start). Each adapter pulls in `@rsc-boundary/core` transitively — no separate install needed.

## 1.0.0

### Minor Changes

- Add TanStack Start support and split into framework adapter packages.
  - Introduce `@rsc-boundary/core`: framework-agnostic fiber walk, highlights engine, devtools UI, and `FrameworkAdapter` contract.
  - Introduce `@rsc-boundary/next`: Next.js App Router adapter. Drop-in replacement for `rsc-boundary`.
  - Introduce `@rsc-boundary/start`: TanStack Start / TanStack Router adapter.
  - `rsc-boundary` becomes a back-compat shim re-exporting `@rsc-boundary/next`. Existing imports continue to work unchanged.
