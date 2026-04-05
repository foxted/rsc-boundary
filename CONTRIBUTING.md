# Contributing

How to work in the **RSC Boundary** monorepo. For broader conventions (stack, AI workflow, scope), see [`AGENTS.md`](AGENTS.md).

## Repository layout

| Path                                                   | Role                                                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [`packages/rsc-boundary`](packages/rsc-boundary)       | Publishable npm package: `RscBoundaryProvider`, dev-only highlighting               |
| [`apps/web`](apps/web)                                 | Next.js app: marketing, docs, interactive examples (`workspace:*` → `rsc-boundary`) |
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

Feature work for boundary detection and highlighting belongs in **`packages/rsc-boundary`**; copy, routes, and examples belong in **`apps/web`**.
