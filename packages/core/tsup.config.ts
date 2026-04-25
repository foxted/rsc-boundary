import { readFileSync, writeFileSync, existsSync } from "fs";
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    target: "es2022",
    dts: true,
    sourcemap: true,
    splitting: false,
    clean: true,
    treeshake: true,
    esbuildPlugins: [
      {
        name: "external-rsc-devtools",
        setup(build) {
          build.onResolve({ filter: /rsc-devtools/ }, () => ({
            path: "./components/rsc-devtools.js",
            external: true,
          }));
        },
      },
    ],
  },
  {
    entry: { "components/rsc-devtools": "src/components/rsc-devtools.tsx" },
    format: ["esm"],
    target: "es2022",
    dts: true,
    sourcemap: true,
    splitting: false,
    clean: false,
    treeshake: true,
    esbuildPlugins: [
      {
        name: "strip-use-client",
        setup(build) {
          build.onLoad({ filter: /rsc-devtools\.tsx$/ }, (args) => ({
            contents: readFileSync(args.path, "utf8").replace(
              /^\s*["']use client["'];?\s*\n?/,
              "",
            ),
            loader: "tsx",
          }));
        },
      },
    ],
    plugins: [
      {
        name: "inject-use-client",
        buildEnd() {
          const outFile = "dist/components/rsc-devtools.js";
          if (!existsSync(outFile)) return;
          const content = readFileSync(outFile, "utf8");
          if (!content.startsWith('"use client"')) {
            writeFileSync(outFile, `"use client";\n${content}`);
          }
        },
      },
    ],
  },
]);
