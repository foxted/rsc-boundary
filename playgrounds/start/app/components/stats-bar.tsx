import { RscServerBoundaryMarker } from "@rsc-boundary/start";
import { siteStats } from "../lib/data";

export function StatsBar() {
  return (
    <RscServerBoundaryMarker label="StatsBar">
      <div className="stats-bar">
        {Object.entries(siteStats).map(([key, val]) => (
          <div key={key}>
            <div className="stat-value">{val}</div>
            <div className="stat-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </RscServerBoundaryMarker>
  );
}
