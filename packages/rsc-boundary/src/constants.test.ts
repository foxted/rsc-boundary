import { describe, expect, it } from "vitest";

import { SERVER_BOUNDARY_DATA_ATTR } from "./constants";

describe("SERVER_BOUNDARY_DATA_ATTR", () => {
  it("matches the documented explicit-marker attribute for DOM queries", () => {
    expect(SERVER_BOUNDARY_DATA_ATTR).toBe("data-rsc-boundary-server");
  });
});
