import type { ReactNode } from "react";
import { RscBoundaryProvider } from "@rsc-boundary/next";
import "./globals.css";

export const metadata = {
  title: "DevPulse — Next.js Playground",
  description: "RSC Boundary demo: a realistic Next.js App Router app showing server vs client regions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
      </body>
    </html>
  );
}
