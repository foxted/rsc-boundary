import { RscServerBoundaryMarker } from "@rsc-boundary/next";

import { FakeServerChrome } from "./boundary-chrome";

export interface ServerStaticBlockProps {
  /** When true (docs examples page), draw static outlines like development devtools. */
  illustrativeBoundaryChrome?: boolean;
}

/**
 * Pure Server Component — no "use client", no client children.
 */
export function ServerStaticBlock({
  illustrativeBoundaryChrome = false,
}: ServerStaticBlockProps) {
  const body = (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-sm font-medium text-foreground">
        Server-only subtree
      </p>
      <p className="mt-1 text-sm text-muted">
        This card is a separate module with no client components inside. With{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          RscBoundaryProvider
        </code>{" "}
        in development, this region appears as an explicit server entry in the
        devtools panel.
      </p>
    </div>
  );

  return (
    <RscServerBoundaryMarker label="ExampleServerOnly">
      {illustrativeBoundaryChrome ? (
        <FakeServerChrome label="ExampleServerOnly">{body}</FakeServerChrome>
      ) : (
        body
      )}
    </RscServerBoundaryMarker>
  );
}
