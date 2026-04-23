import type { ServerRegionInfo } from "../types";
import { COLORS } from "../styles";

interface ServerRegionEntryProps {
  region: ServerRegionInfo;
}

function provenanceLabel(source: ServerRegionInfo["source"]): string {
  if (source === "explicit") return "explicit";
  if (source === "rsc-debug") return "rsc";
  return "~";
}

function provenanceColor(source: ServerRegionInfo["source"]): string {
  if (source === "explicit") return "rgba(147, 197, 253, 0.95)";
  if (source === "rsc-debug") return "rgba(134, 239, 172, 0.9)";
  return "rgba(255,255,255,0.45)";
}

export function ServerRegionEntry({ region }: ServerRegionEntryProps) {
  const provenance = provenanceLabel(region.source);
  const color = provenanceColor(region.source);
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
          color,
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
      {region.source === "rsc-debug" && region.env && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "1px 4px",
            borderRadius: 3,
            background: "rgba(134, 239, 172, 0.15)",
            color: "rgba(134, 239, 172, 0.85)",
            flexShrink: 0,
          }}
        >
          {region.env}
        </span>
      )}
    </div>
  );
}
