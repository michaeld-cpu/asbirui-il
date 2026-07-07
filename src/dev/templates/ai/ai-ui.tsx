/*
  Icons + data-viz primitives for the AI console. Icons are rendered elements
  (use as {Icons.x}, not <Icons.x/>). Charts are token/accent-driven SVG.
*/

import * as React from "react";

export const Icons = {
  overview: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  playground: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v2M18.4 5.6l-1.4 1.4M21 12h-2M5 12H3M7 7 5.6 5.6" /><circle cx="12" cy="14" r="6" /><path d="M9 14h6" />
    </svg>
  ),
  keys: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.5 12.5 20 3M17 6l3 3M14 9l2 2" />
    </svg>
  ),
  prompts: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  ),
  logs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  billing: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  team: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  ),
  search: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>),
  bell: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>),
  menu: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>),
  x: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>),
  plus: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>),
  chevronLeft: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>),
  chevronDown: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>),
  arrowLeft: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>),
  arrowUp: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>),
  copy: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>),
  volume: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>),
  thumbUp: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4.5-7a2 2 0 0 1 2.6 2.6L13 8h5.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 19H7" /></svg>),
  thumbDown: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3Zm0 0-4.5 7a2 2 0 0 1-2.6-2.6L11 16H5.5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 7 5h10" /></svg>),
  regenerate: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /></svg>),
  trash: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>),
  sun: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></svg>),
  moon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>),
  sparkle: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.65 5.06 3.44 7.85 8.5 8.5-5.06.65-7.85 3.44-8.5 8.5-.65-5.06-3.44-7.85-8.5-8.5C8.56 9.85 11.35 7.06 12 2Zm7 11.5c.33 2.53 1.72 3.92 4.25 4.25-2.53.33-3.92 1.72-4.25 4.25-.33-2.53-1.72-3.92-4.25-4.25 2.53-.33 3.92-1.72 4.25-4.25Z"/></svg>),
  star: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5 9 8.9 12 2Z" /></svg>),
  starOff: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 2.9 5.9 6.1.5-4.6 4 1.4 6-5.8-3.5L6.2 19l1.4-6-4.6-4 6.1-.5L12 3Z" /></svg>),
  check: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>),
  inbox: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" /></svg>),
  alert: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>),
  send: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>),
  arrowUpRight: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>),
  filter: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2" /></svg>),
  logo: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z" /></svg>),
  paperclip: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.4 11.05 12.25 20.2a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 1 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" /></svg>),
  book: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>),
  mic: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" /></svg>),
  wand: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 4 5 5L9 20l-5-5L15 4ZM18 2l.7 1.8L20.5 4.5 18.7 5.2 18 7l-.7-1.8L15.5 4.5 17.3 3.8 18 2ZM5 13l.6 1.6L7.2 15l-1.6.6L5 17.2 4.4 15.6 2.8 15l1.6-.4L5 13Z" /></svg>),
};

/* Real provider logos (Simple Icons SVGs vendored into src/assets/providers).
   Rendered as CSS masks so they inherit the current text color and stay
   legible in both themes. */
import openaiLogo from "@/assets/providers/openai.svg";
import anthropicLogo from "@/assets/providers/anthropic.svg";
import claudeLogo from "@/assets/providers/claude.svg";
import geminiLogo from "@/assets/providers/googlegemini.svg";
import mistralLogo from "@/assets/providers/mistral.svg";
import metaLogo from "@/assets/providers/meta.svg";
import xaiLogo from "@/assets/providers/x.svg";
import googleGImg from "@/assets/providers/google-g.png";
import geminiColorImg from "@/assets/providers/gemini-color.png";

const providerLogoUrls: Record<string, string> = {
  openai: openaiLogo,
  anthropic: anthropicLogo,
  google: geminiLogo,
  mistral: mistralLogo,
  meta: metaLogo,
  xai: xaiLogo,
};

