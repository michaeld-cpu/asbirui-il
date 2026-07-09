import type { Config } from "tailwindcss";
import { asbirPreset } from "./src/preset";

/*
  This repo's own Tailwind config just extends the shared AsbirUI preset — the
  single source of truth for tokens/animations lives in src/preset.ts (which is
  also what consuming apps import via "@asbirtech/asbir-ui/preset"). Keeping the
  dev app on the same preset guarantees the docs render exactly what ships.
*/
const config: Config = {
  presets: [asbirPreset],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  plugins: [],
};

export default config;
