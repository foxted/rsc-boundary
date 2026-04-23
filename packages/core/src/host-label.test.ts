import { describe, expect, it } from "vitest";

import { formatHostFallbackLabel } from "./host-label";

describe("formatHostFallbackLabel", () => {
  it("returns tag only when id is missing or empty", () => {
    expect(formatHostFallbackLabel("DIV")).toBe("<div>");
    expect(formatHostFallbackLabel("DIV", "")).toBe("<div>");
    expect(formatHostFallbackLabel("DIV", null)).toBe("<div>");
    expect(formatHostFallbackLabel("DIV", undefined)).toBe("<div>");
  });

  it("normalizes tag name to lowercase and appends id", () => {
    expect(formatHostFallbackLabel("SECTION", "hero")).toBe("<section#hero>");
  });
});
