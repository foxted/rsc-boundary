/** @vitest-environment jsdom */

import { describe, expect, it, beforeEach } from "vitest";

import {
  collectDebugServerRegions,
  computeLCA,
  getFiberDebugInfo,
} from "./rsc-debug-info";
import type { FiberWithDom } from "./rsc-debug-info";
import type { ReactComponentInfo } from "./types";

// ---------------------------------------------------------------------------
// getFiberDebugInfo
// ---------------------------------------------------------------------------

describe("getFiberDebugInfo", () => {
  it("returns null for non-objects", () => {
    expect(getFiberDebugInfo(null)).toBeNull();
    expect(getFiberDebugInfo(undefined)).toBeNull();
    expect(getFiberDebugInfo("string")).toBeNull();
    expect(getFiberDebugInfo(42)).toBeNull();
  });

  it("returns null when _debugInfo is missing", () => {
    expect(getFiberDebugInfo({})).toBeNull();
    expect(getFiberDebugInfo({ tag: 0 })).toBeNull();
  });

  it("returns null when _debugInfo is not an array", () => {
    expect(getFiberDebugInfo({ _debugInfo: "bad" })).toBeNull();
    expect(getFiberDebugInfo({ _debugInfo: null })).toBeNull();
  });

  it("returns the array when _debugInfo is present", () => {
    const info: ReactComponentInfo[] = [{ name: "Page", env: "Server" }];
    expect(getFiberDebugInfo({ _debugInfo: info })).toBe(info);
  });

  it("returns an empty array without throwing", () => {
    expect(getFiberDebugInfo({ _debugInfo: [] })).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// computeLCA
// ---------------------------------------------------------------------------

describe("computeLCA", () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.replaceChildren();
    container = document.createElement("div");
    document.body.append(container);
  });

  it("returns null for an empty array", () => {
    expect(computeLCA([])).toBeNull();
  });

  it("returns the sole element for a singleton", () => {
    const el = document.createElement("span");
    container.append(el);
    expect(computeLCA([el])).toBe(el);
  });

  it("returns the shared parent for two siblings", () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    container.append(a, b);
    expect(computeLCA([a, b])).toBe(container);
  });

  it("returns the ancestor for a parent-child pair", () => {
    const parent = document.createElement("section");
    const child = document.createElement("p");
    parent.append(child);
    container.append(parent);
    expect(computeLCA([parent, child])).toBe(parent);
  });

  it("returns body for elements in completely separate branches", () => {
    const left = document.createElement("div");
    const right = document.createElement("div");
    document.body.append(left, right);
    // LCA is document.body since container is not an ancestor of both
    const result = computeLCA([left, right]);
    expect(result).toBe(document.body);
  });
});

// ---------------------------------------------------------------------------
// collectDebugServerRegions
// ---------------------------------------------------------------------------

