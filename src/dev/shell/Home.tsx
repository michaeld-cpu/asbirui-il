import asbirLogo from "@/assets/logo/asbirlogo-white.svg";
import heroBackdrop from "@/assets/backdrops/herobackdrop.jpeg";
import { DashboardPreview } from "./DashboardPreview";

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
      {/* photo backdrop — shown at full strength, no darkening scrim */}
      <img
        src={heroBackdrop}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
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

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#components"
            className="group inline-flex items-center gap-2 rounded-asbir border border-white/25 bg-black/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/55"
          >
            Browse components
            <span className="transition-transform group-hover:translate-x-0.5">
              {ArrowIcon}
            </span>
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-asbir border border-white/25 bg-black/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/55"
          >
            Documentation
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

      {/* big framed dashboard preview */}
      <div className="relative mt-10">
        {/* ambient glow behind the frame */}
        <div
          className="pointer-events-none absolute -inset-x-8 -top-6 bottom-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgb(var(--fg-rgb) / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="overflow-hidden rounded-xl border border-border bg-canvas shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]">
          {/* fixed aspect stage the mockup fills */}
          <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* What's inside / Technology                                          */
/* ------------------------------------------------------------------ */

const stack = [
  { name: "React", detail: "Function components, hooks-first API." },
  { name: "TypeScript", detail: "Fully typed props and variants." },
  { name: "Tailwind CSS", detail: "Utility-driven, zero runtime CSS." },
  { name: "Design tokens", detail: "One palette, themed via CSS vars." },
  { name: "Radix primitives", detail: "Accessible behaviour underneath." },
  { name: "Vite", detail: "Instant dev server, fast builds." },
];

function TechnologySection() {
  return (
    <section id="technology" className="mt-24">
      <SectionHeading
        title="Built on tools your team already trusts."
        description="No bespoke framework to learn. AsbirUI is a thin, opinionated layer over the stack you already ship with."
      />
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <div key={item.name} className="bg-panel p-5">
            <h3 className="text-sm font-semibold text-fg">{item.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-fg/55">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Everything you need (features)                                      */
/* ------------------------------------------------------------------ */

const PaletteIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" />
    <circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" />
    <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h1.5A4.5 4.5 0 0 0 22 10.5C22 5.8 17.5 2 12 2Z" />
  </svg>
);
const AccessibilityIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4.5" r="1.5" />
    <path d="M4 8c2.5 1 5 1.5 8 1.5S17.5 9 20 8M12 9.5V15m0 0-3 6m3-6 3 6" />
  </svg>
);
const CopyIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const ThemeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 3v18" fill="currentColor" fillOpacity="0.15" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" fillOpacity="0.12" />
  </svg>
);
const TypeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V5h16v2M9 5v14m-2 0h4" /><path d="M14 12h6M17 12v7" />
  </svg>
);
const BoltIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
  </svg>
);

const features = [
  {
    icon: PaletteIcon,
    title: "One palette, everywhere",
    body: "Every component draws from the same semantic tokens, so a single change re-themes the whole system.",
  },
  {
    icon: ThemeIcon,
    title: "Light & dark, built in",
    body: "Themes flip through CSS variables — no duplicated styles, no flash, no per-component overrides.",
  },
  {
    icon: AccessibilityIcon,
    title: "Accessible by default",
    body: "Keyboard nav, focus rings, and ARIA come from Radix primitives, not bolted on afterward.",
  },
  {
    icon: CopyIcon,
    title: "Copy the source",
    body: "Own the code. Copy a component straight into your repo and tweak it — no black-box dependency.",
  },
  {
    icon: TypeIcon,
    title: "Fully typed",
    body: "Props, variants, and slots are typed end-to-end, so your editor catches mistakes before runtime.",
  },
  {
    icon: BoltIcon,
    title: "Fast to ship",
    body: "Vite-powered dev, tree-shakeable output, and zero-runtime styling keep bundles lean.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="mt-24">
      <SectionHeading
        title="The details are the product."
        description="A component library is only as good as the thousand small decisions inside it. Here's what we sweated so you don't have to."
      />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-panel p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-asbir bg-accent-soft-bg/10 text-accent-soft-fg">
              {f.icon}
            </div>
            <h3 className="mt-4 text-sm font-semibold text-fg">{f.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-fg/55 sm:text-sm">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA banner (hero-sized)                                             */
/* ------------------------------------------------------------------ */

function CtaSection() {
  return (
    <section
      id="get-started"
      className="relative mt-24 flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-panel px-6 py-16 text-center sm:px-12"
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
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-4xl">
          Stop building from scratch.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg/60 sm:text-base">
          Every screen your team ships starts a step ahead. Browse the
          components, grab a template, and get back to the work that matters.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="#components"
            className="group inline-flex items-center gap-2 rounded-asbir bg-solid px-5 py-2.5 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            Browse components
            <span className="transition-transform group-hover:translate-x-0.5">
              {ArrowIcon}
            </span>
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-asbir border border-border bg-overlay/[0.03] px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-overlay/[0.07]"
          >
            Read the docs
          </a>
        </div>
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
      <TemplatesSection />
      <TechnologySection />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
