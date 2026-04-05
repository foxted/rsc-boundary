"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className="text-sm text-muted">Count: {count}</span>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => setCount(0)}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-border/40"
      >
        Reset
      </button>
    </div>
  );
}
