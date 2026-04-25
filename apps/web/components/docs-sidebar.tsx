"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import {
  docsNav,
  docsSectionsByPath,
  flattenDocsSectionIds,
  isDocsSectionGroup,
  normalizeDocsPath,
  type DocsSectionEntry,
} from "../lib/docs-nav";
import { useScrollSpy } from "../lib/use-scroll-spy";

/** Sticky header is h-14 (56px); align active section with reading position below it. */
const SCROLL_SPY_OFFSET_PX = 96;

const EMPTY_SECTION_IDS: readonly string[] = [];

function sectionLinkClass(active: boolean): string {
  return active
    ? "block border-l-2 border-accent py-1 pl-2 -ml-px text-xs font-medium text-foreground transition"
    : "block py-1 text-xs text-muted transition hover:text-foreground";
}

function renderSectionEntries(
  entries: DocsSectionEntry[],
  pageHref: string,
  activeSectionId: string | null,
): ReactNode {
  return entries.map((entry) => {
    if (isDocsSectionGroup(entry)) {
      const parentActive = activeSectionId === entry.id;
      return (
        <li key={entry.id} className="space-y-0.5">
          <Link
            href={`${pageHref}#${entry.id}`}
            aria-current={parentActive ? "location" : undefined}
            className={sectionLinkClass(parentActive)}
          >
            {entry.label}
          </Link>
          <ul
            className="ml-2 space-y-0.5 border-l border-border py-0.5 pl-3"
            aria-label={`${entry.label} sections`}
          >
            {entry.children.map((child) => {
              const childActive = activeSectionId === child.id;
              return (
                <li key={child.id}>
                  <Link
                    href={`${pageHref}#${child.id}`}
                    aria-current={childActive ? "location" : undefined}
                    className={sectionLinkClass(childActive)}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    const leafActive = activeSectionId === entry.id;
    return (
      <li key={entry.id}>
        <Link
          href={`${pageHref}#${entry.id}`}
          aria-current={leafActive ? "location" : undefined}
          className={sectionLinkClass(leafActive)}
        >
          {entry.label}
        </Link>
      </li>
    );
  });
}

export function DocsSidebar() {
  const pathname = usePathname() ?? "";
  const path = normalizeDocsPath(pathname);

  const sectionIds = useMemo(() => {
    const list = docsSectionsByPath[path];
    return list ? flattenDocsSectionIds(list) : EMPTY_SECTION_IDS;
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
                  className="mt-1 ml-2 space-y-1 border-l border-border py-0.5 pl-3"
                  aria-label={`Sections on ${item.label}`}
                >
                  {renderSectionEntries(
                    pageSections,
                    item.href,
                    activeSectionId,
                  )}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
