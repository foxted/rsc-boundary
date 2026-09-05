export function register() {
  // Client PostHog is initialized in instrumentation-client.ts.
}

function distinctIdFromCookie(cookieHeader: string | string[] | undefined) {
  if (!cookieHeader) {
    return undefined;
  }

  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join("; ")
    : cookieHeader;
  const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);

  if (!match?.[1]) {
    return undefined;
  }

  try {
    const postHogData: unknown = JSON.parse(decodeURIComponent(match[1]));

    if (
      typeof postHogData === "object" &&
      postHogData !== null &&
      "distinct_id" in postHogData &&
      typeof postHogData.distinct_id === "string"
    ) {
      return postHogData.distinct_id;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export const onRequestError = async (
  err: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { cookie?: string | string[] };
  },
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { getPostHogServer } = await import("./lib/posthog-server");
  const posthog = getPostHogServer();

  if (!posthog) {
    return;
  }

  await posthog.captureException(err, distinctIdFromCookie(request.headers.cookie), {
    path: request.path,
    method: request.method,
  });
};
