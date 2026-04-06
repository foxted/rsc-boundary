import { RscServerBoundaryMarker } from "rsc-boundary";

import { FakeClientChrome, FakeServerChrome } from "./boundary-chrome";
import { Accordion, type AccordionItem } from "./accordion";

export interface ServerAccordionDemoProps {
  illustrativeBoundaryChrome?: boolean;
}

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: "1",
    title: "Why is this page useful for the devtools?",
    content:
      "This route mixes server-rendered copy and structure with several client islands. Toggle the RSC pill to see orange around interactive pieces and blue around static server output.",
  },
  {
    id: "2",
    title: "Do I need to mark server regions manually?",
    content:
      "Often no: in development, regions outside client boundaries are inferred (~). For documentation or production previews, add RscServerBoundaryMarker (or the data attribute) so labels and outlines stay predictable.",
  },
  {
    id: "3",
    title: "Is this accurate for every edge case?",
    content:
      "It is a heuristic based on the client fiber tree and DOM ownership. See limitations on the How it works page.",
  },
];

/**
 * Server Component: FAQ data is defined here; Accordion is the client boundary.
 */
export function ServerAccordionDemo({
  illustrativeBoundaryChrome = false,
}: ServerAccordionDemoProps) {
  const shell = (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        FAQ entries are plain data in this server file and passed as props into{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">Accordion</code>{" "}
        (client). Open/close state is client-side.
      </p>
      {illustrativeBoundaryChrome ? (
        <FakeClientChrome label="Accordion">
          <Accordion items={FAQ_ITEMS} />
        </FakeClientChrome>
      ) : (
        <Accordion items={FAQ_ITEMS} />
      )}
    </div>
  );

  return (
    <RscServerBoundaryMarker label="ExampleServerAccordion">
      {illustrativeBoundaryChrome ? (
        <FakeServerChrome label="ExampleServerAccordion">{shell}</FakeServerChrome>
      ) : (
        shell
      )}
    </RscServerBoundaryMarker>
  );
}
