/*
  Asbir UI — motion (JS layer)
  ------------------------------------------------------------------
  React motion components built on framer-motion. Opt-in subpath export so the
  framer runtime is NEVER pulled into consumers of the core package:

      import { Reveal, Stagger, StaggerItem } from "@asbirtech/asbir-ui/motion";

  `framer-motion` is an OPTIONAL peer dependency — install it only if you use
  this entry:

      npm install framer-motion

  For the zero-runtime CSS microinteractions, import "@asbirtech/asbir-ui/motion.css"
  instead (no framer needed).
*/

export { Reveal, Stagger, StaggerItem } from "./reveal";
export type {
  RevealProps,
  RevealDirection,
  StaggerProps,
  StaggerItemProps,
} from "./reveal";

// Chart entrance — draws stroked paths + fades area fills. Framer-free (pure
// CSS + IntersectionObserver); pair with "@asbirtech/asbir-ui/motion.css".
export { ChartReveal } from "./chart-reveal";
export type { ChartRevealProps } from "./chart-reveal";

// Re-export the framer primitives adopters most often reach for, so they can
// build custom motion without adding framer-motion to their own import graph
// separately (it's already their peer dep once they use this entry).
export { motion, AnimatePresence, useReducedMotion } from "framer-motion";
