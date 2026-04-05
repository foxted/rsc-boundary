"use client";

interface ShikiThemedHtmlProps {
  lightHtml: string;
  darkHtml: string;
}

export function ShikiThemedHtml({ lightHtml, darkHtml }: ShikiThemedHtmlProps) {
  const bodyClass =
    "shiki-themed-html overflow-x-auto p-4 font-mono text-sm leading-relaxed";

  return (
    <>
      <div
        className={`${bodyClass} dark:hidden`}
        // Shiki output is trusted (our own strings at build/render time)
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className={`${bodyClass} hidden dark:block`}
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
    </>
  );
}
