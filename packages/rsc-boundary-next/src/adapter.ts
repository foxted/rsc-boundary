import type { FrameworkAdapter } from "@rsc-boundary/core";

/**
 * Next.js App Router adapter for RSC Boundary.
 *
 * Filters out Next.js framework internals from client-component detection so
 * they don't add noise to the devtools panel, and uses `#__next` as the
 * preferred fiber root / scan container.
 */
export const nextAdapter: FrameworkAdapter = {
  name: "next",

  internals: new Set([
    "AppRouter",
    "HotReload",
    "Router",
    "LayoutRouter",
    "InnerLayoutRouter",
    "OuterLayoutRouter",
    "RenderFromTemplateContext",
    "ErrorBoundary",
    "ErrorBoundaryHandler",
    "GlobalError",
    "RedirectBoundary",
    "RedirectErrorBoundary",
    "NotFoundBoundary",
    "NotFoundErrorBoundary",
    "LoadingBoundary",
    "ScrollAndFocusHandler",
    "InnerScrollAndFocusHandler",
    "RootLayoutBoundary",
    "RootErrorBoundary",
    "ReactDevOverlay",
    "DevToolsIndicator",
    "DevRootNotFoundBoundary",
    "MetadataBoundary",
    "ViewportBoundary",
    "OutletBoundary",
    "HTTPAccessFallbackBoundary",
    "HTTPAccessErrorBoundary",
    // RSC Boundary own devtools root (sub-components filtered via DOM check)
    "RscDevtools",
  ]),

  rootCandidates: () => [
    document.getElementById("__next"),
    document.body,
    document.documentElement,
  ],

  resolveScanContainer: () =>
    document.getElementById("__next") ?? document.body,
};
