import * as React from "react";

/*
  Brand Kits — the internal, per-project brand reference for the Asbir studio.

  Two views off one component, chosen by `slug`:
    ""            → the project index: a card grid of every project
    "<slug>"      → that project's full brand book

  A kit page is a Mobbin-style reference: a sticky section rail on the left
  (with scrollspy — the rail highlights the section you're currently viewing),
  and stacked sections on the right: Overview, Colors, Gradients, Typography,
  Logo, Layout & radius, Motion, Brand voice. Every section renders from the
  Project data below, so onboarding / editing a project is a single data edit.

  Asbir Tech Web is filled in with the REAL brand system pulled from the live
  site source (dark theme, #FF6900 orange, Inter, the "A" logomark). The other
  projects carry the same structure with their own values.
*/

/* ---- data model ------------------------------------------------------- */

type Swatch = { name: string; hex: string; role: string };
type Gradient = { name: string; css: string; role: string };
type TypeSpec = { label: string; sample: string; meta: string; style?: React.CSSProperties };
type Motion = { name: string; value: string; role: string };

type Project = {
  slug: string;
  name: string;
  tagline: string;
  /* the mark's base color — drives the index card accent */
  accent: string;
  status: "live" | "draft";
  /* one-liner shown at the top of the kit */
  summary: string;
  /* short factual meta rows (Founded, Location, Site, …) */
  facts?: { label: string; value: string }[];
  /* inline SVG logomark (paste-ready) + optional wordmark, both single-color
     so they can flip fg on any surface. If absent, a lettermark tile is used. */
  logomark?: string;
  colors: Swatch[];
  gradients?: Gradient[];
  fonts: { family: string; source: string; weights: string };
  type: TypeSpec[];
  radius?: { label: string; value: string }[];
  motion?: Motion[];
  voice: string;
  voiceTraits?: string[];
  /* real copy lines that characterize the brand voice */
  voiceLines?: string[];
};

