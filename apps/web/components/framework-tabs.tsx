"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "rsc-boundary-docs-framework";
const FRAMEWORK_CHANGE_EVENT = "rsc-boundary-framework-change";

export type FrameworkTabId = "next" | "start";

const TABS: { id: FrameworkTabId; label: string }[] = [
  { id: "next", label: "Next.js" },
  { id: "start", label: "TanStack Start" },
];

interface FrameworkTabsProps {
  next: ReactNode;
  start: ReactNode;
  /** Accessible label for the tab list */
  label?: string;
}

export function FrameworkTabs({
  next,
  start,
  label = "Framework",
}: FrameworkTabsProps) {
  const [framework, setFramework] = useState<FrameworkTabId>("next");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "next" || stored === "start") {
      setFramework(stored);
    }
  }, []);

  const setAndPersist = useCallback((id: FrameworkTabId) => {
    setFramework(id);
    window.localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(
      new CustomEvent<FrameworkTabId>(FRAMEWORK_CHANGE_EVENT, { detail: id }),
    );
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<FrameworkTabId>;
      const detail = ce.detail;
      if (detail === "next" || detail === "start") {
        setFramework(detail);
      }
    };
    window.addEventListener(FRAMEWORK_CHANGE_EVENT, handler);
    return () => window.removeEventListener(FRAMEWORK_CHANGE_EVENT, handler);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-zinc-50 dark:bg-zinc-950 not-prose">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <div
          className="flex flex-wrap gap-1"
          role="tablist"
          aria-label={label}
        >
          {TABS.map((tab) => {
            const selected = tab.id === framework;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`fw-tab-${tab.id}`}
                aria-controls={`fw-panel-${tab.id}`}
                onClick={() => setAndPersist(tab.id)}
                className={
                  selected
                    ? "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm dark:border-zinc-600 dark:bg-zinc-800/60 dark:shadow-none"
                    : "rounded-md px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-zinc-100/90 hover:text-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div
        id="fw-panel-next"
        role="tabpanel"
        aria-labelledby="fw-tab-next"
        hidden={framework !== "next"}
      >
        {next}
      </div>
      <div
        id="fw-panel-start"
        role="tabpanel"
        aria-labelledby="fw-tab-start"
        hidden={framework !== "start"}
      >
        {start}
      </div>
    </div>
  );
}
