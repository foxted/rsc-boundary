import type { ReactNode } from "react";
import { createRootRoute, Outlet, Scripts, HeadContent } from "@tanstack/react-router";
import { RscBoundaryProvider } from "@rsc-boundary/start";
import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
        <Scripts />
      </body>
    </html>
  );
}
