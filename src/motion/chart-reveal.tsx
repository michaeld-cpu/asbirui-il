import * as React from "react";

/*
  ChartReveal — an entrance animation for SVG charts (the Lumina AI overview
  graphs are the reference). Wrap any SVG chart; on scroll-into-view it:

    • draws every stroked <path>/<line>/<polyline> left-to-right
      (stroke-dashoffset from full length → 0), and
    • fades the filled areas up underneath as the line completes.

  Reusable by design — it inspects the SVG at runtime, so it works with ANY
  chart markup (area, line, sparkline), not just AsbirUI's. Framer-free: the
  animation is pure CSS (see motion.css / the .asbir-chart-reveal rules); this
  component only measures path lengths and flips the "play" state on view.

  Honors prefers-reduced-motion (renders final state, no drawing).

    import { ChartReveal } from "@asbirtech/asbir-ui/motion";
    import "@asbirtech/asbir-ui/motion.css";

    <ChartReveal>
      <svg>…your chart paths…</svg>
    </ChartReveal>
*/

export interface ChartRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds the line-draw runs. Default 1.1. */
  duration?: number;
  /** Seconds to delay before drawing. Default 0. */
  delay?: number;
  /** Replay every time it re-enters the viewport, or just once (default). */
  once?: boolean;
  /** Fraction visible before it plays (0–1). Default 0.3. */
  amount?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function ChartReveal({
  duration = 1.1,
  delay = 0,
  once = true,
  amount = 0.3,
  children,
  style,
  className = "",
  ...rest
}: ChartRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [play, setPlay] = React.useState(false);

  // Prime each stroked path with its own length so the CSS draw (dashoffset →
  // 0) starts fully "undrawn". Fills get a marker class the CSS fades in.
  const prime = React.useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const strokes = root.querySelectorAll<SVGGeometryElement>(
      "path, line, polyline"
    );
    strokes.forEach((el) => {
      // idempotent — skip anything already tagged (the MutationObserver may
      // re-run prime() after a chart re-render; only fresh nodes need tagging)
      if (el.dataset.asbirDraw !== undefined || el.dataset.asbirFill !== undefined) return;
      const s = getComputedStyle(el);
      const hasStroke = s.stroke && s.stroke !== "none";
      const isFilledArea = s.fill && s.fill !== "none";
      if (hasStroke && !isFilledArea) {
        const len = el.getTotalLength?.() ?? 0;
        if (len > 0) {
          el.style.setProperty("--asbir-len", `${len}`);
          el.dataset.asbirDraw = "";
        }
      } else if (isFilledArea) {
        el.dataset.asbirFill = "";
      }
    });
  }, []);

  // Prime BEFORE first paint (layout effect) so the paths are already tagged
  // + un-drawn on the very first frame — otherwise a fast refresh could let the
  // IntersectionObserver flip to "play" and reveal a fully-drawn chart for one
  // frame before priming ran (the intermittent right-edge flash).
  React.useLayoutEffect(() => {
    prime();
  }, [prime]);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      setPlay(true); // render final state, no drawing (CSS skips animation)
      return;
    }

    // Re-prime whenever the chart's SVG re-renders (hover/data changes drop the
    // imperatively-set attributes; the MutationObserver re-applies them).
    const mo = new MutationObserver(() => prime());
    mo.observe(root, { childList: true, subtree: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // ensure paths are primed before revealing (guards the case where
            // this fires before the layout-effect prime on some engines)
            prime();
            setPlay(true);
            if (once) io.disconnect();
          } else if (!once) {
            setPlay(false);
          }
        }
      },
      { threshold: amount }
    );
    io.observe(root);
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [prime, once, amount]);

  return (
    <div
      ref={ref}
      data-asbir-chart-reveal={play ? "play" : "idle"}
      className={`asbir-chart-reveal ${className}`}
      style={
        {
          "--asbir-draw-duration": `${duration}s`,
          "--asbir-draw-delay": `${delay}s`,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
}
