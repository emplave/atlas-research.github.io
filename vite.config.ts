import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync, rmSync, statSync } from "node:fs";
import path from "path";

/**
 * Strip macOS junk from the build output.
 *
 * Vite copies `public/` into `dist/` VERBATIM and offers no ignore list, so
 * `public/.DS_Store` was being published — it is in .gitignore, which is exactly
 * why it went unnoticed: `git status` never mentions it, but the file is on disk
 * and the copy step does not consult .gitignore.
 *
 * Deleting the file is not a fix on its own. Finder recreates .DS_Store the next
 * time anyone opens the folder, so without this the leak returns on the next
 * build. This runs after the bundle is written and removes them from the output
 * rather than from the source, which is the only place it matters.
 *
 * .DS_Store leaks directory metadata — including names of files since deleted.
 */
function stripDsStore(): Plugin {
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (entry === ".DS_Store") {
        rmSync(full, { force: true });
        continue;
      }
      if (statSync(full).isDirectory()) walk(full);
    }
  };

  return {
    name: "strip-ds-store",
    apply: "build",
    closeBundle() {
      const out = path.resolve(__dirname, "dist");
      try {
        walk(out);
      } catch {
        // No dist, or it vanished mid-build. Nothing to clean, nothing to report.
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), stripDsStore()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
