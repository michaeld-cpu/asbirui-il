#!/usr/bin/env node
/*
  Architecture guard: the core package must never import the motion layer.

  Motion (src/motion/**) may import from core (../lib, ../components, …), but
  NOT the reverse — otherwise the framer-motion runtime would leak into the
  core bundle and break its "framer-free, tree-shakeable" promise.

  This runs in prepublishOnly. It's a deliberately dependency-free scan (no
  ESLint required) so the boundary is enforced even before a linter is set up.
*/
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(root, "src");
const MOTION_DIR = join(SRC, "motion");
const DEV_DIR = join(SRC, "dev");

/** Recursively collect .ts/.tsx files under a dir. */
function collect(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      collect(full, out);
    } else if (/\.tsx?$/.test(full)) {
      out.push(full);
    }
  }
  return out;
}

// Core files = everything under src/ EXCEPT the motion layer and the dev shell
// (dev is a demo app, not part of the published core, so it may use motion).
const coreFiles = collect(SRC).filter(
  (f) => !f.startsWith(MOTION_DIR) && !f.startsWith(DEV_DIR),
);

const importRe = /\bfrom\s+["']([^"']+)["']|\bimport\s+["']([^"']+)["']/g;
const violations = [];

for (const file of coreFiles) {
  const code = readFileSync(file, "utf8");
  let m;
  while ((m = importRe.exec(code)) !== null) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    const isMotion =
      spec === "framer-motion" ||
      /(^|\/)motion(\/|$)/.test(spec); // ./motion, ../motion, @/motion, …
    if (isMotion) {
      violations.push(`  ${relative(root, file)} → imports "${spec}"`);
    }
  }
}

if (violations.length > 0) {
  console.error(
    "\nx  Boundary violation: core must not import the motion layer / framer-motion.\n",
  );
  console.error(violations.join("\n"));
  console.error(
    "\nMove motion-dependent code into src/motion/, or import it from the " +
      '"@asbirtech/asbir-ui/motion" entry instead.\n',
  );
  process.exit(1);
}

console.log("✓ boundaries ok — core is free of motion/framer imports");
