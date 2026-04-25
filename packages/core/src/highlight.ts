/**
 * DOM highlighting for RSC Boundary visualization.
 *
 * When active, this module:
 * 1. Takes the list of client components (from fiber-utils) and applies
 *    orange dashed outlines to their root DOM elements.
 * 2. Identifies server regions (explicit, rsc-debug, heuristic) and applies blue
 *    dashed outlines.
 * 3. Injects small floating labels (client name; server label + explicit / rsc / ~).
 * 4. Sets up a MutationObserver to re-scan when the DOM changes
 *    (e.g. route navigation, lazy-loaded content).
 *
 * All styling uses inline styles — no global CSS is injected.
 *
 * Module state (`activeHighlights`, `MutationObserver`) assumes a single
 * devtools overlay instance. Multiple concurrent mounts are unsupported and may
 * corrupt restored outline/position styles and label nodes.
 */

import {
  RSC_DEVTOOLS_DATA_ATTR,
  RSC_HIGHLIGHT_DATA_ATTR,
  RSC_LABEL_DATA_ATTR,
} from "./constants";
import { formatDevtoolsLabelCaption } from "./highlight-caption";
import type {
  ClientComponentInfo,
  HighlightKind,
  ServerRegionInfo,
  ServerRegionSource,
} from "./types";
import { COLORS, LABEL_BASE_STYLES, applyStyles } from "./styles";

/** Debounced delay before re-scanning after DOM mutations (balance UI latency vs churn). */
const DOM_MUTATION_DEBOUNCE_MS = 300;

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
  kind: HighlightKind,
  serverSource?: ServerRegionSource,
): HTMLElement {
  const label = document.createElement("div");
  label.setAttribute(RSC_LABEL_DATA_ATTR, "");
  label.setAttribute(RSC_DEVTOOLS_DATA_ATTR, "");
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
  kind: HighlightKind,
  serverSource?: ServerRegionSource,
): HighlightEntry {
  const colors = kind === "client" ? COLORS.client : COLORS.server;

  const originalOutline = element.style.outline;
  const originalPosition = element.style.position;

  element.style.outline = `2px dashed ${colors.outline}`;
  element.setAttribute(RSC_HIGHLIGHT_DATA_ATTR, kind);

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
    entry.element.removeAttribute(RSC_HIGHLIGHT_DATA_ATTR);
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
    debounceTimer = setTimeout(onMutation, DOM_MUTATION_DEBOUNCE_MS);
  });

  observer.observe(document.body, OBSERVER_OPTIONS);

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    observer?.disconnect();
    observer = null;
  };
}
