/**
 * Represents a detected client component boundary in the fiber tree.
 * Server components have no fibers on the client — they are identified
 * by exclusion (DOM regions not owned by any client component) and/or
 * optional explicit markers.
 */
export interface ClientComponentInfo {
  name: string;
  domNodes: HTMLElement[];
}

/** How a server region was detected. */
export type ServerRegionSource = "explicit" | "heuristic" | "rsc-debug";

/** Client vs server outline/label kind in devtools overlays. */
export type HighlightKind = "client" | "server";

/**
 * React 19 DEV-only debug info attached to fibers. Mirrors the internal
 * ReactComponentInfo shape emitted by the RSC Flight stream (row type "D").
 * Only present in development builds; must never be relied on in prod paths.
 */
export interface ReactComponentInfo {
  name: string;
  env?: "Server" | "Client";
  key?: string | null;
  owner?: ReactComponentInfo | null;
}

/**
 * A highlighted server-rendered DOM region (explicit marker, rsc-debug, or heuristic).
 */
export interface ServerRegionInfo {
  element: HTMLElement;
  /** Label for panel and floating overlay */
  displayLabel: string;
  source: ServerRegionSource;
  /**
   * The real Server Component name when source is "rsc-debug".
   * May differ from displayLabel if the label has been customised.
   */
  componentName?: string;
  /**
   * Environment badge from React's _debugInfo (e.g. "Server").
   * Only present when source is "rsc-debug".
   */
  env?: "Server" | "Client";
}

export interface HighlightState {
  enabled: boolean;
  clientComponents: ClientComponentInfo[];
}

/**
 * Per-framework adapter supplied to the core scanning and provider APIs.
 * Adapters live in `@rsc-boundary/next` and `@rsc-boundary/start`; the
 * core package is framework-agnostic and only depends on this interface.
 */
export interface FrameworkAdapter {
  /** Human-readable name shown in debug output. */
  name: string;
  /**
   * Set of component display-names that belong to the framework's own
   * internals. These are excluded from client-component detection so they
   * don't add noise to the devtools panel.
   */
  internals: ReadonlySet<string>;
  /**
   * Returns an ordered list of DOM elements to try as the React fiber root
   * (first non-null candidate with a React fiber wins).
   */
  rootCandidates: () => Array<HTMLElement | null>;
  /**
   * Returns the container element used as the scan boundary for heuristic
   * server-region detection. Defaults to `document.body` when null.
   */
  resolveScanContainer: () => HTMLElement | null;
}
