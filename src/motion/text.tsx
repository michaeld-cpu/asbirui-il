import * as React from "react";
import { cn } from "../lib/cn";

/*
  Text motion (framer-free — timers, rAF, and the motion.css keyframes):

    <Typewriter words={["components", "templates", "dashboards"]} />
    <CountUp to={1248930} />
    <TextReveal text="Motion that ships with the system" />
    <ShinyText>Introducing AsbirMotion</ShinyText>

  Everything resolves to a readable static state under
  prefers-reduced-motion.
*/

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useInView<T extends Element>(once: boolean): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView];
}

/* ---- Typewriter ---------------------------------------------------------- */

export interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  /** ms per typed character. Default 70. */
  typeMs?: number;
  /** ms per deleted character. Default 45. */
  deleteMs?: number;
  /** ms a completed word holds before deleting. Default 1500. */
  holdMs?: number;
  /** Show the blinking caret. Default true. */
  cursor?: boolean;
}

/**
 * Typewriter — types each word, holds, deletes, and moves to the next in a
 * loop. Reduced motion renders the first word statically.
 */
export function Typewriter({
  words,
  typeMs = 70,
  deleteMs = 45,
  holdMs = 1500,
  cursor = true,
  className,
  ...rest
}: TypewriterProps) {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = React.useState("");
  const [wordIdx, setWordIdx] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (reduced || words.length === 0) return;
    const full = words[wordIdx % words.length];
    let delay: number;
    let next: () => void;

    if (!deleting) {
      if (text.length < full.length) {
        delay = typeMs;
        next = () => setText(full.slice(0, text.length + 1));
      } else {
        delay = holdMs;
        next = () => setDeleting(true);
      }
    } else if (text.length > 0) {
      delay = deleteMs;
      next = () => setText(text.slice(0, -1));
    } else {
      delay = typeMs;
      next = () => {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      };
    }

    const t = window.setTimeout(next, delay);
    return () => window.clearTimeout(t);
  }, [reduced, words, wordIdx, text, deleting, typeMs, deleteMs, holdMs]);

  return (
    <span className={className} aria-label={words.join(", ")} {...rest}>
      <span aria-hidden="true">{reduced ? words[0] ?? "" : text}</span>
      {cursor && !reduced && (
        <span aria-hidden="true" className="as-caret select-none">
          |
        </span>
      )}
    </span>
  );
}

/* ---- CountUp -------------------------------------------------------------- */

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  to: number;
  from?: number;
  /** Seconds the count runs. Default 1.4. */
  duration?: number;
  /** Formatter for the displayed value. Default toLocaleString. */
  format?: (n: number) => string;
  /** Count once (default) or every time it re-enters the viewport. */
  once?: boolean;
}

/**
 * CountUp — eases a number from `from` to `to` when it scrolls into view.
 * Reduced motion shows the final value immediately.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  format = (n) => n.toLocaleString(),
  once = true,
  className,
  ...rest
}: CountUpProps) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>(once);
  const [value, setValue] = React.useState(from);

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, from, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...rest}>
      {format(Math.round(value))}
    </span>
  );
}

/* ---- TextReveal ------------------------------------------------------------ */

export interface TextRevealProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  /** Seconds between each word's entrance. Default 0.05. */
  stagger?: number;
  /** Reveal once (default) or every time it re-enters the viewport. */
  once?: boolean;
}

/**
 * TextReveal — each word rises out of a blur, staggered left to right, when
 * the text scrolls into view. Reduced motion renders the plain text.
 */
export function TextReveal({ text, stagger = 0.05, once = true, className, ...rest }: TextRevealProps) {
  const [ref, inView] = useInView<HTMLSpanElement>(once);
  const words = text.split(/\s+/);
  return (
    <span ref={ref} data-inview={inView || undefined} className={className} {...rest}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            className="as-word"
            style={{ ["--as-word-delay" as string]: `${(i * stagger).toFixed(3)}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

/* ---- ShinyText ------------------------------------------------------------- */

export interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Seconds per sheen pass. Default 2.6. */
  speed?: number;
}

/**
 * ShinyText — a specular highlight sweeps across the text in a loop
 * (background-clip: text). Reduced motion renders normal text.
 */
export function ShinyText({ speed = 2.6, className, style, children, ...rest }: ShinyTextProps) {
  return (
    <span
      className={cn("as-shiny-text", className)}
      style={{ ["--as-shine-duration" as string]: `${speed}s`, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
