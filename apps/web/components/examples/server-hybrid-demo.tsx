import { RscServerBoundaryMarker } from "rsc-boundary";

import { FakeClientChrome, FakeServerChrome } from "./boundary-chrome";
import { Counter } from "./counter";

export interface ServerHybridDemoProps {
  illustrativeBoundaryChrome?: boolean;
}

/**
 * Mixes an explicit server marker with a normal server shell + client island
 * so devtools can show both `explicit` and heuristic (~) regions.
 */
export function ServerHybridDemo({
  illustrativeBoundaryChrome = false,
}: ServerHybridDemoProps) {
  const explicitInner = (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-foreground">
        <span className="font-medium">Explicit marker</span>
        {" — "}
        wrapped with{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          RscServerBoundaryMarker
        </code>
        . The devtools panel lists this as{" "}
        <span className="font-medium">explicit</span> in development.
      </p>
    </div>
  );

  const heuristicInner = (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-foreground">
        <span className="font-medium">Heuristic-only shell (~)</span>
        {" — "}
        no marker on this block; devtools infer server regions around static
        copy in development. Prefer explicit markers when you need a stable
        label.
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
    <div className="space-y-4">
      <RscServerBoundaryMarker label="DocsHero">
        {illustrativeBoundaryChrome ? (
          <FakeServerChrome label="DocsHero">{explicitInner}</FakeServerChrome>
        ) : (
          explicitInner
        )}
      </RscServerBoundaryMarker>

      {illustrativeBoundaryChrome ? (
        <FakeServerChrome label="Heuristic shell" variant="heuristic">
          {heuristicInner}
        </FakeServerChrome>
      ) : (
        heuristicInner
      )}
    </div>
  );
}
