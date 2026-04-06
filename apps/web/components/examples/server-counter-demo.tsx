import { RscServerBoundaryMarker } from "rsc-boundary";

import { FakeClientChrome, FakeServerChrome } from "./boundary-chrome";
import { Counter } from "./counter";

export interface ServerCounterDemoProps {
  illustrativeBoundaryChrome?: boolean;
}

/**
 * Server Component that composes static markup with a client island (`Counter`).
 */
export function ServerCounterDemo({
  illustrativeBoundaryChrome = false,
}: ServerCounterDemoProps) {
  const shell = (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-foreground">
        <span className="font-medium text-foreground">Server Component shell</span>
        {" — "}
        this paragraph and the container are from a file without{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          &quot;use client&quot;
        </code>
        . Only the controls below are a client boundary.
      </p>
      {illustrativeBoundaryChrome ? (
        <FakeClientChrome label="Counter">
          <Counter />
        </FakeClientChrome>
      ) : (
        <Counter />
      )}
    </div>
  );

  return (
    <RscServerBoundaryMarker label="ExampleServerShellCounter">
      {illustrativeBoundaryChrome ? (
        <FakeServerChrome label="ExampleServerShellCounter">{shell}</FakeServerChrome>
      ) : (
        shell
      )}
    </RscServerBoundaryMarker>
  );
}