describe("collectDebugServerRegions", () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.replaceChildren();
    container = document.createElement("div");
    container.id = "root";
    document.body.append(container);
  });

  function makeEl(tag = "div"): HTMLElement {
    const el = document.createElement(tag);
    container.append(el);
    return el;
  }

  function makeFiber(
    info: ReactComponentInfo[],
    domNodes: HTMLElement[],
  ): FiberWithDom {
    return { fiber: { _debugInfo: info }, domNodes };
  }

  it("returns empty array when no fibers have _debugInfo", () => {
    const el = makeEl();
    const fibers: FiberWithDom[] = [{ fiber: {}, domNodes: [el] }];
    expect(collectDebugServerRegions(fibers)).toEqual([]);
  });

  it("emits one region per unique server component", () => {
    const el1 = makeEl();
    const el2 = makeEl();
    const pageInfo: ReactComponentInfo = { name: "Page", env: "Server" };
    const fibers = [
      makeFiber([pageInfo], [el1]),
      makeFiber([pageInfo], [el2]),
    ];
    const regions = collectDebugServerRegions(fibers);
    expect(regions).toHaveLength(1);
    expect(regions[0]?.displayLabel).toBe("Page");
    expect(regions[0]?.source).toBe("rsc-debug");
    expect(regions[0]?.env).toBe("Server");
    // LCA of el1 and el2 is their shared parent (container)
    expect(regions[0]?.element).toBe(container);
  });

  it("produces two regions for two different server component infos", () => {
    const el1 = makeEl();
    const el2 = makeEl();
    const heroInfo: ReactComponentInfo = { name: "Hero", env: "Server" };
    const footerInfo: ReactComponentInfo = { name: "Footer", env: "Server" };
    const fibers = [
      makeFiber([heroInfo], [el1]),
      makeFiber([footerInfo], [el2]),
    ];
    const regions = collectDebugServerRegions(fibers);
    expect(regions).toHaveLength(2);
    const names = regions.map((r) => r.displayLabel).sort();
    expect(names).toEqual(["Footer", "Hero"]);
  });

  it("ignores entries where env is Client", () => {
    const el = makeEl();
    const clientInfo: ReactComponentInfo = { name: "Nav", env: "Client" };
    const fibers = [makeFiber([clientInfo], [el])];
    expect(collectDebugServerRegions(fibers)).toHaveLength(0);
  });

  it("defaults missing env to Server", () => {
    const el = makeEl();
    const info: ReactComponentInfo = { name: "Layout" };
    const fibers = [makeFiber([info], [el])];
    const regions = collectDebugServerRegions(fibers);
    expect(regions).toHaveLength(1);
    expect(regions[0]?.env).toBe("Server");
  });

  it("sets componentName equal to displayLabel", () => {
    const el = makeEl();
    const info: ReactComponentInfo = { name: "Article", env: "Server" };
    const fibers = [makeFiber([info], [el])];
    const regions = collectDebugServerRegions(fibers);
    expect(regions[0]?.componentName).toBe("Article");
    expect(regions[0]?.displayLabel).toBe("Article");
  });

  it("merges sibling fibers sharing the same ReactComponentInfo by object identity", () => {
    // Both fibers reference the exact same ReactComponentInfo object.
    const shared: ReactComponentInfo = { name: "PostsGrid", env: "Server" };
    const inner1 = document.createElement("article");
    const inner2 = document.createElement("article");
    container.append(inner1, inner2);
    const fibers = [
      makeFiber([shared], [inner1]),
      makeFiber([shared], [inner2]),
    ];
    const regions = collectDebugServerRegions(fibers);
    // Should collapse to a single region because it's the same object identity.
    expect(regions).toHaveLength(1);
    expect(regions[0]?.element).toBe(container);
  });

  it("merges by string key when objects differ but represent the same component", () => {
    // Two separate objects with the same name + owner chain (no owner here).
    const a: ReactComponentInfo = { name: "Stats" };
    const b: ReactComponentInfo = { name: "Stats" };
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");
    container.append(el1, el2);
    const fibers = [makeFiber([a], [el1]), makeFiber([b], [el2])];
    const regions = collectDebugServerRegions(fibers);
    expect(regions).toHaveLength(1);
    expect(regions[0]?.displayLabel).toBe("Stats");
  });

  it("skips fibers with empty domNodes", () => {
    const info: ReactComponentInfo = { name: "Ghost", env: "Server" };
    const fibers = [makeFiber([info], [])];
    expect(collectDebugServerRegions(fibers)).toHaveLength(0);
  });

  it("handles multiple _debugInfo levels (nested server components)", () => {
    // outer owns inner — simulate as separate entries in two separate fibers.
    const outer: ReactComponentInfo = { name: "Layout", env: "Server" };
    const inner: ReactComponentInfo = {
      name: "Article",
      env: "Server",
      owner: outer,
    };
    const el1 = document.createElement("header");
    const el2 = document.createElement("main");
    container.append(el1, el2);
    // Fiber 1 is owned by both Layout and Article (inner debug info chain).
    // Fiber 2 is owned by Layout only.
    const fibers = [
      makeFiber([outer, inner], [el1]),
      makeFiber([outer], [el2]),
    ];
    const regions = collectDebugServerRegions(fibers);
    // Layout: covers el1 + el2 → LCA = container
    // Article: covers el1 only → LCA = el1
    expect(regions).toHaveLength(2);
    const layout = regions.find((r) => r.displayLabel === "Layout");
    const article = regions.find((r) => r.displayLabel === "Article");
    expect(layout?.element).toBe(container);
    expect(article?.element).toBe(el1);
  });
});
