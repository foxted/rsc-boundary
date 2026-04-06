import { RscServerBoundaryMarker } from "rsc-boundary";

import { FakeClientChrome, FakeServerChrome } from "./boundary-chrome";
import { SearchFilter } from "./search-filter";

export interface ServerSearchDemoProps {
  illustrativeBoundaryChrome?: boolean;
}

const SERVER_RENDERED_ITEMS = [
  "use server — layout shell",
  "Static docs paragraph",
  "List item: Server Component A",
  "List item: Server Component B",
  "List item: hydration boundary ahead",
] as const;

/**
 * Server Component: the list source lives on the server; filtering runs in the client.
 */
export function ServerSearchDemo({
  illustrativeBoundaryChrome = false,
}: ServerSearchDemoProps) {
  const shell = (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        The array{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          SERVER_RENDERED_ITEMS
        </code>{" "}
        is defined in this server module. The filter input narrows results on the
        client without a round trip.
      </p>
      {illustrativeBoundaryChrome ? (
        <FakeClientChrome label="SearchFilter">
          <SearchFilter items={SERVER_RENDERED_ITEMS} />
        </FakeClientChrome>
      ) : (
        <SearchFilter items={SERVER_RENDERED_ITEMS} />
      )}
    </div>
  );

  return (
    <RscServerBoundaryMarker label="ExampleServerSearch">
      {illustrativeBoundaryChrome ? (
        <FakeServerChrome label="ExampleServerSearch">{shell}</FakeServerChrome>
      ) : (
        shell
      )}
    </RscServerBoundaryMarker>
  );
}
