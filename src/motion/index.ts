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

// Interaction motion — pointer springs (framer) + click feedback.
export { Magnetic, Dock, DockItem, CardStack, Ripple } from "./interactive";
export type { MagneticProps, DockProps, DockItemProps, CardStackProps, RippleProps } from "./interactive";

// Text motion — framer-free; pair with "@asbirtech/asbir-ui/motion.css".
export {
  Typewriter,
  CountUp,
  TextReveal,
  ShinyText,
  GradientText,
  ScrambleText,
  WaveText,
  FlipWords,
  NumberTicker,
} from "./text";
export type {
  TypewriterProps,
  CountUpProps,
  TextRevealProps,
  ShinyTextProps,
  GradientTextProps,
  ScrambleTextProps,
  WaveTextProps,
  FlipWordsProps,
  NumberTickerProps,
} from "./text";

// Chart motion — framer-free in-view reveals for data viz.
export { BarsReveal, RadialProgress } from "./charts";
export type { BarsRevealProps, RadialProgressProps } from "./charts";

// Ambient / decorative motion — framer-free.
export {
  BorderBeam,
  Meteors,
  Aurora,
  GradientBlob,
  PulseBeacon,
  Orbit,
  Equalizer,
  HoverFlip,
} from "./decor";
export type {
  BorderBeamProps,
  MeteorsProps,
  AuroraProps,
  GradientBlobProps,
  PulseBeaconProps,
  OrbitProps,
  EqualizerProps,
  HoverFlipProps,
} from "./decor";

// Canvas motion — drifting particle fields + click confetti.
export { Particles, Confetti } from "./particles";
export type { ParticlesProps, ConfettiProps } from "./particles";

// Looping strips — framer-free; pair with "@asbirtech/asbir-ui/motion.css".
export { Marquee } from "./marquee";
export type { MarqueeProps } from "./marquee";

// Re-export the framer primitives adopters most often reach for, so they can
// build custom motion without adding framer-motion to their own import graph
// separately (it's already their peer dep once they use this entry).
export { motion, AnimatePresence, useReducedMotion } from "framer-motion";
