"use client";

import { useMemo, useState } from "react";

interface SearchFilterProps {
  items: readonly string[];
  placeholder?: string;
}

export function SearchFilter({
  items,
  placeholder = "Filter list…",
}: SearchFilterProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...items];
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <label className="block text-sm font-medium text-foreground" htmlFor="search-filter-input">
        Search (client)
      </label>
      <input
        id="search-filter-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-accent focus:ring-2"
      />
      <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-muted">
        {filtered.length === 0 ? (
          <li className="text-muted">No matches.</li>
        ) : (
          filtered.map((item) => (
            <li
              key={item}
              className="rounded-md border border-transparent px-2 py-1 hover:border-border hover:bg-border/20"
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
