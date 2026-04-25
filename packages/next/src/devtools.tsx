"use client";

import { RscDevtools } from "@rsc-boundary/core";
import { nextAdapter } from "./adapter";

/**
 * Pre-wired devtools component for Next.js.
 * Closes over `nextAdapter` at module evaluation so no adapter props need
 * to cross the server/client boundary.
 */
export function RscDevtoolsNext() {
  return <RscDevtools adapter={nextAdapter} />;
}