const PROJECTS: Project[] = [
  {
    slug: "asbir-tech-web",
    name: "Asbir Tech Web",
    tagline: "Web development & IT consulting",
    accent: "#FF6900",
    status: "live",
    summary:
      "A web development and IT consulting studio founded in 2016 in Dumaguete, Philippines, and brought to Australia in 2022. The site is a dark, confident, enterprise-B2B statement built on a single Inter typeface and one hot orange.",
    facts: [
      { label: "Founded", value: "2016 · Dumaguete, PH" },
      { label: "Expanded", value: "2022 · Australia" },
      { label: "Sector", value: "Studio & product engineering" },
      { label: "Theme", value: "Dark only" },
    ],
    // The real "A" logomark from the live site (three stacked chevron paths).
    logomark:
      '<svg viewBox="0 0 26 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.5205 8.94012L14.6933 5.28149C14.1219 6.42815 13.3659 7.92302 13.2099 8.2437L13.5647 8.93742H13.5673L13.5657 8.94012L19.0029 19.8685C15.2648 18.5809 10.3785 18.5804 6.63992 19.8668C6.87398 19.3972 7.10909 18.9253 7.34367 18.454C5.23767 18.8303 4.19547 19.2406 3.93927 19.3507C3.5418 20.1497 3.14485 20.9471 2.75 21.7418L2.80535 21.8098C2.81537 21.8222 4.57187 23.9892 4.58083 24C8.35371 21.0049 17.2854 21.0065 21.0588 24C21.0656 23.9914 22.8221 21.8179 22.8306 21.8076L22.8875 21.7374L16.5205 8.94012Z"/><path d="M25.0622 17.1719C22.3489 11.7182 19.5534 6.09987 16.839 0.644592C16.1458 0.50153 13.7588 0.0620839 13.5759 0L6.27051 14.6669C7.04754 14.5141 8.13454 14.3306 9.46984 14.1832C9.98119 13.1558 14.6661 3.73853 15.0446 2.97625L21.3874 15.725C21.0574 15.6316 20.7231 15.5442 20.3858 15.4621L22.0964 18.9048C22.884 19.1817 23.6615 19.504 24.3995 19.8668C24.5319 19.6806 25.4359 18.4211 25.5403 18.2672L25.0622 17.1719Z"/><path d="M15.8274 14.71C13.6466 14.5092 11.344 14.5313 9.17575 14.7731C7.88526 14.9297 6.97433 15.0825 5.95743 15.2941L5.95532 15.2984C5.37756 15.4248 4.80928 15.5662 4.2526 15.7244C5.37861 13.4629 6.50673 11.196 7.62589 8.9378C7.62906 8.93996 7.6338 8.92593 7.6338 8.92593C8.58638 7.02238 9.57111 5.03948 10.5453 3.07979L10.9633 3.79618L12.4468 0.83397L12.0546 0.0317383C11.6824 0.0949019 9.08507 0.592112 8.80832 0.634221C6.60953 5.05351 2.36537 13.5779 0.225624 17.8811L0 18.3346C0 18.3346 0.00737998 18.3492 0.0195047 18.3735L1.23303 19.8705C3.55095 18.8189 4.67749 18.3616 7.65014 17.8412L7.65173 17.8385C10.6866 17.2916 14.257 17.2522 17.3283 17.731L15.828 14.7116L15.8274 14.71Z"/></svg>',
    colors: [
      { name: "Orange", hex: "#FF6900", role: "Primary" },
      { name: "Ember", hex: "#FF4500", role: "Primary / gradient end" },
      { name: "Amber", hex: "#FFB800", role: "Accent" },
      { name: "Black", hex: "#000000", role: "Background" },
      { name: "Card", hex: "#111111", role: "Surface" },
      { name: "Panel", hex: "#0A0A0A", role: "Surface deep" },
      { name: "White", hex: "#FFFFFF", role: "Text primary" },
      { name: "Grey", hex: "#A0A0A0", role: "Text secondary" },
      { name: "Peach", hex: "#FFEEDB", role: "Text on warm" },
      { name: "Bloom", hex: "#FFAF76", role: "Gradient accent" },
    ],
    gradients: [
      {
        name: "Primary",
        css: "linear-gradient(135deg, #FF6900 0%, #FF4500 100%)",
        role: "Buttons · text gradient",
      },
      {
        name: "Hero glow",
        css: "radial-gradient(circle at center, rgba(255,100,0,0.28), transparent 70%)",
        role: "Ambient hero light",
      },
      {
        name: "Vision",
        css: "linear-gradient(to bottom, #ffffff 40%, #FFAF76 100%)",
        role: "Heading text gradient",
      },
    ],
    fonts: {
      family: "Inter",
      source: "Google Fonts · variable (opsz 14–32)",
      weights: "300 · 400 · 500 · 600 · 700",
    },
    type: [
      {
        label: "Display / H1",
        sample: "Modern Problems Require Modern Solutions",
        meta: "Inter · 500 · clamp(2.5rem, 6vw, 4.8rem) · letter-spacing -2px",
        style: { fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1 },
      },
      {
        label: "Section / H2",
        sample: "Our services enable businesses to scale & transform",
        meta: "Inter · 500 · 3rem · line-height 1.1",
        style: { fontWeight: 500, letterSpacing: "-0.01em" },
      },
      {
        label: "Card / H3",
        sample: "Web Development",
        meta: "Inter · 300 · 1.8rem",
        style: { fontWeight: 300 },
      },
      {
        label: "Body",
        sample:
          "We take our time understanding the IT needs of businesses and provide a modern approach to the solution.",
        meta: "Inter · 400 · 1.1rem · line-height 1.6–1.8",
        style: { fontWeight: 400, lineHeight: 1.7 },
      },
    ],
    radius: [
      { label: "Pill", value: "100px / 50px" },
      { label: "Card", value: "24px" },
      { label: "Panel", value: "12px" },
      { label: "Icon box", value: "8px" },
      { label: "Container", value: "max 1500px" },
      { label: "Section rhythm", value: "8rem 0" },
    ],
    motion: [
      { name: "Expo out", value: "cubic-bezier(0.16, 1, 0.3, 1)", role: "Buttons · menus" },
      { name: "Navbar collapse", value: "cubic-bezier(0.4, 0, 0.2, 1) · 1.2s", role: "Scroll shrink" },
      { name: "Reveal card", value: "opacity + translateY(30px) scale(0.98) · 0.8s", role: "On-scroll reveal" },
      { name: "Orbit", value: "rotate · linear infinite · 15/25/40s", role: "Decorative orbits" },
      { name: "Button lift", value: "translateY(-2px) + glow 0 0 40px rgba(255,106,0,0.5)", role: "Hover" },
    ],
    voice:
      "Asbir Tech Web is the confident craftsperson. Consultative, enterprise, and quietly ambitious — it speaks in outcomes (scale, transform, competitive advantage), uses AU/British spelling, and lets robust, well-built work carry the message.",
    voiceTraits: ["Consultative", "Enterprise B2B", "Outcome-led", "Understated", "AU / British spelling"],
    voiceLines: [
      "Modern Problems Require Modern Solutions.",
      "We enable businesses to scale, transform, and gain a competitive advantage.",
      "Delivering technology services that fit the way your business works.",
      "Robust and flexible web and mobile solutions.",
    ],
  },
  {
    slug: "tripket-ph",
    name: "Tripket PH",
    tagline: "Vessel booking & ticketing",
    accent: "#0D9488",
    status: "live",
    summary:
      "A maritime ferry-booking admin for the Philippine inter-island network — a light, friendly-yet-precise product that makes booking a boat feel effortless.",
    facts: [
      { label: "Sector", value: "Maritime booking admin" },
      { label: "Region", value: "Philippines" },
      { label: "Theme", value: "Light" },
    ],
    colors: [
      { name: "Teal", hex: "#0D9488", role: "Primary" },
      { name: "Deep", hex: "#0F766E", role: "Primary dark" },
      { name: "Ink", hex: "#0C1B1A", role: "Surface" },
      { name: "Foam", hex: "#5EEAD4", role: "Accent soft" },
      { name: "Lime", hex: "#65A30D", role: "Positive" },
      { name: "Coral", hex: "#FB7185", role: "Attention" },
    ],
    gradients: [
      { name: "Primary", css: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)", role: "Buttons" },
    ],
    fonts: { family: "Inter", source: "Google Fonts", weights: "400 · 500 · 600" },
    type: [
      { label: "Display", sample: "Book your crossing", meta: "Inter · 600 · 2.5rem", style: { fontWeight: 600 } },
      { label: "Body", sample: "Real-time seats across the inter-island network.", meta: "Inter · 400 · 15px / 1.6", style: { fontWeight: 400, lineHeight: 1.6 } },
    ],
    radius: [{ label: "Card", value: "12px" }, { label: "Control", value: "8px" }],
    voice:
      "Tripket PH is the friendly guide at the dock. Warm, clear, and reassuring — we make booking a boat feel as easy as it should be.",
    voiceTraits: ["Warm", "Clear", "Reassuring"],
    voiceLines: ["Book your crossing in a tap.", "Every route, every vessel, one place."],
  },
  {
    slug: "planout",
    name: "PlanOut",
    tagline: "Planning & scheduling workspace",
    accent: "#2563EB",
    status: "draft",
    summary:
      "A planning and scheduling workspace for operators — direct, structured, and numbers-first. The plan and the data lead; the hype stays out.",
    facts: [{ label: "Sector", value: "Planning workspace" }, { label: "Theme", value: "Dark" }],
    colors: [
      { name: "Blue", hex: "#2563EB", role: "Primary" },
      { name: "Deep", hex: "#1E3A8A", role: "Primary dark" },
      { name: "Slate", hex: "#0F172A", role: "Surface" },
      { name: "Sky", hex: "#93C5FD", role: "Accent soft" },
      { name: "Emerald", hex: "#10B981", role: "Positive" },
      { name: "Amber", hex: "#F59E0B", role: "Attention" },
    ],
    gradients: [{ name: "Primary", css: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)", role: "Buttons" }],
    fonts: { family: "Inter", source: "Google Fonts", weights: "400 · 500 · 600" },
    type: [
      { label: "Display", sample: "Ship the plan", meta: "Inter · 600 · 2.5rem", style: { fontWeight: 600 } },
      { label: "Body", sample: "Surface the plan and the numbers, never the hype.", meta: "Inter · 400 · 15px / 1.6", style: { fontWeight: 400, lineHeight: 1.6 } },
    ],
    radius: [{ label: "Card", value: "12px" }],
    voice:
      "PlanOut is the steady operator. We're direct, structured, and confident — we surface the plan and the numbers, never the hype.",
    voiceTraits: ["Direct", "Structured", "Confident"],
    voiceLines: ["The plan and the numbers, up front."],
  },
  {
    slug: "projectplaza",
    name: "ProjectPlaza",
    tagline: "Project marketplace & collaboration",
    accent: "#EA580C",
    status: "draft",
    summary:
      "A project marketplace and collaboration space — energetic, approachable, and community-first, built to make jumping in and shipping together easy.",
    facts: [{ label: "Sector", value: "Marketplace" }, { label: "Theme", value: "Dark" }],
    colors: [
      { name: "Orange", hex: "#EA580C", role: "Primary" },
      { name: "Deep", hex: "#9A3412", role: "Primary dark" },
      { name: "Charcoal", hex: "#1C1512", role: "Surface" },
      { name: "Peach", hex: "#FDBA74", role: "Accent soft" },
      { name: "Teal", hex: "#0D9488", role: "Positive" },
      { name: "Rose", hex: "#F43F5E", role: "Attention" },
    ],
    gradients: [{ name: "Primary", css: "linear-gradient(135deg, #EA580C 0%, #9A3412 100%)", role: "Buttons" }],
    fonts: { family: "Inter", source: "Google Fonts", weights: "400 · 500 · 600" },
    type: [
      { label: "Display", sample: "Build it together", meta: "Inter · 600 · 2.5rem", style: { fontWeight: 600 } },
      { label: "Body", sample: "Jump in and get building together.", meta: "Inter · 400 · 15px / 1.6", style: { fontWeight: 400, lineHeight: 1.6 } },
    ],
    radius: [{ label: "Card", value: "12px" }],
    voice:
      "ProjectPlaza is the welcoming host. Energetic, approachable, and community-first — we make it easy to jump in and get building together.",
    voiceTraits: ["Energetic", "Approachable", "Community-first"],
    voiceLines: ["Jump in and get building together."],
  },
  {
    slug: "beetzeeplay",
    name: "BeetzeePlay",
    tagline: "Music & audio streaming",
    accent: "#DB2777",
    status: "draft",
    summary:
      "A music and audio streaming experience — bold, playful, and full of rhythm, bringing energy and personality to every beat.",
    facts: [{ label: "Sector", value: "Streaming" }, { label: "Theme", value: "Dark" }],
    colors: [
      { name: "Pink", hex: "#DB2777", role: "Primary" },
      { name: "Deep", hex: "#9D174D", role: "Primary dark" },
      { name: "Void", hex: "#140A12", role: "Surface" },
      { name: "Blush", hex: "#F9A8D4", role: "Accent soft" },
      { name: "Cyan", hex: "#06B6D4", role: "Positive" },
      { name: "Amber", hex: "#F59E0B", role: "Attention" },
    ],
    gradients: [{ name: "Primary", css: "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)", role: "Buttons" }],
    fonts: { family: "Inter", source: "Google Fonts", weights: "400 · 500 · 700" },
    type: [
      { label: "Display", sample: "Turn it up", meta: "Inter · 700 · 2.5rem", style: { fontWeight: 700 } },
      { label: "Body", sample: "Energy and personality on every beat.", meta: "Inter · 400 · 15px / 1.6", style: { fontWeight: 400, lineHeight: 1.6 } },
    ],
    radius: [{ label: "Card", value: "16px" }],
    voice:
      "BeetzeePlay is the after-hours DJ. Bold, playful, and full of rhythm — we bring energy and personality to every beat.",
    voiceTraits: ["Bold", "Playful", "Rhythmic"],
    voiceLines: ["Energy and personality on every beat."],
  },
];

/* ---- copy helper ------------------------------------------------------ */

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200);
  };
  return { copied, copy };
}

