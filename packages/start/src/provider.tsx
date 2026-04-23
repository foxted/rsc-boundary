import { createRscBoundaryProvider } from "@rsc-boundary/core";
import { RscDevtoolsStart } from "./devtools";

/**
 * Drop this once in your TanStack Start root route (`app/routes/__root.tsx`).
 * In development it renders the RSC Boundary devtools overlay; in production
 * it renders only `{children}` with zero runtime cost.
 *
 * ```tsx
 * import { RscBoundaryProvider } from "@rsc-boundary/start";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <RscBoundaryProvider>{children}</RscBoundaryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export const RscBoundaryProvider = createRscBoundaryProvider(RscDevtoolsStart);
