/*
  "The details are the product" — Cartesia/Catalyst-style quiet section.

  Top: two soft prose paragraphs with inline glyphs embedded mid-sentence
  (tokens / motion / a11y) beside an isometric wireframe "skeleton" cluster —
  outlined iso tiles in faint foreground strokes, blueprint-style.

  Below: a Catalyst-style two-column feature grid — bold lead + em-dash + body.

  Static by design (no animation) — the restraint IS the style. The glyphs
  stroke with a white→gray gradient; the cluster strokes currentColor at low
  opacity, so light and dark both work.
*/

/* ---- inline glyphs (ride along in the prose) --------------------------- */

const glyphCls =
  "mx-1 inline-block h-[1.5em] w-[1.5em] -translate-y-[2px] align-middle";

/** Shared white→gray gradient stroke — vertical and subtle (white easing into
    a soft gray), so the glyphs read smooth, not metallic. */
function GlyphGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#A1A1AA" />
      </linearGradient>
    </defs>
  );
}

const TokenGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#dg-token)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={glyphCls} aria-hidden="true">
    <GlyphGradient id="dg-token" />
    <rect x="3.5" y="3.5" width="8" height="8" rx="2" />
    <rect x="12.5" y="12.5" width="8" height="8" rx="2" />
    <path d="M12.5 7.5h5.5a2.5 2.5 0 0 1 2.5 2.5v1.5M11.5 16.5H6a2.5 2.5 0 0 1-2.5-2.5v-1.5" />
  </svg>
);
const MotionGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#dg-motion)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={glyphCls} aria-hidden="true">
    <GlyphGradient id="dg-motion" />
    {/* the classic motion-graphics glyph — an object with speed/trail lines */}
    <circle cx="15.5" cy="12" r="5" />
    <path d="M3 8.5h6M2 12h5.5M3 15.5h6" />
  </svg>
);
const A11yGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#dg-a11y)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={glyphCls} aria-hidden="true">
    <GlyphGradient id="dg-a11y" />
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="7.5" r="1.2" fill="url(#dg-a11y)" stroke="none" />
    <path d="M8 10c2.6.8 5.4.8 8 0M12 11.5V15m0 0-2.2 4M12 15l2.2 4" />
  </svg>
);

/* ---- isometric wireframe cluster --------------------------------------- */

/* Grid → iso projection. Each tile is a flat rhombus (2:1) with a small
   extruded edge on its two visible sides. */
const TILE_W = 88;
const TILE_H = 44;
const DEPTH = 11;

function isoPoint(col: number, row: number): [number, number] {
  return [(col - row) * (TILE_W / 2), (col + row) * (TILE_H / 2)];
}

function Tile({ col, row }: { col: number; row: number }) {
  const [cx, cy] = isoPoint(col, row);
  const t: [number, number] = [cx, cy - TILE_H / 2];
  const r: [number, number] = [cx + TILE_W / 2, cy];
  const b: [number, number] = [cx, cy + TILE_H / 2];
  const l: [number, number] = [cx - TILE_W / 2, cy];
  const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");
  return (
    <g>
      {/* top face */}
      <polygon points={pts([t, r, b, l])} />
      {/* extruded left + right edges */}
      <polygon points={pts([l, b, [b[0], b[1] + DEPTH], [l[0], l[1] + DEPTH]])} />
      <polygon points={pts([b, r, [r[0], r[1] + DEPTH], [b[0], b[1] + DEPTH]])} />
    </g>
  );
}

/* the cluster — a loose, asymmetric spread like the reference */
const TILES: { col: number; row: number }[] = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 2, row: -1 },
  { col: 3, row: -1 },
  { col: 1, row: 1 },
  { col: 2, row: 0 }, // the beam block — fills the cluster's middle slot
  { col: 2, row: 1 },
  { col: 3, row: 0 },
  { col: 4, row: 0 },
  { col: 2, row: 2 },
  { col: 4, row: -2 },
];

/* the block the light rises from — the empty middle slot of the cluster */
const BEAM_TILE = { col: 2, row: 0 };
const BEAM_H = 160; // how far the light reaches up
const BEAM_FLARE = 18; // outward spread at the top — narrow, subtle taper

/** Volumetric light rising from the beam tile. All four top edges emit (the
    column wraps the block); the colors are MIXED — overlapping radial pools of
    the hero-backdrop hues screened over each other, not per-column bands — and
    the whole thing is exaggeratedly bright with a blurred halo. The block's top
    face carries an inner "aperture" hole the light appears to pour out of. */
