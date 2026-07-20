import * as React from "react";
import { createPortal } from "react-dom";
import asbirMotionBanner from "@/assets/backdrops/asbirmotion.png";
import asbirWebSlats from "@/assets/backdrops/asbirweb-slats.png";
import asbirTechLogo from "@/assets/logo/asbirtech-logo.png";

/* SINGLE SOURCE OF TRUTH for the promo-card banner size. Keyed to the Asbir
   Motion banner (asbirmotion.png, 272×153) as the reference — every card's
   banner box uses this exact aspect, so the box height and the body below it
   line up identically across all cards regardless of the artwork inside. Any
   banner art just fills this box with object-cover; no per-card sizing. */
const BANNER_ASPECT = "272 / 153";

/* Promo banner for the AsbirTech website card — the website hero's EXACT
   gradient-slats backdrop (a static render of the real WebGL `GradientBlinds`
   shader) with the real AsbirTech logo (icon + wordmark) centered. Fills the
   shared banner box; no bespoke scaling. */
const AsbirWebBanner = () => (
  <div className="relative h-full w-full overflow-hidden bg-black">
    <img src={asbirWebSlats} alt="" aria-hidden="true" className="h-full w-full object-cover" />
    <div className="absolute inset-0 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
      <img src={asbirTechLogo} alt="AsbirTech" className="h-auto w-[52%] max-w-[150px]" />
    </div>
  </div>
);

/*
  Asbir promo card. One card body, two presentations:

    • variant="static"   — sits in the docs right-aside on desktop (no dismiss).
    • variant="floating" — a fixed, dismissible card (X top-right + Close
                           button, HeroUI-style). Used as the mobile form of the
                           docs aside AND as a bottom-left promo on the homepage.

  The floating card CYCLES: closing the first promo (Asbir Motion) doesn't
  unmount it — it slides out, then the next card (the new AsbirTech website
  announcement) slides in. Closing the last card dismisses for real.

  Dismissal is in-memory only — a reload or returning to the page restarts the
  cycle from card one. It's a promo, not a one-time notice, so it greets each
  fresh visit.
*/

/** A single promo card's content. `banner` is either an image URL or a JSX
    element rendered as the banner (for the inline gradient-slat banner). */
interface PromoContent {
  banner: string | React.ReactNode;
  bannerAlt: string;
  title: string;
  body: React.ReactNode;
  cta: string;
  href: string;
  /** external links open in a new tab. */
  external?: boolean;
}

/** The promo cycle, in order. Close card N → card N+1 flies in; close the last
    → dismissed. Add/remove entries here to change the sequence. */
const PROMOS: PromoContent[] = [
  {
    banner: asbirMotionBanner,
    bannerAlt: "Asbir Motion",
    title: "Introducing Asbir Motion",
    body: "AsbirMotion is an internal animation library built to pair with AsbirUI, delivering smooth, high-performance microinteractions & animations for React, JavaScript, and Vue.",
    cta: "Explore Asbir Motion",
    href: "#motion",
  },
  {
    banner: <AsbirWebBanner />,
    bannerAlt: "AsbirTech — Modern Problems Require Modern Solutions",
    title: "Introducing the new asbir.tech",
    body: "Our website has been fully redesigned — a clearer, faster look at who we are, the products we build, and the teams we work with. Modern problems require modern solutions.",
    cta: "Visit the new site",
    href: "https://asbir.tech",
    external: true,
  },
];

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

/** The card body — banner + copy + CTA, driven by `content`. `onDismiss`
    (floating only) renders the top-right X and the Close button. The Close
    label reflects whether another card follows in the cycle. */
function CardBody({
  content,
  onDismiss,
  closeLabel = "Close",
}: {
  content: PromoContent;
  onDismiss?: () => void;
  closeLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-panel shadow-lg">
      {/* banner artwork — image URL or an inline JSX banner. The box aspect is
          the single source of truth (BANNER_ASPECT), so every card's banner is
          the same size and the body below always starts at the same point. */}
      <div
        className="relative w-full overflow-hidden bg-overlay/[0.06]"
        style={{ aspectRatio: BANNER_ASPECT }}
      >
        {typeof content.banner === "string" ? (
          <img src={content.banner} alt={content.bannerAlt} className="h-full w-full object-cover" />
        ) : (
          content.banner
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={closeLabel}
            className="absolute right-2.5 top-2.5 text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-colors hover:text-white"
          >
            {CloseIcon}
          </button>
        )}
      </div>

      {/* content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-fg">{content.title}</h3>
        {/* min-height reserves enough for the longest card's copy (~5 lines) so
            shorter-copy cards keep the same overall height (uniform card). */}
        <p className="mt-1.5 min-h-[5.5rem] text-xs leading-relaxed text-fg/55">{content.body}</p>
        <div className="mt-3.5 flex items-center gap-2">
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-asbir border border-border px-3 py-2 text-xs font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
            >
              {closeLabel}
            </button>
          )}
          <a
            href={content.href}
            {...(content.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-asbir bg-solid px-3 py-2 text-xs font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            {content.cta}
            <span>{ArrowIcon}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** Static card for the desktop docs aside — shows the first promo, no cycle. */
export function MotionPromoStatic() {
  return <CardBody content={PROMOS[0]} />;
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
  // `mounted` keeps the card in the DOM; `closing` plays the outro before the
  // card either advances to the next promo or unmounts (a hard `return null`
  // would kill the exit animation). `step` is the index into PROMOS.
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    // Dismissal is in-memory only (see note on `dismissKey`), so every fresh
    // page load / return to the page restarts the cycle. Hold it out of the DOM
    // for `delayMs` so the page settles first; mounting triggers the entrance.
    const t = window.setTimeout(() => setMounted(true), delayMs);
    return () => window.clearTimeout(t);
  }, [dismissKey, delayMs]);

  // Close the current card. If another promo follows, slide it out then swap in
  // the next one; otherwise unmount for good.
  const dismiss = () => {
    setClosing(true);
    const hasNext = step < PROMOS.length - 1;
    window.setTimeout(() => {
      if (hasNext) {
        setStep((s) => s + 1);
        setClosing(false); // next card plays its intro
      } else {
        setMounted(false);
      }
    }, 240); // matches promo-out duration
  };

  if (!mounted) return null;

  const content = PROMOS[step];
  const closeLabel = step < PROMOS.length - 1 ? "Next" : "Close";

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
      // key by step so React remounts on swap → the intro animation replays
      key={step}
      className={`fixed bottom-4 z-40 w-[min(20rem,calc(100vw-2rem))] ${anim} ${className}`}
      style={edge}
    >
      <CardBody content={content} onDismiss={dismiss} closeLabel={closeLabel} />
    </div>,
    document.body
  );
}
