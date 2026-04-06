import { useEffect, useRef, type MouseEvent } from "react";

import {
  COLORS,
  PILL_STYLES,
  PILL_ACTIVE_STYLES,
  applyStyles,
} from "../styles";

export interface PillProps {
  active: boolean;
  onToggle: () => void;
  onPanelToggle: (e: MouseEvent) => void;
  clientCount: number;
}

export function Pill({
  active,
  onToggle,
  onPanelToggle,
  clientCount,
}: PillProps) {
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
      aria-label="Toggle RSC Boundary highlighting"
      title="Toggle RSC Boundary highlighting"
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
              onPanelToggle(e as unknown as MouseEvent);
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
