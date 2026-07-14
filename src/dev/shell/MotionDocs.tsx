import * as React from "react";
import {
  BarsReveal,
  BorderBeam,
  ChartReveal,
  Confetti,
  CountUp,
  FlipWords,
  Magnetic,
  Marquee,
  NumberTicker,
  PulseBeacon,
  RadialProgress,
  Reveal,
  Ripple,
  ShinyText,
  Stagger,
  StaggerItem,
  TextReveal,
  Typewriter,
  WaveText,
} from "@/motion";
import { Button, FilterChips, Pagination } from "@/index";

/*
  Motion docs. #motion is a filterable GALLERY of live motion pieces; each
  card routes to its own page (#motion/<slug>) with a large stage and the
  copyable usage snippet. Cards themselves carry no copy affordance — the
  detail page owns that.
*/

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ReplayIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
  </svg>
);

/* ---- demo helpers ------------------------------------------------------ */

/* The exact series behind the Lumina AI landing card's overview chart —
   s(0.3, "rising") from the AI template store, so the motion demo reads the
   same as the product. */
const LUMINA_SERIES = [
  0.416, 0.39, 0.351, 0.39, 0.307, 0.45, 0.609, 0.371, 0.569, 0.517, 0.617,
  0.491, 0.501, 0.529, 0.538, 0.392, 0.585, 0.571, 0.892, 0.626, 0.643, 0.755,
  0.747, 0.633, 0.818, 0.806, 0.829, 0.764, 0.807, 0.702,
];

/** The Lumina AI overview chart's look — a Catmull-Rom smoothed area with a
    gradient wash and an end-dot that pops in after the draw — in white (fg),
    with the draw/fill/dot markup ChartReveal expects. */
function MiniChart() {
  const data = LUMINA_SERIES;
  const W = 300, H = 100, padY = 10;
  const max = Math.max(...data);
  const n = data.length;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - padY - (v / max) * (H - padY * 2);
  const pts = data.map((v, i) => [x(i), y(v)] as const);

  // Catmull-Rom → cubic Bézier: a smooth curve through every point (same
  // math as the Lumina AreaChart)
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
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const [ex, ey] = pts[n - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full max-w-[17rem] overflow-visible">
      <defs>
        <linearGradient id="motion-demo-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--fg-rgb))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(var(--fg-rgb))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#motion-demo-area)" />
      <path d={line} fill="none" stroke="rgb(var(--fg-rgb))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {/* end dot — halo + core, pops once the line reaches it */}
      <g data-asbir-dot>
        <circle cx={ex} cy={ey} r="7" fill="rgb(var(--fg-rgb))" opacity="0.18" />
        <circle cx={ex} cy={ey} r="3.5" fill="rgb(var(--fg-rgb))" stroke="rgb(var(--panel))" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function TickerDemo() {
  const VALUES = [128, 4096, 12480, 89312];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % VALUES.length), 2200);
    return () => window.clearInterval(t);
  }, []);
  return <NumberTicker value={VALUES[i]} className="text-3xl font-semibold tracking-tight text-fg" />;
}

const MARQUEE_BRANDS = ["AsbirUI", "Lumina", "Tripket PH", "PlanOut", "BeetzeePlay", "ProjectPlaza"];

/* ---- registry ---------------------------------------------------------- */

type Category = "Entrance" | "Pointer" | "Text" | "Charts" | "Looping";

type MotionDemo = {
  id: string;
  name: string;
  category: Category;
  description: string;
  /** Remount the demo when the pointer enters the stage (entrances). */
  replayOnHover?: boolean;
  render: () => React.ReactNode;
  code: string;
};

