import * as React from "react";

/*
  Brand Kits — the internal, per-project brand reference for the Asbir site.

  Two views off one component, chosen by `slug`:
    ""            → the project index: a card grid of every project
    "<slug>"      → that project's kit (colors, typography, logo, voice)

  This is the source of truth for each project's visual identity. It's
  data-driven off PROJECTS below — onboarding a new project is a single entry;
  the index card and the kit page both render from it. The two seeded projects
  (Atlas, Tripket) are placeholders to fill in with real brand values.
*/

/* ---- data ------------------------------------------------------------- */

type Swatch = { name: string; hex: string; role: string };

type Project = {
  slug: string;
  name: string;
  tagline: string;
  /* the mark's base color — drives the index card accent */
  accent: string;
  status: "live" | "draft";
  colors: Swatch[];
  typography: { display: string; body: string; mono: string };
  voice: string;
};

const PROJECTS: Project[] = [
  {
    slug: "tripket-ph",
    name: "Tripket PH",
    tagline: "Vessel booking & ticketing",
    accent: "#0D9488",
    status: "draft",
    colors: [
      { name: "Teal", hex: "#0D9488", role: "Primary" },
      { name: "Deep", hex: "#0F766E", role: "Primary dark" },
      { name: "Ink", hex: "#0C1B1A", role: "Surface" },
      { name: "Foam", hex: "#5EEAD4", role: "Accent soft" },
      { name: "Lime", hex: "#65A30D", role: "Positive" },
      { name: "Coral", hex: "#FB7185", role: "Attention" },
    ],
    typography: {
      display: "Inter · Semibold",
      body: "Inter · Regular · 15px / 1.6",
      mono: "ui-monospace · code & keys",
    },
    voice:
      "Tripket PH is the friendly guide at the dock. Warm, clear, and reassuring — we make booking a boat feel as easy as it should be.",
  },
  {
    slug: "planout",
    name: "PlanOut",
    tagline: "Planning & scheduling workspace",
    accent: "#2563EB",
    status: "draft",
    colors: [
      { name: "Blue", hex: "#2563EB", role: "Primary" },
      { name: "Deep", hex: "#1E3A8A", role: "Primary dark" },
      { name: "Slate", hex: "#0F172A", role: "Surface" },
      { name: "Sky", hex: "#93C5FD", role: "Accent soft" },
      { name: "Emerald", hex: "#10B981", role: "Positive" },
      { name: "Amber", hex: "#F59E0B", role: "Attention" },
    ],
    typography: {
      display: "Inter · Semibold",
      body: "Inter · Regular · 15px / 1.6",
      mono: "ui-monospace · code & keys",
    },
    voice:
      "PlanOut is the steady operator. We're direct, structured, and confident — we surface the plan and the numbers, never the hype.",
  },
  {
    slug: "asbir-tech-web",
    name: "Asbir Tech Web",
    tagline: "Studio & product engineering",
    accent: "#7C3AED",
    status: "draft",
    colors: [
      { name: "Violet", hex: "#7C3AED", role: "Primary" },
      { name: "Deep", hex: "#5B21B6", role: "Primary dark" },
      { name: "Night", hex: "#12111C", role: "Surface" },
      { name: "Lilac", hex: "#C4B5FD", role: "Accent soft" },
      { name: "Emerald", hex: "#10B981", role: "Positive" },
      { name: "Amber", hex: "#F59E0B", role: "Attention" },
    ],
    typography: {
      display: "Inter · Semibold",
      body: "Inter · Regular · 15px / 1.6",
      mono: "ui-monospace · code & keys",
    },
    voice:
      "Asbir Tech Web is the confident craftsperson. Precise, modern, and quietly ambitious — we let the work speak and keep the message sharp.",
  },
  {
    slug: "projectplaza",
    name: "ProjectPlaza",
    tagline: "Project marketplace & collaboration",
    accent: "#EA580C",
    status: "draft",
    colors: [
      { name: "Orange", hex: "#EA580C", role: "Primary" },
      { name: "Deep", hex: "#9A3412", role: "Primary dark" },
      { name: "Charcoal", hex: "#1C1512", role: "Surface" },
      { name: "Peach", hex: "#FDBA74", role: "Accent soft" },
      { name: "Teal", hex: "#0D9488", role: "Positive" },
      { name: "Rose", hex: "#F43F5E", role: "Attention" },
    ],
    typography: {
      display: "Inter · Semibold",
      body: "Inter · Regular · 15px / 1.6",
      mono: "ui-monospace · code & keys",
    },
    voice:
      "ProjectPlaza is the welcoming host. Energetic, approachable, and community-first — we make it easy to jump in and get building together.",
  },
  {
    slug: "beetzeeplay",
    name: "BeetzeePlay",
    tagline: "Music & audio streaming",
    accent: "#DB2777",
    status: "draft",
    colors: [
      { name: "Pink", hex: "#DB2777", role: "Primary" },
      { name: "Deep", hex: "#9D174D", role: "Primary dark" },
      { name: "Void", hex: "#140A12", role: "Surface" },
      { name: "Blush", hex: "#F9A8D4", role: "Accent soft" },
      { name: "Cyan", hex: "#06B6D4", role: "Positive" },
      { name: "Amber", hex: "#F59E0B", role: "Attention" },
    ],
    typography: {
      display: "Inter · Semibold",
      body: "Inter · Regular · 15px / 1.6",
      mono: "ui-monospace · code & keys",
    },
    voice:
      "BeetzeePlay is the after-hours DJ. Bold, playful, and full of rhythm — we bring energy and personality to every beat.",
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

/* ---- project index ---------------------------------------------------- */

function ProjectIndex() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        Projects
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        The brand kit for every project we run — colors, typography, logo, and
        voice, in one place. Open a project to see its identity; each kit is the
        source of truth product and marketing build from.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.slug}
            href={`#brand-kits/${p.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-panel p-4 transition-colors hover:border-[rgb(var(--accent)/0.5)]"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: p.accent }}
            >
              {p.name.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-fg">
                  {p.name}
                </span>
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

/* ---- per-project kit -------------------------------------------------- */

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      {desc && <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function KitView({ project }: { project: Project }) {
  const { copied, copy } = useCopy();

  return (
    <article className="animate-fade-up py-10">
      <a
        href="#brand-kits"
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← All projects
      </a>

      <div className="mt-3 flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
          style={{ backgroundColor: project.accent }}
        >
          {project.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-fg">
            {project.name}
          </h1>
          <p className="mt-1 text-[15px] text-fg/70">{project.tagline}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Colors — the main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Colors" desc="Click a swatch to copy its hex.">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {project.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => copy(c.hex)}
                  className="group overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-[rgb(var(--accent)/0.5)]"
                >
                  <span
                    className="block h-14 w-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="block px-2.5 py-2">
                    <span className="block truncate text-xs font-medium text-fg">
                      {c.name}
                    </span>
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
          </Card>

          <Card
            title="Brand voice"
            desc="How this project should sound in product copy and marketing."
          >
            <p className="text-sm leading-relaxed text-fg/80 dark:text-fg/70">
              {project.voice}
            </p>
          </Card>
        </div>

        {/* Identity — logo + type */}
        <div className="space-y-6">
          <Card title="Logo">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: project.accent }}
              >
                {project.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg">{project.name}</p>
                <p className="text-xs text-fg/60 dark:text-fg/40">
                  Primary mark
                </p>
              </div>
            </div>
          </Card>

          <Card title="Typography">
            <dl className="space-y-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-fg/50">
                  Display
                </dt>
                <dd className="text-lg font-semibold tracking-tight text-fg">
                  {project.typography.display}
                </dd>
              </div>
              <div className="border-t border-border pt-3">
                <dt className="text-[11px] uppercase tracking-wide text-fg/50">
                  Body
                </dt>
                <dd className="text-sm text-fg/80 dark:text-fg/70">
                  {project.typography.body}
                </dd>
              </div>
              <div className="border-t border-border pt-3">
                <dt className="text-[11px] uppercase tracking-wide text-fg/50">
                  Mono
                </dt>
                <dd className="font-mono text-sm text-fg/80 dark:text-fg/70">
                  {project.typography.mono}
                </dd>
              </div>
            </dl>
          </Card>
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
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        No kit for “{slug}”
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        There's no brand kit for this project yet. Pick one from the index, or
        add it to <span className="font-mono">PROJECTS</span> in{" "}
        <span className="font-mono">BrandKitsDocs.tsx</span>.
      </p>
    </article>
  );
}

/* ---- page ------------------------------------------------------------- */

/** `slug` is the project (e.g. "atlas"); "" renders the project index. */
export function BrandKitsDocs({ slug }: { slug: string }) {
  if (!slug) return <ProjectIndex />;
  const project = PROJECTS.find((p) => p.slug === slug);
  return project ? <KitView project={project} /> : <UnknownProject slug={slug} />;
}
