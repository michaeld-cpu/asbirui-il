import * as React from "react";
import {
  ChartReveal,
  CountUp,
  Magnetic,
  Marquee,
  Reveal,
  ShinyText,
  SpotlightCard,
  Stagger,
  StaggerItem,
  TextReveal,
  TiltCard,
  Typewriter,
} from "@/motion";
import { Button, FilterChips } from "@/index";
import asbirLogo from "@/assets/logo/asbirlogo-white.svg";

/*
  Motion docs (route: #motion) — a filterable GALLERY of live motion pieces
  (framer-style template-gallery layout). Every card is the real component
  animating: pointer demos react to the cursor, loops run continuously, and
  entrance demos replay on hover. The Copy button on each card copies its
  usage snippet.
*/

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const CopyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ---- demo helpers ------------------------------------------------------ */

/** A tiny standalone area chart so the Motion page doesn't depend on the AI
    template. Same draw/fill markup ChartReveal looks for. */
function MiniChart() {
  const data = [8, 14, 10, 22, 18, 30, 24, 38, 34, 46];
  const W = 300, H = 90, pad = 8;
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - pad - (v / max) * (H - pad * 2),
  ] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full max-w-[16rem] overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="motion-demo-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#motion-demo-area)" />
      <path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const MARQUEE_BRANDS = ["AsbirUI", "Lumina", "Tripket PH", "PlanOut", "BeetzeePlay", "ProjectPlaza"];

/* ---- gallery registry ---------------------------------------------------- */

type Category = "Entrance" | "Pointer" | "Text" | "Looping";

type MotionDemo = {
  id: string;
  name: string;
  category: Category;
  /** Remount the demo when the pointer enters the preview (entrances). */
  replayOnHover?: boolean;
  render: () => React.ReactNode;
  code: string;
};

const DEMOS: MotionDemo[] = [
  {
    id: "tilt-card",
    name: "Tilt Card",
    category: "Pointer",
    render: () => (
      <TiltCard className="w-48 rounded-xl border border-border bg-gradient-to-br from-overlay/[0.1] to-transparent bg-panel p-4 shadow-xl">
        <img src={asbirLogo} alt="" width={22} height={20} className="[html.light_&]:invert" />
        <p className="mt-5 text-sm font-semibold text-fg">AsbirUI</p>
        <p className="text-xs text-fg/55">Move your cursor</p>
      </TiltCard>
    ),
    code: `<TiltCard maxTilt={10} className="rounded-xl border border-border bg-panel p-4">
  …card content…
</TiltCard>`,
  },
  {
    id: "magnetic",
    name: "Magnetic",
    category: "Pointer",
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
    id: "spotlight-card",
    name: "Spotlight Card",
    category: "Pointer",
    render: () => (
      <SpotlightCard className="w-56 rounded-xl border border-border bg-panel p-5">
        <p className="text-sm font-semibold text-fg">Spotlight</p>
        <p className="mt-1 text-xs leading-relaxed text-fg/55">
          A glow tracks your cursor across the surface
        </p>
      </SpotlightCard>
    ),
    code: `<SpotlightCard radius={240} className="rounded-xl border border-border bg-panel p-5">
  …card content…
</SpotlightCard>`,
  },
  {
    id: "typewriter",
    name: "Typewriter",
    category: "Text",
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
    id: "text-reveal",
    name: "Text Reveal",
    category: "Text",
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
    id: "shiny-text",
    name: "Shiny Text",
    category: "Text",
    render: () => (
      <span className="rounded-full border border-border bg-panel px-4 py-1.5">
        <ShinyText className="text-sm font-medium">✦ Introducing AsbirMotion</ShinyText>
      </span>
    ),
    code: `<ShinyText speed={2.6}>Introducing AsbirMotion</ShinyText>`,
  },
  {
    id: "marquee",
    name: "Marquee",
    category: "Looping",
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
    id: "reveal",
    name: "Reveal",
    category: "Entrance",
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
  {
    id: "chart-reveal",
    name: "Chart Reveal",
    category: "Entrance",
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
    id: "hover-press",
    name: "Lift & Press",
    category: "Pointer",
    render: () => (
      <div className="flex gap-3">
        <span className="as-lift flex h-12 w-24 cursor-pointer items-center justify-center rounded-lg border border-border bg-panel text-xs font-medium text-fg">
          as-lift
        </span>
        <span className="as-press flex h-12 w-24 cursor-pointer select-none items-center justify-center rounded-lg border border-border bg-panel text-xs font-medium text-fg">
          as-press
        </span>
      </div>
    ),
    code: `/* zero-JS — from motion.css */
<button className="as-lift">Hover</button>
<button className="as-press">Press</button>`,
  },
];

const CATEGORIES = ["All", "Entrance", "Pointer", "Text", "Looping"] as const;

/* ---- gallery card -------------------------------------------------------- */

function GalleryCard({ demo }: { demo: MotionDemo }) {
  const [key, setKey] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(demo.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel">
      {/* live stage */}
      <div
        className="relative flex h-56 items-center justify-center overflow-hidden border-b border-border bg-canvas p-6"
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
        <div key={key} className="relative flex w-full items-center justify-center">
          {demo.render()}
        </div>
      </div>
      {/* caption */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{demo.name}</p>
          <p className="mt-0.5 text-xs text-fg/55">
            {demo.category}
            {demo.replayOnHover ? " · hover to replay" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
        >
          <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{copied ? CheckIcon : CopyIcon}</span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* ---- page ------------------------------------------------------------- */

export function MotionDocs() {
  const [category, setCategory] = React.useState<string>("All");
  const visible = DEMOS.filter((d) => category === "All" || d.category === category);

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Asbir Motion</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        Microinteractions &amp; animations built to pair with AsbirUI — pointer physics, text
        effects, loops, and entrances. Everything honors{" "}
        <span className="text-fg">prefers-reduced-motion</span>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import &#123; TiltCard, Magnetic, Typewriter, Marquee &#125; from "@asbirtech/asbir-ui/motion"</code>
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import "@asbirtech/asbir-ui/motion.css"</code>
      </div>

      {/* category filter */}
      <div className="mt-8">
        <FilterChips
          label="Type"
          value={category}
          onValueChange={setCategory}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {/* gallery */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((demo) => (
          <GalleryCard key={demo.id} demo={demo} />
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3 border-t border-border pt-8 text-sm text-fg/60">
        <span>Full API + reduced-motion behavior lives in the motion package.</span>
        <a href="#components" className="inline-flex items-center gap-1 font-medium text-fg transition-colors hover:text-accent">
          Browse components {ArrowIcon}
        </a>
      </div>
    </article>
  );
}
