import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { SERVER_BOUNDARY_DATA_ATTR } from "../constants";

interface RscServerBoundaryMarkerProps {
  children: ReactNode;
  /** Shown in devtools when the region source is explicit. */
  label?: string;
}

/**
 * Server Component that opts a subtree into **explicit** server-region
 * detection.
 *
 * Uses an `asChild`-style pattern: it does NOT render a wrapper element.
 * Instead it clones its single child and injects `SERVER_BOUNDARY_DATA_ATTR`
 * onto it so the devtools scanner can find the region by `querySelectorAll`.
 *
 * Production behavior: zero impact. When `process.env.NODE_ENV !==
 * "development"` this component is a pass-through — no cloning, no
 * attribute, no extra DOM. Forgetting a marker in a production build
 * therefore has no effect on the shipped HTML or CSS.
 *
 * Requirements:
 * - `children` must be a single React element. Arrays, strings, and
 *   fragments are passed through untouched (with a dev-only warning).
 * - For reliable detection the child should be a host element (e.g.
 *   `<section>`, `<div>`). Custom components only propagate the attribute
 *   if they spread unknown props onto their root DOM element.
 */
export function RscServerBoundaryMarker({
  children,
  label,
}: RscServerBoundaryMarkerProps) {
  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>;
  }

  if (!isValidElement(children)) {
    if (typeof console !== "undefined") {
      console.warn(
        "[rsc-boundary] RscServerBoundaryMarker expected a single React element as children. The marker will be ignored.",
      );
    }
    return <>{children}</>;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    [SERVER_BOUNDARY_DATA_ATTR]: label ?? "",
  });
}
