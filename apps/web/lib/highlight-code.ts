import { getSingletonHighlighter } from "shiki";

export type CodeLang = "tsx" | "typescript" | "javascript" | "jsx" | "bash";

export type ShikiThemeName = "github-dark" | "github-light";

export function langFromFilename(filename: string | undefined): CodeLang {
  if (!filename) return "tsx";
  const match = /\.([a-z]+)$/i.exec(filename.trim());
  const ext = match?.[1]?.toLowerCase();
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "jsx":
      return "jsx";
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "sh":
      return "bash";
    default:
      return "tsx";
  }
}

export async function highlightCode(
  code: string,
  lang: CodeLang,
  theme: ShikiThemeName = "github-dark",
): Promise<string> {
  const highlighter = await getSingletonHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["tsx", "typescript", "javascript", "jsx", "bash"],
  });

  return highlighter.codeToHtml(code, {
    lang,
    theme,
  });
}

/** Light + dark HTML for transparent panels (theme picked via `.dark` on `html`). */
export async function highlightCodeThemedPair(
  code: string,
  lang: CodeLang,
): Promise<{ light: string; dark: string }> {
  const [light, dark] = await Promise.all([
    highlightCode(code, lang, "github-light"),
    highlightCode(code, lang, "github-dark"),
  ]);
  return { light, dark };
}
