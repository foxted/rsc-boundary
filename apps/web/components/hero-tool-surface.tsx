import {
  COLORS,
  LABEL_BASE_STYLES,
  type ServerRegionSource,
} from "@rsc-boundary/next";
import type { CSSProperties, ReactNode } from "react";

interface HeroToolSurfaceProps {
  kind: "server" | "client";
  /** Same string the tool shows after the prefix (e.g. heuristic label or component name). */
  name: string;
  serverSource?: ServerRegionSource;
  children: ReactNode;
}

function labelText(
  name: string,
  kind: "server" | "client",
  serverSource: ServerRegionSource | undefined,
): string {
  if (kind === "client") {
    return `Client: ${name}`;
  }
  const prefix =
    serverSource === "explicit" ? "Server (explicit)" : "Server (~)";
  return `${prefix}: ${name}`;
}

/**
 * Static recreation of {@link highlightElement} visuals — 2px dashed outline,
 * relative positioning, and the same label node styling as the real devtools.
 */
export function HeroToolSurface({
  kind,
  name,
  serverSource = "heuristic",
  children,
}: HeroToolSurfaceProps) {
  const colors = kind === "client" ? COLORS.client : COLORS.server;

  const shellStyle: CSSProperties = {
    position: "relative",
    outline: `2px dashed ${colors.outline}`,
  };

  const labelStyle: CSSProperties = {
    ...(LABEL_BASE_STYLES as unknown as CSSProperties),
    background: colors.label,
  };

  return (
    <div style={shellStyle} data-rsc-highlight={kind}>
      {children}
      <div data-rsc-label="" data-rsc-devtools="" style={labelStyle}>
        {labelText(name, kind, kind === "server" ? serverSource : undefined)}
      </div>
    </div>
  );
}
