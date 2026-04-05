"use client";

import { useCallback, useState } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-border/30"
              aria-expanded={open}
            >
              {item.title}
              <span className="text-muted" aria-hidden>
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? (
              <div className="border-t border-border px-4 py-3 text-sm text-muted">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
