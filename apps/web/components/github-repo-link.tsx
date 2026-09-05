import { after } from "next/server";
import { GitHubRepoLinkClient } from "./github-repo-link-client";
import { getPostHogServer } from "../lib/posthog-server";

const GITHUB_REPO_URL = "https://github.com/foxted/rsc-boundary";
const GITHUB_REPO_API_URL = "https://api.github.com/repos/foxted/rsc-boundary";

interface GitHubRepoResponse {
  stargazers_count?: number;
}

interface GitHubRepoLinkProps {
  location: "header" | "footer";
}

function isGitHubStarsEnabled() {
  const value = process.env.NEXT_PUBLIC_GITHUB_STARS_ENABLED;

  return value === "true" || value === "1";
}

async function getGitHubStarsCount(showStars: boolean) {
  if (!showStars) {
    return 0;
  }

  try {
    const response = await fetch(GITHUB_REPO_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as GitHubRepoResponse;

    if (typeof data.stargazers_count !== "number") {
      return 0;
    }

    return data.stargazers_count;
  } catch (error) {
    after(() => {
      const posthog = getPostHogServer();
      posthog?.captureException(error);
    });
    return 0;
  }
}

export async function GitHubRepoLink({ location }: GitHubRepoLinkProps) {
  const showGitHubStars = isGitHubStarsEnabled();
  const starsCount = await getGitHubStarsCount(showGitHubStars);
  const isHeader = location === "header";

  return (
    <GitHubRepoLinkClient
      href={GITHUB_REPO_URL}
      location={location}
      className={
        isHeader
          ? `inline-flex h-8 items-center justify-center rounded-md text-muted transition hover:text-foreground ${
              showGitHubStars ? "gap-1.5 px-2" : "w-8"
            }`
          : `inline-flex h-5 items-center justify-center text-muted transition hover:text-foreground ${
              showGitHubStars ? "gap-1 px-0.5" : "w-5"
            }`
      }
    >
      {showGitHubStars ? (
        <span
          className={
            isHeader
              ? "text-xs font-medium tabular-nums text-foreground"
              : "text-xs tabular-nums text-foreground"
          }
        >
          {starsCount}
        </span>
      ) : null}
    </GitHubRepoLinkClient>
  );
}
