# AGENTS.md — RSC Boundary

Guidance for AI and human contributors. Keep changes scoped and consistent with this layout.

## Purpose

Monorepo for **RSC Boundary**: tooling that visualizes the boundary between **React Server Components** and **Client Components** in Next.js (App Router). The **library** lives under `packages/`; the **demo site and playground** live under `apps/web`.

## Layout

| Path                                               | Role                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `packages/rsc-boundary`                            | Published (or publishable) package: APIs, runtime/dev-only behavior, types. Minimize coupling to the demo app. |
| `apps/web`                                         | Next.js app: marketing, docs snippets, interactive examples. Depends on `rsc-boundary` via `workspace:*`.      |
| `config/eslint-config`, `config/typescript-config` | Shared ESLint and TypeScript configs (`@repo/eslint-config`, `@repo/typescript-config`).                       |

**Rule of thumb:** feature work for “how boundaries are detected/highlighted” belongs in `packages/rsc-boundary`. Wiring, copy, and example routes belong in `apps/web`.

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
- **Public API:** Export a small, stable surface from `packages/rsc-boundary` (e.g. main entry in `package.json` `exports`). Internals stay unexported or under `/internal` if you split files.
- **Dependencies:** Prefer peer dependencies for `react`, `react-dom`, and `next` in the library with ranges aligned to the app; avoid pinning app-only deps inside the package unless necessary.
- **Quality:** Match existing ESLint and TS configs; no `any` without justification. Prefer named exports unless the repo already uses a default for a specific entry.
- **Testing:** When tests exist, use **Vitest** for unit/integration and **Playwright** for E2E if/when added—follow existing project scripts.

## AI workflow

1. Read the **nearest** `package.json` and `tsconfig` for the package you’re editing.
2. After substantive edits, run **`pnpm lint`** and **`pnpm check-types`** from the root (or the relevant `--filter`).
3. Prefer **small PR-sized diffs**: one concern per change (e.g. “highlight styles” vs “playground route”).
4. Do **not** add unsolicited root-level docs or refactor unrelated packages.

## Out of scope (unless explicitly requested)

Rewriting the whole monorepo, changing Next/React majors without a tracked task, or adding heavy dependencies to the library without a clear need.
