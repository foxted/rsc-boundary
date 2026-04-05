---
name: install
description: >-
  Installs and wires the npm package rsc-boundary into a Next.js App Router app
  (dependencies, root layout provider, optional production enablement). Use when
  the user wants to add RSC Boundary, integrate rsc-boundary, or set up server/client
  boundary devtools in Next.js. The package name is rsc-boundary (not rsc-component).
---

# Install RSC Boundary in a Next.js app

**Package:** `rsc-boundary` on npm. If the user says “rsc component” or similar, assume they mean this package unless they specify a different library.

## Prerequisites

- **Next.js** 16+ with the **App Router**
- **React** 19+ and **react-dom** 19+ (peer dependencies of `rsc-boundary`)

If versions are older, say so and recommend upgrading before installing.

## 1. Install the dependency

Use the project’s package manager:

```bash
pnpm add rsc-boundary
```

```bash
npm install rsc-boundary
```

```bash
yarn add rsc-boundary
```

Do **not** add `next` as a dependency of `rsc-boundary` in the app; the library targets Next.js via the app’s own `next` install.

### Monorepo / local development

If the user is working inside this repository and consuming the package from the workspace, use the workspace protocol instead of a registry version (example):

```json
"rsc-boundary": "workspace:*"
```

Ensure the `rsc-boundary` workspace package is built (`pnpm --filter rsc-boundary build`) before the app typechecks against `dist/`.

## 2. Wrap the App Router root layout

Edit **`app/layout.tsx`** (or the file that exports the root `RootLayout` for `app/`).

1. Import the provider:

   ```tsx
   import { RscBoundaryProvider } from "rsc-boundary";
   ```

2. Wrap `{children}` (inside `<body>`) with `<RscBoundaryProvider>{children}</RscBoundaryProvider>`.

Preserve existing structure: fonts, metadata, other layout UI, and `className` on `<body>` / `<html>` stay as they are—only add the provider around the main content tree as appropriate.

**Minimal pattern:**

```tsx
import { RscBoundaryProvider } from "rsc-boundary";

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
- **Production:** By default the provider is a no-op (children only). For a docs or demo site that must show devtools in production, pass **`enabled`**: `<RscBoundaryProvider enabled>{children}</RscBoundaryProvider>`.

## 4. Optional API (only if the user asks)

From `rsc-boundary` the app can also use:

- `RscDevtools` — advanced mounting without the provider wrapper
- `RscServerBoundaryMarker` / `SERVER_BOUNDARY_DATA_ATTR` — explicit server region labels

Prefer `RscBoundaryProvider` unless the user’s setup requires splitting these.

## 5. Verify

- Run `pnpm dev` (or the app’s dev script).
- Open the app in the browser; confirm the RSC Boundary control appears and toggling highlights boundaries.
- Run the project’s typecheck/lint if available.

## Troubleshooting (brief)

- **Peer dependency warnings:** Align `react` and `react-dom` to ^19 with the app’s Next.js version.
- **Types / module not found:** Ensure install completed and, for workspace usage, that `packages/rsc-boundary` is built.
- **Nothing in production:** Expected unless `enabled` is passed.
