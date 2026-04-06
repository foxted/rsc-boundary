import type { ClientComponentInfo } from "../types";
import { COLORS } from "../styles";

interface ClientComponentEntryProps {
  component: ClientComponentInfo;
}

export function ClientComponentEntry({ component }: ClientComponentEntryProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 6px",
        borderRadius: 4,
        background: "rgba(249, 115, 22, 0.1)",
        fontSize: 11,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.client.outline,
          flexShrink: 0,
        }}
      />
      <span style={{ color: "rgba(255,255,255,0.9)" }}>
        {`<${component.name} />`}
      </span>
      {component.domNodes.length > 1 && (
        <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: "auto" }}>
          {component.domNodes.length} nodes
        </span>
      )}
    </div>
  );
}
