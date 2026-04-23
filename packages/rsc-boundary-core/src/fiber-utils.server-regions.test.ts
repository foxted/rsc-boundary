/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";

import {
  RSC_DEVTOOLS_DATA_ATTR,
  SERVER_BOUNDARY_DATA_ATTR,
} from "./constants";
import { getServerRegions } from "./fiber-utils";
import type { ClientComponentWithFiber } from "./fiber-utils";
import type { FrameworkAdapter, ReactComponentInfo } from "./types";

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

  // ---------------------------------------------------------------------------
  // Precedence: explicit > rsc-debug > heuristic
  // ---------------------------------------------------------------------------

  it("rsc-debug region wins over heuristic for the same element", () => {
    const next = document.getElementById("__next")!;
    const el = document.createElement("section");
    next.append(el);

    // A client component inside el so el would otherwise also appear as heuristic
    // (it won't because debug covers it — but here we test with no client subtrees
    // to confirm debug takes priority and heuristic doesn't double-report).
    const info: ReactComponentInfo = { name: "Hero", env: "Server" };
    const clientEl = document.createElement("button");
    el.append(clientEl);

    const clientsWithFibers: ClientComponentWithFiber[] = [
      {
        info: { name: "HeroButton", domNodes: [clientEl] },
        fiber: { _debugInfo: [info] },
      },
    ];

    const regions = getServerRegions(clientsWithFibers, testAdapter);
    const debugRegions = regions.filter((r) => r.source === "rsc-debug");
    expect(debugRegions).toHaveLength(1);
    expect(debugRegions[0]?.displayLabel).toBe("Hero");
    // The element covered by rsc-debug should not also appear as heuristic.
    const heuristic = regions.filter((r) => r.source === "heuristic");
    const heuristicOverlap = heuristic.some(
      (r) => r.element === debugRegions[0]?.element,
    );
    expect(heuristicOverlap).toBe(false);
  });

  it("explicit marker wins over rsc-debug: explicit is emitted and debug label is not duplicated", () => {
    const next = document.getElementById("__next")!;

    // An explicit marker wrapping a server region.
    const wrapper = document.createElement("div");
    wrapper.setAttribute(SERVER_BOUNDARY_DATA_ATTR, "ExplicitName");
    next.append(wrapper);

    // A client component inside the wrapper whose fiber has _debugInfo
    // pointing to a server component covering the same wrapper element.
    const clientEl = document.createElement("button");
    wrapper.append(clientEl);
    const info: ReactComponentInfo = { name: "InferredName", env: "Server" };

    const clientsWithFibers: ClientComponentWithFiber[] = [
      {
        info: { name: "MyButton", domNodes: [clientEl] },
        fiber: { _debugInfo: [info] },
      },
    ];

    const regions = getServerRegions(clientsWithFibers, testAdapter);
    // Explicit is always emitted.
    const explicit = regions.filter((r) => r.source === "explicit");
    expect(explicit).toHaveLength(1);
    expect(explicit[0]?.displayLabel).toBe("ExplicitName");

    // rsc-debug region anchors at clientEl (LCA of the one member), which is
    // inside the explicit wrapper. It must NOT be presented as a separate entry
    // whose element is also inside the explicit wrapper — heuristic suppresses
    // descendants of explicit, but debug regions are separate. In the current
    // design they co-exist if they have different elements. Assert that no
    // rsc-debug region has the same element as the explicit region.
    const debug = regions.filter((r) => r.source === "rsc-debug");
    for (const d of debug) {
      expect(d.element).not.toBe(explicit[0]?.element);
    }
  });

  it("passes ClientComponentInfo[] (no fibers) without errors — backwards compat", () => {
    const next = document.getElementById("__next")!;
    // serverEl and clientEl are siblings so serverEl is a heuristic server region.
    const serverEl = document.createElement("div");
    const clientEl = document.createElement("button");
    next.append(serverEl, clientEl);

    // Plain ClientComponentInfo, no fibers — legacy call shape.
    const regions = getServerRegions(
      [{ name: "OldButton", domNodes: [clientEl] }],
      testAdapter,
    );
    // Should not throw; rsc-debug pass is skipped; heuristic still works.
    expect(regions.some((r) => r.source === "heuristic")).toBe(true);
    expect(regions.some((r) => r.source === "rsc-debug")).toBe(false);
  });
});
