"use client";

import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  children?: ReactNode;
}

export function Tabs({ tabs, activeId, onChange, children }: TabsProps) {
  return (
    <div>
      <div
        className="flex gap-1 border-b border-border px-2 pt-2"
        role="tablist"
        aria-label="Package manager"
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={
                selected
                  ? "rounded-t-md border border-b-0 border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                  : "rounded-t-md px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
