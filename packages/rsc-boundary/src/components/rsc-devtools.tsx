"use client";

/**
 * RscDevtools — floating overlay for visualizing RSC boundaries.
 *
 * Renders a small pill-shaped toggle (bottom-left, visually complementing
 * the Next.js dev indicator) that, when activated, scans the React fiber
 * tree to find all client components, highlights them with orange outlines,
 * and shows server regions in blue.
 *
 * A companion panel lists detected components with counts and a legend.
 *
 * This component is client-only ("use client"). Mounting is controlled by
 * `RscBoundaryProvider` (development by default, or when `enabled` is set).
 */

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
} from "react";

import type { ComponentInfo, ServerRegionInfo } from "../types";
import { scanFiberTree, getServerRegions } from "../fiber-utils";
import {
  applyHighlights,
  removeHighlights,
  observeDomChanges,
} from "../highlight";
import { componentListEqual, serverRegionsEqual } from "./devtools-compare";
import { Panel } from "./devtools-panel";
import { Pill } from "./devtools-pill";

export function RscDevtools() {
  const [active, setActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [serverRegions, setServerRegions] = useState<ServerRegionInfo[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);

  const scan = useCallback(() => {
    const clientComponents = scanFiberTree();
    const nextServerRegions = getServerRegions(clientComponents);
    applyHighlights(clientComponents, nextServerRegions);
    setComponents((prev) =>
      componentListEqual(prev, clientComponents) ? prev : clientComponents,
    );
    setServerRegions((prev) =>
      serverRegionsEqual(prev, nextServerRegions) ? prev : nextServerRegions,
    );
  }, []);

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
    setComponents([]);
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
        <Panel components={components} serverRegions={serverRegions} />
      )}
      <Pill
        active={active}
        onToggle={handleToggle}
        onPanelToggle={handlePanelToggle}
        clientCount={components.length}
      />
    </>
  );
}
