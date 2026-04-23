# AGENTS.md — RSC Boundary

Guidance for AI and human contributors. Keep changes scoped and consistent with this layout.

## Purpose

Monorepo for **RSC Boundary**: tooling that visualizes the boundary between **React Server Components** and **Client Components** in any RSC-capable React framework. Published packages live under `packages/`; the **demo site** lives under `apps/web`; lightweight adapter smoke-tests live under `playgrounds/`.

## Layout

| Path | Role |
| ---- | ---- |
| `packages/rsc-boundary-core` | `@rsc-boundary/core` — framework-agnostic: fiber walk, highlights, devtools UI, `FrameworkAdapter` contract. |
| `packages/rsc-boundary-next` | `@rsc-boundary/next` — Next.js App Router adapter + `RscBoundaryProvider`. |
| `packages/rsc-boundary-start` | `@rsc-boundary/start` — TanStack Start adapter + `RscBoundaryProvider`. |
| `packages/rsc-boundary` | `rsc-boundary` — back-compat shim that re-exports `@rsc-boundary/next`. Do not add logic here. |
| `apps/web` | Next.js app: marketing, docs snippets, interactive examples. Depends on `rsc-boundary` via `workspace:*`. |
| `playgrounds/next` | Minimal Next.js 16 App Router app that smoke-tests `@rsc-boundary/next`. Private, not published. |
| `playgrounds/start` | Minimal TanStack Start app that smoke-tests `@rsc-boundary/start`. Private, not published. |
| `config/eslint-config`, `config/typescript-config` | Shared ESLint and TypeScript configs (`@repo/eslint-config`, `@repo/typescript-config`). |

**Rule of thumb:**
- Framework-agnostic detection / highlight logic → `packages/rsc-boundary-core`.
- Next.js-specific adapter changes (internals list, root element) → `packages/rsc-boundary-next`.
- TanStack Start-specific adapter changes → `packages/rsc-boundary-start`.
- Wiring, copy, and example routes for the public site → `apps/web`.

## Stack

- **Package manager:** `pnpm` (see root `packageManager`).
- **Monorepo:** Turborepo (`turbo.json`).
- **App:** Next.js App Router, React 19, TypeScript strict.

## Commands (repo root)

```bash
pnpm install
pnpm dev          # turbo run dev
pnpm build        # turbo run build
pnpm lint         # turbo run lint
pnpm check-types  # turbo run check-types
```

Run a single workspace with `pnpm --filter <name> <script>` (e.g. `pnpm --filter web dev`).

## Conventions for this project

- **Server vs client:** Be explicit: `"use client"` only where needed. Library code that must run on the client should be isolated and documented (entry points, dev-only imports). Avoid pulling client-only modules into RSC entry paths.
- **Public API:** Export a small, stable surface from each package (e.g. main entry in `package.json` `exports`). Internals stay unexported or under `/internal` if you split files.
- **Dependencies:** Prefer peer dependencies for `react`, `react-dom`, `next`, and `@tanstack/react-start` in the library with ranges aligned to the app; avoid pinning app-only deps inside the package unless necessary.
- **Quality:** Match existing ESLint and TS configs; no `any` without justification. Prefer named exports unless the repo already uses a default for a specific entry.
- **Testing:** When tests exist, use **Vitest** for unit/integration and **Playwright** for E2E if/when added—follow existing project scripts.

## AI workflow

1. Read the **nearest** `package.json` and `tsconfig` for the package you're editing.
2. After substantive edits, run **`pnpm lint`** and **`pnpm check-types`** from the root (or the relevant `--filter`).
3. Prefer **small PR-sized diffs**: one concern per change (e.g. "highlight styles" vs "playground route").
4. Do **not** add unsolicited root-level docs or refactor unrelated packages.

## Out of scope (unless explicitly requested)

Rewriting the whole monorepo, changing Next/React majors without a tracked task, or adding heavy dependencies to the library without a clear need.
