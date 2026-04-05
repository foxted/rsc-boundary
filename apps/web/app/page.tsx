import Link from "next/link";
import { CodeBlock } from "../components/code-block";
import { FeatureCard } from "../components/feature-card";
import { PackageInstall } from "../components/package-install";

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

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-accent">Next.js App Router · React 19</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          See where server meets client
        </h1>
        <p className="mt-4 text-lg text-muted">
          Wrap your root layout once. In development, toggle boundary highlights to
          inspect client component islands and server-rendered regions—no annotations
          required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs"
            className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Read the docs
          </Link>
          <Link
            href="/docs/examples"
            className="inline-flex rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-border/40"
          >
            View examples
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-xl">
        <h2 className="sr-only">Install</h2>
        <PackageInstall />
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="Zero config boundaries"
          description="Add a single provider to your root layout. Client subtrees get orange outlines; server regions show in blue when you toggle the devtools pill."
          icon={<BoltIcon />}
        />
        <FeatureCard
          title="Dev-only by default"
          description="In production, the provider renders only children—no extra client bundle unless you opt in (this site uses enabled for the live demo)."
          icon={<ShieldIcon />}
        />
        <FeatureCard
          title="Fiber-based detection"
          description="Walks the client React tree via DOM fiber pointers, filters framework noise, and keeps highlights in sync with a MutationObserver."
          icon={<TreeIcon />}
        />
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground">Quick start</h2>
        <p className="mt-2 text-muted">
          Add the provider around your app body. That&apos;s the entire integration.
        </p>
        <div className="mt-6">
          <CodeBlock code={layoutSnippet} filename="app/layout.tsx" />
        </div>
      </section>
    </main>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22v-8M8 6a4 4 0 108 0 4 4 0 10-8 0zM12 14v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
