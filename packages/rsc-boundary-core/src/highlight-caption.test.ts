import { describe, expect, it } from "vitest";

import { formatDevtoolsLabelCaption } from "./highlight-caption";

describe("formatDevtoolsLabelCaption", () => {
  it("labels client boundaries", () => {
    expect(formatDevtoolsLabelCaption("MyButton", "client")).toBe(
      "Client: MyButton",
    );
  });

  it("labels explicit server regions", () => {
    expect(
      formatDevtoolsLabelCaption("Hero", "server", "explicit"),
    ).toBe("Server (explicit): Hero");
  });

  it("labels heuristic server regions", () => {
    expect(formatDevtoolsLabelCaption("<div>", "server", "heuristic")).toBe(
      "Server (~): <div>",
    );
  });

  it("treats missing server source as heuristic wording", () => {
    expect(formatDevtoolsLabelCaption("X", "server")).toBe("Server (~): X");
  });
});
