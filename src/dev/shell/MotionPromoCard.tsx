import * as React from "react";
import { createPortal } from "react-dom";
import asbirMotionBanner from "@/assets/backdrops/asbirmotion.png";

/*
  Asbir Motion promo card. One card, two presentations:

    • variant="static"   — sits in the docs right-aside on desktop (no dismiss).
    • variant="floating" — a fixed, dismissible card (X top-right + Close
                           button, HeroUI-style). Used as the mobile form of the
                           docs aside AND as a bottom-left promo on the homepage.

  Dismissing a floating card only hides it for the current page view (in-memory
  state) — a reload or returning to the page re-shows it. This is intentional:
  it's a promo, not a one-time notice, so it should greet each fresh visit.
*/

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CloseIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/** The card body — banner + copy + CTA. `onDismiss` (floating only) renders the
    top-right X and the Close button. */
function CardBody({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-panel shadow-lg">
      {/* banner: Asbir Motion artwork */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-overlay/[0.06]">
        <img src={asbirMotionBanner} alt="Asbir Motion" className="h-full w-full object-cover" />
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="absolute right-2.5 top-2.5 text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-colors hover:text-white"
          >
            {CloseIcon}
          </button>
        )}
      </div>

      {/* content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-fg">Introducing Asbir Motion</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-fg/55">
          AsbirMotion is an internal animation library built to pair with AsbirUI, delivering smooth, high-performance microinteractions &amp; animations for React, JavaScript, and Vue.
        </p>
        <div className="mt-3.5 flex items-center gap-2">
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-asbir border border-border px-3 py-2 text-xs font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
            >
              Close
            </button>
          )}
          <a
            href="#motion"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-asbir bg-solid px-3 py-2 text-xs font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            Explore Asbir Motion
            <span>{ArrowIcon}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** Static card for the desktop docs aside. */
export function MotionPromoStatic() {
  return <CardBody />;
}

export interface MotionPromoFloatingProps {
  /** Identity for this card (kept for API stability / future per-key logic).
      Dismissal is in-memory only, so the card re-shows on every fresh visit. */
  dismissKey: string;
  /** Which corner to anchor to. */
  corner?: "bottom-left" | "bottom-right";
  /** Extra responsive visibility classes (e.g. show only below xl). */
  className?: string;
  /** Wait this many ms after mount before the card flies in — lets the page
      settle first so the entrance reads as an intentional beat, not a jump. */
  delayMs?: number;
}

/** Fixed, dismissible floating card (mobile docs form + homepage promo). */
export function MotionPromoFloating({
  dismissKey,
  corner = "bottom-left",
  className = "",
  delayMs = 900,
}: MotionPromoFloatingProps) {
  // `mounted` keeps the card in the DOM; `closing` plays the outro before it
  // actually unmounts (a hard `return null` would kill the exit animation).
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    // Dismissal is in-memory only (see note on `dismissKey`), so every fresh
    // page load / return to the page re-shows the card. Hold it out of the DOM
    // for `delayMs` so the page settles first; mounting triggers the entrance.
    const t = window.setTimeout(() => setMounted(true), delayMs);
    return () => window.clearTimeout(t);
  }, [dismissKey, delayMs]);

  const dismiss = () => {
    setClosing(true);
    // unmount after the outro finishes (matches promo-out duration)
    window.setTimeout(() => setMounted(false), 240);
  };

  if (!mounted) return null;

  const anim = closing
    ? "motion-safe:animate-promo-out"
    : "motion-safe:animate-promo-in";

  // Clamp the card near the centered content instead of the raw viewport edge:
  // past ~1440px wide, the layout stops growing and the card would otherwise
  // drift into the empty gutter on a 2K/4K monitor. `max(1rem, …)` keeps the
  // normal 1rem inset on typical screens but, once the viewport exceeds the
  // content width, tracks inward so the card hugs the content column.
  const CONTENT_HALF = "980px"; // pushes the card further toward the edge
  const edge =
    corner === "bottom-right"
      ? { right: `max(1rem, calc(50vw - ${CONTENT_HALF} + 1rem))` }
      : { left: `max(1rem, calc(50vw - ${CONTENT_HALF} + 1rem))` };

  // Portalled to <body> so `position: fixed` anchors to the VIEWPORT, not a
  // transformed ancestor (the homepage/docs containers keep a `transform` from
  // their fade-up animation, which would otherwise trap the fixed card).
  return createPortal(
    <div
      className={`fixed bottom-4 z-40 w-[min(20rem,calc(100vw-2rem))] ${anim} ${className}`}
      style={edge}
    >
      <CardBody onDismiss={dismiss} />
    </div>,
    document.body
  );
}
