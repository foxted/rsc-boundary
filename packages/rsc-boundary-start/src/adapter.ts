import type { FrameworkAdapter } from "@rsc-boundary/core";

/**
 * TanStack Start adapter for RSC Boundary.
 *
 * Filters out TanStack Router and TanStack Start framework internals from
 * client-component detection so they don't add noise to the devtools panel,
 * and uses `#root` as the preferred fiber root / scan container (the default
 * mount point used by Vite / TanStack Start).
 *
 * The internals list is compiled from `@tanstack/react-router` and
 * `@tanstack/react-start` source. It may need additions as either library
 * evolves — file an issue or PR if you spot missing entries.
 */
export const startAdapter: FrameworkAdapter = {
  name: "start",

  internals: new Set([
    // @tanstack/react-router core
    "RouterProvider",
    "RouterContextProvider",
    "InnerRouterContextProvider",
    "Router",
    "Transitioner",
    "Match",
    "MatchInner",
    "MatchRoute",
    "Outlet",
    "CatchBoundary",
    "CatchBoundaryInner",
    "ErrorComponent",
    "ErrorBoundary",
    "DefaultGlobalNotFound",
    "DefaultNotFound",
    "ScriptOnce",
    // @tanstack/react-start server/client entry
    "StartServer",
    "StartClient",
    "InnerRouter",
    // Asset injection (TanStack Start)
    "Asset",
    "Meta",
    "Scripts",
    "RootDocument",
    "DehydrateRouter",
    // RSC Boundary own devtools root (sub-components filtered via DOM check)
    "RscDevtools",
  ]),

  rootCandidates: () => [
    document.getElementById("root"),
    document.body,
    document.documentElement,
  ],

  resolveScanContainer: () =>
    document.getElementById("root") ?? document.body,
};
