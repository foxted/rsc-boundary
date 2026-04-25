---
name: install-start
description: >-
  Installs and wires the npm package @rsc-boundary/start into a TanStack Start app
  (dependencies, root route provider, optional explicit markers). Use when
  the user wants to add RSC Boundary to a TanStack Start / TanStack Router app,
  or set up server/client boundary devtools with TanStack.
---

# Install RSC Boundary in a TanStack Start app

**Package:** `@rsc-boundary/start` on npm.

## Prerequisites

- **`@tanstack/react-start`** 1+
- **React** 19+ and **react-dom** 19+ (peer dependencies)

If versions are older, say so and recommend upgrading before installing.

## 1. Install the dependency

Use the project's package manager:

```bash
pnpm add @rsc-boundary/start
```

```bash
npm install @rsc-boundary/start
```

```bash
yarn add @rsc-boundary/start
```

### Monorepo / local development

If the user is working inside this repository and consuming the package from the workspace, use the workspace protocol:

```json
"@rsc-boundary/start": "workspace:*"
```

Ensure the packages are built (`pnpm --filter @rsc-boundary/start build`, which also builds core) before the app typechecks against `dist/`.

## 2. Add the provider to the root route

Edit the root route file (`app/routes/__root.tsx`).

1. Import the provider:

   ```tsx
   import { RscBoundaryProvider } from "@rsc-boundary/start";
   ```

2. Wrap `<Outlet />` (or `{children}`) inside `<body>` with `<RscBoundaryProvider>`.

**Minimal pattern:**

```tsx
import { RscBoundaryProvider } from "@rsc-boundary/start";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        <RscBoundaryProvider>
          <Outlet />
        </RscBoundaryProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

Preserve existing structure: `<ScrollRestoration />`, `<Scripts />`, `<Meta />`, and any other layout UI stay as they are—only add the provider around the main content as appropriate.

## 3. Behavior to set expectations

- **Development:** A small control (pill) appears in the bottom-left; toggling it highlights client vs server regions. No changes are required in individual route components.
- **Production:** The provider is a no-op (children only). Devtools never mount in production builds.

## 4. Optional API (only if the user asks)

From `@rsc-boundary/start` the app can also use:

- `RscServerBoundaryMarker` / `SERVER_BOUNDARY_DATA_ATTR` — explicit server region labels, useful when heuristic detection misses or mislabels a subtree
- `RscDevtoolsStart` — advanced mounting without the provider wrapper
- `createRscBoundaryProvider` — factory for custom wiring (re-exported from `@rsc-boundary/core`)

Prefer `RscBoundaryProvider` unless the user's setup requires splitting these.

**Explicit marker example:**

```tsx
import { RscServerBoundaryMarker } from "@rsc-boundary/start";

// In a server-rendered component:
<RscServerBoundaryMarker label="HeroSection">
  <section>...</section>
</RscServerBoundaryMarker>
```

## 5. Verify

- Run `pnpm dev` (or `vinxi dev`).
- Open the app in the browser; confirm the RSC Boundary control appears and toggling highlights boundaries.
- Navigate between routes; the MutationObserver should re-scan automatically.

## Troubleshooting (brief)

- **Peer dependency warnings:** Align `react` and `react-dom` to ^19.
- **Types / module not found:** Ensure install completed and, for workspace usage, that packages are built.
- **Nothing in production:** Expected; devtools are development-only.
- **Framework internals still visible in panel:** Open an issue with the component name so it can be added to the `startAdapter` internals list.
