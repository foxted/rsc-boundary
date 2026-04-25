---
"@rsc-boundary/core": patch
---

Fix ERR_MODULE_NOT_FOUND when consuming the package in Node ESM environments (e.g. TanStack Start) by enabling `rewriteRelativeImportExtensions` in the TypeScript build config. This ensures relative imports in emitted output have `.js` extensions as required by Node's ESM resolver.
