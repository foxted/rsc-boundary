"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  docsNav,
  docsSectionsByPath,
  normalizeDocsPath,
} from "../lib/docs-nav";
import { useScrollSpy } from "../lib/use-scroll-spy";

/** Sticky header is h-14 (56px); align active section with reading position below it. */
const SCROLL_SPY_OFFSET_PX = 96;

const EMPTY_SECTION_IDS: readonly string[] = [];

export function DocsSidebar() {
  const pathname = usePathname() ?? "";
  const path = normalizeDocsPath(pathname);

  const sectionIds = useMemo(() => {
    const list = docsSectionsByPath[path];
    return list ? list.map((s) => s.id) : EMPTY_SECTION_IDS;
  }, [path]);

  const activeSectionId = useScrollSpy(sectionIds, SCROLL_SPY_OFFSET_PX);
  const sections = docsSectionsByPath[path] ?? [];

  return (
    <aside className="hidden w-52 shrink-0 md:block">
      <nav className="sticky top-24 space-y-1" aria-label="Documentation">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Documentation
        </p>
        {docsNav.map((item) => {
          const itemPath = normalizeDocsPath(item.href);
          const isActivePage = path === itemPath;
          const pageSections = isActivePage ? sections : [];

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                aria-current={isActivePage ? "page" : undefined}
                className={
                  isActivePage
                    ? "block rounded-lg bg-border/50 px-3 py-2 text-sm font-medium text-foreground transition"
                    : "block rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-border/40 hover:text-foreground"
                }
              >
                {item.label}
              </Link>
              {pageSections.length > 0 ? (
                <ul
                  className="mt-1 ml-2 space-y-0.5 border-l border-border py-0.5 pl-3"
                  aria-label={`Sections on ${item.label}`}
                >
                  {pageSections.map((section) => {
                    const isActiveSection = activeSectionId === section.id;
                    return (
                      <li key={section.id}>
                        <Link
                          href={`${item.href}#${section.id}`}
                          aria-current={isActiveSection ? "location" : undefined}
                          className={
                            isActiveSection
                              ? "block border-l-2 border-accent py-1 pl-2 -ml-px text-xs font-medium text-foreground transition"
                              : "block py-1 text-xs text-muted transition hover:text-foreground"
                          }
                        >
                          {section.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
