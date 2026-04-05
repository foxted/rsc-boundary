/**
 * Represents a detected client component boundary in the fiber tree.
 * Server components have no fibers on the client — they are identified
 * by exclusion (DOM regions not owned by any client component).
 */
export interface ComponentInfo {
  name: string;
  domNodes: HTMLElement[];
}

export interface HighlightState {
  enabled: boolean;
  components: ComponentInfo[];
}
