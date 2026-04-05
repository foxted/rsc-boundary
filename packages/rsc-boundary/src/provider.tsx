/**
 * RscBoundaryProvider — the single integration point for rsc-boundary.
 *
 * This is a React Server Component (no "use client" directive). Add it once
 * in your root layout:
 *
 * ```tsx
 * import { RscBoundaryProvider } from "rsc-boundary";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <RscBoundaryProvider>{children}</RscBoundaryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * In development, it renders `{children}` plus the `<RscDevtools />` floating
 * overlay. In production, it renders only `{children}` — zero runtime cost.
 */

import type { ReactNode } from "react";
import { RscDevtools } from "./devtools";

interface RscBoundaryProviderProps {
  children: ReactNode;
}

export function RscBoundaryProvider({ children }: RscBoundaryProviderProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      {children}
      {isDev && <RscDevtools />}
    </>
  );
}
