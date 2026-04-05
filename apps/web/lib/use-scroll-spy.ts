"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is “current” while scrolling: the last heading whose
 * top edge has passed the viewport offset (e.g. sticky header height).
 */
export function useScrollSpy(
  sectionIds: readonly string[],
  offsetPx: number,
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActive(null);
      return;
    }

    const measure = () => {
      if (typeof window === "undefined") return;

      if (window.scrollY < 8) {
        setActive(sectionIds[0] ?? null);
        return;
      }

      let current: string | null = sectionIds[0] ?? null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offsetPx + 1) {
          current = id;
        }
      }
      setActive(current);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", measure);
    };
  }, [sectionIds, offsetPx]);

  return active;
}
