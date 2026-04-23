---
name: install-next
description: >-
  Installs and wires @rsc-boundary/next into a Next.js App Router app (dependencies,
  root layout provider, optional explicit markers). Use when the user wants to add RSC
  Boundary, integrate rsc-boundary, or set up server/client boundary devtools in Next.js.
  The package is @rsc-boundary/next (previously rsc-boundary — see migration note).
---

# Install RSC Boundary in a Next.js app

**Package:** `@rsc-boundary/next` on npm. The legacy `rsc-boundary` package is a back-compat shim that re-exports this package — for new installs always use `@rsc-boundary/next`.

## Prerequisites

- **Next.js** 16+ with the **App Router**
- **React** 19+ and **react-dom** 19+ (peer dependencies)

If versions are older, say so and recommend upgrading before installing.

## 1. Install the dependency

Use the project's package manager:

```bash
pnpm add @rsc-boundary/next
```

```bash
npm install @rsc-boundary/next
```

```bash
yarn add @rsc-boundary/next
```

### Migrating from `rsc-boundary`

If the user already has `rsc-boundary` installed, the migration is a one-liner:

```bash
pnpm remove rsc-boundary && pnpm add @rsc-boundary/next
```

Then replace the import everywhere (one global find-and-replace):

```diff
-import { ... } from "rsc-boundary";
+import { ... } from "@rsc-boundary/next";
```

The API surface is identical — no other code changes are needed.

### Monorepo / local development

If the user is working inside this repository and consuming the package from the workspace, use the workspace protocol:

```json
"@rsc-boundary/next": "workspace:*"
```

Ensure the packages are built (`pnpm --filter @rsc-boundary/next build`, which also builds core) before the app typechecks against `dist/`.

## 2. Wrap the App Router root layout

Edit **`app/layout.tsx`** (or the file that exports the root `RootLayout` for `app/`).

1. Import the provider:

   ```tsx
   import { RscBoundaryProvider } from "@rsc-boundary/next";
   ```

2. Wrap `{children}` (inside `<body>`) with `<RscBoundaryProvider>{children}</RscBoundaryProvider>`.

Preserve existing structure: fonts, metadata, other layout UI, and `className` on `<body>` / `<html>` stay as they are—only add the provider around the main content tree as appropriate.

**Minimal pattern:**

```tsx
import { RscBoundaryProvider } from "@rsc-boundary/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
      </body>
    </html>
  );
}
```

If the app already wraps children in other providers, nest `RscBoundaryProvider` in a sensible place (often outermost inside `<body>` so the whole app is covered).

## 3. Behavior to set expectations

- **Development:** A small control (pill) appears; toggling it highlights client vs server regions. No changes are required in individual components for the default experience.
- **Production:** The provider is a no-op (children only). Devtools never mount in production builds; use static UI or screenshots if you need to illustrate boundaries on a deployed site.

## 4. Optional API (only if the user asks)

From `@rsc-boundary/next` the app can also use:

- `RscServerBoundaryMarker` / `SERVER_BOUNDARY_DATA_ATTR` — explicit server region labels
- `RscDevtoolsNext` — advanced mounting without the provider wrapper
- `createRscBoundaryProvider` — factory for custom wiring (re-exported from `@rsc-boundary/core`)

Prefer `RscBoundaryProvider` unless the user's setup requires splitting these.

## 5. Verify

- Run `pnpm dev` (or the app's dev script).
- Open the app in the browser; confirm the RSC Boundary control appears and toggling highlights boundaries.
- Run the project's typecheck/lint if available.

## Troubleshooting (brief)

- **Peer dependency warnings:** Align `react` and `react-dom` to ^19 with the app's Next.js version.
- **Types / module not found:** Ensure install completed and, for workspace usage, that packages are built.
- **Nothing in production:** Expected; devtools are development-only.
