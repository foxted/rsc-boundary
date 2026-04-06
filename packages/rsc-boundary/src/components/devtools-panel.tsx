import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";

import type { ComponentInfo, ServerRegionInfo } from "../types";
import { COLORS, PANEL_STYLES, applyStyles } from "../styles";
import { LegendItem } from "./devtools-legend-item";
import { ComponentEntry } from "./devtools-component-entry";
import { ServerRegionEntry } from "./devtools-server-region-entry";

type PanelTab = "client" | "server";

export interface PanelProps {
  components: ComponentInfo[];
  serverRegions: ServerRegionInfo[];
}

export function Panel({ components, serverRegions }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<PanelTab>("client");

  useEffect(() => {
    if (!panelRef.current) return;
    applyStyles(panelRef.current, PANEL_STYLES);
  }, []);

  const tabBase: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minHeight: 44,
    padding: "6px 6px 8px",
    border: "none",
    borderRadius: "4px 4px 0 0",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const tabLine1: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.15,
    fontVariantNumeric: "tabular-nums",
  };

  const tabLine2: CSSProperties = {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.2,
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <div ref={panelRef} data-rsc-devtools="">
      <div
        style={{
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        RSC Boundaries
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 10,
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <LegendItem color={COLORS.server.outline} label="Server" />
          <LegendItem color={COLORS.client.outline} label="Client" />
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 10,
            lineHeight: 1.35,
          }}
        >
          Server:{" "}
          <span style={{ color: "rgba(255,255,255,0.65)" }}>explicit</span>{" "}
          (marker) vs{" "}
          <span style={{ color: "rgba(255,255,255,0.65)" }}>~</span>{" "}
          (heuristic).
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Boundary list scope"
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 10,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "client"}
          id="rsc-panel-tab-client"
          aria-controls="rsc-panel-client"
          aria-label={`${components.length} client component${components.length !== 1 ? "s" : ""}`}
          onClick={() => setTab("client")}
          style={{
            ...tabBase,
            color:
              tab === "client"
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.55)",
            borderBottom:
              tab === "client"
                ? `2px solid ${COLORS.client.outline}`
                : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          <span style={tabLine1}>{components.length}</span>
          <span style={tabLine2}>
            client component{components.length !== 1 ? "s" : ""}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "server"}
          id="rsc-panel-tab-server"
          aria-controls="rsc-panel-server"
          aria-label={`${serverRegions.length} server region${serverRegions.length !== 1 ? "s" : ""}`}
          onClick={() => setTab("server")}
          style={{
            ...tabBase,
            color:
              tab === "server"
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.55)",
            borderBottom:
              tab === "server"
                ? `2px solid ${COLORS.server.outline}`
                : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          <span style={tabLine1}>{serverRegions.length}</span>
          <span style={tabLine2}>
            server region{serverRegions.length !== 1 ? "s" : ""}
          </span>
        </button>
      </div>

      {tab === "client" && (
        <div
          id="rsc-panel-client"
          role="tabpanel"
          aria-labelledby="rsc-panel-tab-client"
        >
          {components.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {components.map((comp, i) => (
                <ComponentEntry key={`${comp.name}-${i}`} component={comp} />
              ))}
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {serverRegions.length > 0 ? (
                <>
                  No client components in this view.
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>
                    Switch to the server tab to see server regions.
                  </span>
                </>
              ) : (
                "No regions detected."
              )}
            </div>
          )}
        </div>
      )}

      {tab === "server" && (
        <div
          id="rsc-panel-server"
          role="tabpanel"
          aria-labelledby="rsc-panel-tab-server"
        >
          {serverRegions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {serverRegions.map((region, i) => (
                <ServerRegionEntry
                  key={`server-region-${i}`}
                  region={region}
                />
              ))}
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {components.length > 0 ? (
                <>
                  No server regions in this view (everything may sit under
                  client boundaries).
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>
                    Switch to the client tab or add an explicit server marker.
                  </span>
                </>
              ) : (
                "No regions detected."
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
