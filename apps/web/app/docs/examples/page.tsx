import type { Metadata } from "next";
import { CodeBlock } from "../../../components/code-block";
import { FrameworkTabs } from "../../../components/framework-tabs";
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

type Pkg = "@rsc-boundary/next" | "@rsc-boundary/start";

function withMarkerImport(fileComment: string, pkg: Pkg, body: string): string {
  return `${fileComment}\nimport { RscServerBoundaryMarker } from "${pkg}";\n\n${body}`;
}

const staticBlockBody = `export function ServerStaticBlock() {
  return (
    <RscServerBoundaryMarker label="ExampleServerOnly">
      <div className="rounded-xl border ...">{/* server-only content */}</div>
    </RscServerBoundaryMarker>
  );
}`;

const staticBlockSnippetNext = withMarkerImport(
  "// components/examples/server-static-block.tsx",
  "@rsc-boundary/next",
  staticBlockBody,
);
const staticBlockSnippetStart = withMarkerImport(
  "// components/examples/server-static-block.tsx",
  "@rsc-boundary/start",
  staticBlockBody,
);

const counterBody = `import { Counter } from "./counter";

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

const serverCounterSnippetNext = withMarkerImport(
  "// components/examples/server-counter-demo.tsx",
  "@rsc-boundary/next",
  counterBody,
);
const serverCounterSnippetStart = withMarkerImport(
  "// components/examples/server-counter-demo.tsx",
  "@rsc-boundary/start",
  counterBody,
);

const accordionBody = `import { Accordion } from "./accordion";

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

const serverAccordionSnippetNext = withMarkerImport(
  "// components/examples/server-accordion-demo.tsx",
  "@rsc-boundary/next",
  accordionBody,
);
const serverAccordionSnippetStart = withMarkerImport(
  "// components/examples/server-accordion-demo.tsx",
  "@rsc-boundary/start",
  accordionBody,
);

const searchBody = `import { SearchFilter } from "./search-filter";

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

const serverSearchSnippetNext = withMarkerImport(
  "// components/examples/server-search-demo.tsx",
  "@rsc-boundary/next",
  searchBody,
);
const serverSearchSnippetStart = withMarkerImport(
  "// components/examples/server-search-demo.tsx",
  "@rsc-boundary/start",
  searchBody,
);

const hybridBody = `import { Counter } from "./counter";

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

const hybridSnippetNext = withMarkerImport(
  "// components/examples/server-hybrid-demo.tsx",
  "@rsc-boundary/next",
  hybridBody,
);
const hybridSnippetStart = withMarkerImport(
  "// components/examples/server-hybrid-demo.tsx",
  "@rsc-boundary/start",
  hybridBody,
);

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
          to your app and run your dev server for the interactive pill, panel, and
          live highlights.
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
        <div className="not-prose">
          <FrameworkTabs
            label="Import package"
            next={
              <CodeBlock
                embedded
                code={staticBlockSnippetNext}
                filename="components/examples/server-static-block.tsx"
              />
            }
            start={
              <CodeBlock
                embedded
                code={staticBlockSnippetStart}
                filename="components/examples/server-static-block.tsx"
              />
            }
          />
        </div>
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
        <div className="not-prose">
          <FrameworkTabs
            label="Import package"
            next={
              <CodeBlock
                embedded
                code={serverCounterSnippetNext}
                filename="components/examples/server-counter-demo.tsx"
              />
            }
            start={
              <CodeBlock
                embedded
                code={serverCounterSnippetStart}
                filename="components/examples/server-counter-demo.tsx"
              />
            }
          />
        </div>
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
        <div className="not-prose">
          <FrameworkTabs
            label="Import package"
            next={
              <CodeBlock
                embedded
                code={serverAccordionSnippetNext}
                filename="components/examples/server-accordion-demo.tsx"
              />
            }
            start={
              <CodeBlock
                embedded
                code={serverAccordionSnippetStart}
                filename="components/examples/server-accordion-demo.tsx"
              />
            }
          />
        </div>
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
        <div className="not-prose">
          <FrameworkTabs
            label="Import package"
            next={
              <CodeBlock
                embedded
                code={serverSearchSnippetNext}
                filename="components/examples/server-search-demo.tsx"
              />
            }
            start={
              <CodeBlock
                embedded
                code={serverSearchSnippetStart}
                filename="components/examples/server-search-demo.tsx"
              />
            }
          />
        </div>
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
        <div className="not-prose">
          <FrameworkTabs
            label="Import package"
            next={
              <CodeBlock
                embedded
                code={hybridSnippetNext}
                filename="components/examples/server-hybrid-demo.tsx"
              />
            }
            start={
              <CodeBlock
                embedded
                code={hybridSnippetStart}
                filename="components/examples/server-hybrid-demo.tsx"
              />
            }
          />
        </div>
      </section>
    </article>
  );
}
