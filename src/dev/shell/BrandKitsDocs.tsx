import * as React from "react";

/*
  Brand Kits — the internal, per-project brand reference for the Asbir studio.

  Two views off one component, chosen by `slug`:
    ""            → the project index: a card grid of every project
    "<slug>"      → that project's full brand book

  A kit page is a Mobbin-style reference: a sticky section rail on the left
  (with scrollspy — the rail highlights the section you're currently viewing),
  and stacked sections on the right: Overview, Colors, Gradients, Typography,
  Logo, Layout & radius, Motion, Brand voice.

  The scaffolding (rail + every section page) always renders. Each section's
  values live in the Project data below; a section with no data yet shows a
  "Coming soon" placeholder so the shell stays complete while content is filled
  in. Onboarding / editing a project is a single data edit.
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
  /* the mark's base color — drives the index card accent + logo panels */
  accent: string;
  /* inline SVG logomark (paste-ready), single-color so it flips fg on any
     surface. If absent, a lettermark tile is used. */
  logomark?: string;
  /* one-liner shown at the top of the kit (Overview) */
  summary?: string;
  /* short factual meta rows (Founded, Location, …) */
  facts?: { label: string; value: string }[];
  colors?: Swatch[];
  gradients?: Gradient[];
  fonts?: { family: string; source: string; weights: string };
  type?: TypeSpec[];
  radius?: { label: string; value: string }[];
  motion?: Motion[];
  voice?: string;
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
    // The real "A" logomark from the live site (three stacked chevron paths).
    logomark:
      '<svg viewBox="0 0 26 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.5205 8.94012L14.6933 5.28149C14.1219 6.42815 13.3659 7.92302 13.2099 8.2437L13.5647 8.93742H13.5673L13.5657 8.94012L19.0029 19.8685C15.2648 18.5809 10.3785 18.5804 6.63992 19.8668C6.87398 19.3972 7.10909 18.9253 7.34367 18.454C5.23767 18.8303 4.19547 19.2406 3.93927 19.3507C3.5418 20.1497 3.14485 20.9471 2.75 21.7418L2.80535 21.8098C2.81537 21.8222 4.57187 23.9892 4.58083 24C8.35371 21.0049 17.2854 21.0065 21.0588 24C21.0656 23.9914 22.8221 21.8179 22.8306 21.8076L22.8875 21.7374L16.5205 8.94012Z"/><path d="M25.0622 17.1719C22.3489 11.7182 19.5534 6.09987 16.839 0.644592C16.1458 0.50153 13.7588 0.0620839 13.5759 0L6.27051 14.6669C7.04754 14.5141 8.13454 14.3306 9.46984 14.1832C9.98119 13.1558 14.6661 3.73853 15.0446 2.97625L21.3874 15.725C21.0574 15.6316 20.7231 15.5442 20.3858 15.4621L22.0964 18.9048C22.884 19.1817 23.6615 19.504 24.3995 19.8668C24.5319 19.6806 25.4359 18.4211 25.5403 18.2672L25.0622 17.1719Z"/><path d="M15.8274 14.71C13.6466 14.5092 11.344 14.5313 9.17575 14.7731C7.88526 14.9297 6.97433 15.0825 5.95743 15.2941L5.95532 15.2984C5.37756 15.4248 4.80928 15.5662 4.2526 15.7244C5.37861 13.4629 6.50673 11.196 7.62589 8.9378C7.62906 8.93996 7.6338 8.92593 7.6338 8.92593C8.58638 7.02238 9.57111 5.03948 10.5453 3.07979L10.9633 3.79618L12.4468 0.83397L12.0546 0.0317383C11.6824 0.0949019 9.08507 0.592112 8.80832 0.634221C6.60953 5.05351 2.36537 13.5779 0.225624 17.8811L0 18.3346C0 18.3346 0.00737998 18.3492 0.0195047 18.3735L1.23303 19.8705C3.55095 18.8189 4.67749 18.3616 7.65014 17.8412L7.65173 17.8385C10.6866 17.2916 14.257 17.2522 17.3283 17.731L15.828 14.7116L15.8274 14.71Z"/></svg>',
    // Content intentionally left empty for now — the rail + section pages still
    // render (each section shows a placeholder). Fill these arrays in to
    // populate the kit.
    summary: "",
    facts: [],
    colors: [],
    gradients: [],
    fonts: undefined,
    type: [],
    radius: [],
    motion: [],
    voice: "",
    voiceTraits: [],
    voiceLines: [],
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
              <span className="truncate text-sm font-semibold text-fg">{p.name}</span>
              <span className="mt-0.5 block truncate text-xs text-fg/60 dark:text-fg/45">
                {p.tagline}
              </span>
            </span>
          </a>
        ))}
      </div>
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

  // the full kit structure is always present — the rail and every section page
  // render regardless of whether their data is filled in yet.
  const sections: Section[] = [
    { id: "overview", label: "Overview" },
    { id: "colors", label: "Colors" },
    { id: "gradients", label: "Gradients" },
    { id: "typography", label: "Typography" },
    { id: "logo", label: "Logo" },
    { id: "layout", label: "Layout & radius" },
    { id: "motion", label: "Motion" },
    { id: "voice", label: "Brand voice" },
  ];

  const Mark = ({ className = "" }: { className?: string }) =>
    project.logomark ? (
      <Glyph svg={project.logomark} className={className} />
    ) : (
      <span className={className}>{project.name.slice(0, 1)}</span>
    );

  const has = <T,>(v: T[] | undefined): v is T[] => Boolean(v && v.length);

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
          <h1 className="text-3xl font-semibold tracking-tight text-fg">{project.name}</h1>
          <p className="mt-1 text-[15px] text-fg/70">{project.tagline}</p>
        </div>
      </div>

      {/* rail + sections */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_1fr]">
        <SectionRail sections={sections} />

        <div className="min-w-0 space-y-10">
          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            {project.summary ? (
              <p className="max-w-2xl text-[15px] leading-relaxed text-fg/80 dark:text-fg/70">
                {project.summary}
              </p>
            ) : (
              null
            )}
            {has(project.facts) && (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
                {project.facts!.map((f) => (
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
            {has(project.colors) ? (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                {project.colors!.map((c) => (
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
            ) : (
              null
            )}
          </KitSection>

          {/* Gradients */}
          <KitSection id="gradients" title="Gradients" desc="Signature blends. Click to copy the CSS.">
            {has(project.gradients) ? (
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {project.gradients!.map((g) => (
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
            ) : (
              null
            )}
          </KitSection>

          {/* Typography */}
          <KitSection
            id="typography"
            title="Typography"
            desc={
              project.fonts
                ? `${project.fonts.family} · ${project.fonts.source} · weights ${project.fonts.weights}`
                : undefined
            }
          >
            {has(project.type) ? (
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-panel">
                {project.type!.map((t) => (
                  <div key={t.label} className="p-5">
                    <p className="text-[11px] uppercase tracking-wide text-fg/50">{t.label}</p>
                    <p className="mt-2 text-fg" style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.9rem)", ...t.style }}>
                      {t.sample}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-fg/55">{t.meta}</p>
                  </div>
                ))}
              </div>
            ) : (
              null
            )}
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
                <span className="[&_svg]:h-12 [&_svg]:w-12" style={{ color: project.accent }}>
                  <Mark className="text-3xl font-semibold" />
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fg/50">
              The mark is single-color and inherits <span className="font-mono">currentColor</span> — tint it per surface, never recolor the paths.
            </p>
          </KitSection>

          {/* Layout & radius */}
          <KitSection id="layout" title="Layout & radius" desc="Corner radii, container, and rhythm.">
            {has(project.radius) ? (
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                {project.radius!.map((r) => (
                  <div key={r.label} className="bg-panel p-4">
                    <dt className="text-[11px] uppercase tracking-wide text-fg/50">{r.label}</dt>
                    <dd className="mt-1 font-mono text-sm text-fg">{r.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              null
            )}
          </KitSection>

          {/* Motion */}
          <KitSection id="motion" title="Motion" desc="Signature easing curves and interaction patterns.">
            {has(project.motion) ? (
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-panel">
                {project.motion!.map((m) => (
                  <div key={m.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">{m.name}</p>
                      <p className="text-xs text-fg/50">{m.role}</p>
                    </div>
                    <code className="font-mono text-[11px] text-fg/70">{m.value}</code>
                  </div>
                ))}
              </div>
            ) : (
              null
            )}
          </KitSection>

          {/* Brand voice */}
          <KitSection id="voice" title="Brand voice" desc="How this project should sound in product and marketing.">
            {project.voice ? (
              <p className="max-w-2xl text-sm leading-relaxed text-fg/80 dark:text-fg/70">
                {project.voice}
              </p>
            ) : (
              null
            )}
            {has(project.voiceTraits) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.voiceTraits!.map((tr) => (
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
            {has(project.voiceLines) && (
              <ul className="mt-5 space-y-2">
                {project.voiceLines!.map((line) => (
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
