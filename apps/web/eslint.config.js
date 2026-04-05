import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      // False positives for intentional client-only hydration / IO sync (theme, scroll spy).
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
