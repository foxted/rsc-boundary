"use client";

/**
 * RscDevtools — floating overlay for visualizing RSC boundaries.
 *
 * Renders a small pill-shaped toggle (bottom-left, visually complementing
 * the Next.js dev indicator) that, when activated, scans the React fiber
 * tree to find all client components, highlights them with orange outlines,
 * and shows server regions in blue.
 *
 * A companion panel lists detected components with counts and a legend.
 *
 * This component is client-only ("use client"). Mounting is controlled by
 * `RscBoundaryProvider` (development by default, or when `enabled` is set).
 */

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import type { ComponentInfo } from "./types";
import { scanFiberTree, getServerRegions } from "./fiber-utils";
import {
  applyHighlights,
  removeHighlights,
  observeDomChanges,
} from "./highlight";
import {
  COLORS,
  PILL_STYLES,
  PILL_ACTIVE_STYLES,
  PANEL_STYLES,
  applyStyles,
} from "./styles";

function componentListEqual(a: ComponentInfo[], b: ComponentInfo[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (ai === undefined || bi === undefined) {
      return false;
    }
    if (ai.name !== bi.name) {
      return false;
    }
    const na = ai.domNodes;
    const nb = bi.domNodes;
    if (na.length !== nb.length) {
      return false;
    }
    for (let j = 0; j < na.length; j++) {
      const naJ = na[j];
      const nbJ = nb[j];
      if (naJ !== nbJ) {
        return false;
      }
    }
  }
  return true;
}

function serverRegionsEqual(a: HTMLElement[], b: HTMLElement[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function serverRegionLabel(el: HTMLElement, all: HTMLElement[]): string {
  const tag = el.tagName.toLowerCase();
  if (el.id) {
    return `<${tag}#${el.id}>`;
  }
  const sameTag = all.filter((e) => e.tagName === el.tagName);
  if (sameTag.length === 1) {
    return `<${tag}>`;
  }
  const n = sameTag.indexOf(el) + 1;
  return `<${tag}> (${n})`;
}

export function RscDevtools() {
  return <RscDevtoolsInner />;
}

function RscDevtoolsInner() {
  const [active, setActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [serverRegions, setServerRegions] = useState<HTMLElement[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);

  const scan = useCallback(() => {
    const clientComponents = scanFiberTree();
    const nextServerRegions = getServerRegions(clientComponents);
    applyHighlights(clientComponents, nextServerRegions);
    setComponents((prev) =>
      componentListEqual(prev, clientComponents) ? prev : clientComponents,
    );
    setServerRegions((prev) =>
      serverRegionsEqual(prev, nextServerRegions) ? prev : nextServerRegions,
    );
  }, []);

  const activate = useCallback(() => {
    // Delay scan slightly to let React finish any pending renders
    requestAnimationFrame(() => {
      scan();
      cleanupRef.current = observeDomChanges(scan);
    });
  }, [scan]);

  const deactivate = useCallback(() => {
    removeHighlights();
    cleanupRef.current?.();
    cleanupRef.current = null;
    setComponents([]);
    setServerRegions([]);
  }, []);

  const handleToggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      if (next) {
        activate();
      } else {
        deactivate();
        setPanelOpen(false);
      }
      return next;
    });
  }, [activate, deactivate]);

  const handlePanelToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (active) {
        setPanelOpen((prev) => !prev);
      }
    },
    [active],
  );

  useEffect(() => {
    return () => {
      removeHighlights();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <>
      {panelOpen && active && (
        <Panel components={components} serverRegions={serverRegions} />
      )}
      <Pill
        active={active}
        onToggle={handleToggle}
        onPanelToggle={handlePanelToggle}
        clientCount={components.length}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PillProps {
  active: boolean;
  onToggle: () => void;
  onPanelToggle: (e: React.MouseEvent) => void;
  clientCount: number;
}

function Pill({ active, onToggle, onPanelToggle, clientCount }: PillProps) {
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pillRef.current) return;
    applyStyles(pillRef.current, PILL_STYLES);
    if (active) {
      applyStyles(pillRef.current, PILL_ACTIVE_STYLES as Record<string, string>);
    }
  }, [active]);

  return (
    <button
      ref={pillRef}
      type="button"
      onClick={onToggle}
      data-rsc-devtools=""
      aria-label="Toggle RSC boundary highlighting"
      title="Toggle RSC boundary highlighting"
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? COLORS.client.outline : "rgba(255,255,255,0.4)",
          transition: "background 150ms ease",
        }}
      />
      <span>RSC</span>
      {active && (
        <span
          role="button"
          tabIndex={0}
          onClick={onPanelToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onPanelToggle(e as unknown as React.MouseEvent);
            }
          }}
          data-rsc-devtools=""
          style={{
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            padding: "0 0 0 4px",
            fontSize: "12px",
            fontFamily: "inherit",
            lineHeight: "1",
          }}
          aria-label="Toggle component panel"
          title="Toggle component panel"
        >
          {clientCount > 0 ? `(${clientCount})` : "···"}
        </span>
      )}
    </button>
  );
}

type PanelTab = "client" | "server";

interface PanelProps {
  components: ComponentInfo[];
  serverRegions: HTMLElement[];
}

function Panel({ components, serverRegions }: PanelProps) {
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
      <div style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 11 }}>
        <LegendItem color={COLORS.server.outline} label="Server" />
        <LegendItem color={COLORS.client.outline} label="Client" />
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
              {serverRegions.map((el, i) => (
                <ServerRegionEntry
                  key={`server-region-${i}`}
                  label={serverRegionLabel(el, serverRegions)}
                />
              ))}
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {components.length > 0 ? (
                <>
                  No top-level server regions (client components may wrap the
                  page).
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>
                    Switch to the client tab for detected client components.
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

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: 2,
          border: `2px dashed ${color}`,
        }}
      />
      {label}
    </span>
  );
}

function ServerRegionEntry({ label }: { label: string }) {
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
      <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "ui-monospace, monospace" }}>
        {label}
      </span>
    </div>
  );
}

function ComponentEntry({ component }: { component: ComponentInfo }) {
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
