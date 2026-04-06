import type { ServerRegionInfo } from "../types";
import { COLORS } from "../styles";

interface ServerRegionEntryProps {
  region: ServerRegionInfo;
}

export function ServerRegionEntry({ region }: ServerRegionEntryProps) {
  const provenance = region.source === "explicit" ? "explicit" : "~";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 6px",
        borderRadius: 4,
        background: "rgba(59, 130, 246, 0.12)",
        fontSize: 11,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.server.outline,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          minWidth: 52,
          flexShrink: 0,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color:
            region.source === "explicit"
              ? "rgba(147, 197, 253, 0.95)"
              : "rgba(255,255,255,0.45)",
        }}
      >
        {provenance}
      </span>
      <span
        style={{
          color: "rgba(255,255,255,0.9)",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {region.displayLabel}
      </span>
    </div>
  );
}
