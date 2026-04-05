"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { ShikiThemedHtml } from "./shiki-themed-html";

type Manager = "pnpm" | "npm" | "yarn";

interface ThemedHtml {
  light: string;
  dark: string;
}

interface PackageInstallClientProps {
  commands: Record<Manager, string>;
  html: Record<Manager, ThemedHtml>;
}

const TABS: { id: Manager; label: string }[] = [
  { id: "pnpm", label: "pnpm" },
  { id: "npm", label: "npm" },
  { id: "yarn", label: "yarn" },
];

export function PackageInstallClient({
  commands,
  html,
}: PackageInstallClientProps) {
  const [manager, setManager] = useState<Manager>("pnpm");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div
          className="flex flex-wrap gap-1"
          role="tablist"
          aria-label="Package manager"
        >
          {TABS.map((tab) => {
            const selected = tab.id === manager;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`tab-${tab.id}`}
                onClick={() => setManager(tab.id)}
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
        <CopyButton
          text={commands[manager]}
          className="shrink-0 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted transition hover:bg-border/40 hover:text-foreground"
        />
      </div>
      <ShikiThemedHtml
        lightHtml={html[manager].light}
        darkHtml={html[manager].dark}
      />
    </div>
  );
}