/** Renders a raw inline-SVG string, tinted via currentColor. */
function Glyph({ svg, className = "" }: { svg: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ---- project index ---------------------------------------------------- */

function ProjectIndex() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Brand kits</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        The brand book for every project we run — colors, gradients, typography,
        logo, motion, and voice, in one place. Open a project for its full
        identity; each kit is the source of truth product and marketing build
        from.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.slug}
            href={`#brand-kits/${p.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-panel p-4 transition-colors hover:border-fg/20"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white [&_svg]:h-6 [&_svg]:w-6"
              style={{ backgroundColor: p.accent }}
            >
              {p.logomark ? <Glyph svg={p.logomark} /> : p.name.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-fg">{p.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    p.status === "live"
                      ? "bg-lime-500/15 text-lime-600 dark:text-lime-400"
                      : "bg-overlay/[0.08] text-fg/50"
                  }`}
                >
                  {p.status}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-fg/60 dark:text-fg/45">
                {p.tagline}
              </span>
            </span>
            <span className="flex -space-x-1">
              {p.colors.slice(0, 4).map((c) => (
                <span
                  key={c.hex}
                  className="h-4 w-4 rounded-full ring-2 ring-panel"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </span>
          </a>
        ))}
      </div>

      <p className="mt-8 text-xs text-fg/50">
        {PROJECTS.length} projects · add more in{" "}
        <span className="font-mono">BrandKitsDocs.tsx</span>
      </p>
    </article>
  );
}

