/**
 * React fiber tree utilities for automatic RSC Boundary detection.
 *
 * How it works:
 * - React Server Components are resolved on the server and sent as pre-rendered
 *   HTML. They have NO corresponding fibers in the client-side React tree.
 * - Client Components ("use client") are hydrated on the client and DO have
 *   fibers (FunctionComponent, ForwardRef, MemoComponent, etc.).
 *
 * By walking the fiber tree after hydration, we find every user-defined client
 * component and map it to its root DOM node(s). Server regions are explicit
 * markers plus heuristic DOM outside those client subtrees (see getServerRegions).
 *
 * This approach mirrors what React DevTools does internally — it accesses the
 * __reactFiber$* property that React attaches to DOM elements during hydration.
 *
 * Framework-specific configuration (internal component names, root element
 * candidates) is supplied via the `FrameworkAdapter` interface so this module
 * stays framework-agnostic.
 */

import { RSC_DEVTOOLS_DATA_ATTR, SERVER_BOUNDARY_DATA_ATTR } from "./constants";
import { formatHostFallbackLabel } from "./host-label";
import { collectDebugServerRegions } from "./rsc-debug-info";
import type { ClientComponentInfo, FrameworkAdapter, ServerRegionInfo } from "./types";
import type { FiberWithDom } from "./rsc-debug-info";

/**
 * Standard HTML elements that are never visual server regions.
 * Excludes them from heuristic detection to avoid noisy panel entries for
 * injected scripts, stylesheets, and other infrastructure tags.
 */
const NON_VISUAL_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "LINK",
  "META",
  "TEMPLATE",
  "NOSCRIPT",
  "HEAD",
  "TITLE",
  "BASE",
]);

// React fiber work tags (numeric constants from React source)
const FUNCTION_COMPONENT = 0;
const CLASS_COMPONENT = 1;
const HOST_COMPONENT = 5;
const FORWARD_REF = 11;
const MEMO_COMPONENT = 14;
const SIMPLE_MEMO_COMPONENT = 15;

const COMPONENT_TAGS = new Set([
  FUNCTION_COMPONENT,
  CLASS_COMPONENT,
  FORWARD_REF,
  MEMO_COMPONENT,
  SIMPLE_MEMO_COMPONENT,
]);

/**
 * Find the __reactFiber$* property key on a DOM element.
 * React attaches a randomly-suffixed key per render root.
 */
function getReactFiberKey(element: Element): string | null {
  for (const key of Object.keys(element)) {
    if (key.startsWith("__reactFiber$")) return key;
  }
  return null;
}

/**
 * Get the React fiber attached to a DOM element, if any.
 */
function getFiber(element: Element): unknown {
  const key = getReactFiberKey(element);
  if (!key) return null;
  return (element as unknown as Record<string, unknown>)[key] ?? null;
}

interface Fiber {
  tag: number;
  type: {
    name?: string;
    displayName?: string;
    render?: { name?: string; displayName?: string };
  } | null;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  stateNode: Element | null;
}

function isFiber(value: unknown): value is Fiber {
  return (
    typeof value === "object" &&
    value !== null &&
    "tag" in value &&
    "child" in value &&
    "sibling" in value
  );
}

interface FunctionWithMeta {
  displayName?: string;
  name?: string;
}

function getFunctionDisplayName(fn: FunctionWithMeta): string | null {
  return fn.displayName ?? fn.name ?? null;
}

function getComponentName(fiber: Fiber): string | null {
  const type = fiber.type;
  if (!type) return null;

  if (typeof type === "function") {
    return getFunctionDisplayName(type as FunctionWithMeta);
  }

  if (typeof type === "object" && type !== null) {
    // ForwardRef: render fn name wins; do not fall through if render exists (even when unnamed).
    if ("render" in type && typeof type.render === "function") {
      return getFunctionDisplayName(type.render as FunctionWithMeta);
    }

    // Memo / similar: inner function name wins; do not fall through when inner is a function.
    const record = type as Record<string, unknown>;
    if ("type" in record && typeof record.type === "function") {
      return getFunctionDisplayName(record.type as FunctionWithMeta);
    }

    return getFunctionDisplayName(type as FunctionWithMeta);
  }

  return null;
}

function isUserComponent(fiber: Fiber, adapter: FrameworkAdapter): boolean {
  if (!COMPONENT_TAGS.has(fiber.tag)) return false;
  const name = getComponentName(fiber);
  if (!name) return false;
  if (adapter.internals.has(name)) return false;
  return true;
}

/**
 * Walk down from a component fiber to find its root DOM node(s).
 * Stops at the first HostComponent layer — does not recurse into
 * child components.
 */
