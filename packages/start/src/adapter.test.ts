/** @vitest-environment jsdom */

import { describe, expect, it, beforeEach } from "vitest";
import { startAdapter } from "./adapter";

describe("startAdapter", () => {
  it("has the correct name", () => {
    expect(startAdapter.name).toBe("start");
  });

  it("filters known TanStack Router / Start internals", () => {
    const knownInternals = [
      "RouterProvider",
      "RouterContextProvider",
      "Transitioner",
      "Match",
      "MatchInner",
      "Outlet",
      "CatchBoundary",
      "ErrorComponent",
      "ScriptOnce",
      "StartServer",
      "StartClient",
      "Asset",
      "Meta",
      "Scripts",
      "RootDocument",
      "DehydrateRouter",
      "RscDevtools",
    ];
    for (const name of knownInternals) {
      expect(startAdapter.internals.has(name), `expected "${name}" to be in internals`).toBe(true);
    }
  });

  it("does not filter user-defined component names", () => {
    expect(startAdapter.internals.has("MyButton")).toBe(false);
    expect(startAdapter.internals.has("Hero")).toBe(false);
  });

  describe("rootCandidates", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("returns #root as the first candidate when present", () => {
      const root = document.createElement("div");
      root.id = "root";
      document.body.append(root);
      const candidates = startAdapter.rootCandidates();
      expect(candidates[0]).toBe(root);
    });

    it("returns null for #root when absent", () => {
      const candidates = startAdapter.rootCandidates();
      expect(candidates[0]).toBeNull();
    });
  });

  describe("resolveScanContainer", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("returns #root when present", () => {
      const root = document.createElement("div");
      root.id = "root";
      document.body.append(root);
      expect(startAdapter.resolveScanContainer()).toBe(root);
    });

    it("falls back to document.body when #root is absent", () => {
      expect(startAdapter.resolveScanContainer()).toBe(document.body);
    });
  });
});
