"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import type { ReactNode } from "react";

interface GitHubRepoLinkClientProps {
  href: string;
  location: "header" | "footer";
  className: string;
  children: ReactNode;
}

export function GitHubRepoLinkClient({
  href,
  location,
  className,
  children,
}: GitHubRepoLinkClientProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub repository"
      className={className}
      onClick={() => {
        posthog.capture("github_clicked", { location });
      }}
    >
      <Github aria-hidden className="h-4 w-4" />
      {children}
      <span className="sr-only">GitHub repository</span>
    </Link>
  );
}