/* ---- section rail (scrollspy) ----------------------------------------- */

type Section = { id: string; label: string };

/** A sticky in-page rail (Mobbin-style) that jumps to each kit section and
    highlights the section currently in view. */
function SectionRail({ sections }: { sections: Section[] }) {
  const [active, setActive] = React.useState(sections[0]?.id);

  React.useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    // an element counts as "active" once its top passes ~30% down the viewport;
    // the last such element wins so the rail tracks scroll position precisely.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Brand kit sections" className="hidden lg:block">
      <div className="sticky top-24 space-y-1">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-fg/40">
          On this kit
        </p>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
              active === s.id
                ? "bg-overlay/[0.06] font-medium text-fg"
                : "text-fg/55 hover:text-fg"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ---- section primitives ----------------------------------------------- */

function KitSection({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    // scroll-mt clears the sticky navbar when a rail link jumps here
    <section id={id} className="scroll-mt-24 border-t border-border pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-fg">{title}</h2>
      {desc && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg/60">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ---- per-project kit -------------------------------------------------- */

function KitView({ project }: { project: Project }) {
  const { copied, copy } = useCopy();

  const sections: Section[] = [
    { id: "overview", label: "Overview" },
    { id: "colors", label: "Colors" },
    ...(project.gradients?.length ? [{ id: "gradients", label: "Gradients" }] : []),
    { id: "typography", label: "Typography" },
    { id: "logo", label: "Logo" },
    ...(project.radius?.length ? [{ id: "layout", label: "Layout & radius" }] : []),
    ...(project.motion?.length ? [{ id: "motion", label: "Motion" }] : []),
    { id: "voice", label: "Brand voice" },
  ];

  const Mark = ({ className = "" }: { className?: string }) =>
    project.logomark ? (
      <Glyph svg={project.logomark} className={className} />
    ) : (
      <span className={className}>{project.name.slice(0, 1)}</span>
    );

  return (
    <article className="animate-fade-up py-10">
      <a
        href="#brand-kits"
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← All projects
      </a>

      {/* header */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white [&_svg]:h-7 [&_svg]:w-7"
          style={{ backgroundColor: project.accent }}
        >
          <Mark />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-fg">{project.name}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                project.status === "live"
                  ? "bg-lime-500/15 text-lime-600 dark:text-lime-400"
                  : "bg-overlay/[0.08] text-fg/50"
              }`}
            >
              {project.status}
            </span>
          </div>
          <p className="mt-1 text-[15px] text-fg/70">{project.tagline}</p>
        </div>
      </div>

      {/* rail + sections */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_1fr]">
        <SectionRail sections={sections} />

        <div className="min-w-0 space-y-10">
          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <p className="max-w-2xl text-[15px] leading-relaxed text-fg/80 dark:text-fg/70">
              {project.summary}
            </p>
            {project.facts && (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
                {project.facts.map((f) => (
                  <div key={f.label} className="bg-panel p-4">
                    <dt className="text-[11px] uppercase tracking-wide text-fg/50">{f.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* Colors */}
          <KitSection id="colors" title="Colors" desc="Click any swatch to copy its hex.">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {project.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => copy(c.hex)}
                  className="group overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-fg/20"
                >
                  <span className="block h-16 w-full" style={{ backgroundColor: c.hex }} />
                  <span className="block px-2.5 py-2">
                    <span className="block truncate text-xs font-medium text-fg">{c.name}</span>
                    <span className="block truncate text-[10px] uppercase tracking-wide text-fg/50">
                      {c.role}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-fg/60">
                      {copied === c.hex ? "Copied!" : c.hex}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </KitSection>

          {/* Gradients */}
          {project.gradients && project.gradients.length > 0 && (
            <KitSection
              id="gradients"
              title="Gradients"
              desc="Signature blends. Click to copy the CSS."
            >
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {project.gradients.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => copy(g.css)}
                    className="group overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-fg/20"
                  >
                    <span className="block h-20 w-full" style={{ background: g.css }} />
                    <span className="block px-3 py-2.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-fg">{g.name}</span>
                        <span className="text-[10px] uppercase tracking-wide text-fg/50">{g.role}</span>
                      </span>
                      <span className="mt-1 block truncate font-mono text-[10px] text-fg/55">
                        {copied === g.css ? "Copied!" : g.css}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </KitSection>
          )}

          {/* Typography */}
          <KitSection
            id="typography"
            title="Typography"
            desc={`${project.fonts.family} · ${project.fonts.source} · weights ${project.fonts.weights}`}
          >
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-panel">
              {project.type.map((t) => (
                <div key={t.label} className="p-5">
                  <p className="text-[11px] uppercase tracking-wide text-fg/50">{t.label}</p>
                  <p className="mt-2 text-fg" style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.9rem)", ...t.style }}>
                    {t.sample}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-fg/55">{t.meta}</p>
                </div>
              ))}
            </div>
          </KitSection>

          {/* Logo */}
          <KitSection id="logo" title="Logo" desc="Primary mark on light and dark surfaces.">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {/* on brand color */}
              <div
                className="flex h-40 items-center justify-center rounded-xl border border-border [&_svg]:h-12 [&_svg]:w-12"
                style={{ backgroundColor: project.accent }}
              >
                <span className="text-white [&_svg]:h-12 [&_svg]:w-12">
                  <Mark className="text-3xl font-semibold" />
                </span>
              </div>
              {/* on surface */}
              <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-canvas">
                <span
                  className="[&_svg]:h-12 [&_svg]:w-12"
                  style={{ color: project.accent }}
                >
                  <Mark className="text-3xl font-semibold" />
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fg/50">
              The mark is single-color and inherits <span className="font-mono">currentColor</span> — tint it per surface, never recolor the paths.
            </p>
          </KitSection>

          {/* Layout & radius */}
          {project.radius && project.radius.length > 0 && (
            <KitSection id="layout" title="Layout & radius" desc="Corner radii, container, and rhythm.">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                {project.radius.map((r) => (
                  <div key={r.label} className="bg-panel p-4">
                    <dt className="text-[11px] uppercase tracking-wide text-fg/50">{r.label}</dt>
                    <dd className="mt-1 font-mono text-sm text-fg">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </KitSection>
          )}

          {/* Motion */}
          {project.motion && project.motion.length > 0 && (
            <KitSection id="motion" title="Motion" desc="Signature easing curves and interaction patterns.">
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-panel">
                {project.motion.map((m) => (
                  <div key={m.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">{m.name}</p>
                      <p className="text-xs text-fg/50">{m.role}</p>
                    </div>
                    <code className="font-mono text-[11px] text-fg/70">{m.value}</code>
                  </div>
                ))}
              </div>
            </KitSection>
          )}

          {/* Brand voice */}
          <KitSection id="voice" title="Brand voice" desc="How this project should sound in product and marketing.">
            <p className="max-w-2xl text-sm leading-relaxed text-fg/80 dark:text-fg/70">
              {project.voice}
            </p>
            {project.voiceTraits && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.voiceTraits.map((tr) => (
                  <span
                    key={tr}
                    className="rounded-full border px-2.5 py-1 text-xs font-medium"
                    style={{
                      borderColor: `${project.accent}55`,
                      color: project.accent,
                      backgroundColor: `${project.accent}18`,
                    }}
                  >
                    {tr}
                  </span>
                ))}
              </div>
            )}
            {project.voiceLines && (
              <ul className="mt-5 space-y-2">
                {project.voiceLines.map((line) => (
                  <li
                    key={line}
                    className="rounded-lg border border-border bg-panel px-4 py-3 text-sm italic text-fg/80"
                  >
                    “{line}”
                  </li>
                ))}
              </ul>
            )}
          </KitSection>
        </div>
      </div>
    </article>
  );
}

/* ---- not found -------------------------------------------------------- */

function UnknownProject({ slug }: { slug: string }) {
  return (
    <article className="animate-fade-up py-10">
      <a
        href="#brand-kits"
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← All projects
      </a>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">No kit for “{slug}”</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        There's no brand kit for this project yet. Pick one from the index, or
        add it to <span className="font-mono">PROJECTS</span> in{" "}
        <span className="font-mono">BrandKitsDocs.tsx</span>.
      </p>
    </article>
  );
}

/* ---- page ------------------------------------------------------------- */

/** `slug` is the project (e.g. "asbir-tech-web"); "" renders the project index. */
export function BrandKitsDocs({ slug }: { slug: string }) {
  if (!slug) return <ProjectIndex />;
  const project = PROJECTS.find((p) => p.slug === slug);
  return project ? <KitView project={project} /> : <UnknownProject slug={slug} />;
}
