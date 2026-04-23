import { createRscBoundaryProvider } from "@rsc-boundary/core";
import { RscDevtoolsNext } from "./devtools";

/**
 * Drop this once in your Next.js App Router root layout (`app/layout.tsx`).
 * In development it renders the RSC Boundary devtools overlay; in production
 * it renders only `{children}` with zero runtime cost.
 *
 * ```tsx
 * import { RscBoundaryProvider } from "@rsc-boundary/next";
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
export const RscBoundaryProvider = createRscBoundaryProvider(RscDevtoolsNext);
