import * as React from "react";

/*
  Templates landing page (#templates) — Tailwind-Plus-style catalogue.

  Each template is a row: a left meta column (name / kind / description / price
  + CTA) and a right strip of preview thumbnails. Templates render real, scaled
  iframes of their preview route at a few logical widths so the thumbnails are
  the ACTUAL running app.
*/

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const GitHubIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

/* ---- live preview thumbnail ------------------------------------------- */

function initialFrameTheme(): string {
  try {
    const stored = localStorage.getItem("asbir-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** A single scaled, non-interactive iframe of a preview route, rendering at a
    fixed logical `width` so the template shows its real layout at that size. */
function PreviewThumb({
  route,
  externalUrl,
  width,
  forceTheme,
  title,
  className = "",
}: {
  route: string;
  /** When set, the iframe previews this external URL (a deployed site) instead
      of an internal preview route. */
  externalUrl?: string;
  width: number;
  forceTheme?: "light" | "dark";
  title: string;
  /** aspect + sizing classes for the frame box (e.g. desktop vs phone). */
  className?: string;
}) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = React.useState({ scale: 0.3, logicalH: 800 });

  // freeze src so theme toggles don't remount the iframe
  const srcRef = React.useRef<string | null>(null);
  if (srcRef.current === null) {
    if (externalUrl) {
      srcRef.current = externalUrl;
    } else {
      const t = forceTheme ?? initialFrameTheme();
      srcRef.current = `${window.location.pathname}?frame=1&t=${t}#${route}`;
    }
  }

  React.useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      const scale = box.clientWidth / width;
      const logicalH = scale > 0 ? box.clientHeight / scale : 800;
      setDims({ scale, logicalH });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden rounded-xl border border-border bg-canvas ${className}`}
    >
      <iframe
        title={title}
        src={srcRef.current}
        tabIndex={-1}
        aria-hidden="true"
        loading="lazy"
        scrolling="no"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-canvas"
        style={{ width, height: dims.logicalH, transform: `scale(${dims.scale})` }}
      />
    </div>
  );
}

/* ---- data ------------------------------------------------------------- */

type Template = {
  name: string;
  kind: string;
  description: string;
  href: string;
  /** Live preview route (e.g. "preview/ai") for templates that live in-app. */
  previewRoute?: string;
  /** For a deployed external product: previews this URL and opens it directly. */
  externalUrl?: string;
  /** Preview strip theme — external sites keep their own look; default "dark". */
  previewTheme?: "light" | "dark";
  /** Source repo for this template — each template ships from its own repo,
      separate from the main AsbirUI library repo linked in the navbar. */
  repoUrl?: string;
};

const TEMPLATES: Template[] = [
  {
    name: "Tripket PH",
    kind: "Maritime booking admin",
    description:
      "A live, production maritime ferry-booking admin — shipping-line dashboard, voyages, vessels, bookings, tickets and reports across the Philippine inter-island network. Deployed and running.",
    href: "https://tripket-ph.vercel.app/",
    externalUrl: "https://tripket-ph.vercel.app/",
    previewTheme: "light",
  },
  {
    name: "Lumina AI",
    kind: "AI console template",
    description:
      "A production-shaped AI gateway console — overview metrics, playground, prompt library, API keys, logs, team & billing. Fully responsive, themeable.",
    href: "#ai",
    previewRoute: "preview/ai",
    repoUrl: "https://github.com/asbirtech/lumina-ai",
  },
];

/* ---- rows ------------------------------------------------------------- */

/** Big preview pair for the live template: a wide dark-mode desktop and a
    true phone-proportioned dark-mode mobile beside it. The mobile frame keeps
    the 390×844 aspect so the preview reads as a real phone, not a stretched
    panel; it's centered in its column and matched to the desktop's height. */
function LivePreviews({
  route,
  externalUrl,
  theme = "dark",
}: {
  route?: string;
  externalUrl?: string;
  theme?: "light" | "dark";
}) {
  const label = theme === "light" ? "light" : "dark";
  return (
    <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto]">
      <PreviewThumb
        route={route ?? ""}
        externalUrl={externalUrl}
        width={1280}
        forceTheme={theme}
        title={`Desktop preview (${label})`}
        className="h-[22rem]"
      />
      <PreviewThumb
        route={route ?? ""}
        externalUrl={externalUrl}
        width={390}
        forceTheme={theme}
        title={`Mobile preview (${label})`}
        className="h-[22rem] w-[calc(22rem*390/844)] justify-self-center"
      />
    </div>
  );
}

const ExternalIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

function TemplateRow({ t }: { t: Template }) {
  const external = Boolean(t.externalUrl);
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-10">
      {/* meta column */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-fg">{t.name}</h3>
          {external && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-fg/40">{t.kind}</p>
        <p className="mt-4 text-sm leading-relaxed text-fg/60">{t.description}</p>
        <div className="mt-6 flex items-center gap-2">
          <a
            href={t.href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-asbir bg-solid px-4 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            {external ? "Visit live site" : "Open template"}
            <span>{external ? ExternalIcon : ArrowIcon}</span>
          </a>
          {t.repoUrl && (
            <a
              href={t.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.name} repository`}
              title={`${t.name} repository`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-asbir border border-border text-fg/70 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
            >
              {GitHubIcon}
            </a>
          )}
        </div>
      </div>

      {/* preview strip */}
      <div>
        <LivePreviews route={t.previewRoute} externalUrl={t.externalUrl} theme={t.previewTheme} />
      </div>
    </div>
  );
}

/* ---- page ------------------------------------------------------------- */

export function TemplatesPage() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        Templates
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        Production-shaped starter kits built entirely on AsbirUI components and
        tokens. Every preview below is the actual template running live — clone
        one, swap the data, and ship.
      </p>

      <div className="mt-6">
        {TEMPLATES.map((t) => (
          <TemplateRow key={t.name} t={t} />
        ))}
      </div>
    </article>
  );
}
