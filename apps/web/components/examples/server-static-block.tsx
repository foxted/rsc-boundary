/**
 * Pure Server Component — no "use client", no client children.
 * In rsc-boundary devtools this subtree highlights as server-only (blue).
 */
export function ServerStaticBlock() {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-sm font-medium text-foreground">
        Server-only subtree
      </p>
      <p className="mt-1 text-sm text-muted">
        This card is a separate module with no client components inside. Toggle
        highlights to see the full region as server output.
      </p>
    </div>
  );
}
