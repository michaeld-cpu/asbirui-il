import * as React from "react";

/*
  Typography — Tokens → Typography (#tokens/typography).

  A live specimen for Asbir Sans, our own self-hosted variable typeface
  (wght 100–900, opsz 14–32). Modeled on the "Asbir Sans Studio" playground:

    · Interactive specimen — Size / Weight / Letter-spacing sliders + a
      sample-text switcher (Sentence / Pangram / Interface / Code / Numbers).
    · Nine-weight ladder — every named instance, live.
    · Glyph grid — the character set, filterable.
    · Details — OpenType-ish notes + a few multilingual samples.

  Everything renders in "Asbir Sans" (see the @font-face in tokens.css). This is
  the company-wide type reference; the brand-kit Font section stays a brief
  per-project view.
*/

const ASBIR = "'Asbir Sans', Inter, sans-serif";

/* ---- sample texts ----------------------------------------------------- */

const SAMPLES: { id: string; label: string; text: string }[] = [
  { id: "sentence", label: "Sentence", text: "Design once, ship everywhere." },
  { id: "pangram", label: "Pangram", text: "The quick brown fox jumps over the lazy dog." },
  { id: "interface", label: "Interface", text: "Dashboard · Settings · 12 new alerts · Save changes" },
  { id: "code", label: "Code", text: "const theme = useTheme(); // 0123456789" },
  { id: "numbers", label: "Numbers", text: "0123456789 ₱4,820,000 +12.5% −8% 97.6%" },
];

/* ---- weights ---------------------------------------------------------- */

const WEIGHTS = [
  { name: "Thin", w: 100 },
  { name: "ExtraLight", w: 200 },
  { name: "Light", w: 300 },
  { name: "Regular", w: 400 },
  { name: "Medium", w: 500 },
  { name: "SemiBold", w: 600 },
  { name: "Bold", w: 700 },
  { name: "ExtraBold", w: 800 },
  { name: "Black", w: 900 },
];

/* ---- glyph set -------------------------------------------------------- */

const GLYPH_SETS: { id: string; label: string; chars: string }[] = [
  { id: "upper", label: "Uppercase", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { id: "lower", label: "Lowercase", chars: "abcdefghijklmnopqrstuvwxyz" },
  { id: "figures", label: "Figures", chars: "0123456789" },
  { id: "punct", label: "Punctuation", chars: ".,;:!?·—–-…“”‘’\"'()[]{}/\\&@#%*+=<>" },
  { id: "symbols", label: "Symbols", chars: "$€£¥₱¢©®™°§¶†‡•" },
];

/* ---- multilingual ----------------------------------------------------- */

const LANGS: { label: string; text: string }[] = [
  { label: "French", text: "Voix ambiguë d'un cœur qui préfère les jattes de kiwis." },
  { label: "Vietnamese", text: "Tiếng Việt Trầm nằm trong cội nguồn ta." },
  { label: "Turkish", text: "Pijamalı hasta yağız şoföre çabucak güvendi." },
  { label: "Polish", text: "Zażółć gęślą jaźń." },
];

/* ---- controls --------------------------------------------------------- */

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-xs text-fg/50">
        <span>{label}</span>
        <span className="font-mono text-fg">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2 w-full accent-[rgb(var(--accent))]"
      />
    </label>
  );
}

/* ---- page ------------------------------------------------------------- */

