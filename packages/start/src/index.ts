export { RscBoundaryProvider } from "./provider";
export { RscDevtoolsStart } from "./devtools";
export { startAdapter } from "./adapter";

// Re-export shared API from core so users only need one import
export {
  SERVER_BOUNDARY_DATA_ATTR,
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
