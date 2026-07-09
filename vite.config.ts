import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/*
  Multi-entry library build.

  - "."        (src/index.ts)        → core: components, cn, tokens. framer-free.
  - "./motion" (src/motion/index.ts) → JS motion layer. framer-motion externalized.
  - "./preset" (src/preset.ts)       → the shareable Tailwind preset (tokens).

  framer-motion is `external` everywhere, so it never lands in the core bundle
  and is treated as a peer for the motion bundle (consumers bring their own).
  Types are emitted per-file (rollupTypes off) so "./dist/motion/index.d.ts"
  resolves for the "./motion" subpath export.
*/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], exclude: ["src/dev"], rollupTypes: false }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        "asbir-ui": resolve(__dirname, "src/index.ts"),
        motion: resolve(__dirname, "src/motion/index.ts"),
        preset: resolve(__dirname, "src/preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "framer-motion", "tailwindcss"],
      output: {
        // per-entry CSS: core → style.css (historical name), motion → motion.css
        assetFileNames: (asset) => {
          const names = asset.names ?? (asset.name ? [asset.name] : []);
          if (names.some((n) => n.includes("motion"))) return "motion.css";
          return "style.css";
        },
      },
    },
  },
});
