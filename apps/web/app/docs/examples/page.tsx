import type { Metadata } from "next";
import { CodeBlock } from "../../../components/code-block";
import { ServerAccordionDemo } from "../../../components/examples/server-accordion-demo";
import { ServerCounterDemo } from "../../../components/examples/server-counter-demo";
import { ServerHybridDemo } from "../../../components/examples/server-hybrid-demo";
import { ServerSearchDemo } from "../../../components/examples/server-search-demo";
import { ServerStaticBlock } from "../../../components/examples/server-static-block";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Interactive examples mixing Server and Client Components for RSC Boundary.",
};

const staticBlockSnippet = `// components/examples/server-static-block.tsx
import { RscServerBoundaryMarker } from "rsc-boundary";

export function ServerStaticBlock() {
  return (
    <RscServerBoundaryMarker label="ExampleServerOnly">
      <div className="rounded-xl border ...">{/* server-only content */}</div>
    </RscServerBoundaryMarker>
  );
}`;

const serverCounterSnippet = `// components/examples/server-counter-demo.tsx
import { RscServerBoundaryMarker } from "rsc-boundary";
import { Counter } from "./counter";

export function ServerCounterDemo() {
  return (
    <RscServerBoundaryMarker label="ExampleServerShellCounter">
      <div className="...">
        <p>Server Component shell — static copy here.</p>
        <Counter />
      </div>
    </RscServerBoundaryMarker>
  );
}`;

const serverAccordionSnippet = `// components/examples/server-accordion-demo.tsx
import { RscServerBoundaryMarker } from "rsc-boundary";
import { Accordion } from "./accordion";

const FAQ_ITEMS = [/* ... */];

export function ServerAccordionDemo() {
  return (
    <RscServerBoundaryMarker label="ExampleServerAccordion">
      <div className="space-y-3">
        <p className="text-sm text-muted">...</p>
        <Accordion items={FAQ_ITEMS} />
      </div>
    </RscServerBoundaryMarker>
  );
}`;

const serverSearchSnippet = `// components/examples/server-search-demo.tsx
import { RscServerBoundaryMarker } from "rsc-boundary";
import { SearchFilter } from "./search-filter";

const SERVER_RENDERED_ITEMS = [/* ... */] as const;

export function ServerSearchDemo() {
  return (
    <RscServerBoundaryMarker label="ExampleServerSearch">
      <div className="space-y-3">
        <p className="text-sm text-muted">...</p>
        <SearchFilter items={SERVER_RENDERED_ITEMS} />
      </div>
    </RscServerBoundaryMarker>
  );
}`;

const hybridSnippet = `// components/examples/server-hybrid-demo.tsx
import { RscServerBoundaryMarker } from "rsc-boundary";
import { Counter } from "./counter";

export function ServerHybridDemo() {
  return (
    <div className="space-y-4">
      <RscServerBoundaryMarker label="DocsHero">{/* ... */}</RscServerBoundaryMarker>
      <div className="rounded-xl border ...">
        <p>Heuristic-only shell</p>
        <Counter />
      </div>
    </div>
  );
}`;

export default function DocsExamplesPage() {
  return (
    <article className="max-w-3xl space-y-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Examples
        </h1>
        <p className="mt-4 text-muted">
          Each pattern below mixes{" "}
          <strong className="text-foreground">Server Component</strong> modules (no{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            &quot;use client&quot;
          </code>
          ) with <strong className="text-foreground">Client Components</strong>.{" "}
          <strong className="text-foreground">Blue and orange outlines</strong> on this
          page are{" "}
          <strong className="text-foreground">static illustrations</strong> (same
          colors as the real devtools)—they are not fiber-based detection. Add{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            RscBoundaryProvider
          </code>{" "}
          to your app and run{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">next dev</code>{" "}
          for the interactive pill, panel, and live highlights.
        </p>
      </div>

      <section className="space-y-4">
        <h2
          id="server-only-block"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Server-only block
        </h2>
        <p className="text-muted">
          A small module that renders only on the server, with no client children.
          The outline mimics an explicit server region; the code uses{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            RscServerBoundaryMarker
          </code>{" "}
          so development devtools can pick up the same label.
        </p>
        <ServerStaticBlock illustrativeBoundaryChrome />
        <CodeBlock
          code={staticBlockSnippet}
          filename="components/examples/server-static-block.tsx"
        />
      </section>

      <section className="space-y-4">
        <h2
          id="counter-island"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Server shell + counter island
        </h2>
        <p className="text-muted">
          The demo component is defined in a server file: an explicit marker wraps the
          shell; static copy sits next to a client{" "}
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">Counter</code>.
        </p>
        <ServerCounterDemo illustrativeBoundaryChrome />
        <CodeBlock
          code={serverCounterSnippet}
          filename="components/examples/server-counter-demo.tsx"
        />
      </section>

      <section className="space-y-4">
        <h2 id="accordion" className="scroll-mt-24 text-xl font-semibold text-foreground">
          Server data + accordion (client)
        </h2>
        <p className="text-muted">
          FAQ items are authored in the server module; only the accordion UI is
          client-side for open/close state.
        </p>
        <ServerAccordionDemo illustrativeBoundaryChrome />
        <CodeBlock
          code={serverAccordionSnippet}
          filename="components/examples/server-accordion-demo.tsx"
        />
      </section>

      <section className="space-y-4">
        <h2
          id="server-list-client-filter"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Server list + client filter
        </h2>
        <p className="text-muted">
          The searchable list source is defined on the server; filtering runs in the
          client without a round trip.
        </p>
        <ServerSearchDemo illustrativeBoundaryChrome />
        <CodeBlock
          code={serverSearchSnippet}
          filename="components/examples/server-search-demo.tsx"
        />
      </section>

      <section className="space-y-4">
        <h2
          id="hybrid-detection"
          className="scroll-mt-24 text-xl font-semibold text-foreground"
        >
          Explicit + heuristic regions
        </h2>
        <p className="text-muted">
          The first block uses a marker; the second has no marker so development
          devtools can show a <strong className="text-foreground">~</strong> heuristic
          region. Below, the static outlines show both styles side by side.
        </p>
        <ServerHybridDemo illustrativeBoundaryChrome />
        <CodeBlock
          code={hybridSnippet}
          filename="components/examples/server-hybrid-demo.tsx"
        />
      </section>
    </article>
  );
}
