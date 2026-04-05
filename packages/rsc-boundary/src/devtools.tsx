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
 * This component is client-only ("use client") and renders nothing in
 * production builds.
 */

import { useState, useCallback, useEffect, useRef } from "react";
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

export function RscDevtools() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <RscDevtoolsInner />;
}

function RscDevtoolsInner() {
  const [active, setActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [serverCount, setServerCount] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const scan = useCallback(() => {
    const clientComponents = scanFiberTree();
    const serverRegions = getServerRegions(clientComponents);
    setComponents(clientComponents);
    setServerCount(serverRegions.length);
    applyHighlights(clientComponents, serverRegions);
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
    setServerCount(0);
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
        <Panel components={components} serverCount={serverCount} />
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

interface PanelProps {
  components: ComponentInfo[];
  serverCount: number;
}

function Panel({ components, serverCount }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    applyStyles(panelRef.current, PANEL_STYLES);
  }, []);

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

      {/* Counts */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 10,
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <span>
          {serverCount} server region{serverCount !== 1 ? "s" : ""}
        </span>
        <span>
          {components.length} client component{components.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Component list */}
      {components.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {components.map((comp, i) => (
            <ComponentEntry key={`${comp.name}-${i}`} component={comp} />
          ))}
        </div>
      )}

      {components.length === 0 && (
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
          No client components detected.
          <br />
          All content is server-rendered.
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