/* model marks use the product logo where it differs from the company mark —
   Anthropic models show the Claude starburst, the agent keeps the Anthropic A */
const modelLogoUrls: Record<string, string> = {
  ...providerLogoUrls,
  anthropic: claudeLogo,
};

/* real brand colors for the circular logo chips */
export const providerBrandColors: Record<string, string> = {
  openai: "#10A37F",
  anthropic: "#000000",
  google: "#5684D1",
  mistral: "#FA520F",
  meta: "#0467DF",
  xai: "#000000",
};

/* full-color official artwork rendered as-is on a white chip (not masked) —
   Google's multicolor G for the provider, the multicolor Gemini sparkle for models */
const providerColorImages: Record<"provider" | "model", Record<string, string>> = {
  provider: { google: googleGImg },
  model: { google: geminiColorImg },
};

export function ProviderLogo({
  provider,
  className = "h-4 w-4",
  kind = "provider",
}: {
  provider: string;
  className?: string;
  /* "model" swaps in the product logo (e.g. Claude) where it differs */
  kind?: "provider" | "model";
}) {
  const url = (kind === "model" ? modelLogoUrls : providerLogoUrls)[provider];
  if (!url) return null;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/* circular chip filled with the provider's real brand color, white logo inside */
export function ProviderBadge({
  provider,
  className = "h-8 w-8",
  logoClassName = "h-4 w-4",
  kind = "provider",
}: {
  provider: string;
  className?: string;
  logoClassName?: string;
  kind?: "provider" | "model";
}) {
  // full-color official artwork sits on a white chip, un-masked
  const colorImg = providerColorImages[kind][provider];
  if (colorImg) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-black/10 ${className}`}
      >
        <img src={colorImg} alt="" aria-hidden="true" className={logoClassName} />
      </span>
    );
  }
  // Claude model chips keep the terracotta; the Anthropic company mark is white on black
  const brand =
    kind === "model" && provider === "anthropic"
      ? "#D97757"
      : providerBrandColors[provider] ?? "rgb(var(--fg-rgb) / 0.15)";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/15 ${className}`}
      style={{ backgroundColor: brand }}
    >
      <ProviderLogo provider={provider} kind={kind} className={logoClassName} />
    </span>
  );
}

export const ProviderMarks: Record<string, React.ReactNode> = Object.fromEntries(
  Object.keys(providerLogoUrls).map((p) => [
    p,
    <ProviderBadge key={p} provider={p} className="h-5 w-5" logoClassName="h-3 w-3" />,
  ])
);

/* same chips but with the product/model logo (Claude for Anthropic) */
export const ModelMarks: Record<string, React.ReactNode> = Object.fromEntries(
  Object.keys(providerLogoUrls).map((p) => [
    p,
    <ProviderBadge key={p} provider={p} kind="model" className="h-5 w-5" logoClassName="h-3 w-3" />,
  ])
);

/* Eased count-up for stat numbers — ramps from 0 to `value` on mount.
   Respects prefers-reduced-motion (jumps straight to the final value).
   Uses ease-out quad (not cubic) at a relaxed default duration so big numbers
   read as a smooth count rather than a fast flicker through thousands. */
