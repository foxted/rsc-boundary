/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";

import {
  RSC_DEVTOOLS_DATA_ATTR,
  SERVER_BOUNDARY_DATA_ATTR,
} from "./constants";
import { getServerRegions } from "./fiber-utils";
import type { FrameworkAdapter } from "./types";

/** Minimal adapter that mimics Next.js-style root detection for tests. */
const testAdapter: FrameworkAdapter = {
  name: "test",
  internals: new Set(),
  rootCandidates: () => [
    document.getElementById("__next"),
    document.body,
    document.documentElement,
  ],
  resolveScanContainer: () =>
    document.getElementById("__next") ?? document.body,
};

describe("getServerRegions", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    const next = document.createElement("div");
    next.id = "__next";
    document.body.append(next);
  });

  it("collapses nested server-only markup to minimal heuristic roots", () => {
    const next = document.getElementById("__next")!;
    const outer = document.createElement("div");
    const inner = document.createElement("div");
    outer.append(inner);
    next.append(outer);

    const regions = getServerRegions([], testAdapter);
    const heuristic = regions.filter((r) => r.source === "heuristic");
    expect(heuristic).toHaveLength(1);
    expect(heuristic[0]?.element).toBe(outer);
  });

  it("excludes heuristic regions inside client component DOM subtrees", () => {
    const next = document.getElementById("__next")!;
    const section = document.createElement("section");
    const clientRoot = document.createElement("div");
    clientRoot.id = "client-root";
    section.append(clientRoot);
    const aside = document.createElement("aside");
    next.append(section, aside);

    const regions = getServerRegions(
      [{ name: "ClientCmp", domNodes: [clientRoot] }],
      testAdapter,
    );
    const heuristic = regions.filter((r) => r.source === "heuristic");
    expect(heuristic).toHaveLength(1);
    expect(heuristic[0]?.element).toBe(aside);
  });

  it("collects explicit regions with displayLabel from attribute", () => {
    const next = document.getElementById("__next")!;
    const el = document.createElement("span");
    el.setAttribute(SERVER_BOUNDARY_DATA_ATTR, "MyRegion");
    next.append(el);

    const regions = getServerRegions([], testAdapter);
    expect(regions).toHaveLength(1);
    expect(regions[0]).toMatchObject({
      source: "explicit",
      displayLabel: "MyRegion",
      element: el,
    });
  });

  it("uses host fallback label for explicit marker with empty attribute", () => {
    const next = document.getElementById("__next")!;
    const el = document.createElement("p");
    el.setAttribute(SERVER_BOUNDARY_DATA_ATTR, "");
    next.append(el);

    const regions = getServerRegions([], testAdapter);
    expect(regions).toHaveLength(1);
    expect(regions[0]?.source).toBe("explicit");
    expect(regions[0]?.displayLabel).toBe("<p>");
  });

  it("skips explicit markers inside devtools subtree", () => {
    const next = document.getElementById("__next")!;
    const shell = document.createElement("div");
    shell.setAttribute(RSC_DEVTOOLS_DATA_ATTR, "");
    const marked = document.createElement("span");
    marked.setAttribute(SERVER_BOUNDARY_DATA_ATTR, "Hidden");
    shell.append(marked);
    next.append(shell);

    const regions = getServerRegions([], testAdapter);
    expect(regions.filter((r) => r.source === "explicit")).toHaveLength(0);
  });
});
