import type { HighlightKind, ServerRegionSource } from "./types";

/**
 * Text shown on floating boundary labels (client vs server, explicit vs heuristic).
 */
export function formatDevtoolsLabelCaption(
  name: string,
  kind: HighlightKind,
  serverSource?: ServerRegionSource,
): string {
  const prefix =
    kind === "client"
      ? "Client"
      : serverSource === "explicit"
        ? "Server (explicit)"
        : serverSource === "rsc-debug"
          ? "Server (rsc)"
          : "Server (~)";
  return `${prefix}: ${name}`;
}
