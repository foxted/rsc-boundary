export interface DocsNavItem {
  href: string;
  label: string;
}

export interface DocsSection {
  id: string;
  label: string;
}

export const docsNav: DocsNavItem[] = [
  { href: "/docs", label: "Getting started" },
  { href: "/docs/examples", label: "Examples" },
  { href: "/docs/api", label: "API reference" },
  { href: "/docs/how-it-works", label: "How it works" },
];

export const docsSectionsByPath: Record<string, DocsSection[]> = {
  "/docs": [
    { id: "prerequisites", label: "Prerequisites" },
    { id: "install", label: "Install" },
    { id: "add-the-provider", label: "Add the provider" },
    { id: "first-activation", label: "First activation" },
  ],
  "/docs/examples": [
    { id: "server-only-block", label: "Server-only block" },
    { id: "counter-island", label: "Server shell + counter" },
    { id: "accordion", label: "Server data + accordion" },
    { id: "server-list-client-filter", label: "Server list + client filter" },
    { id: "hybrid-detection", label: "Explicit + heuristic regions" },
  ],
  "/docs/api": [
    { id: "rsc-boundary-provider", label: "RscBoundaryProvider" },
    { id: "rsc-server-boundary-marker", label: "RscServerBoundaryMarker" },
    { id: "rsc-devtools", label: "RscDevtools" },
  ],
  "/docs/how-it-works": [
    { id: "pipeline", label: "Pipeline" },
    { id: "what-you-see", label: "What you see" },
    { id: "explicit-markers", label: "Explicit markers" },
    { id: "limitations", label: "Limitations" },
  ],
};

export function normalizeDocsPath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}