const DEMOS: MotionDemo[] = [
  /* ---- Pointer ---- */
  {
    id: "magnetic",
    name: "Magnetic",
    category: "Pointer",
    description: "Pulls its child toward the pointer while hovered and springs back on leave.",
    render: () => (
      <Magnetic>
        <Button>Hover me</Button>
      </Magnetic>
    ),
    code: `<Magnetic strength={14}>
  <Button>Hover me</Button>
</Magnetic>`,
  },
  {
    id: "ripple",
    name: "Ripple",
    category: "Pointer",
    description: "A material-style ring expands out of the click point and fades.",
    render: () => (
      <Ripple className="rounded-asbir">
        <Button variant="secondary">Click me</Button>
      </Ripple>
    ),
    code: `<Ripple className="rounded-asbir">
  <Button variant="secondary">Click me</Button>
</Ripple>`,
  },
  {
    id: "confetti",
    name: "Confetti",
    category: "Pointer",
    description: "A paper burst erupts from the click point — for ship moments.",
    render: () => (
      <Confetti>
        <Button>Ship it</Button>
      </Confetti>
    ),
    code: `<Confetti count={26}>
  <Button>Ship it</Button>
</Confetti>`,
  },

  /* ---- Text ---- */
  {
    id: "typewriter",
    name: "Typewriter",
    category: "Text",
    description: "Types each word, holds, deletes, and moves to the next in a loop.",
    render: () => (
      <p className="text-lg font-semibold tracking-tight text-fg">
        Ship{" "}
        <Typewriter
          words={["components", "templates", "dashboards", "motion"]}
          className="text-accent-soft-fg"
        />
      </p>
    ),
    code: `<Typewriter words={["components", "templates", "dashboards"]} />`,
  },
  {
    id: "flip-words",
    name: "Flip Words",
    category: "Text",
    description: "Rotates through words with a 3D flip-up entrance.",
    render: () => (
      <p className="text-lg font-semibold tracking-tight text-fg">
        Built for{" "}
        <FlipWords words={["designers", "engineers", "founders"]} className="text-accent-soft-fg" />
      </p>
    ),
    code: `<FlipWords words={["designers", "engineers", "founders"]} interval={2200} />`,
  },
  {
    id: "wave-text",
    name: "Wave Text",
    category: "Text",
    description: "Letters bob through a continuous wave.",
    render: () => (
      <WaveText text="AsbirMotion" className="text-xl font-semibold tracking-tight text-fg" />
    ),
    code: `<WaveText text="AsbirMotion" stagger={0.06} />`,
  },
  {
    id: "shiny-text",
    name: "Shiny Text",
    category: "Text",
    description: "A specular highlight sweeps across the text in a loop.",
    render: () => (
      <span className="rounded-full border border-border bg-panel px-4 py-1.5">
        <ShinyText className="text-sm font-medium">✦ Introducing AsbirMotion</ShinyText>
      </span>
    ),
    code: `<ShinyText speed={2.6}>Introducing AsbirMotion</ShinyText>`,
  },
  {
    id: "text-reveal",
    name: "Text Reveal",
    category: "Text",
    description: "Each word rises out of a blur, staggered left to right, on view.",
    replayOnHover: true,
    render: () => (
      <TextReveal
        text="Motion that ships with the system"
        className="max-w-[16rem] text-center text-lg font-semibold leading-snug tracking-tight text-fg"
      />
    ),
    code: `<TextReveal text="Motion that ships with the system" stagger={0.05} />`,
  },
  {
    id: "count-up",
    name: "Count Up",
    category: "Text",
    description: "Eases a number up from zero when it scrolls into view.",
    replayOnHover: true,
    render: () => (
      <div className="text-center">
        <p className="text-3xl font-semibold tracking-tight text-fg">
          <CountUp to={1248930} />
        </p>
        <p className="mt-1 text-xs text-fg/55">requests this month</p>
      </div>
    ),
    code: `<CountUp to={1248930} duration={1.4} />`,
  },
  {
    id: "number-ticker",
    name: "Number Ticker",
    category: "Text",
    description: "An odometer — each digit rolls vertically to its new position on change.",
    render: () => <TickerDemo />,
    code: `<NumberTicker value={liveValue} />`,
  },

  /* ---- Charts ---- */
  {
    id: "chart-reveal",
    name: "Chart Reveal",
    category: "Charts",
    description: "Draws stroked lines left-to-right and fades area fills in as they complete.",
    replayOnHover: true,
    render: () => (
      <ChartReveal>
        <MiniChart />
      </ChartReveal>
    ),
    code: `<ChartReveal delay={0.1}>
  <svg>…your chart paths…</svg>
</ChartReveal>`,
  },
  {
    id: "bars-reveal",
    name: "Bars Reveal",
    category: "Charts",
    description: "Bars grow up out of the baseline one after another on view.",
    replayOnHover: true,
    render: () => <BarsReveal values={[0.35, 0.6, 0.45, 0.8, 0.55, 1, 0.7, 0.9]} />,
    code: `<BarsReveal values={[0.35, 0.6, 0.45, 0.8, 0.55, 1]} stagger={0.07} />`,
  },
  {
    id: "radial-progress",
    name: "Radial Progress",
    category: "Charts",
    description: "A donut sweeps to its value while the center counts up with it.",
    replayOnHover: true,
    render: () => <RadialProgress value={72} />,
    code: `<RadialProgress value={72} size={96} strokeWidth={8} />`,
  },

  /* ---- Looping ---- */
  {
    id: "border-beam",
    name: "Border Beam",
    category: "Looping",
    description: "A streak of light endlessly laps the card's border.",
    render: () => (
      <div className="relative w-56 rounded-xl border border-border bg-panel p-5">
        <BorderBeam />
        <p className="text-sm font-semibold text-fg">Border Beam</p>
        <p className="mt-1 text-xs text-fg/55">Light on patrol</p>
      </div>
    ),
    code: `<div className="relative rounded-xl border border-border bg-panel p-5">
  <BorderBeam duration={6} />
  …card content…
</div>`,
  },
  {
    id: "marquee",
    name: "Marquee",
    category: "Looping",
    description: "A seamless infinite strip — logos, tickers, social proof.",
    render: () => (
      <Marquee duration={16} className="w-full max-w-[18rem]">
        {MARQUEE_BRANDS.map((b) => (
          <span key={b} className="whitespace-nowrap text-sm font-medium text-fg/60">
            {b}
          </span>
        ))}
      </Marquee>
    ),
    code: `<Marquee duration={28} gap={40}>
  {logos.map((l) => <Logo key={l.id} {...l} />)}
</Marquee>`,
  },
  {
    id: "pulse-beacon",
    name: "Pulse Beacon",
    category: "Looping",
    description: "A live-status dot radiating expanding rings.",
    render: () => (
      <div className="flex items-center gap-3">
        <PulseBeacon />
        <span className="text-sm font-medium text-fg">Live on production</span>
      </div>
    ),
    code: `<PulseBeacon /> Live on production`,
  },

  /* ---- Entrance ---- */
  {
    id: "reveal",
    name: "Reveal",
    category: "Entrance",
    description: "Fades and slides content in as it scrolls into view.",
    replayOnHover: true,
    render: () => (
      <Reveal className="rounded-xl border border-border bg-panel px-6 py-4 text-sm font-medium text-fg">
        Revealed on view
      </Reveal>
    ),
    code: `<Reveal direction="up" delay={0.1}>
  <Card>…</Card>
</Reveal>`,
  },
  {
    id: "stagger",
    name: "Stagger",
    category: "Entrance",
    description: "Reveals a group of children one after another.",
    replayOnHover: true,
    render: () => (
      <Stagger className="flex gap-2.5">
        {["One", "Two", "Three"].map((t) => (
          <StaggerItem key={t} className="rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-fg">
            {t}
          </StaggerItem>
        ))}
      </Stagger>
    ),
    code: `<Stagger gap={0.08}>
  {items.map((i) => (
    <StaggerItem key={i.id}>{i.label}</StaggerItem>
  ))}
</Stagger>`,
  },
];

