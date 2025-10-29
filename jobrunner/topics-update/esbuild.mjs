import * as esbuild from "esbuild";
import fs from "fs/promises";

try {
  const distFolder = await fs.lstat("./dist/");

  if (distFolder.isDirectory() || distFolder.isFile()) {
    await fs.rm("./dist", { recursive: true });
  }
} catch (e) {
  // no-op
}

await esbuild.build({
  entryPoints: ["./main.js"],
  bundle: true,
  treeShaking: true,
  outfile: "dist/main.js",
  format: "cjs",
  platform: "node",
  target: "node20",
});

await fs.cp("./manifest.json", "dist/manifest.json");
