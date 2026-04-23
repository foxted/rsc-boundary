import type { Metadata } from "next";
import { CodeBlock } from "../../../components/code-block";
import { FrameworkTabs } from "../../../components/framework-tabs";

export const metadata: Metadata = {
  title: "API reference",
  description:
    "RscBoundaryProvider, adapters, and RSC Boundary API for Next.js and TanStack Start.",
};

const importSnippetNext = `import {
  RscBoundaryProvider,
  RscDevtoolsNext,
  nextAdapter,
  RscServerBoundaryMarker,
  SERVER_BOUNDARY_DATA_ATTR,
  COLORS,
  LABEL_BASE_STYLES,
} from "@rsc-boundary/next";`;

const importSnippetStart = `import {
  RscBoundaryProvider,
  RscDevtoolsStart,
  startAdapter,
  RscServerBoundaryMarker,
  SERVER_BOUNDARY_DATA_ATTR,
  createRscBoundaryProvider,
} from "@rsc-boundary/start";`;

export default function DocsApiPage() {
  return (
    <article className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          API reference
        </h1>
        <p className="mt-4 text-muted">
          Pick the entry point for your stack. The primary integration is{" "}
          <code>RscBoundaryProvider</code>. Each adapter package re-exports
          shared types and <code>RscServerBoundaryMarker</code> from{" "}
          <code>@rsc-boundary/core</code>.
        </p>
      </div>

      <div className="not-prose">
        <FrameworkTabs
          label="Import from"
          next={
            <CodeBlock embedded code={importSnippetNext} lang="tsx" />
          }
          start={
            <CodeBlock embedded code={importSnippetStart} lang="tsx" />
          }
        />
      </div>

      <section>
        <h2
          id="rsc-boundary-provider"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">RscBoundaryProvider</code>
        </h2>
        <p className="mt-2 text-muted">
          Server Component. Wrap <code>children</code> once at the root (Next.js:{" "}
          <code>app/layout.tsx</code>; TanStack Start:{" "}
          <code>app/routes/__root.tsx</code>).
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">Prop</th>
                <th className="px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Description
                </th>
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
            <strong className="text-foreground">Development, default:</strong>{" "}
            children + floating devtools.
          </li>
          <li>
            <strong className="text-foreground">Production:</strong> children only;
            devtools are not mounted (no client chunk for the tool).
          </li>
        </ul>
      </section>

      <section>
        <h2
          id="adapters"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">nextAdapter</code> /{" "}
          <code className="text-lg">startAdapter</code>
        </h2>
        <p className="mt-2 text-muted">
          Each implements <code>FrameworkAdapter</code> from{" "}
          <code>@rsc-boundary/core</code>: DOM root selection, framework-internal
          filtering, and wiring for the fiber walk. You rarely import these unless
          you are composing <code>RscDevtools</code> from core yourself.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
          <li>
            <code className="text-foreground">nextAdapter</code> — exported from{" "}
            <code>@rsc-boundary/next</code>.
          </li>
          <li>
            <code className="text-foreground">startAdapter</code> — exported from{" "}
            <code>@rsc-boundary/start</code>.
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
          <strong className="text-foreground">explicit</strong> server region with
          your <code>label</code>. It uses an <code>asChild</code>-style pattern — it
          does <strong className="text-foreground">not</strong> render a wrapper
          element, so your DOM structure is unchanged.
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
          is{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            data-rsc-boundary-server
          </code>{" "}
          if you need it for docs or codegen.
        </p>
      </section>

      <section>
        <h2
          id="rsc-devtools-next-start"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">RscDevtoolsNext</code> /{" "}
          <code className="text-lg">RscDevtoolsStart</code>
        </h2>
        <p className="mt-2 text-muted">
          Client Components. Each renders the shared{" "}
          <code>RscDevtools</code> UI from core with the matching adapter
          pre-wired (no props). Normally you do not import them —{" "}
          <code>RscBoundaryProvider</code> mounts the right one in development.
          They are exported for custom layouts or non-standard wiring.
        </p>
      </section>

      <section>
        <h2
          id="create-rsc-boundary-provider"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          <code className="text-lg">createRscBoundaryProvider</code>
        </h2>
        <p className="mt-2 text-muted">
          Factory from <code>@rsc-boundary/core</code>, re-exported by{" "}
          <code>@rsc-boundary/next</code> and <code>@rsc-boundary/start</code>.
          It takes a no-props client devtools component that closes over your
          adapter and returns a server <code>RscBoundaryProvider</code>. The
          published Next.js and Start packages use this internally; use it when
          building a new framework adapter.
        </p>
      </section>

      <section>
        <h2
          id="legacy-shim"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Legacy <code className="text-lg">rsc-boundary</code> package
        </h2>
        <p className="mt-2 text-muted">
          The unscoped <code>rsc-boundary</code> npm package re-exports{" "}
          <code>@rsc-boundary/next</code> for backward compatibility. New projects
          should depend on <code>@rsc-boundary/next</code> or{" "}
          <code>@rsc-boundary/start</code> directly.
        </p>
      </section>

      <section>
        <h2
          id="next-only-exports"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Next-only: <code className="text-lg">COLORS</code>,{" "}
          <code className="text-lg">LABEL_BASE_STYLES</code>
        </h2>
        <p className="mt-2 text-muted">
          Re-exported from <code>@rsc-boundary/next</code> for building static
          previews that match devtools styling (e.g. documentation sites). Not
          exported from <code>@rsc-boundary/start</code>; import from{" "}
          <code>@rsc-boundary/core</code> if you need them outside Next.
        </p>
      </section>
    </article>
  );
}
