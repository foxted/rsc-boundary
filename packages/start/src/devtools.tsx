"use client";

import { RscDevtools } from "@rsc-boundary/core";
import { startAdapter } from "./adapter";

/**
 * Pre-wired devtools component for TanStack Start.
 * Closes over `startAdapter` at module evaluation so no adapter props need
 * to cross the server/client boundary.
 */
export function RscDevtoolsStart() {
  return <RscDevtools adapter={startAdapter} />;
}
