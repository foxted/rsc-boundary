export interface DocsNavItem {
  href: string;
  label: string;
}

/** Single anchor in the on-page table of contents. */
export interface DocsSectionLink {
  id: string;
  label: string;
}

/** Group heading (links to its own `id`) with nested section links. */
export interface DocsSectionGroup {
  id: string;
  label: string;
  children: DocsSectionLink[];
}

export type DocsSectionEntry = DocsSectionLink | DocsSectionGroup;

export function isDocsSectionGroup(
  entry: DocsSectionEntry,
): entry is DocsSectionGroup {
  return "children" in entry && Array.isArray(entry.children);
}

/** Document order of all heading ids (for scroll-spy). */
export function flattenDocsSectionIds(entries: DocsSectionEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    if (isDocsSectionGroup(entry)) {
      ids.push(entry.id);
      for (const child of entry.children) {
        ids.push(child.id);
      }
    } else {
      ids.push(entry.id);
    }
  }
  return ids;
}

export const docsNav: DocsNavItem[] = [
  { href: "/docs", label: "Getting started" },
  { href: "/docs/examples", label: "Examples" },
  { href: "/docs/api", label: "API reference" },
  { href: "/docs/how-it-works", label: "How it works" },
];

export const docsSectionsByPath: Record<string, DocsSectionEntry[]> = {
  "/docs": [
    {
      id: "next-js",
      label: "Next.js",
      children: [
        { id: "next-js-prerequisites", label: "Prerequisites" },
        { id: "next-js-install", label: "Install" },
        { id: "next-js-add-provider", label: "Add the provider" },
      ],
    },
    {
      id: "tanstack-start",
      label: "TanStack Start",
      children: [
        { id: "tanstack-start-prerequisites", label: "Prerequisites" },
        { id: "tanstack-start-install", label: "Install" },
        { id: "tanstack-start-add-provider", label: "Add the provider" },
      ],
    },
    { id: "legacy-shim", label: "Deprecated: rsc-boundary" },
    { id: "first-activation", label: "First Activation" },
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
    { id: "adapters", label: "Adapters" },
    { id: "rsc-server-boundary-marker", label: "RscServerBoundaryMarker" },
    { id: "rsc-devtools-next-start", label: "RscDevtoolsNext / Start" },
    { id: "create-rsc-boundary-provider", label: "createRscBoundaryProvider" },
    { id: "legacy-shim", label: "Legacy rsc-boundary" },
    { id: "next-only-exports", label: "COLORS / LABEL_BASE_STYLES" },
  ],
  "/docs/how-it-works": [
    { id: "pipeline", label: "Pipeline" },
    { id: "what-you-see", label: "What you see" },
    { id: "explicit-markers", label: "Explicit markers" },
    { id: "dev-vs-production", label: "Dev vs production" },
    { id: "limitations", label: "Limitations" },
  ],
};

export function normalizeDocsPath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}
