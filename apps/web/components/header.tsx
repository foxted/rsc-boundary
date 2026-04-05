import Link from "next/link";
import { GitHubRepoLink } from "./github-repo-link";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          RSC Boundary
        </Link>
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main"
        >
          <Link
            href="/docs"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/docs/examples"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            Examples
          </Link>
          <Link
            href="/docs/api"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            API
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <GitHubRepoLink location="header" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
