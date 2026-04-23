"use client";

/**
 * RscDevtools — floating overlay for visualizing RSC boundaries.
 *
 * Renders a small pill-shaped toggle (bottom-left, visually complementing
 * the Next.js / TanStack Start dev indicator) that, when activated, scans
 * the React fiber tree to find all client components, highlights them with
 * orange outlines, and shows server regions in blue.
 *
 * A companion panel lists detected components with counts and a legend.
 *
 * This component is client-only ("use client"). Mounting is controlled by
 * the per-framework `RscBoundaryProvider` (development only).
 *
 * The `adapter` prop provides framework-specific configuration: which
 * component names to treat as framework internals and how to find the
 * React fiber root.
 */

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
} from "react";

import type { ClientComponentInfo, FrameworkAdapter, ServerRegionInfo } from "../types";
import { scanFiberTree, getServerRegions } from "../fiber-utils";
import {
  applyHighlights,
  removeHighlights,
  observeDomChanges,
} from "../highlight";
import { clientComponentListEqual, serverRegionsEqual } from "./devtools-compare";
import { Panel } from "./devtools-panel";
import { Pill } from "./devtools-pill";

export interface RscDevtoolsProps {
  adapter: FrameworkAdapter;
}

export function RscDevtools({ adapter }: RscDevtoolsProps) {
  const [active, setActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [clientComponents, setClientComponents] = useState<
    ClientComponentInfo[]
  >([]);
  const [serverRegions, setServerRegions] = useState<ServerRegionInfo[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);

  const scan = useCallback(() => {
    const nextClientComponents = scanFiberTree(adapter);
    const nextServerRegions = getServerRegions(nextClientComponents, adapter);
    applyHighlights(nextClientComponents, nextServerRegions);
    setClientComponents((prev) =>
      clientComponentListEqual(prev, nextClientComponents)
        ? prev
        : nextClientComponents,
    );
    setServerRegions((prev) =>
      serverRegionsEqual(prev, nextServerRegions) ? prev : nextServerRegions,
    );
  }, [adapter]);

  const activate = useCallback(() => {
    // Delay scan slightly to let React finish any pending renders
    requestAnimationFrame(() => {
      scan();
      cleanupRef.current = observeDomChanges(scan);
    });
  }, [scan]);

  const deactivate = useCallback(() => {
    removeHighlights();
    cleanupRef.current?.();
    cleanupRef.current = null;
    setClientComponents([]);
    setServerRegions([]);
  }, []);

  const handleToggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      if (next) {
        activate();
      } else {
        deactivate();
        setPanelOpen(false);
      }
      return next;
    });
  }, [activate, deactivate]);

  const handlePanelToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (active) {
        setPanelOpen((prev) => !prev);
      }
    },
    [active],
  );

  useEffect(() => {
    return () => {
      removeHighlights();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <>
      {panelOpen && active && (
        <Panel clientComponents={clientComponents} serverRegions={serverRegions} />
      )}
      <Pill
        active={active}
        onToggle={handleToggle}
        onPanelToggle={handlePanelToggle}
        clientCount={clientComponents.length}
      />
    </>
  );
}
