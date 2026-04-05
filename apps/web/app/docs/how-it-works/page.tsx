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
          inspection—so the tool infers{" "}
          <strong className="text-foreground">server regions</strong> from the DOM,
          optionally boosted by explicit markers you add.
        </p>
      </div>

      <section>
        <h2 id="pipeline" className="scroll-mt-24 text-xl font-semibold text-foreground">
          Pipeline
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-3 text-muted">
          <li>
            Start from a DOM root (e.g. <code>#__next</code>{" "}
            or <code>body</code>).
          </li>
          <li>
            Read <code>__reactFiber$*</code> from nodes and
            walk the fiber tree (same family of internals React DevTools uses).
          </li>
          <li>
            Collect user client components: function/class/forwardRef/memo fibers,
            with display names, excluding a known set of Next.js App Router internals.
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
            Compute <strong className="text-foreground">heuristic</strong> regions:
            walk descendants of the app root; nodes outside every client
            component DOM subtree become candidates, drop wrappers that strictly
            contain a client root, then take minimal region roots (nested islands,
            not only top-level siblings).
          </li>
          <li>
            Draw blue outlines for server regions and orange for client boundaries;
            floating labels include provenance (<strong className="text-foreground">explicit</strong>{" "}
            vs <strong className="text-foreground">~</strong> heuristic).
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
            your marker label; <strong className="text-foreground">heuristic</strong>{" "}
            regions use host tags / ids because there is no client fiber name.
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
          Heuristic scanning skips DOM inside those subtrees so regions are not
          double-counted.
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
            Depends on React internals (<code>__reactFiber$*</code>
            ). Acceptable for devtools; not a public React API.
          </li>
          <li>
            Next.js internal filtering is name-based and may need updates as the
            framework evolves.
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

      <p className="text-muted">
        Back to{" "}
        <Link href="/docs" className="font-medium text-accent hover:underline">
          Getting started
        </Link>{" "}
        or{" "}
        <Link href="/docs/examples" className="font-medium text-accent hover:underline">
          Examples
        </Link>
        .
      </p>
    </article>
  );
}
