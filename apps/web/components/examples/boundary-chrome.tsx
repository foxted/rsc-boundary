import type { ReactNode } from "react";
import { COLORS } from "@rsc-boundary/next";

/**
 * Static outlines that mimic development devtools (this site does not ship
 * rsc-boundary scanning in production).
 */
interface FakeServerChromeProps {
  label: string;
  variant?: "explicit" | "heuristic";
  children: ReactNode;
}

export function FakeServerChrome({
  label,
  variant = "explicit",
  children,
}: FakeServerChromeProps) {
  const caption =
    variant === "explicit"
      ? `Server (explicit): ${label}`
      : `Server (~): ${label}`;

  return (
    <div
      className="relative rounded-xl"
      style={{
        outline: `2px dashed ${COLORS.server.outline}`,
        background: COLORS.server.background,
      }}
    >
      <span
        className="absolute left-0 top-0 z-10 rounded-br px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-4 text-white"
        style={{ background: COLORS.server.label }}
      >
        {caption}
      </span>
      <div className="p-3 pt-7">{children}</div>
    </div>
  );
}

interface FakeClientChromeProps {
  label: string;
  children: ReactNode;
}

export function FakeClientChrome({ label, children }: FakeClientChromeProps) {
  return (
    <div
      className="relative rounded-lg"
      style={{
        outline: `2px dashed ${COLORS.client.outline}`,
        background: COLORS.client.background,
      }}
    >
      <span
        className="absolute left-0 top-0 z-10 rounded-br px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-4 text-white"
        style={{ background: COLORS.client.label }}
      >
        {`Client: ${label}`}
      </span>
      <div className="p-3 pt-7">{children}</div>
    </div>
  );
}
