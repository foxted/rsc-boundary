import { SearchFilter } from "./search-filter";

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
export function ServerSearchDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        The array{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          SERVER_RENDERED_ITEMS
        </code>{" "}
        is defined in this server module. The filter input narrows results on the
        client without a round trip.
      </p>
      <SearchFilter items={SERVER_RENDERED_ITEMS} />
    </div>
  );
}
