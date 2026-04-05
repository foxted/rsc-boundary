"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav, normalizeDocsPath } from "../lib/docs-nav";

export function DocsPager() {
  const pathname = usePathname() ?? "";
  const path = normalizeDocsPath(pathname);
  const index = docsNav.findIndex(
    (item) => normalizeDocsPath(item.href) === path,
  );

  if (index === -1) {
    return null;
  }

  const prev = index > 0 ? docsNav[index - 1] : null;
  const next = index < docsNav.length - 1 ? docsNav[index + 1] : null;

  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      className="mx-auto mt-16 max-w-3xl border-t border-border pt-8"
      aria-label="Previous and next documentation pages"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          {prev ? (
            <Link
              href={prev.href}
              className="group block outline-none transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-xs font-medium text-muted">Previous</span>
              <span className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground transition group-hover:text-accent">
                <ChevronLeftIcon className="h-4 w-4 shrink-0 opacity-80 transition group-hover:opacity-100" />
                {prev.label}
              </span>
            </Link>
          ) : null}
        </div>
        <div className="sm:text-right">
          {next ? (
            <Link
              href={next.href}
              className="group flex flex-col items-start sm:items-end sm:ml-auto sm:max-w-full outline-none transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-xs font-medium text-muted">Next</span>
              <span className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground transition group-hover:text-accent">
                {next.label}
                <ChevronRightIcon className="h-4 w-4 shrink-0 opacity-80 transition group-hover:opacity-100" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
