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
export type ServerRegionSource = "explicit" | "heuristic";

/** Client vs server outline/label kind in devtools overlays. */
export type HighlightKind = "client" | "server";

/**
 * A highlighted server-rendered DOM region (explicit marker or heuristic).
 */
export interface ServerRegionInfo {
  element: HTMLElement;
  /** Label for panel and floating overlay */
  displayLabel: string;
  source: ServerRegionSource;
}

export interface HighlightState {
  enabled: boolean;
  clientComponents: ClientComponentInfo[];
}
