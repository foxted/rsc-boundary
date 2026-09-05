"use client";

import posthog from "posthog-js";
import { useCallback, useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  event?: string;
  eventProperties?: Record<string, string>;
}

export function CopyButton({
  text,
  className,
  event = "code_copied",
  eventProperties,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      posthog.capture(event, eventProperties);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
      posthog.captureException(error);
    }
  }, [event, eventProperties, text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        "absolute right-2 top-2 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted transition hover:bg-border/40 hover:text-foreground"
      }
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