function getRootDomNodes(fiber: Fiber, adapter: FrameworkAdapter): HTMLElement[] {
  const nodes: HTMLElement[] = [];

  function collect(f: Fiber | null): void {
    if (!f) return;
    if (f.tag === HOST_COMPONENT && f.stateNode instanceof HTMLElement) {
      nodes.push(f.stateNode);
      return; // don't go deeper — this is the DOM root for this subtree
    }
    // Skip into child component fibers but only collect their DOM if
    // they are NOT themselves user components (which get their own entry).
    if (COMPONENT_TAGS.has(f.tag) && f !== fiber && isUserComponent(f, adapter)) {
      return; // this child component will be reported separately
    }
    collect(f.child);
    collect(f.sibling);
  }

  collect(fiber.child);
  return nodes;
}

/**
 * Find the fiber root by trying each candidate in the adapter's list.
 */
function findFiberRoot(adapter: FrameworkAdapter): Fiber | null {
  for (const el of adapter.rootCandidates()) {
    if (!el) continue;
    const raw = getFiber(el);
    if (!isFiber(raw)) continue;

    let root: Fiber = raw;
    while (root.return) root = root.return;
    return root;
  }

  return null;
}

/**
 * True if `el` or one of its ancestors satisfies `predicate`.
 */
function someAncestor(
  el: HTMLElement,
  predicate: (node: HTMLElement) => boolean,
): boolean {
  let current: HTMLElement | null = el;
  while (current) {
    if (predicate(current)) return true;
    current = current.parentElement;
  }
  return false;
}

/**
 * Check whether a DOM node lives inside our own devtools overlay.
 */
function isInsideDevtools(el: HTMLElement): boolean {
  return someAncestor(el, (node) => node.hasAttribute(RSC_DEVTOOLS_DATA_ATTR));
}

/**
 * A client component entry paired with its raw fiber for debug-info extraction.
 *
 * `fiber` is typed as `unknown` because the internal React Fiber shape is
 * not part of the public API and may change between React versions.
 * `getFiberDebugInfo` in rsc-debug-info.ts handles safe access.
 */
export interface ClientComponentWithFiber {
  info: ClientComponentInfo;
  fiber: unknown;
}

/**
 * Scan the React fiber tree and return all user-defined client components
 * with their root DOM nodes, each paired with the underlying fiber so callers
 * can read `_debugInfo` for zero-setup Server Component name detection.
 *
 * Server regions combine explicit markers with heuristic DOM outside client
 * subtrees (see getServerRegions).
 */
export function scanFiberTreeWithFibers(
  adapter: FrameworkAdapter,
): ClientComponentWithFiber[] {
  const root = findFiberRoot(adapter);
  if (!root) return [];

  const components: ClientComponentWithFiber[] = [];

  function walk(fiber: Fiber | null): void {
    if (!fiber) return;

    if (isUserComponent(fiber, adapter)) {
      const name = getComponentName(fiber) ?? "Anonymous";
      const domNodes = getRootDomNodes(fiber, adapter).filter(
        (node) => !isInsideDevtools(node),
      );
      if (domNodes.length > 0) {
        components.push({ info: { name, domNodes }, fiber });
      }
    }

    walk(fiber.child);
    walk(fiber.sibling);
  }

  walk(root.child);
  return components;
}

/**
 * Scan the React fiber tree and return all user-defined client components
 * with their root DOM nodes.
 *
 * Thin wrapper around `scanFiberTreeWithFibers` that discards the raw fibers.
 * Prefer `scanFiberTreeWithFibers` when you also need Server Component name
 * detection via `_debugInfo`.
 */
export function scanFiberTree(adapter: FrameworkAdapter): ClientComponentInfo[] {
  return scanFiberTreeWithFibers(adapter).map(({ info }) => info);
}

function isInsideClientBoundary(
  el: HTMLElement,
  clientRoots: ReadonlySet<HTMLElement>,
): boolean {
  return someAncestor(el, (node) => clientRoots.has(node));
}

/**
 * True if `el` is a strict DOM ancestor of any client component root.
 * Those nodes are excluded from heuristic server highlights so we don't draw
 * a box around a wrapper that contains a client boundary.
 */
function isStrictAncestorOfAnyClientRoot(
  el: HTMLElement,
  clientRoots: ReadonlySet<HTMLElement>,
): boolean {
  for (const root of clientRoots) {
    if (el !== root && el.contains(root)) return true;
  }
  return false;
}

/**
 * True if `el` is the explicit marker element or a descendant of one.
 */
function isInsideExplicitMarkerSubtree(
  el: HTMLElement,
  explicitRoots: ReadonlySet<HTMLElement>,
): boolean {
  return someAncestor(el, (node) => explicitRoots.has(node));
}

function* elementDescendants(root: HTMLElement): Generator<HTMLElement> {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let n: Node | null = walker.nextNode();
  while (n) {
    if (n instanceof HTMLElement && n !== root) {
      yield n;
    }
    n = walker.nextNode();
  }
}

