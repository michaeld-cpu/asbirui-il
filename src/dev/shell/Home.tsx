import * as React from "react";
import asbirLogo from "@/assets/logo/asbirlogo-white.svg";
import heroBackdrop from "@/assets/backdrops/herobackdrop.jpeg";
import { TemplatePreview } from "./TemplatePreview";
import { MotionPromoFloating } from "./MotionPromoCard";
import { DetailsSkeleton } from "./DetailsSkeleton";
import { SkeletonImg } from "./PageSkeleton";
import { IntegrationsGrid } from "./IntegrationsGrid";
import { Reveal } from "@/motion";

const RocketIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0Z" />
    <path d="M12 15 9 12a10 10 0 0 1 5.5-8.5C17.5 2 21 2 21 2s0 3.5-1.5 6.5A10 10 0 0 1 12 15Z" />
    <path d="M9 12H4s.5-2.8 2-4c1.7-1.3 5 0 5 0M12 15v5s2.8-.5 4-2c1.3-1.7 0-5 0-5" />
  </svg>
);

const ArrowIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function IntroPanel() {
  return (
    <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-2xl border border-border px-6 py-16 sm:px-12">
      {/* photo backdrop — shown at full strength, no darkening scrim; shimmers
          in while the large hero image loads */}
      <SkeletonImg
        src={heroBackdrop}
        alt=""
        aria-hidden="true"
        wrapperClassName="pointer-events-none absolute inset-0"
        className="object-cover"
      />

      {/* one soft shadow behind the whole content block, instead of per-line
          text-shadows — reads as ambient depth rather than a harsh outline */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(48% 62% at 50% 50%, rgb(0 0 0 / 0.32) 0%, rgb(0 0 0 / 0.14) 55%, transparent 82%)",
          filter: "blur(6px)",
        }}
      />

      <div className="relative z-10 max-w-3xl text-center">
        <a
          href="#changelog"
          className="mb-6 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-black"
        >
          <span className="[&_svg]:h-3 [&_svg]:w-3">{RocketIcon}</span>
          AsbirUI v0.1.0 — patch release
        </a>
        <h1 className="text-balance text-4xl font-semibold leading-[1.0] tracking-tight text-white sm:text-5xl">
          The internal component library
          <br /> for AsbirTech.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Accessible, themeable React components built on one palette. Preview
          live, read the docs, and copy the source straight into your next build.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#components"
            className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-asbir border border-white/25 bg-black/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/55"
          >
            Browse components
            <span className="transition-transform group-hover:translate-x-0.5">
              {ArrowIcon}
            </span>
          </a>
          <a
            href="#docs"
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-asbir border border-white/25 bg-black/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/55"
          >
            Installation
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared section heading                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-soft-fg">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-fg/60 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Templates showcase                                                  */
/* ------------------------------------------------------------------ */

function TemplatesSection() {
  return (
    <section id="templates" className="mt-24">
      <SectionHeading
        title="Start from a real screen, not a blank file."
        description="Production-shaped starter kits built entirely on AsbirUI components and tokens. Clone one, swap the data, ship."
      />

      {/* big framed dashboard preview — p-4 (not margin, which would collapse)
          keeps the hatch band visible on all four sides */}
      <div className="relative mt-10 p-4">
        {/* feathered echo — thin outline offset from the frame, filled with a
            subtle diagonal hatch that only shows in the gap band (the opaque
            frame covers the center). */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl border"
          style={{
            borderColor: "rgb(var(--accent) / 0.12)",
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgb(var(--accent) / 0.12) 0px, rgb(var(--accent) / 0.12) 1px, transparent 1px, transparent 7px)",
          }}
        />
        <a
          href="#ai"
          className="group relative block overflow-hidden rounded-xl border border-border bg-canvas"
        >
          {/* fixed aspect stage — renders the REAL AI console template, scaled
              to fit and non-interactive, so the preview is the actual page. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
            <TemplatePreview />
            {/* hover affordance — the preview opens the live, routable template */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="mb-6 inline-flex items-center gap-1.5 rounded-asbir bg-white px-4 py-2 text-sm font-semibold text-black">
                Open live template →
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* What's inside / Technology                                          */
/* ------------------------------------------------------------------ */

/* "Built on tools your team already trusts" — a "Fueled by" hub + connector
   wires fanning down to a 2×3 grid of brand-colored tech cards (React / TS /
   Tailwind / Vite / Radix / tokens). See IntegrationsGrid.tsx. */
function TechnologySection() {
  return (
    <section id="technology" className="mt-24">
      <SectionHeading
        title="Built on tools your team already trusts."
        description="No bespoke framework to learn. AsbirUI is a thin, opinionated layer over the stack you already ship with."
      />
      <div className="mt-10">
        <IntegrationsGrid />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Everything you need (features)                                      */
/* ------------------------------------------------------------------ */

function FeaturesSection() {
  return (
    <section id="features" className="mt-24">
      <SectionHeading title="The details are the product." />
      <DetailsSkeleton />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA banner (hero-sized)                                             */
/* ------------------------------------------------------------------ */

const SPECTRUM_GRADIENT =
  "linear-gradient(90deg, #3E8AFF, #00B8CE, #976CFF, #E14D9F, #F83E3A, #FF751A, #3E8AFF)";

function CtaSection() {
  const ref = React.useRef<HTMLElement>(null);
  const [phase, setPhase] = React.useState<"idle" | "band" | "content">("idle");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPhase("content");
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setPhase("band"); 
        timers.push(window.setTimeout(() => setPhase("content"), 650)); 
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const bandOpen = phase === "band" || phase === "content";
  const showContent = phase === "content";

  return (
    <section
      ref={ref}
      id="get-started"
      className="relative mt-24 flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-panel px-6 pb-40 pt-16 text-center sm:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(var(--fg-rgb) / 0.09) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(80% 70% at 50% 100%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(80% 70% at 50% 100%, black, transparent 75%)",
        }}
      />

      <div
        className={`relative z-10 max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showContent ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-4xl">
          Stop building from scratch.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg/60 sm:text-base">
          Every screen your team ships starts a step ahead. Browse the
          components, grab a template, and get back to the work that matters.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#components"
            className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-asbir bg-solid px-5 py-2.5 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            Browse components
            <span className="transition-transform group-hover:translate-x-0.5">
              {ArrowIcon}
            </span>
          </a>
          <a
            href="#docs"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-asbir border border-border bg-overlay/[0.03] px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-overlay/[0.07]"
          >
            Read the docs
          </a>
        </div>
      </div>

      {/* spectrum band — grows from a center block into the full-bleed strip
          as the cube dissolves */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 justify-center">
        <div
          className={`asbir-spectrum-pan h-full transition-[width,border-radius] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            bandOpen ? "w-full rounded-none" : "w-0 rounded-t-2xl"
          }`}
          style={{ backgroundImage: SPECTRUM_GRADIENT }}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const footerCols = [
  {
    heading: "Library",
    links: [
      { label: "Components", href: "#components" },
      { label: "Templates", href: "#templates" },
      { label: "Tokens", href: "#tokens" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Getting started", href: "#docs" },
      { label: "Theming", href: "#docs" },
      { label: "Accessibility", href: "#docs" },
    ],
  },
  {
    heading: "AsbirTech",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className="mt-24 border-t border-border pt-10">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <a href="#home" className="flex items-center gap-2">
            <img src={asbirLogo} alt="AsbirUI logo" width={22} height={20} className="[html.light_&]:invert" />
            <span className="text-lg font-semibold tracking-[-0.03em] text-fg">
              AsbirUI
            </span>
          </a>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-fg/50">
            The internal component library for AsbirTech. One palette, fully
            themeable, copy-paste ready.
          </p>
        </div>
        {footerCols.map((col) => (
          <div key={col.heading}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {col.heading}
            </h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-fg/60 transition-colors hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border py-6 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">
          © 2026 AsbirTech. All rights reserved.
        </p>
        <p className="text-xs text-muted">v0.1 alpha</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function Home() {
  return (
    <div className="mx-auto max-w-[88rem] animate-fade-up px-6 pb-4 lg:px-10">
      <div className="pt-10">
        <IntroPanel />
      </div>
      <Reveal>
        <TemplatesSection />
      </Reveal>
      <Reveal>
        <TechnologySection />
      </Reveal>
      <Reveal>
        <FeaturesSection />
      </Reveal>
      <CtaSection />
      <Footer />

      {/* floating Asbir Motion promo, bottom-left; dismiss sticks per session */}
      <MotionPromoFloating dismissKey="asbir-motion-home" corner="bottom-left" />
    </div>
  );
}
