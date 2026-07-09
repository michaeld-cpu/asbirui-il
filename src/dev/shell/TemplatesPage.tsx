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
  width,
  forceTheme,
  title,
  className = "",
}: {
  route: string;
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
    const t = forceTheme ?? initialFrameTheme();
    srcRef.current = `${window.location.pathname}?frame=1&t=${t}#${route}`;
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
  /** Live preview route (e.g. "preview/ai"). */
  previewRoute: string;
};

const TEMPLATES: Template[] = [
  {
    name: "Lumina AI",
    kind: "AI console template",
    description:
      "A production-shaped AI gateway console — overview metrics, playground, prompt library, API keys, logs, team & billing. Fully responsive, themeable.",
    href: "#ai",
    previewRoute: "preview/ai",
  },
];

/* ---- rows ------------------------------------------------------------- */

/** Big preview pair for the live template: a wide dark-mode desktop and a
    true phone-proportioned dark-mode mobile beside it. The mobile frame keeps
    the 390×844 aspect so the preview reads as a real phone, not a stretched
    panel; it's centered in its column and matched to the desktop's height. */
function LivePreviews({ route }: { route: string }) {
  return (
    <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto]">
      <PreviewThumb
        route={route}
        width={1280}
        forceTheme="dark"
        title="Desktop preview (dark)"
        className="h-[22rem]"
      />
      <PreviewThumb
        route={route}
        width={390}
        forceTheme="dark"
        title="Mobile preview (dark)"
        className="h-[22rem] w-[calc(22rem*390/844)] justify-self-center"
      />
    </div>
  );
}

function TemplateRow({ t }: { t: Template }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-10">
      {/* meta column */}
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-fg">{t.name}</h3>
        <p className="mt-4 text-sm leading-relaxed text-fg/60">{t.description}</p>
        <a
          href={t.href}
          className="mt-6 inline-flex items-center gap-1.5 rounded-asbir bg-solid px-4 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
        >
          Open template
          <span>{ArrowIcon}</span>
        </a>
      </div>

      {/* preview strip */}
      <div>
        <LivePreviews route={t.previewRoute} />
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
