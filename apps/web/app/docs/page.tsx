import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../../components/code-block";
import { PackageInstall } from "../../components/package-install";

export const metadata: Metadata = {
  title: "Getting started",
  description:
    "Get started with RSC Boundary: install @rsc-boundary/next or @rsc-boundary/start and add RscBoundaryProvider at the app root.",
};

const layoutSnippetNext = `import { RscBoundaryProvider } from "@rsc-boundary/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
      </body>
    </html>
  );
}`;

const layoutSnippetStart = `import type { ReactNode } from "react";
import { createRootRoute, Outlet, Scripts, HeadContent } from "@tanstack/react-router";
import { RscBoundaryProvider } from "@rsc-boundary/start";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
        <Scripts />
      </body>
    </html>
  );
}`;

export default function DocsGettingStartedPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Getting started
      </h1>
      <p className="mt-4 text-muted">
        RSC Boundary helps you visualize where{" "}
        <strong className="text-foreground">Client Components</strong> begin in
        a React app that supports Server Components—whether you use{" "}
        <strong className="text-foreground">Next.js</strong> (App Router) or{" "}
        <strong className="text-foreground">TanStack Start</strong>. Server
        Components don&apos;t create client fibers, so the tool approximates
        server regions by exclusion (and optional explicit markers).
      </p>
      <aside className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted">
        <p>
          <strong className="text-foreground">See it in your app.</strong> Add
          the provider at the root and run your dev server (
          <code>next dev</code>, <code>vinxi dev</code>, or your Start
          equivalent): use the{" "}
          <strong className="text-foreground">RSC</strong> control (bottom-left)
          to toggle live highlights. On this site, the{" "}
          <Link
            href="/docs/examples"
            className="font-medium text-accent hover:underline"
          >
            Examples
          </Link>{" "}
          page uses{" "}
          <strong className="text-foreground">static outlines</strong> so the
          deployed docs can show the idea without shipping devtools in
          production.
        </p>
      </aside>

      <h2
        id="next-js"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        Next.js
      </h2>
      <p className="mt-3 text-muted">
        Use <code>@rsc-boundary/next</code> in App Router projects.
      </p>

      <h3
        id="next-js-prerequisites"
        className="mt-8 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Prerequisites
      </h3>
      <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
        <li>React 19+</li>
        <li>Next.js 16+ with the App Router</li>
      </ul>

      <h3
        id="next-js-install"
        className="mt-8 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Install
      </h3>
      <p className="mt-2 text-muted">
        Add the package from your registry of choice.
      </p>
      <div className="mt-4 not-prose">
        <PackageInstall packageName="@rsc-boundary/next" />
      </div>

      <h3
        id="next-js-add-provider"
        className="mt-10 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Add the provider
      </h3>
      <p className="mt-2 text-muted">
        Wrap <code>children</code> in your root layout. In development
        you&apos;ll see a small <strong className="text-foreground">RSC</strong>{" "}
        pill in the corner; click it to toggle highlights and open the component
        list.
      </p>
      <div className="mt-4 not-prose">
        <CodeBlock code={layoutSnippetNext} filename="app/layout.tsx" />
      </div>

      <h2
        id="tanstack-start"
        className="mt-14 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        TanStack Start
      </h2>
      <p className="mt-3 text-muted">
        Use <code>@rsc-boundary/start</code> with TanStack Start and the file
        routes root document pattern.
      </p>

      <h3
        id="tanstack-start-prerequisites"
        className="mt-8 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Prerequisites
      </h3>
      <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
        <li>React 19+</li>
        <li>
          TanStack Start 1+ with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            @tanstack/react-start
          </code>
        </li>
      </ul>

      <h3
        id="tanstack-start-install"
        className="mt-8 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Install
      </h3>
      <p className="mt-2 text-muted">
        Add the package from your registry of choice.
      </p>
      <div className="mt-4 not-prose">
        <PackageInstall packageName="@rsc-boundary/start" />
      </div>

      <h3
        id="tanstack-start-add-provider"
        className="mt-10 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        Add the provider
      </h3>
      <p className="mt-2 text-muted">
        Wrap <code>children</code> in your root route document (typically where
        you render <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code>). The
        same <strong className="text-foreground">RSC</strong> devtools pill
        appears in development.
      </p>
      <div className="mt-4 not-prose">
        <CodeBlock code={layoutSnippetStart} filename="app/routes/__root.tsx" />
      </div>

      <h2
        id="legacy-shim"
        className="mt-14 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        Deprecated: <code className="text-lg">rsc-boundary</code>
      </h2>
      <p className="mt-3 text-sm text-muted">
        The unscoped{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">rsc-boundary</code>{" "}
        package on npm is <strong>deprecated</strong> and is no longer published
        from this repository. Use <code>@rsc-boundary/next</code> or{" "}
        <code>@rsc-boundary/start</code> (each includes{" "}
        <code>@rsc-boundary/core</code> as a dependency).
      </p>

      <h2
        id="first-activation"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        First Activation
      </h2>
      <ol className="mt-3 list-inside list-decimal space-y-2 text-muted">
        <li>
          On the{" "}
          <Link
            href="/docs/examples"
            className="font-medium text-accent hover:underline"
          >
            Examples
          </Link>{" "}
          page, blue and orange borders are static illustrations (not live
          devtools).
        </li>
        <li>
          In your own project, run your dev server with the provider wired at the
          root, open any route, and use the{" "}
          <strong className="text-foreground">RSC</strong> pill (bottom-left).
        </li>
        <li>
          Orange dashed outlines mark client subtrees; blue marks server regions
          (explicit labels from markers, or ~ heuristics). Click the number in
          the pill to open the panel.
        </li>
      </ol>
    </article>
  );
}
