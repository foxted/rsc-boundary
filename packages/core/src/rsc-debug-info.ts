/**
 * Zero-setup Server Component name detection via React 19's DEV-only
 * `fiber._debugInfo`.
 *
 * React 19 attaches a `_debugInfo` array to fibers whose rendering was owned
 * by one or more Server Components (RSC Flight stream row type "D"). Each
 * entry in the array is a tagged union:
 *
 *   ReactComponentInfo  — { name: string, env?, key?, owner?, … }
 *   ReactEnvironmentInfo — { env: string }          (no `name`)
 *   ReactAsyncInfo      — { awaited: …, … }          (no `name`)
 *   ReactTimeInfo       — { time: number }            (no `name`)
 *
 * Only `ReactComponentInfo` entries carry a Server Component name; the
 * others are timing / environment metadata. `isReactComponentInfo` below
 * discriminates on the presence of `name: string` — the field that is
 * required on `ReactComponentInfo` and absent on all other union members.
 *
 * The official React DevTools use the same `_debugInfo` data to display
 * Server Components as "VirtualInstances" in the component tree
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
// _debugInfo access and type discrimination
// ---------------------------------------------------------------------------

/**
 * Safely read `_debugInfo` from a raw fiber object.
 * Returns `null` if absent (prod build, older React, or plain client fiber).
 *
 * The array is typed as `unknown[]` because `_debugInfo` is a tagged union
 * (ReactComponentInfo | ReactEnvironmentInfo | ReactAsyncInfo | ReactTimeInfo).
 * Callers must use `isReactComponentInfo` to narrow entries before accessing
 * component-specific fields.
 */
export function getFiberDebugInfo(fiber: unknown): unknown[] | null {
  if (!fiber || typeof fiber !== "object") return null;
  const raw = (fiber as Record<string, unknown>)["_debugInfo"];
  if (!Array.isArray(raw)) return null;
  return raw;
}

/**
 * Type guard that narrows an `_debugInfo` entry to `ReactComponentInfo`.
 *
 * Discrimination key: `name` is a required `string` on `ReactComponentInfo`
 * and absent on every other union member (ReactEnvironmentInfo has only `env`,
 * ReactAsyncInfo has `awaited`/`type`, ReactTimeInfo has `time`).
 */
export function isReactComponentInfo(
  entry: unknown,
): entry is ReactComponentInfo {
  return (
    typeof entry === "object" &&
    entry !== null &&
    typeof (entry as Record<string, unknown>).name === "string"
  );
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
// Core collection logic
// ---------------------------------------------------------------------------

/**
 * Given the full list of client fibers with their DOM nodes, extract Server
 * Component regions by reading each fiber's `_debugInfo`.
 *
 * Algorithm:
 * 1. For every fiber, iterate its `_debugInfo` entries.
 * 2. Narrow each entry with `isReactComponentInfo` — other union members
 *    (ReactEnvironmentInfo, ReactAsyncInfo, ReactTimeInfo) carry no component
 *    name and must be skipped to avoid phantom regions.
 * 3. Skip entries where `env === "Client"` — those are client components
 *    already represented in the client component list.
 * 4. Skip entries whose `name` is in `internals` (framework-owned SCs that
 *    add noise, e.g. Next.js layout wrappers).
 * 5. Bucket `(info, domNodes)` pairs by **object identity** only.
 *    React RSC Flight assigns one `ReactComponentInfo` object per SC
 *    *instance*; sibling fibers owned by the same instance share that exact
 *    object. Different instances — even of the same component type — always
 *    get distinct objects, so object identity correctly separates them.
 *    A string-key fallback would incorrectly merge two list items with the
 *    same component name into a single region.
 * 6. For each bucket compute the LCA of all member DOM nodes.
 * 7. Emit one `ServerRegionInfo` per bucket with `source: "rsc-debug"`.
 */
export function collectDebugServerRegions(
  fibers: FiberWithDom[],
  internals?: ReadonlySet<string>,
): ServerRegionInfo[] {
  const byIdentity = new Map<
    ReactComponentInfo,
    { info: ReactComponentInfo; domNodes: HTMLElement[] }
  >();

  for (const { fiber, domNodes } of fibers) {
    const rawDebugInfo = getFiberDebugInfo(fiber);
    if (!rawDebugInfo || rawDebugInfo.length === 0) continue;

    for (const entry of rawDebugInfo) {
      // Narrow to ReactComponentInfo; skip timing/env/async entries.
      if (!isReactComponentInfo(entry)) continue;
      // Client-env entries are already covered by the client scan.
      if (entry.env === "Client") continue;
      // Skip framework-internal SC names (e.g. Next.js layout wrappers).
      if (internals?.has(entry.name)) continue;

      const existing = byIdentity.get(entry);
      if (existing) {
        existing.domNodes.push(...domNodes);
      } else {
        byIdentity.set(entry, { info: entry, domNodes: [...domNodes] });
      }
    }
  }

  const regions: ServerRegionInfo[] = [];

  for (const { info, domNodes } of byIdentity.values()) {
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
