"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/examples", label: "Examples" },
  { href: "/docs/api", label: "API" },
  { href: "/docs/how-it-works", label: "How it works" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X aria-hidden className="h-5 w-5" />
        ) : (
          <Menu aria-hidden className="h-5 w-5" />
        )}
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute left-0 right-0 top-full z-50 mt-2 border-b border-border bg-card px-4 py-4 shadow-lg"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-border/40"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
