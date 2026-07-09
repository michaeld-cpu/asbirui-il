#!/usr/bin/env node
/*
  Build the standalone motion CSS layer (src/motion/styles.css → dist/motion.css).

  Kept separate from the Vite JS build on purpose: this file is pure CSS with
  no JS entry importing it, so bundling it through a JS chunk would either drop
  it or wrongly couple it to the JS runtime. We run it through the project's
  own PostCSS pipeline (autoprefixer) so it gets the same vendor-prefixing as
  the core stylesheet, then write it to dist/.
*/
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const src = join(root, "src/motion/styles.css");
const outDir = join(root, "dist");
const out = join(outDir, "motion.css");

const css = readFileSync(src, "utf8");
const result = await postcss([autoprefixer]).process(css, { from: src, to: out });

mkdirSync(outDir, { recursive: true });
writeFileSync(out, result.css);
console.log(`✓ motion.css → ${result.css.length} bytes`);
