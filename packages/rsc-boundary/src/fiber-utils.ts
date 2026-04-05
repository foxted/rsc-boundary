/**
 * React fiber tree utilities for automatic RSC boundary detection.
 *
 * How it works:
 * - React Server Components are resolved on the server and sent as pre-rendered
 *   HTML. They have NO corresponding fibers in the client-side React tree.
 * - Client Components ("use client") are hydrated on the client and DO have
 *   fibers (FunctionComponent, ForwardRef, MemoComponent, etc.).
 *
 * By walking the fiber tree after hydration, we find every user-defined client
 * component and map it to its root DOM node(s). Everything else in the DOM is
 * server component output.
 *
 * This approach mirrors what React DevTools does internally — it accesses the
 * __reactFiber$* property that React attaches to DOM elements during hydration.
 */

import type { ComponentInfo } from "./types";

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
 * Next.js internal client component names to filter out.
 * These are framework components that appear in the fiber tree but are not
 * user-authored — highlighting them would add noise rather than insight.
 */
const NEXT_INTERNALS = new Set([
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
  // Our own devtools root components (sub-components filtered via DOM check)
  "RscDevtools",
  "RscDevtoolsInner",
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

function getComponentName(fiber: Fiber): string | null {
  const type = fiber.type;
  if (!type) return null;

  if (typeof type === "function") {
    return (type as { displayName?: string; name?: string }).displayName ??
      (type as { name?: string }).name ?? null;
  }

  if (typeof type === "object" && type !== null) {
    // ForwardRef wraps a render function
    if ("render" in type && typeof type.render === "function") {
      return (type.render as { displayName?: string; name?: string }).displayName ??
        (type.render as { name?: string }).name ?? null;
    }
    // MemoComponent wraps a type
    if ("type" in type) {
      const inner = (type as Record<string, unknown>).type;
      if (typeof inner === "function") {
        return (inner as { displayName?: string; name?: string }).displayName ??
          (inner as { name?: string }).name ?? null;
      }
    }
    return type.displayName ?? type.name ?? null;
  }

  return null;
}

function isUserComponent(fiber: Fiber): boolean {
  if (!COMPONENT_TAGS.has(fiber.tag)) return false;
  const name = getComponentName(fiber);
  if (!name) return false;
  if (NEXT_INTERNALS.has(name)) return false;
  return true;
}

/**
 * Walk down from a component fiber to find its root DOM node(s).
 * Stops at the first HostComponent layer — does not recurse into
 * child components.
 */
function getRootDomNodes(fiber: Fiber): HTMLElement[] {
  const nodes: HTMLElement[] = [];

  function collect(f: Fiber | null): void {
    if (!f) return;
    if (f.tag === HOST_COMPONENT && f.stateNode instanceof HTMLElement) {
      nodes.push(f.stateNode);
      return; // don't go deeper — this is the DOM root for this subtree
    }
    // Skip into child component fibers but only collect their DOM if
    // they are NOT themselves user components (which get their own entry).
    if (COMPONENT_TAGS.has(f.tag) && f !== fiber && isUserComponent(f)) {
      return; // this child component will be reported separately
    }
    collect(f.child);
    collect(f.sibling);
  }

  collect(fiber.child);
  return nodes;
}

/**
 * Find the fiber root by starting at a DOM element and walking up.
 */
function findFiberRoot(): Fiber | null {
  const candidates = [
    document.getElementById("__next"),
    document.body,
    document.documentElement,
  ];

  for (const el of candidates) {
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
 * Check whether a DOM node lives inside our own devtools overlay.
 */
function isInsideDevtools(el: HTMLElement): boolean {
  let current: HTMLElement | null = el;
  while (current) {
    if (current.dataset.rscDevtools != null) return true;
    current = current.parentElement;
  }
  return false;
}

/**
 * Scan the React fiber tree and return all user-defined client components
 * with their root DOM nodes.
 *
 * Server components have no fibers — their DOM regions are identified by
 * exclusion (any DOM node not inside a client component's subtree).
 */
export function scanFiberTree(): ComponentInfo[] {
  const root = findFiberRoot();
  if (!root) return [];

  const components: ComponentInfo[] = [];

  function walk(fiber: Fiber | null): void {
    if (!fiber) return;

    if (isUserComponent(fiber)) {
      const name = getComponentName(fiber) ?? "Anonymous";
      const domNodes = getRootDomNodes(fiber).filter(
        (node) => !isInsideDevtools(node),
      );
      if (domNodes.length > 0) {
        components.push({ name, domNodes });
      }
    }

    walk(fiber.child);
    walk(fiber.sibling);
  }

  walk(root.child);
  return components;
}

/**
 * Collect DOM elements that are server-rendered (not inside any client
 * component's DOM subtree). Operates on direct children of a container
 * (typically document.body or #__next) and returns those that have no
 * overlap with the given client component nodes.
 */
export function getServerRegions(
  clientComponents: ComponentInfo[],
  container?: HTMLElement,
): HTMLElement[] {
  const root = container ?? document.getElementById("__next") ?? document.body;

  const clientNodeSet = new Set<HTMLElement>();
  for (const comp of clientComponents) {
    for (const node of comp.domNodes) {
      clientNodeSet.add(node);
    }
  }

  const serverRegions: HTMLElement[] = [];

  function isInsideClientNode(el: HTMLElement): boolean {
    let current: HTMLElement | null = el;
    while (current && current !== root) {
      if (clientNodeSet.has(current)) return true;
      current = current.parentElement;
    }
    return false;
  }

  // Walk direct children of the container. If a child is not a client
  // component root and not inside one, it's server-rendered content.
  for (const child of Array.from(root.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (clientNodeSet.has(child)) continue;
    if (isInsideClientNode(child)) continue;
    // Skip our devtools overlay
    if (child.dataset.rscDevtools != null) continue;
    serverRegions.push(child);
  }

  return serverRegions;
}
