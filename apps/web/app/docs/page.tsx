import type { Metadata } from "next";
import { CodeBlock } from "../../components/code-block";
import { PackageInstall } from "../../components/package-install";

export const metadata: Metadata = {
  title: "Getting started",
  description:
    "Get started with RSC Boundary: install the rsc-boundary package and add RscBoundaryProvider to your root layout.",
};

const layoutSnippet = `import { RscBoundaryProvider } from "rsc-boundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RscBoundaryProvider>{children}</RscBoundaryProvider>
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
        <strong className="text-foreground">Client Components</strong>
        &nbsp;begin in a Next.js App Router app. Server Components don&apos;t
        create client fibers, so the tool approximates server regions by
        exclusion.
      </p>

      <h2
        id="prerequisites"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        Prerequisites
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
        <li>Next.js 16+ with the App Router</li>
        <li>React 19+</li>
      </ul>

      <h2
        id="install"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        Install
      </h2>
      <p className="mt-3 text-muted">
        Add the package from npm (or your registry of choice).
      </p>
      <div className="mt-4 not-prose">
        <PackageInstall />
      </div>

      <h2
        id="add-the-provider"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        Add the provider
      </h2>
      <p className="mt-3 text-muted">
        Wrap <code>children</code> in your root layout. In development
        you&apos;ll see a small <strong className="text-foreground">RSC</strong>{" "}
        pill in the corner; click it to toggle highlights and open the component
        list.
      </p>
      <div className="mt-4 not-prose">
        <CodeBlock code={layoutSnippet} filename="app/layout.tsx" />
      </div>

      <h2
        id="first-activation"
        className="mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
      >
        First activation
      </h2>
      <ol className="mt-3 list-inside list-decimal space-y-2 text-muted">
        <li>
          Run <code>next dev</code>.
        </li>
        <li>Open any route and click the RSC pill (bottom-left).</li>
        <li>
          Orange dashed outlines mark client subtrees; blue marks
          server-rendered regions. Click the number in the pill to open the
          panel.
        </li>
      </ol>
    </article>
  );
}
