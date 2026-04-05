import {
  highlightCodeThemedPair,
  langFromFilename,
  type CodeLang,
} from "../lib/highlight-code";
import { CopyButton } from "./copy-button";
import { ShikiThemedHtml } from "./shiki-themed-html";

interface CodeBlockProps {
  code: string;
  /** Shown in header bar */
  filename?: string;
  /** Grammar for highlighting; defaults from `filename` extension or tsx */
  lang?: CodeLang;
}

export async function CodeBlock({ code, filename, lang }: CodeBlockProps) {
  const trimmed = code.trimEnd();
  const resolvedLang = lang ?? langFromFilename(filename);
  const { light, dark } = await highlightCodeThemedPair(trimmed, resolvedLang);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-zinc-50 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="min-w-0 truncate font-mono text-xs text-muted">
          {filename ?? "\u00a0"}
        </span>
        <CopyButton
          text={trimmed}
          className="shrink-0 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted transition hover:bg-border/40 hover:text-foreground"
        />
      </div>
      <ShikiThemedHtml lightHtml={light} darkHtml={dark} />
    </div>
  );
}
