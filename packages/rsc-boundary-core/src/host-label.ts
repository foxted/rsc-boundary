/**
 * Fallback label for a host element when no explicit server-boundary name is set.
 */
export function formatHostFallbackLabel(
  tagName: string,
  id?: string | null,
): string {
  const tag = tagName.toLowerCase();
  if (id != null && id.length > 0) {
    return `<${tag}#${id}>`;
  }
  return `<${tag}>`;
}
