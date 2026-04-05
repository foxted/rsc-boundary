/**
 * CSS-in-JS constants for the devtools overlay.
 * All styles are applied via inline styles or injected style elements
 * to avoid requiring a CSS file or global stylesheet.
 */

export const COLORS = {
  client: {
    outline: "rgba(249, 115, 22, 0.8)",
    background: "rgba(249, 115, 22, 0.12)",
    label: "rgba(249, 115, 22, 0.95)",
  },
  server: {
    outline: "rgba(59, 130, 246, 0.8)",
    background: "rgba(59, 130, 246, 0.12)",
    label: "rgba(59, 130, 246, 0.95)",
  },
} as const;

export const PILL_STYLES: Record<string, string> = {
  position: "fixed",
  bottom: "64px",
  left: "16px",
  zIndex: "99999",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  borderRadius: "9999px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(8px)",
  color: "#fff",
  fontSize: "13px",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontWeight: "500",
  cursor: "pointer",
  userSelect: "none",
  lineHeight: "1",
  transition: "background 150ms ease, box-shadow 150ms ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
};

export const PILL_ACTIVE_STYLES: Partial<typeof PILL_STYLES> = {
  background: "rgba(0, 0, 0, 0.9)",
  boxShadow: `0 0 0 2px ${COLORS.client.outline}, 0 2px 8px rgba(0, 0, 0, 0.3)`,
};

export const PANEL_STYLES: Record<string, string> = {
  position: "fixed",
  bottom: "52px",
  left: "16px",
  zIndex: "99998",
  width: "280px",
  maxHeight: "400px",
  overflowY: "auto",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(0, 0, 0, 0.85)",
  backdropFilter: "blur(12px)",
  color: "#fff",
  fontSize: "12px",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  padding: "12px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
};

export const LABEL_BASE_STYLES: Record<string, string> = {
  position: "absolute",
  top: "-1px",
  left: "-1px",
  padding: "1px 6px",
  fontSize: "10px",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontWeight: "600",
  lineHeight: "16px",
  color: "#fff",
  borderRadius: "0 0 4px 0",
  pointerEvents: "none",
  zIndex: "99997",
  whiteSpace: "nowrap",
};

export function applyStyles(
  el: HTMLElement,
  styles: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(styles)) {
    el.style.setProperty(
      key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
      value,
    );
  }
}
