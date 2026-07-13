import * as React from "react";
import {
  Aurora,
  BarsReveal,
  BorderBeam,
  CardStack,
  ChartReveal,
  Confetti,
  CountUp,
  Dock,
  DockItem,
  Equalizer,
  FlipWords,
  GradientBlob,
  GradientText,
  HoverFlip,
  Magnetic,
  Marquee,
  Meteors,
  NumberTicker,
  Orbit,
  Particles,
  PulseBeacon,
  RadialProgress,
  Reveal,
  Ripple,
  ScrambleText,
  ShinyText,
  Stagger,
  StaggerItem,
  TextReveal,
  Typewriter,
  WaveText,
} from "@/motion";
import { Button, FilterChips } from "@/index";
import asbirLogo from "@/assets/logo/asbirlogo-white.svg";

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

/** A tiny standalone area chart with the draw/fill markup ChartReveal expects. */
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

function TickerDemo() {
  const VALUES = [128, 4096, 12480, 89312];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % VALUES.length), 2200);
    return () => window.clearInterval(t);
  }, []);
  return <NumberTicker value={VALUES[i]} className="text-3xl font-semibold tracking-tight text-fg" />;
}

const DOCK_ICONS: { label: string; path: string }[] = [
  { label: "Home", path: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" },
  { label: "Search", path: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm10 17-4.3-4.3" },
  { label: "Charts", path: "M4 20V10m6 10V4m6 16v-7m4 7H2" },
  { label: "Mail", path: "M4 5h16v14H4V5Zm0 2 8 6 8-6" },
  { label: "Settings", path: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm8.5 4a8.4 8.4 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8.6 8.6 0 0 0-2-1.2L15.5 3h-4l-.5 2.6a8.6 8.6 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a8.4 8.4 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a8.6 8.6 0 0 0 2 1.2l.5 2.6h4l.5-2.6a8.6 8.6 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.06-.4.1-.8.1-1.2Z" },
];

const MARQUEE_BRANDS = ["AsbirUI", "Lumina", "Tripket PH", "PlanOut", "BeetzeePlay", "ProjectPlaza"];

const STACK_CARDS = [
  { title: "Deploy complete", body: "lumina-web is live on production" },
  { title: "Build queued", body: "asbir-docs is 2nd in line" },
  { title: "2FA enabled", body: "All members now require a second factor" },
].map((c) => (
  <div key={c.title} className="flex h-full flex-col justify-center rounded-xl border border-border bg-panel px-4 shadow-lg">
    <p className="text-sm font-medium text-fg">{c.title}</p>
    <p className="mt-0.5 text-xs text-fg/55">{c.body}</p>
  </div>
));

/* ---- registry ---------------------------------------------------------- */

type Category = "Entrance" | "Pointer" | "Text" | "Charts" | "Background" | "Looping";

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
    id: "dock",
    name: "Dock",
    category: "Pointer",
    description: "The macOS dock — tiles magnify as the pointer nears and relax as it leaves, on springs.",
    render: () => (
      <Dock>
        {DOCK_ICONS.map((icon) => (
          <DockItem key={icon.label} aria-label={icon.label}>
            <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon.path} />
            </svg>
          </DockItem>
        ))}
      </Dock>
    ),
    code: `<Dock>
  {apps.map((app) => (
    <DockItem key={app.id} aria-label={app.label}>
      {app.icon}
    </DockItem>
  ))}
</Dock>`,
  },
  {
    id: "hover-flip",
    name: "Hover Flip",
    category: "Pointer",
    description: "A card that flips in 3D on hover to reveal its back face.",
    render: () => (
      <HoverFlip
        className="h-32 w-52"
        front={
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-panel">
            <img src={asbirLogo} alt="" width={22} height={20} className="[html.light_&]:invert" />
            <p className="text-xs text-fg/55">Hover to flip</p>
          </div>
        }
        back={
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
            <p className="text-sm font-semibold text-fg">AsbirUI</p>
            <p className="mt-0.5 text-xs text-fg/55">16 components · 4 blocks</p>
          </div>
        }
      />
    ),
    code: `<HoverFlip
  className="h-32 w-52"
  front={<CardFront />}
  back={<CardBack />}
/>`,
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
  {
    id: "lift-press",
    name: "Lift & Press",
    category: "Pointer",
    description: "Zero-JS hover lift and active squash from motion.css.",
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
    id: "scramble-text",
    name: "Scramble Text",
    category: "Text",
    description: "Decodes from random glyphs into the target text, left to right.",
    replayOnHover: true,
    render: () => (
      <ScrambleText
        text="ACCESS GRANTED"
        className="font-mono text-lg font-semibold tracking-widest text-fg"
      />
    ),
    code: `<ScrambleText text="ACCESS GRANTED" duration={1.1} />`,
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
    id: "gradient-text",
    name: "Gradient Text",
    category: "Text",
    description: "A color gradient flows continuously through the glyphs.",
    render: () => (
      <GradientText className="text-2xl font-semibold tracking-tight">
        Design with motion
      </GradientText>
    ),
    code: `<GradientText colors={["#8b5cf6", "#06b6d4", "#8b5cf6"]} speed={4}>
  Design with motion
</GradientText>`,
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

  /* ---- Background ---- */
  {
    id: "aurora",
    name: "Aurora",
    category: "Background",
    description: "Two blurred color fields drift against each other — an ambient backdrop.",
    render: () => (
      <div className="relative h-32 w-64 overflow-hidden rounded-xl border border-border">
        <Aurora className="absolute inset-0" />
        <p className="relative flex h-full items-center justify-center text-sm font-medium text-fg">
          Aurora backdrop
        </p>
      </div>
    ),
    code: `<div className="relative overflow-hidden rounded-xl">
  <Aurora className="absolute inset-0" />
  <HeroContent />
</div>`,
  },
  {
    id: "gradient-blob",
    name: "Gradient Blob",
    category: "Background",
    description: "An organic gradient blob that slowly morphs its silhouette.",
    render: () => <GradientBlob className="h-24 w-24" />,
    code: `<GradientBlob className="h-40 w-40" />`,
  },
  {
    id: "particles",
    name: "Particles",
    category: "Background",
    description: "A canvas field of softly drifting dots that fills its parent.",
    render: () => (
      <div className="relative h-32 w-64 overflow-hidden rounded-xl border border-border bg-panel">
        <Particles className="absolute inset-0" />
        <p className="relative flex h-full items-center justify-center text-sm font-medium text-fg">
          48 drifting dots
        </p>
      </div>
    ),
    code: `<div className="relative">
  <Particles count={48} className="absolute inset-0" />
  <HeroContent />
</div>`,
  },
  {
    id: "meteors",
    name: "Meteors",
    category: "Background",
    description: "Falling light streaks raining through the parent, clipped to its radius.",
    render: () => (
      <div className="relative h-32 w-64 overflow-hidden rounded-xl border border-border bg-panel">
        <Meteors count={10} />
        <p className="relative flex h-full items-center justify-center text-sm font-medium text-fg">
          Meteor shower
        </p>
      </div>
    ),
    code: `<div className="relative overflow-hidden rounded-xl">
  <Meteors count={10} />
  <CardContent />
</div>`,
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
    id: "card-stack",
    name: "Card Stack",
    category: "Looping",
    description: "Stacked cards cycle — the top springs to the back on an interval.",
    render: () => <CardStack items={STACK_CARDS} className="h-24 w-64" />,
    code: `<CardStack
  items={[<CardA />, <CardB />, <CardC />]}
  interval={2600}
/>`,
  },
  {
    id: "orbit",
    name: "Orbit",
    category: "Looping",
    description: "Satellites orbit a core on counter-rotating rings.",
    render: () => <Orbit />,
    code: `<Orbit duration={8} />`,
  },
  {
    id: "equalizer",
    name: "Equalizer",
    category: "Looping",
    description: "Audio-style bars bouncing out of phase.",
    render: () => <Equalizer />,
    code: `<Equalizer bars={5} />`,
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

const CATEGORIES = ["All", "Entrance", "Pointer", "Text", "Charts", "Background", "Looping"] as const;

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

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import &#123; {demo.name.replace(/\s|&/g, "")} &#125; from "@asbirtech/asbir-ui/motion"</code>
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import "@asbirtech/asbir-ui/motion.css"</code>
      </div>
    </>
  );
}

/* ---- gallery card ---------------------------------------------------------- */

function GalleryCard({ demo }: { demo: MotionDemo }) {
  return (
    <a
      href={`#motion/${demo.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel transition-colors hover:border-fg/20"
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

export function MotionDocs({ slug = "" }: { slug?: string }) {
  const [category, setCategory] = React.useState<string>("All");
  const detail = slug ? DEMOS.find((d) => d.id === slug) : undefined;
  const visible = DEMOS.filter((d) => category === "All" || d.category === category);

  return (
    <article className="animate-fade-up py-10">
      {detail ? (
        <MotionDetail demo={detail} />
      ) : (
        <>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">Asbir Motion</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
            Microinteractions &amp; animations built to pair with AsbirUI — pointer physics, text
            effects, charts, ambient backdrops, and loops. Everything honors{" "}
            <span className="text-fg">prefers-reduced-motion</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import &#123; Dock, ScrambleText, BorderBeam, BarsReveal &#125; from "@asbirtech/asbir-ui/motion"</code>
            <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import "@asbirtech/asbir-ui/motion.css"</code>
          </div>

          <div className="mt-8">
            <FilterChips
              label="Type"
              value={category}
              onValueChange={setCategory}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((demo) => (
              <GalleryCard key={demo.id} demo={demo} />
            ))}
          </div>

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
