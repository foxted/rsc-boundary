import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../../../components/code-block";

export const metadata: Metadata = {
  title: "API reference",
  description: "RscBoundaryProvider and RscDevtools API for RSC Boundary.",
};

const importSnippet = `import {
  RscBoundaryProvider,
  RscDevtools,
  RscServerBoundaryMarker,
  SERVER_BOUNDARY_DATA_ATTR,
} from "rsc-boundary";`;

export default function DocsApiPage() {
  return (
    <article className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          API reference
        </h1>
        <p className="mt-4 text-muted">
          The primary integration is{" "}
          <code>RscBoundaryProvider</code>. Advanced
          setups can mount{" "}
          <code>RscDevtools</code> directly if needed.
        </p>
      </div>

      <div className="not-prose">
        <CodeBlock code={importSnippet} />
      </div>

      <section>
        <h2
          id="rsc-boundary-provider"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">RscBoundaryProvider</code>
        </h2>
        <p className="mt-2 text-muted">
          Server Component. Wrap{" "}
          <code>children</code> once at the root (e.g.{" "}
          <code>app/layout.tsx</code>).
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">Prop</th>
                <th className="px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted">
              <tr>
                <td className="px-4 py-3 font-mono text-foreground">children</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3">Your app tree.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-lg font-semibold text-foreground">Behavior</h3>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
          <li>
            <strong className="text-foreground">Development, default:</strong> children
            + floating devtools.
          </li>
          <li>
            <strong className="text-foreground">Production:</strong> children only;
            devtools are not mounted (no client chunk for the tool).
          </li>
        </ul>
      </section>

      <section>
        <h2
          id="rsc-server-boundary-marker"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">RscServerBoundaryMarker</code>
        </h2>
        <p className="mt-2 text-muted">
          Server Component. Optional marker that injects{" "}
          <code>{`data-rsc-boundary-server`}</code> onto its single child element so
          devtools list the subtree as an{" "}
          <strong className="text-foreground">explicit</strong> server region with your{" "}
          <code>label</code>. It uses an <code>asChild</code>-style pattern — it does{" "}
          <strong className="text-foreground">not</strong> render a wrapper element,
          so your DOM structure is unchanged.
        </p>
        <p className="mt-3 text-muted">
          <strong className="text-foreground">Production:</strong> the marker is a
          pass-through. No cloning, no attribute, no extra DOM — leaving a marker in
          a production build has zero impact on the shipped HTML or CSS.
        </p>
        <p className="mt-3 text-muted">
          <strong className="text-foreground">Requirements:</strong> pass a single
          React element as children. For reliable detection prefer a host element
          (e.g. <code>&lt;section&gt;</code>, <code>&lt;div&gt;</code>); custom
          components only propagate the attribute if they spread unknown props onto
          their root DOM node.
        </p>
        <p className="mt-3 text-muted">
          Constant <code className="text-foreground">SERVER_BOUNDARY_DATA_ATTR</code>{" "}
          is <code className="rounded bg-muted px-1 py-0.5 text-xs">data-rsc-boundary-server</code>{" "}
          if you need it for docs or codegen.
        </p>
      </section>

      <section>
        <h2
          id="rsc-devtools"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">RscDevtools</code>
        </h2>
        <p className="mt-2 text-muted">
          Client Component. Renders the pill, panel, and highlighting logic. Normally you
          do not import it; the provider includes it when appropriate. Export is
          available for custom layouts or non-standard wiring.
        </p>
      </section>

      <p className="text-muted">
        <Link href="/docs/how-it-works" className="font-medium text-accent hover:underline">
          How it works
        </Link>{" "}
        — detection pipeline and limitations.
      </p>
    </article>
  );
}