function LightBeam() {
  const [cx, cy] = isoPoint(BEAM_TILE.col, BEAM_TILE.row);
  const t: [number, number] = [cx, cy - TILE_H / 2];
  const r: [number, number] = [cx + TILE_W / 2, cy];
  const b: [number, number] = [cx, cy + TILE_H / 2];
  const l: [number, number] = [cx - TILE_W / 2, cy];
  const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

  /* full column silhouette — around ALL four sides, flared at the top. The top
     edge extends well past where the fade reaches zero, so its hard line sits
     entirely in the transparent zone (no visible cap). */
  const capY = cy - BEAM_H - TILE_H; // above the fade's zero point
  const silhouette = pts([
    [l[0] - BEAM_FLARE, capY],
    [t[0], capY - TILE_H / 2],
    [r[0] + BEAM_FLARE, capY],
    r,
    b,
    l,
  ]);

  return (
    <g stroke="none">
      <defs>
        {/* the hero-backdrop spectrum, mixed across the width */}
        <linearGradient id="beam-spectrum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3E8AFF" />
          <stop offset="20%" stopColor="#00B8CE" />
          <stop offset="40%" stopColor="#976CFF" />
          <stop offset="60%" stopColor="#E14D9F" />
          <stop offset="80%" stopColor="#F83E3A" />
          <stop offset="100%" stopColor="#FF751A" />
        </linearGradient>
        {/* vertical falloff — saturated + bright at the block base, dissolving
            softly toward the top so the beam feathers out (mesh-like), never a
            hard cap. */}
        {/* many closely-spaced stops on an ease-out curve → a continuous
            dissolve with no visible banding line. Brightest at the base,
            smoothly gone by ~75% up. */}
        <linearGradient id="beam-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="8%" stopColor="#fff" stopOpacity="0.94" />
          <stop offset="16%" stopColor="#fff" stopOpacity="0.84" />
          <stop offset="24%" stopColor="#fff" stopOpacity="0.71" />
          <stop offset="32%" stopColor="#fff" stopOpacity="0.57" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.44" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="56%" stopColor="#fff" stopOpacity="0.21" />
          <stop offset="64%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="82%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="92%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="beam-mask">
          <rect
            x={l[0] - BEAM_FLARE - 24}
            y={cy - BEAM_H - TILE_H - 24}
            width={TILE_W + BEAM_FLARE * 2 + 48}
            height={BEAM_H + TILE_H * 2 + 24}
            fill="url(#beam-fade)"
          />
        </mask>
        <filter id="beam-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* exaggerated bloom — a blurred, brightened copy behind the column */}
      <g mask="url(#beam-mask)" filter="url(#beam-blur)" opacity="0.9">
        <polygon points={silhouette} fill="url(#beam-spectrum)" style={{ mixBlendMode: "screen" }} />
      </g>

      {/* the light volume — spectrum, doubled with screen for the bright mix.
          Crisp edges (no blur); the vertical fade alone dims it toward the top. */}
      <g mask="url(#beam-mask)">
        <polygon points={silhouette} fill="url(#beam-spectrum)" />
        <polygon points={silhouette} fill="url(#beam-spectrum)" style={{ mixBlendMode: "screen" }} />
        {/* faint face creases so the column still reads as four shaped sides */}
        <polygon points={pts([l, t, [t[0], capY - TILE_H / 2], [l[0] - BEAM_FLARE, capY]])} fill="#000" opacity="0.1" />
        <polygon points={pts([t, r, [r[0] + BEAM_FLARE, capY], [t[0], capY - TILE_H / 2]])} fill="#fff" opacity="0.05" />
        <polygon points={pts([b, r, [r[0] + BEAM_FLARE, capY], [b[0], capY]])} fill="#000" opacity="0.08" />
      </g>

      {/* lit top face — the block glows with the spectrum, no white core */}
      <polygon points={pts([t, r, b, l])} fill="url(#beam-spectrum)" opacity="0.7" style={{ mixBlendMode: "screen" }} />
    </g>
  );
}

function SkeletonCluster() {
  return (
    <svg
      viewBox="-64 -164 392 300"
      className="mx-auto h-auto w-full max-w-[560px] text-fg/25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* light first, so the wireframes draw crisp over it */}
      <LightBeam />
      {TILES.map((tile) => (
        <Tile key={`${tile.col},${tile.row}`} {...tile} />
      ))}
    </svg>
  );
}

/* ---- Catalyst-style feature grid ---------------------------------------- */

const FEATURES: { lead: string; body: string }[] = [
  {
    lead: "Built on your tokens",
    body: "every color, radius, and shadow reads from one semantic palette, so a single change re-themes every screen — light and dark included.",
  },
  {
    lead: "Easy to customize",
    body: "everything is styled with utility classes, directly in the component markup. No configuration variables to wrestle with — open any component in your editor and change whatever you want.",
  },
  {
    lead: "Built with React",
    body: "well-structured, thoughtfully designed function components with explicit props. Benefit from the strength and maturity of the React ecosystem.",
  },
  {
    lead: "Keyboard accessible",
    body: "everything we build is keyboard accessible — focus rings, roving focus, ARIA roles — and we carefully craft the markup to deliver the best screenreader experience we know how.",
  },
  {
    lead: "TypeScript first",
    body: "props, variants, and slots are typed end-to-end, so your editor catches mistakes before runtime and autocomplete actually helps.",
  },
  {
    lead: "Your components, not ours",
    body: "AsbirUI isn't a black box. Copy the source straight into your project alongside your own code — it's yours to customize, adapt, and make your own.",
  },
];

/* ---- section ------------------------------------------------------------ */

export function DetailsSkeleton() {
  return (
    <div className="mt-10">
      {/* prose + skeleton visual */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="max-w-md space-y-5 text-base leading-relaxed text-fg/60 sm:text-lg">
          <p>
            Developers love how easy AsbirUI makes it to compose token-driven
            interfaces {TokenGlyph}, purposeful motion {MotionGlyph}, accessible
            components {A11yGlyph} and more into their applications.
          </p>
          <p>
            Teams trust AsbirUI to deliver consistent, production-shaped UI for
            every AsbirTech product.
          </p>
        </div>
        <div className="flex justify-center lg:-mt-28 lg:justify-end">
          <SkeletonCluster />
        </div>
      </div>

      {/* feature grid — bold lead, em-dash, quiet body. One step smaller than
          the main prose above so the hierarchy reads headline → details. */}
      <div className="mt-24 grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <p key={f.lead} className="text-sm leading-relaxed text-fg/60 sm:text-base">
            <span className="font-semibold text-fg">{f.lead}</span> — {f.body}
          </p>
        ))}
      </div>
    </div>
  );
}
