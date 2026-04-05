import type { ReactNode } from "react";

import { SERVER_BOUNDARY_DATA_ATTR } from "./constants";

interface RscServerBoundaryMarkerProps {
  children: ReactNode;
  /** Shown in devtools when the region source is explicit. */
  label?: string;
  className?: string;
}

/**
 * Server Component wrapper that opts a subtree into **explicit** server-region
 * detection. Add `label` so the devtools panel shows a stable name.
 *
 * Heuristic detection still runs elsewhere; this marker is optional.
 */
export function RscServerBoundaryMarker({
  children,
  label,
  className,
}: RscServerBoundaryMarkerProps) {
  return (
    <div
      className={className}
      {...{ [SERVER_BOUNDARY_DATA_ATTR]: label ?? "" }}
    >
      {children}
    </div>
  );
}