export function useCountUp(target: number, duration = 1400) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 2))); // ease-out quad — gentler ramp
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function CountUp({
  value,
  format,
  duration = 1400,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const v = useCountUp(value, duration);
  return <>{format ? format(v) : Math.round(v).toLocaleString("en-US")}</>;
}

/* Thick rounded pill bars (fintech budget-strip style). Upsamples the series
   with midpoint jitter so a 14-pt series renders as ~28 pills. `color` sets
   the hue — pass a distinct color per category so the strip reads as a
   spectrum, NOT the brand color. */
export function MicroBars({
  data,
  color = "rgb(var(--fg-rgb))",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  // deterministic upsample: 2 pills per point with multi-scale variation —
  // a fast jitter plus occasional deep lows and tall spikes, so the strip
  // reads like real activity instead of a smoothed ramp
  const needles: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const a = data[i];
    const b = data[i + 1] ?? a;
    for (let k = 0; k < 2; k++) {
      const idx = i * 2 + k;
      const mid = a + (b - a) * (k / 2);
      // deterministic hash-noise in [-1, 1]
      const h = Math.sin(idx * 12.9898) * 43758.5453;
      const noise = (h - Math.floor(h)) * 2 - 1;
      let v = mid * (1 + noise * 0.35);
      if (idx % 7 === 3) v *= 0.35; // deep low
      if (idx % 11 === 5) v = Math.min(1, v * 1.6 + 0.15); // tall spike
      // floor keeps the shortest bar at least as tall as the pill is wide
      needles.push(Math.min(1, Math.max(0.14, v)));
    }
  }
  const max = Math.max(...needles, 0.0001);
  return (
    <div className={`flex items-end justify-between ${className ?? ""}`} aria-hidden="true">
      {needles.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: `${(v / max) * 100}%`,
            // base is the lightest tint of the bar's own color, deepening to
            // the full color at the tip — no foreign white in the ramp
            backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${color} 45%, transparent) 0%, color-mix(in srgb, ${color} 75%, transparent) 50%, ${color} 90%)`,
            opacity: 0.5 + (v / max) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* Halftone dot-matrix chart (fintech style) — columns of stacked dots where
   column height follows the series; dots fade toward the base so the surface
   reads as a soft halftone. Monochrome by design. */
export function HalftoneChart({
  data,
  rows = 9,
  className,
}: {
  data: number[];
  rows?: number;
  className?: string;
}) {
  // upsample ×2 with deterministic lows/highs so columns vary like real
  // traffic — some near-empty, some peaking — instead of one smooth pass
  const cols: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const a = data[i];
    const b = data[i + 1] ?? a;
    [a, (a + b) / 2].forEach((base, j) => {
      const idx = i * 2 + j;
      const h = Math.sin(idx * 78.233) * 43758.5453;
      const noise = (h - Math.floor(h)) * 2 - 1;
      let v = base * (1 + noise * 0.45);
      if (idx % 5 === 2) v *= 0.3; // low column
      if (idx % 9 === 4) v = Math.min(1, v * 1.5 + 0.2); // high column
      cols.push(Math.min(1, Math.max(0.05, v)));
    });
  }
  const max = Math.max(...cols, 0.0001);
  return (
    <div className={`flex items-end justify-between gap-1 ${className ?? ""}`} aria-hidden="true">
      {cols.map((v, ci) => {
        const lit = Math.max(1, Math.round((v / max) * rows));
        return (
          <div key={ci} className="flex flex-col-reverse items-center gap-1">
            {Array.from({ length: rows }, (_, ri) => (
              <span
                key={ri}
                className="h-1 w-1 rounded-full"
                style={{
                  backgroundColor: "rgb(var(--fg-rgb))",
                  // lit dots brighten toward the top of the column; unlit stay faint
                  opacity: ri < lit ? 0.25 + (ri / rows) * 0.75 : 0.07,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* Day labels for a daily series (chart x-axis + tooltip), derived from the
   point count so they stay aligned if the count changes. Static end date so
   the demo reads consistently; a live app would derive these from real data. */
const CHART_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function dayLabels(count: number, end = new Date(2026, 2, 6)): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (count - 1 - i));
    return `${d.getDate()} ${CHART_MONTHS[d.getMonth()]}`;
  });
}

/* Smoothed area chart (analytics style) — Catmull-Rom curve through the series
   with a gradient wash below, a hover crosshair, and a floating tooltip that
   reads out the hovered point and flags it when it's the series min/max.
   `color` sets the hue; defaults to the accent. Pass `labels` (one per point)
   to show a date in the tooltip; the x-axis shows the first/mid/last labels. */
export function AreaChart({
  data,
  color = "rgb(var(--accent))",
  labels,
  format = (v) => `${(v * 100).toFixed(1)}%`,
  className,
}: {
  data: number[];
  color?: string;
  labels?: string[];
  format?: (v: number) => string;
  className?: string;
}) {
  const uid = React.useId();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [hover, setHover] = React.useState<number | null>(null);

  // viewBox space — width scales to the point count, fixed height
  const W = 300;
  const H = 100;
  const padY = 10; // keep the curve off the top/bottom edges
  const n = data.length;
  const max = Math.max(...data, 0.0001);
  const min = Math.min(...data);
  const maxIdx = data.indexOf(max);
  const minIdx = data.indexOf(min);

  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * W);
  const y = (v: number) => H - padY - (v / max) * (H - padY * 2);
  const pts = data.map((v, i) => [x(i), y(v)] as const);

  // Catmull-Rom → cubic Bézier: a smooth curve that passes through every point
  const line = pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const p0 = pts[i - 1];
    const p2 = pts[i + 1] ?? p;
    const cp1x = p0[0] + (p[0] - (pts[i - 2] ?? p0)[0]) / 6;
    const cp1y = p0[1] + (p[1] - (pts[i - 2] ?? p0)[1]) / 6;
    const cp2x = p[0] - (p2[0] - p0[0]) / 6;
    const cp2y = p[1] - (p2[1] - p0[1]) / 6;
    return `${d} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p[0]} ${p[1]}`;
  }, "");
  const areaPath = `${line} L ${W} ${H} L 0 ${H} Z`;

  const onMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };

  const hv = hover ?? -1;
  const hx = hv >= 0 ? (hv / (n - 1)) * 100 : 0; // % across for HTML overlay
  const extreme = hv === maxIdx ? "max" : hv === minIdx ? "min" : null;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label={`Trend chart, ${n} points, peak ${format(max)}`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#area-${uid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {hv >= 0 && (
          <>
            <line x1={x(hv)} y1="0" x2={x(hv)} y2={H} stroke="rgb(var(--fg-rgb))" strokeOpacity="0.25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {/* dot: surface ring keeps it legible over the line */}
            <circle cx={x(hv)} cy={y(data[hv])} r="4.5" fill={color} stroke="rgb(var(--panel))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {/* floating tooltip — mirrors the reference: time row + value with min/max tag */}
      {hv >= 0 && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-1 rounded-lg border border-border bg-card/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur"
          style={{ left: `${Math.max(14, Math.min(86, hx))}%` }}
        >
          {labels?.[hv] && <div className="text-fg/60 dark:text-fg/50">{labels[hv]}</div>}
          <div className="flex items-center gap-1.5 font-medium text-fg">
            {format(data[hv])}
            {extreme && (
              <span className={extreme === "max" ? "text-emerald-500" : "text-amber-500"}>{extreme}.</span>
            )}
          </div>
        </div>
      )}

      {/* x-axis: first / mid / last labels */}
      {labels && labels.length >= 2 && (
        <div className="mt-1 flex justify-between text-[10px] text-fg/50 dark:text-fg/40">
          <span>{labels[0]}</span>
          <span>{labels[Math.floor((labels.length - 1) / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}

/* Round icon action button — muted or filled-accent (fintech style). */
export function RoundAction({
  children,
  variant = "muted",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "muted" | "accent" }) {
  const cls =
    variant === "accent"
      ? "ai-bg-accent text-white hover:brightness-110"
      : "bg-overlay/[0.06] text-fg/70 hover:bg-overlay/[0.12] hover:text-fg";
  return (
    <button
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${cls}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* Tiny inline sparkline for KPI tiles. */
export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const W = 100, H = 28, n = data.length;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - 2 - v * (H - 4);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={d} fill="none" stroke="rgb(var(--accent))" strokeOpacity="0.85" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
