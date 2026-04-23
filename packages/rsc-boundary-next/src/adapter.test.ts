/** @vitest-environment jsdom */

import { describe, expect, it, beforeEach } from "vitest";
import { nextAdapter } from "./adapter";

describe("nextAdapter", () => {
  it("has the correct name", () => {
    expect(nextAdapter.name).toBe("next");
  });

  it("filters known Next.js internals", () => {
    const knownInternals = [
      "AppRouter",
      "LayoutRouter",
      "InnerLayoutRouter",
      "ErrorBoundary",
      "RedirectBoundary",
      "NotFoundBoundary",
      "ScrollAndFocusHandler",
      "ReactDevOverlay",
      "DevToolsIndicator",
      "MetadataBoundary",
      "HTTPAccessFallbackBoundary",
      "RscDevtools",
    ];
    for (const name of knownInternals) {
      expect(nextAdapter.internals.has(name), `expected "${name}" to be in internals`).toBe(true);
    }
  });

  it("does not filter user-defined component names", () => {
    expect(nextAdapter.internals.has("MyButton")).toBe(false);
    expect(nextAdapter.internals.has("Hero")).toBe(false);
  });

  describe("rootCandidates", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("returns #__next as the first candidate when present", () => {
      const next = document.createElement("div");
      next.id = "__next";
      document.body.append(next);
      const candidates = nextAdapter.rootCandidates();
      expect(candidates[0]).toBe(next);
    });

    it("returns null for #__next when absent", () => {
      const candidates = nextAdapter.rootCandidates();
      expect(candidates[0]).toBeNull();
    });
  });

  describe("resolveScanContainer", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("returns #__next when present", () => {
      const next = document.createElement("div");
      next.id = "__next";
      document.body.append(next);
      expect(nextAdapter.resolveScanContainer()).toBe(next);
    });

    it("falls back to document.body when #__next is absent", () => {
      expect(nextAdapter.resolveScanContainer()).toBe(document.body);
    });
  });
});