export function TypographyDocs() {
  const [size, setSize] = React.useState(72);
  const [weight, setWeight] = React.useState(500);
  const [tracking, setTracking] = React.useState(0); // in 1/1000 em
  const [sample, setSample] = React.useState(SAMPLES[1].id);
  const [glyphSet, setGlyphSet] = React.useState(GLYPH_SETS[0].id);

  const sampleText = SAMPLES.find((s) => s.id === sample)!.text;
  const glyphs = GLYPH_SETS.find((g) => g.id === glyphSet)!.chars;

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Typography</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        <span className="text-fg">Asbir Sans</span> is our own variable typeface — the company
        text font, self-hosted (one woff2, weights 100–900). It renders everything on this site.
        Play with the specimen, browse the weights and glyphs below.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">font-family: "Asbir Sans"</code>
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">className="font-sans"</code>
        <code className="rounded-md border border-border bg-panel px-2 py-1 text-fg/70">wght 100–900 · opsz 14–32</code>
      </div>

      {/* interactive specimen */}
      <section className="mt-10">
        {/* sample-text switcher */}
        <div className="flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSample(s.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                sample === s.id
                  ? "border-fg/20 bg-overlay/[0.06] text-fg"
                  : "border-border text-fg/55 hover:text-fg"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* live sample */}
        <div className="mt-5 min-h-[180px] rounded-xl border border-border bg-panel px-6 py-8">
          <p
            className="text-fg"
            style={{
              fontFamily: ASBIR,
              fontSize: `${size}px`,
              fontWeight: weight,
              letterSpacing: `${tracking / 1000}em`,
              lineHeight: 1.05,
            }}
          >
            {sampleText}
          </p>
        </div>

        {/* sliders */}
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <Slider label="Size" value={size} min={16} max={140} suffix="px" onChange={setSize} />
          <Slider label="Weight" value={weight} min={100} max={900} step={1} onChange={setWeight} />
          <Slider label="Letter spacing" value={tracking} min={-80} max={120} onChange={setTracking} />
        </div>
      </section>

      {/* nine weights */}
      <section className="mt-16 border-t border-border pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">One family. Nine weights.</h2>
        <p className="mt-1.5 text-sm text-fg/50">Every named instance of the variable font, live.</p>
        <div className="mt-6 divide-y divide-border">
          {WEIGHTS.map((wt) => (
            <div key={wt.w} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-32 shrink-0 text-sm font-semibold text-fg">
                {wt.name} <span className="font-normal text-fg/45">{wt.w}</span>
              </span>
              <span
                className="min-w-0 truncate text-fg/90"
                style={{ fontFamily: ASBIR, fontWeight: wt.w, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
              >
                The quick brown fox jumps 0123456789
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* glyph grid */}
      <section className="mt-16 border-t border-border pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Every character has a job.</h2>
        <p className="mt-1.5 text-sm text-fg/50">The character set, by group.</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {GLYPH_SETS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGlyphSet(g.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                glyphSet === g.id
                  ? "border-fg/20 bg-overlay/[0.06] text-fg"
                  : "border-border text-fg/55 hover:text-fg"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div
          className="mt-5 grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))" }}
        >
          {[...glyphs].map((ch, i) => (
            <div
              key={ch + i}
              className="flex aspect-square items-center justify-center rounded-lg border border-border bg-panel text-2xl text-fg"
              style={{ fontFamily: ASBIR }}
              title={ch}
            >
              {ch}
            </div>
          ))}
        </div>
      </section>

      {/* details / multilingual */}
      <section className="mt-16 border-t border-border pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Designed to travel.</h2>
        <p className="mt-1.5 text-sm text-fg/50">Extended Latin coverage — a few languages, live.</p>
        <div className="mt-6 divide-y divide-border">
          {LANGS.map((l) => (
            <div key={l.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-28 shrink-0 text-xs text-fg/45">{l.label}</span>
              <span className="min-w-0 text-lg text-fg/85" style={{ fontFamily: ASBIR }}>
                {l.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* license */}
      <section className="mt-16 border-t border-border pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Ready to ship.</h2>
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {[
            { k: "Family", v: "Asbir Sans" },
            { k: "Axes", v: "wght 100–900 · opsz 14–32" },
            { k: "Format", v: "Variable woff2, self-hosted" },
            { k: "Version", v: "1.0.0" },
          ].map((f) => (
            <div key={f.k}>
              <dt className="text-xs text-fg/45">{f.k}</dt>
              <dd className="mt-1 text-sm font-medium text-fg">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
