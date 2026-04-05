import { RscServerBoundaryMarker } from "rsc-boundary";
import { Counter } from "./counter";

/**
 * Mixes an explicit server marker with a normal server shell + client island
 * so devtools can show both `explicit` and heuristic (~) regions.
 */
export function ServerHybridDemo() {
  return (
    <div className="space-y-4">
      <RscServerBoundaryMarker label="DocsHero">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-foreground">
            <span className="font-medium">Explicit marker</span>
            {" — "}
            wrapped with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              RscServerBoundaryMarker
            </code>
            . The server tab should list this as{" "}
            <span className="font-medium">explicit</span>.
          </p>
        </div>
      </RscServerBoundaryMarker>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-foreground">
          <span className="font-medium">Heuristic-only shell</span>
          {" — "}
          same file, no marker; nested regions appear when siblings mix server
          markup and a client boundary.
        </p>
        <Counter />
      </div>
    </div>
  );
}