function collectExplicitServerRegions(): ServerRegionInfo[] {
  const selector = `[${SERVER_BOUNDARY_DATA_ATTR}]`;
  const regions: ServerRegionInfo[] = [];
  for (const el of document.querySelectorAll(selector)) {
    if (!(el instanceof HTMLElement)) continue;
    if (isInsideDevtools(el)) continue;
    const raw = el.getAttribute(SERVER_BOUNDARY_DATA_ATTR) ?? "";
    const name = raw.trim();
    const displayLabel =
      name.length > 0 ? name : hostFallbackLabel(el);
    regions.push({
      element: el,
      displayLabel,
      source: "explicit",
    });
  }
  return regions;
}

function hostFallbackLabel(el: HTMLElement): string {
  return formatHostFallbackLabel(el.tagName, el.id);
}

function heuristicRegionPanelLabel(
  el: HTMLElement,
  allRoots: HTMLElement[],
): string {
  if (el.id) {
    return formatHostFallbackLabel(el.tagName, el.id);
  }
  const tag = el.tagName.toLowerCase();
  const sameTag = allRoots.filter((e) => e.tagName === el.tagName);
  if (sameTag.length === 1) {
    return `<${tag}>`;
  }
  const n = sameTag.indexOf(el) + 1;
  return `<${tag}> (${n})`;
}

/**
 * Heuristic server regions: DOM nodes outside every client component subtree,
 * excluding wrappers that strictly contain a client root, and excluding
 * subtrees already covered by explicit markers.
 */
function collectHeuristicServerRegions(
  clientComponents: ClientComponentInfo[],
  explicitMarkerElements: ReadonlySet<HTMLElement>,
  container: HTMLElement,
): ServerRegionInfo[] {
  const clientRoots = new Set<HTMLElement>();
  for (const comp of clientComponents) {
    for (const node of comp.domNodes) {
      clientRoots.add(node);
    }
  }

  const inHeuristicCandidate = (el: HTMLElement): boolean => {
    if (el === container) return false;
    if (!container.contains(el)) return false;
    if (isInsideDevtools(el)) return false;
    if (NON_VISUAL_TAGS.has(el.tagName)) return false;
    if (isInsideClientBoundary(el, clientRoots)) return false;
    if (isInsideExplicitMarkerSubtree(el, explicitMarkerElements)) return false;
    return true;
  };

  const filtered = new Set<HTMLElement>();
  for (const el of elementDescendants(container)) {
    if (!inHeuristicCandidate(el)) continue;
    if (isStrictAncestorOfAnyClientRoot(el, clientRoots)) continue;
    filtered.add(el);
  }

  const roots: HTMLElement[] = [];
  for (const el of filtered) {
    const parent = el.parentElement;
    const parentIn =
      parent !== null &&
      parent !== container &&
      filtered.has(parent);
    if (!parentIn) {
      roots.push(el);
    }
  }

  return roots.map((element) => ({
    element,
    displayLabel: heuristicRegionPanelLabel(element, roots),
    source: "heuristic" as const,
  }));
}

/**
 * Collect server-rendered regions: explicit markers, then rsc-debug regions
 * (from React 19's `_debugInfo`), then heuristic fallback for anything not
 * already covered.
 *
 * Precedence (highest → lowest):
 *   explicit > rsc-debug > heuristic
 *
 * Pass `clientsWithFibers` (from `scanFiberTreeWithFibers`) to enable
 * zero-setup Server Component name detection. When fibers are not available
 * (e.g. legacy callers using only `ClientComponentInfo[]`), the rsc-debug
 * pass is skipped and heuristics fill the gap as before.
 */
export function getServerRegions(
  clients: ClientComponentInfo[] | ClientComponentWithFiber[],
  adapter: FrameworkAdapter,
  container?: HTMLElement,
): ServerRegionInfo[] {
  const root = container ?? adapter.resolveScanContainer() ?? document.body;

  const explicit = collectExplicitServerRegions();
  const explicitRoots = new Set(explicit.map((r) => r.element));

  // Determine whether the caller passed the richer fiber-aware array.
  const hasFibers =
    clients.length > 0 && "fiber" in (clients[0] as object);

  let debugRegions: ServerRegionInfo[] = [];
  if (hasFibers) {
    const fibersWithDom: FiberWithDom[] = (
      clients as ClientComponentWithFiber[]
    ).map(({ fiber, info }) => ({ fiber, domNodes: info.domNodes }));
    debugRegions = collectDebugServerRegions(fibersWithDom, adapter.internals);
  }

  const debugRoots = new Set(debugRegions.map((r) => r.element));

  // Exclude from heuristics any element inside an explicit or debug subtree.
  const coveredRoots = new Set([...explicitRoots, ...debugRoots]);

  const clientComponents: ClientComponentInfo[] = hasFibers
    ? (clients as ClientComponentWithFiber[]).map(({ info }) => info)
    : (clients as ClientComponentInfo[]);

  const heuristic = collectHeuristicServerRegions(
    clientComponents,
    coveredRoots,
    root,
  );

  return [...explicit, ...debugRegions, ...heuristic];
}
