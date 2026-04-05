import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../../../components/code-block";

export const metadata: Metadata = {
  title: "API reference",
  description: "RscBoundaryProvider and RscDevtools API for rsc-boundary.",
};

const importSnippet = `import { RscBoundaryProvider, RscDevtools } from "rsc-boundary";`;

const enabledSnippet = `<RscBoundaryProvider enabled>
  {children}
</RscBoundaryProvider>`;

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
              <tr>
                <td className="px-4 py-3 font-mono text-foreground">enabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean | undefined</td>
                <td className="px-4 py-3">
                  When <code>true</code>, always mounts devtools
                  (including production). When omitted, devtools run only when{" "}
                  <code>NODE_ENV === &quot;development&quot;</code>
                  .
                </td>
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
            <strong className="text-foreground">Production, default:</strong> children
            only; devtools are not mounted (no extra client chunk for the tool).
          </li>
          <li>
            <strong className="text-foreground">Production + enabled:</strong> same as
            dev—use sparingly (e.g. this documentation site).
          </li>
        </ul>

        <div className="mt-6 not-prose">
          <CodeBlock code={enabledSnippet} filename="Opt-in for production (docs)" />
        </div>
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
