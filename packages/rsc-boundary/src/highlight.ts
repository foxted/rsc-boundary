/**
 * DOM highlighting for RSC Boundary visualization.
 *
 * When active, this module:
 * 1. Takes the list of client components (from fiber-utils) and applies
 *    orange dashed outlines to their root DOM elements.
 * 2. Identifies server regions (explicit markers and/or heuristic DOM outside
 *    client subtrees) and applies blue dashed outlines.
 * 3. Injects small floating labels (client name; server label + explicit vs ~).
 * 4. Sets up a MutationObserver to re-scan when the DOM changes
 *    (e.g. route navigation, lazy-loaded content).
 *
 * All styling uses inline styles — no global CSS is injected.
 */

import { formatDevtoolsLabelCaption } from "./highlight-caption";
import type {
  ClientComponentInfo,
  ServerRegionInfo,
  ServerRegionSource,
} from "./types";
import { COLORS, LABEL_BASE_STYLES, applyStyles } from "./styles";

const HIGHLIGHT_ATTR = "data-rsc-highlight";
const LABEL_ATTR = "data-rsc-label";

interface HighlightEntry {
  element: HTMLElement;
  originalOutline: string;
  originalPosition: string;
  label: HTMLElement;
}

let activeHighlights: HighlightEntry[] = [];
let observer: MutationObserver | null = null;

const OBSERVER_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
};

/**
 * Our own highlight/label DOM updates trigger childList mutations. Pause the
 * observer while mutating so we don't debounce-scan → setState in a loop.
 */
function withObserverPaused(callback: () => void): void {
  if (!observer) {
    callback();
    return;
  }
  observer.disconnect();
  try {
    callback();
  } finally {
    observer.observe(document.body, OBSERVER_OPTIONS);
  }
}

function createLabel(
  name: string,
  kind: "server" | "client",
  serverSource?: ServerRegionSource,
): HTMLElement {
  const label = document.createElement("div");
  label.setAttribute(LABEL_ATTR, "");
  label.setAttribute("data-rsc-devtools", "");
  label.textContent = formatDevtoolsLabelCaption(name, kind, serverSource);
  applyStyles(label, {
    ...LABEL_BASE_STYLES,
    background: kind === "client" ? COLORS.client.label : COLORS.server.label,
  });
  return label;
}

function highlightElement(
  element: HTMLElement,
  name: string,
  kind: "server" | "client",
  serverSource?: ServerRegionSource,
): HighlightEntry {
  const colors = kind === "client" ? COLORS.client : COLORS.server;

  const originalOutline = element.style.outline;
  const originalPosition = element.style.position;

  element.style.outline = `2px dashed ${colors.outline}`;
  element.setAttribute(HIGHLIGHT_ATTR, kind);

  // Labels need a positioned ancestor to sit correctly
  const computed = globalThis.getComputedStyle(element);
  if (computed.position === "static") {
    element.style.position = "relative";
  }

  const label = createLabel(name, kind, serverSource);
  element.appendChild(label);

  return { element, originalOutline, originalPosition, label };
}

/**
 * Apply highlights to detected client components and server regions.
 */
export function applyHighlights(
  clientComponents: ClientComponentInfo[],
  serverRegions: ServerRegionInfo[],
): void {
  withObserverPaused(() => {
    removeHighlightsInternal();

    for (const comp of clientComponents) {
      for (const node of comp.domNodes) {
        activeHighlights.push(highlightElement(node, comp.name, "client"));
      }
    }

    for (const region of serverRegions) {
      activeHighlights.push(
        highlightElement(
          region.element,
          region.displayLabel,
          "server",
          region.source,
        ),
      );
    }
  });
}

function removeHighlightsInternal(): void {
  for (const entry of activeHighlights) {
    entry.element.style.outline = entry.originalOutline;
    entry.element.style.position = entry.originalPosition;
    entry.element.removeAttribute(HIGHLIGHT_ATTR);
    entry.label.remove();
  }
  activeHighlights = [];
}

/**
 * Remove all active highlights and restore original styles.
 */
export function removeHighlights(): void {
  withObserverPaused(removeHighlightsInternal);
}

/**
 * Start a MutationObserver that calls `onMutation` when the DOM subtree
 * changes (route transitions, lazy loading, etc.).
 * Returns a cleanup function to disconnect the observer.
 */
export function observeDomChanges(onMutation: () => void): () => void {
  if (observer) {
    observer.disconnect();
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(onMutation, 300);
  });

  observer.observe(document.body, OBSERVER_OPTIONS);

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    observer?.disconnect();
    observer = null;
  };
}
