import { highlightCodeThemedPair } from "../lib/highlight-code";
import { PackageInstallClient } from "./package-install-client";

interface PackageInstallProps {
  packageName?: string;
  /** When true, omit outer border and radius (e.g. inside FrameworkTabs). */
  embedded?: boolean;
}

export async function PackageInstall({
  packageName = "@rsc-boundary/next",
  embedded = false,
}: PackageInstallProps) {
  const commands = {
    pnpm: `pnpm add ${packageName}`,
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    bun: `bun add ${packageName}`,
  } as const;

  const [pnpm, npm, yarn, bun] = await Promise.all([
    highlightCodeThemedPair(commands.pnpm, "bash"),
    highlightCodeThemedPair(commands.npm, "bash"),
    highlightCodeThemedPair(commands.yarn, "bash"),
    highlightCodeThemedPair(commands.bun, "bash"),
  ]);

  return (
    <PackageInstallClient
      commands={commands}
      embedded={embedded}
      html={{
        pnpm,
        npm,
        yarn,
        bun,
      }}
    />
  );
}
