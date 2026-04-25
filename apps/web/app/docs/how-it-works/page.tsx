import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How RSC Boundary detects client boundaries and approximates server regions.",
};

export default function DocsHowItWorksPage() {
  return (
    <article className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          How it works
        </h1>
        <p className="mt-4 text-muted">
          React Server Components ship HTML and RSC payload; on the client, user{" "}
          <strong className="text-foreground">Client Components</strong> hydrate and
          receive fibers. Server Components do not have a matching client fiber for
          inspection—so the tool combines{" "}
          <strong className="text-foreground">explicit markers</strong>, React
          19&apos;s development-only{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">_debugInfo</code>{" "}
          (when present), and a{" "}
          <strong className="text-foreground">DOM heuristic</strong> for anything
          still uncovered.
        </p>
      </div>

      <section>
        <h2 id="pipeline" className="scroll-mt-24 text-xl font-semibold text-foreground">
          Pipeline
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-3 text-muted">
          <li>
            Find the React fiber root using the adapter&apos;s{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">rootCandidates</code>{" "}
            (framework-specific mount points — not always{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">document.body</code>
            ).
          </li>
          <li>
            Read <code>__reactFiber$*</code> from those nodes and walk the fiber tree
            (same family of internals React DevTools uses).
          </li>
          <li>
            Collect user client components: function/class/forwardRef/memo (including
            simple memo) fibers,
            with display names, excluding a framework-specific set of internal
            components (each adapter maintains its own list).
          </li>
          <li>
            Map each client component to its outermost host DOM nodes (stopping at
            nested user boundaries).
          </li>
          <li>
            Collect <strong className="text-foreground">explicit</strong> server regions:
            elements with <code>data-rsc-boundary-server</code> (e.g. via{" "}
            <code>RscServerBoundaryMarker</code>).
          </li>
          <li>
            Derive <strong className="text-foreground">rsc-debug</strong> regions (development
            builds only): read <code>_debugInfo</code> on client component fibers, keep
            entries that look like server-owned component metadata, bucket by object
            identity, and anchor each region at the lowest common ancestor of the
            related DOM nodes. Framework internal names in the adapter&apos;s{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">internals</code> set
            are skipped.
          </li>
          <li>
            Compute <strong className="text-foreground">heuristic</strong> regions for
            anything not already covered: walk descendants of{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">resolveScanContainer()</code>{" "}
            (or <code className="rounded bg-muted px-1 py-0.5 text-xs">document.body</code>); nodes
            outside every client subtree and outside explicit / rsc-debug region roots
            become candidates; skip non-visual tags (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">script</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">style</code>, etc.); drop
            wrappers that strictly contain a client root; keep minimal region roots
            (nested islands, not only top-level siblings).
          </li>
          <li>
            Merge results in order:{" "}
            <strong className="text-foreground">explicit</strong>, then{" "}
            <strong className="text-foreground">rsc-debug</strong>, then{" "}
            <strong className="text-foreground">heuristic</strong> (later passes only fill gaps).
          </li>
          <li>
            Draw blue outlines for server regions and orange for client boundaries;
            floating labels use{" "}
            <strong className="text-foreground">Server (explicit)</strong>,{" "}
            <strong className="text-foreground">Server (rsc)</strong>, or{" "}
            <strong className="text-foreground">Server (~)</strong> to match the panel&apos;s
            provenance (marker · debug · heuristic).
          </li>
          <li>
            Attach a debounced <code>MutationObserver</code>{" "}
            on <code>document.body</code> to re-scan after
            navigations and dynamic updates.
          </li>
        </ol>
      </section>

      <section>
        <h2
          id="what-you-see"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          What you see
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-muted">
          <li>
            <span className="font-medium text-foreground">Client:</span> dashed orange
            border and a label with the component name when available.
          </li>
          <li>
            <span className="font-medium text-foreground">Server:</span> dashed blue
            border. <strong className="text-foreground">Explicit</strong> regions use
            your marker label (or a host fallback if the attribute is empty).{" "}
            <strong className="text-foreground">Rsc-debug</strong> regions use the Server
            Component name from <code>_debugInfo</code> when React provides it.{" "}
            <strong className="text-foreground">Heuristic</strong> regions use host tags /
            ids / disambiguating indices because there is no fiber name for that slice
            of DOM.
          </li>
        </ul>
      </section>

      <section>
        <h2
          id="explicit-markers"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Explicit markers
        </h2>
        <p className="mt-4 text-muted">
          Wrap any server subtree with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">RscServerBoundaryMarker</code>{" "}
          or set <code className="rounded bg-muted px-1 py-0.5 text-xs">data-rsc-boundary-server</code>{" "}
          on your own element. Optional attribute value becomes the panel label.
          Heuristic scanning skips DOM inside those subtrees (and inside{" "}
          <strong className="text-foreground">rsc-debug</strong> region roots) so regions
          are not double-counted.
        </p>
      </section>

      <section>
        <h2
          id="dev-vs-production"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Development vs production builds
        </h2>
        <p className="mt-4 text-muted">
          <code className="rounded bg-muted px-1 py-0.5 text-xs">RscBoundaryProvider</code>{" "}
          mounts devtools only when{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">NODE_ENV</code>{" "}
          is <code className="rounded bg-muted px-1 py-0.5 text-xs">development</code>
          . Production bundles ship no scanning UI (the provider renders only{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">children</code>
          ). In production React, <code className="rounded bg-muted px-1 py-0.5 text-xs">_debugInfo</code>{" "}
          is not available either. This documentation site uses{" "}
          <strong className="text-foreground">static outlined previews</strong> on the{" "}
          <Link href="/docs/examples" className="font-medium text-accent hover:underline">
            Examples
          </Link>{" "}
          page so you can see the color language without running fiber detection on a
          public build.
        </p>
      </section>

      <section>
        <h2
          id="limitations"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Limitations
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-muted">
          <li>
            Depends on React internals (<code>__reactFiber$*</code>,{" "}
            <code>_debugInfo</code>). Acceptable for devtools; not a public React API.
          </li>
          <li>
            Framework-specific internal filtering is name-based in each adapter (
            <code>@rsc-boundary/next</code>, <code>@rsc-boundary/start</code>) and may
            need updates as those frameworks evolve.
          </li>
          <li>
            Heuristic server regions are inferred from DOM vs client roots; server
            output rendered <em>inside</em> a client subtree (slots) is still
            classified as client-owned for highlighting. Use explicit markers where
            that distinction matters.
          </li>
          <li>
            Portals and non-standard roots can still produce surprising groupings.
          </li>
        </ul>
      </section>
    </article>
  );
}
