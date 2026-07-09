import * as React from "react";
import { ChartReveal, Reveal, Stagger, StaggerItem } from "@/motion";

/*
  Motion docs (route: #motion) — the destination for "Explore Asbir Motion".
  Live demos of the motion layer: the framer-free ChartReveal, the scroll
  Reveal/Stagger (framer), and the zero-runtime CSS utility classes. Each demo
  can be replayed so the entrance is visible on demand.
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

/* ---- shared chrome ---------------------------------------------------- */

/** A framed live-demo stage with a Replay button that remounts `render` so the
    entrance animation plays again on demand. */
function DemoStage({ render }: { render: (key: number) => React.ReactNode }) {
  const [key, setKey] = React.useState(0);
  return (
    <div className="not-prose mt-4 rounded-xl border border-border bg-panel">
      <div className="flex items-center justify-end border-b border-border px-3 py-1.5">
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
        >
          {ReplayIcon} Replay
        </button>
      </div>
      <div className="flex min-h-[180px] items-center justify-center p-8">
        <div key={key}>{render(key)}</div>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="not-prose mt-3 overflow-hidden rounded-xl border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] font-medium tracking-wide text-fg/60">TSX</span>
        <button type="button" onClick={copy} className="rounded-md px-2 py-1 text-xs text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-fg/85"><code>{code}</code></pre>
    </div>
  );
}

function Section({ title, tagline, children }: { title: string; tagline: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 border-t border-border pt-10 first:mt-8 first:border-0 first:pt-0">
      <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-fg/60">{tagline}</p>
      {children}
    </section>
  );
}

/* ---- demo: ChartReveal ------------------------------------------------ */

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
    <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full max-w-md overflow-visible" preserveAspectRatio="none">
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

/* ---- CSS utility swatches --------------------------------------------- */

const CSS_UTILS: { cls: string; label: string; desc: string }[] = [
  { cls: "as-lift", label: "as-lift", desc: "Hover — nudge up + shadow" },
  { cls: "as-press", label: "as-press", desc: "Active — subtle squash" },
  { cls: "as-pulse", label: "as-pulse", desc: "Breathing opacity (live/loading)" },
  { cls: "as-shimmer", label: "as-shimmer", desc: "Sweeping highlight (skeletons)" },
];

/* ---- page ------------------------------------------------------------- */

export function MotionDocs() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Asbir Motion</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        Microinteractions &amp; animations built to pair with AsbirUI. A
        zero-runtime CSS layer for microinteractions, plus opt-in React
        components (framer-motion) for entrances. Everything honors{" "}
        <span className="text-fg">prefers-reduced-motion</span>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import &#123; ChartReveal, Reveal, Stagger &#125; from "@asbirtech/asbir-ui/motion"</code>
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">import "@asbirtech/asbir-ui/motion.css"</code>
      </div>

      <Section
        title="Chart Reveal"
        tagline="Draws a chart's stroked lines left-to-right and fades the area fills up as they complete. Framer-free — wraps any SVG chart and plays on scroll-into-view."
      >
        <DemoStage render={(k) => (
          <ChartReveal key={k}>
            <MiniChart />
          </ChartReveal>
        )} />
        <CodeBlock code={`<ChartReveal delay={0.1}>
  <svg>…your chart paths…</svg>
</ChartReveal>`} />
      </Section>

      <Section
        title="Reveal"
        tagline="Fades and slides content in as it scrolls into view (framer-motion). Configurable direction, distance, delay, duration."
      >
        <DemoStage render={(k) => (
          <Reveal key={k} className="rounded-xl border border-border bg-canvas px-6 py-4 text-sm font-medium text-fg">
            Revealed on view
          </Reveal>
        )} />
        <CodeBlock code={`<Reveal direction="up" delay={0.1}>
  <Card>…</Card>
</Reveal>`} />
      </Section>

      <Section
        title="Stagger"
        tagline="Reveals a group of children one after another. Wrap items in <StaggerItem>."
      >
        <DemoStage render={(k) => (
          <Stagger key={k} className="flex gap-3">
            {["One", "Two", "Three", "Four"].map((t) => (
              <StaggerItem key={t} className="rounded-lg border border-border bg-canvas px-4 py-3 text-sm text-fg">
                {t}
              </StaggerItem>
            ))}
          </Stagger>
        )} />
        <CodeBlock code={`<Stagger gap={0.08}>
  {items.map((i) => (
    <StaggerItem key={i.id}>{i.label}</StaggerItem>
  ))}
</Stagger>`} />
      </Section>

      <Section
        title="CSS utilities"
        tagline="Zero-runtime classes from motion.css — no JS, no framer. Hover / press / pulse / shimmer."
      >
        <div className="not-prose mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CSS_UTILS.map((u) => (
            <div key={u.cls} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-panel p-4 text-center">
              <span className={`${u.cls} flex h-12 w-full items-center justify-center rounded-lg bg-overlay/[0.06] text-xs font-medium text-fg`}>
                Hover me
              </span>
              <code className="text-[11px] text-accent-soft-fg">{u.label}</code>
              <span className="text-[11px] leading-tight text-fg/55">{u.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-12 flex items-center gap-3 border-t border-border pt-8 text-sm text-fg/60">
        <span>Full API + reduced-motion behavior lives in the motion package.</span>
        <a href="#components" className="inline-flex items-center gap-1 font-medium text-fg transition-colors hover:text-accent">
          Browse components {ArrowIcon}
        </a>
      </div>
    </article>
  );
}
