import type { ComponentType, ReactNode } from "react";

export interface RscBoundaryProviderProps {
  children: ReactNode;
}

/**
 * Creates a framework-specific `RscBoundaryProvider` server component.
 *
 * `DevtoolsComponent` is a pre-wired client component (no props) that
 * internally closes over the framework adapter. Passing a component type
 * rather than the adapter directly avoids serializing non-serializable values
 * (functions) across the server/client boundary.
 *
 * Usage in an adapter package:
 * ```tsx
 * // devtools.tsx  ("use client")
 * import { RscDevtools } from "@rsc-boundary/core";
 * import { myAdapter } from "./adapter";
 * export function RscDevtoolsMyFramework() {
 *   return <RscDevtools adapter={myAdapter} />;
 * }
 *
 * // provider.tsx  (no "use client" — this is a server component)
 * import { createRscBoundaryProvider } from "@rsc-boundary/core";
 * import { RscDevtoolsMyFramework } from "./devtools";
 * export const RscBoundaryProvider = createRscBoundaryProvider(RscDevtoolsMyFramework);
 * ```
 */
export function createRscBoundaryProvider(
  DevtoolsComponent: ComponentType,
): ComponentType<RscBoundaryProviderProps> {
  return function RscBoundaryProvider({ children }: RscBoundaryProviderProps) {
    const isDev = process.env.NODE_ENV === "development";
    return (
      <>
        {children}
        {isDev ? <DevtoolsComponent /> : null}
      </>
    );
  };
}
