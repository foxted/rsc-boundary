---
"rsc-boundary": minor
---

Redesign **RscDevtools** with a panel, legend, pills, and dedicated client/server entries; add stable update comparison for scanned fibers.

Improve **server-boundary highlighting** (captions, host labels, fiber/DOM handling) and expand tests for server-region detection.

Export **`HighlightKind`** for overlay styling.

Declare an optional **`next` peer dependency** for clearer Next.js integration.

### Breaking changes (pre-1.0)

- Rename exported type **`ComponentInfo`** to **`ClientComponentInfo`**.
- **`HighlightState`** now uses **`clientComponents`** instead of **`components`**.

README and usage docs updated for **RscBoundaryProvider** and examples.
