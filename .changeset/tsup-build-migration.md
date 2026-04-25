---
"@rsc-boundary/core": patch
---

Switch build tooling from `tsc` to `tsup`. Output is ESM with proper `.js` import extensions, `"use client"` directives preserved on client-side chunks, and separate entry points for server/client boundaries. Fixes `ERR_MODULE_NOT_FOUND` in Node ESM consumers (TanStack Start and similar) more robustly than the `rewriteRelativeImportExtensions` workaround.