const CATEGORIES = ["All", "Entrance", "Pointer", "Text", "Charts", "Looping"] as const;

export const MOTION_SLUGS = DEMOS.map((d) => d.id);

/* ---- stage (shared by cards + detail) ----------------------------------- */

function Stage({
  demo,
  tall = false,
}: {
  demo: MotionDemo;
  tall?: boolean;
}) {
  const [key, setKey] = React.useState(0);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-canvas p-6 ${
        tall ? "min-h-[22rem] rounded-xl border border-border" : "h-56 border-b border-border"
      }`}
      onMouseEnter={demo.replayOnHover ? () => setKey((k) => k + 1) : undefined}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--fg-rgb) / 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(75% 75% at 50% 50%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(75% 75% at 50% 50%, black, transparent 80%)",
        }}
      />
      {tall && demo.replayOnHover && (
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-2 py-1 text-[11px] font-medium text-fg/60 transition-colors hover:text-fg"
        >
          {ReplayIcon} Replay
        </button>
      )}
      <div key={key} className="relative flex w-full items-center justify-center">
        {demo.render()}
      </div>
    </div>
  );
}

/* ---- detail page (#motion/<slug>) ---------------------------------------- */

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="not-prose mt-4 overflow-hidden rounded-xl border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] font-medium tracking-wide text-fg/60">TSX</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-xs text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-fg/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MotionDetail({ demo }: { demo: MotionDemo }) {
  return (
    <>
      <a
        href="#motion"
        className="inline-flex items-center gap-1.5 text-sm text-fg/60 transition-colors hover:text-fg"
      >
        <span className="rotate-180 [&_svg]:h-3.5 [&_svg]:w-3.5">{ArrowIcon}</span> All motion
      </a>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{demo.name}</h1>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-fg/55">
          {demo.category}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">{demo.description}</p>

      <div className="mt-6">
        <Stage demo={demo} tall />
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight text-fg">Usage</h2>
      <CodeBlock code={demo.code} />
    </>
  );
}

/* ---- gallery card ---------------------------------------------------------- */

function GalleryCard({ demo }: { demo: MotionDemo }) {
  return (
    <a
      href={`#motion/${demo.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas transition-colors hover:border-fg/20"
    >
      <Stage demo={demo} />
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <p className="truncate text-sm font-semibold text-fg">{demo.name}</p>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-fg/55">
          {demo.category}
        </span>
      </div>
    </a>
  );
}

