/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { SERVER_BOUNDARY_DATA_ATTR } from "../constants";
import { RscServerBoundaryMarker } from "./server-boundary-marker";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

function setNodeEnv(value: string) {
  vi.stubEnv("NODE_ENV", value);
}

afterEach(() => {
  vi.unstubAllEnvs();
  setNodeEnv(ORIGINAL_NODE_ENV ?? "test");
  vi.restoreAllMocks();
});

describe("RscServerBoundaryMarker", () => {
  describe("development", () => {
    beforeEach(() => {
      setNodeEnv("development");
    });

    it("injects the boundary data attribute onto the child host element", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Hero">
          <section className="hero">content</section>
        </RscServerBoundaryMarker>,
      );

      expect(html).toBe(
        `<section class="hero" ${SERVER_BOUNDARY_DATA_ATTR}="Hero">content</section>`,
      );
    });

    it("injects an empty label when none is provided", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker>
          <div>content</div>
        </RscServerBoundaryMarker>,
      );

      expect(html).toBe(
        `<div ${SERVER_BOUNDARY_DATA_ATTR}="">content</div>`,
      );
    });

    it("does not render an extra wrapper element", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="OnlyChild">
          <footer>f</footer>
        </RscServerBoundaryMarker>,
      );

      expect(html.startsWith("<footer")).toBe(true);
      expect(html).not.toContain("<div");
    });

    it("preserves existing props on the child", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="WithProps">
          <article className="card" id="a1" data-foo="bar">
            c
          </article>
        </RscServerBoundaryMarker>,
      );

      expect(html).toContain(`class="card"`);
      expect(html).toContain(`id="a1"`);
      expect(html).toContain(`data-foo="bar"`);
      expect(html).toContain(`${SERVER_BOUNDARY_DATA_ATTR}="WithProps"`);
    });

    it("warns and passes children through when given multiple children", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Multi">
          <span>a</span>
          <span>b</span>
        </RscServerBoundaryMarker>,
      );

      expect(html).toBe(`<span>a</span><span>b</span>`);
      expect(html).not.toContain(SERVER_BOUNDARY_DATA_ATTR);
      expect(warn).toHaveBeenCalledOnce();
    });

    it("warns and passes string children through untouched", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Text">hello</RscServerBoundaryMarker>,
      );

      expect(html).toBe("hello");
      expect(warn).toHaveBeenCalledOnce();
    });
  });

  describe("production", () => {
    beforeEach(() => {
      setNodeEnv("production");
    });

    it("renders the child with zero extra DOM and no data attribute", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Hero">
          <section className="hero">content</section>
        </RscServerBoundaryMarker>,
      );

      expect(html).toBe(`<section class="hero">content</section>`);
      expect(html).not.toContain(SERVER_BOUNDARY_DATA_ATTR);
    });

    it("is a pass-through for non-element children (no warning)", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Text">hello</RscServerBoundaryMarker>,
      );

      expect(html).toBe("hello");
      expect(warn).not.toHaveBeenCalled();
    });

    it("is a pass-through for multiple children", () => {
      const html = renderToStaticMarkup(
        <RscServerBoundaryMarker label="Multi">
          <span>a</span>
          <span>b</span>
        </RscServerBoundaryMarker>,
      );

      expect(html).toBe(`<span>a</span><span>b</span>`);
      expect(html).not.toContain(SERVER_BOUNDARY_DATA_ATTR);
    });
  });
});
