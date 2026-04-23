export { RscBoundaryProvider } from "./provider";
export { RscDevtoolsNext } from "./devtools";
export { nextAdapter } from "./adapter";

// Re-export shared API from core so users only need one import
export {
  SERVER_BOUNDARY_DATA_ATTR,
  COLORS,
  LABEL_BASE_STYLES,
  RscServerBoundaryMarker,
  createRscBoundaryProvider,
} from "@rsc-boundary/core";
export type {
  ClientComponentInfo,
  FrameworkAdapter,
  HighlightKind,
  HighlightState,
  ServerRegionInfo,
  ServerRegionSource,
} from "@rsc-boundary/core";
