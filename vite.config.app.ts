import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * App build config — bundles the `src/dev` playground (index.html +
 * src/dev/main.tsx) into a browsable static site for deployment (Vercel).
 *
 * This is deliberately separate from vite.config.ts, which builds the
 * publishable npm LIBRARY (dist/asbir-ui.js) and has no index.html output.
 * Deploying the library artifact is what caused the "visiting the URL just
 * downloads a file" bug — a static host had no HTML page to serve.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist-app",
    emptyOutDir: true,
  },
});
