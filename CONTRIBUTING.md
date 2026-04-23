# Contributing

How to work in the **RSC Boundary** monorepo. For broader conventions (stack, AI workflow, scope), see [`AGENTS.md`](AGENTS.md).

## Repository layout

| Path                                                   | Role                                                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [`packages/core`](packages/core)                       | `@rsc-boundary/core` — framework-agnostic detection, highlighting, devtools UI     |
| [`packages/next`](packages/next)                       | `@rsc-boundary/next` — Next.js App Router adapter                                   |
| [`packages/start`](packages/start)                     | `@rsc-boundary/start` — TanStack Start adapter                                     |
| [`apps/web`](apps/web)                                 | Next.js app: marketing, docs, interactive examples (`workspace:*` → `@rsc-boundary/next`) |
| [`config/eslint-config`](config/eslint-config)         | Shared ESLint config (`@repo/eslint-config`)                                        |
| [`config/typescript-config`](config/typescript-config) | Shared TypeScript configs (`@repo/typescript-config`)                               |

## Development

Prerequisites: **Node.js 18+**, **[pnpm](https://pnpm.io/)** (version pinned in root `package.json`).

```bash
pnpm install
pnpm dev          # all workspaces (Turborepo)
pnpm build
pnpm lint
pnpm check-types
```

Run only the demo app:

```bash
pnpm --filter web dev
```

Feature work for boundary detection and highlighting belongs in **`packages/core`** (shared), with framework-specific wiring in **`packages/next`** or **`packages/start`**; copy, routes, and examples belong in **`apps/web`**.
