import { highlightCodeThemedPair } from "../lib/highlight-code";
import { PackageInstallClient } from "./package-install-client";

interface PackageInstallProps {
  packageName?: string;
}

export async function PackageInstall({
  packageName = "rsc-boundary",
}: PackageInstallProps) {
  const commands = {
    pnpm: `pnpm add ${packageName}`,
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
  } as const;

  const [pnpm, npm, yarn] = await Promise.all([
    highlightCodeThemedPair(commands.pnpm, "bash"),
    highlightCodeThemedPair(commands.npm, "bash"),
    highlightCodeThemedPair(commands.yarn, "bash"),
  ]);

  return (
    <PackageInstallClient
      commands={commands}
      html={{
        pnpm,
        npm,
        yarn,
      }}
    />
  );
}
