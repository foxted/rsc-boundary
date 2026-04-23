/**
 * Zero-setup Server Component name detection via React 19's DEV-only
 * `fiber._debugInfo`.
 *
 * React 19 attaches a `_debugInfo: ReactComponentInfo[]` array to fibers
 * whose rendering was owned by one or more Server Components (RSC Flight
 * stream row type "D"). Each entry carries the Server Component's name, env,
 * key, and owner chain. The official React DevTools use this same data to
 * display Server Components as "VirtualInstances" in the component tree
 * (see facebook/react#28272 and facebook/react#30684).
 *
 * This module is DEV-only in practice: `_debugInfo` is stripped from
 * production bundles by React, so the functions here simply return empty
 * arrays when the property is absent — which is always the case in prod.
 * No `process.env.NODE_ENV` guard is needed here because the devtools UI
 * is already gated in `createRscBoundaryProvider`.
 *
 * WARNING: `_debugInfo` is an undocumented, semi-public React internal.
 * All access is centralised in `getFiberDebugInfo` so a future rename is a
 * one-line fix. Do NOT read `_debugInfo` from any other module.
 */

import type { ReactComponentInfo, ServerRegionInfo } from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Opaque fiber-like shape — only the fields we need from fiber-utils.
 * Kept minimal to avoid coupling to React internals beyond _debugInfo.
 */
export interface FiberWithDom {
  /** The raw fiber object (typed as unknown to avoid React internal imports). */
  fiber: unknown;
  /** DOM nodes belonging to this client component. */
  domNodes: HTMLElement[];
}

// ---------------------------------------------------------------------------
// _debugInfo access
// ---------------------------------------------------------------------------

/**
 * Safely read `_debugInfo` from a raw fiber object.
 * Returns `null` if absent (prod build, older React, or plain client fiber).
 */
export function getFiberDebugInfo(fiber: unknown): ReactComponentInfo[] | null {
  if (!fiber || typeof fiber !== "object") return null;
  const raw = (fiber as Record<string, unknown>)["_debugInfo"];
  if (!Array.isArray(raw)) return null;
  return raw as ReactComponentInfo[];
}

// ---------------------------------------------------------------------------
// LCA (Lowest Common Ancestor) helper
// ---------------------------------------------------------------------------

/**
 * Compute the lowest common ancestor of an array of DOM elements.
 *
 * Walks up from the first node toward the document root; the first ancestor
 * that `contains` every other node is the LCA (deepest common ancestor).
 *
 * Returns `null` for an empty array; returns the sole element for a singleton.
 */
export function computeLCA(nodes: HTMLElement[]): HTMLElement | null {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0] ?? null;

  // Walk up from the first node (element → parent → … → documentElement).
  // The first node in this chain that contains every other node is the LCA.
  let current: HTMLElement | null = nodes[0]!;
  while (current) {
    const allContained = nodes.every(
      (n) => current === n || current!.contains(n),
    );
    if (allContained) return current;
    current = current.parentElement;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Identity key for ReactComponentInfo
// ---------------------------------------------------------------------------

/**
 * Build a stable string key for a `ReactComponentInfo` entry so we can
 * bucket fibers that belong to the same Server Component instance.
 *
 * React reuses the same object identity across sibling fibers owned by the
 * same server component in a single render, so object identity (`===`) is
 * the primary bucketing key. This string key is a fallback for the rare case
 * where two entries represent the same component but are separate objects
 * (e.g. after a client-side re-render that rebuilt debug info).
 */
function infoKey(info: ReactComponentInfo): string {
  const ownerName = info.owner?.name ?? "";
  const key = info.key != null ? `:${info.key}` : "";
  return `${info.name}@${ownerName}${key}`;
}

// ---------------------------------------------------------------------------
// Core collection logic
// ---------------------------------------------------------------------------

/**
 * Given the full list of client fibers with their DOM nodes, extract Server
 * Component regions by reading each fiber's `_debugInfo`.
 *
 * Algorithm:
 * 1. For every fiber, iterate its `_debugInfo` entries.
 * 2. Skip entries where `env === "Client"` — those are client components
 *    already represented in the client component list.
 * 3. Group `(info, domNodes)` pairs first by object identity, then by string
 *    key fallback, into buckets.
 * 4. For each bucket compute the LCA of all member dom nodes.
 * 5. Emit one `ServerRegionInfo` per bucket with `source: "rsc-debug"`.
 */
export function collectDebugServerRegions(
  fibers: FiberWithDom[],
): ServerRegionInfo[] {
  // Two-phase bucketing:
  //  Phase 1: object-identity map (covers same instance within one render)
  //  Phase 2: string-key fallback map (covers same component across re-renders)
  const byIdentity = new Map<
    ReactComponentInfo,
    { info: ReactComponentInfo; domNodes: HTMLElement[] }
  >();
  const byKey = new Map<
    string,
    { info: ReactComponentInfo; domNodes: HTMLElement[] }
  >();

  for (const { fiber, domNodes } of fibers) {
    const debugInfo = getFiberDebugInfo(fiber);
    if (!debugInfo || debugInfo.length === 0) continue;

    for (const info of debugInfo) {
      // Skip client-env entries; they are already covered by the client scan.
      if (info.env === "Client") continue;

      // Phase 1: identity
      const existing = byIdentity.get(info);
      if (existing) {
        existing.domNodes.push(...domNodes);
        continue;
      }

      // Phase 2: string-key fallback
      const key = infoKey(info);
      const byKeyEntry = byKey.get(key);
      if (byKeyEntry) {
        // Promote to identity map under the first-seen object
        byKeyEntry.domNodes.push(...domNodes);
        byIdentity.set(info, byKeyEntry);
        continue;
      }

      // New entry
      const entry = { info, domNodes: [...domNodes] };
      byIdentity.set(info, entry);
      byKey.set(key, entry);
    }
  }

  const regions: ServerRegionInfo[] = [];

  for (const { info, domNodes } of byKey.values()) {
    if (domNodes.length === 0) continue;
    const lca = computeLCA(domNodes);
    if (!lca) continue;

    regions.push({
      element: lca,
      displayLabel: info.name,
      componentName: info.name,
      env: info.env ?? "Server",
      source: "rsc-debug",
    });
  }

  return regions;
}