/* ---- page ------------------------------------------------------------- */

// 12 per page = 3 full rows at the gallery's xl:grid-cols-4 (and 4 rows at
// lg:grid-cols-3), so pages stay full at both breakpoints.
const PAGE_SIZE = 12;

export function MotionDocs({ slug = "" }: { slug?: string }) {
  const [category, setCategory] = React.useState<string>("All");
  const [page, setPage] = React.useState(1);
  const detail = slug ? DEMOS.find((d) => d.id === slug) : undefined;
  const filtered = DEMOS.filter((d) => category === "All" || d.category === category);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  // changing the filter can shrink pageCount out from under the current page
  // (e.g. paged to 3, then filter to a category with only 1 page) — reset
  // rather than land on a page that no longer exists.
  const setCategoryAndReset = (next: string) => {
    setCategory(next);
    setPage(1);
  };

  return (
    <article className="animate-fade-up py-10">
      {detail ? (
        <MotionDetail demo={detail} />
      ) : (
        <>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">Asbir Motion</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
            Microinteractions &amp; animations built to pair with AsbirUI — pointer physics, text
            effects, charts, and loops. Everything honors{" "}
            <span className="text-fg">prefers-reduced-motion</span>.
          </p>
          <div className="mt-8">
            <FilterChips
              label="Type"
              value={category}
              onValueChange={setCategoryAndReset}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((demo) => (
              <GalleryCard key={demo.id} demo={demo} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={clampedPage}
                total={pageCount}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}

          <div className="mt-12 flex items-center gap-3 border-t border-border pt-8 text-sm text-fg/60">
            <span>Every piece resolves to a readable static state under reduced motion.</span>
            <a href="#components" className="inline-flex items-center gap-1 font-medium text-fg transition-colors hover:text-accent">
              Browse components {ArrowIcon}
            </a>
          </div>
        </>
      )}
    </article>
  );
}

