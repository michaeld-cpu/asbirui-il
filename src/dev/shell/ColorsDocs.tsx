import * as React from "react";
import { createPortal } from "react-dom";
import { PALETTE, PALETTE_STEPS, type PaletteFamily } from "./palette-data";

/*
  Colors — the Foundations color reference (route: #tokens/colors).

  A curated palette: 22 families × 11 steps (50→950), generated in OKLCH so a
  given step reads at the same brightness across every hue (see palette-data).
  Each family row is a strip of step chips (step # + hex printed in-chip) plus
  per-row actions: Contrast grid (a11y overlay), Export (copy the ramp), Save.
  Click any chip to copy its hex; formats/luminance are computed from the hex.
*/

/* ---- color math: sRGB → OKLCH / HSL ----------------------------------- */

function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

type Rgb = [number, number, number];

/** Parse a "#RRGGBB" string into an [r,g,b] triplet. */
function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WCAG relative luminance of an [r,g,b] color (0 = black, 1 = white). */
function luminance([r, g, b]: Rgb): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG contrast ratio between two colors (1–21). */
function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Legible on-swatch ink: black or white, whichever contrasts more. */
function inkOn(rgb: Rgb): string {
  return contrast(rgb, [0, 0, 0]) >= contrast(rgb, [255, 255, 255]) ? "#000" : "#FFF";
}

/** Alpha-composite [r,g,b,a] over an opaque backdrop (e.g. the swatch below it). */
function compositeOver(fg: [number, number, number, number], backdrop: Rgb): Rgb {
  const [r, g, b, a] = fg;
  return [
    r * a + backdrop[0] * (1 - a),
    g * a + backdrop[1] * (1 - a),
    b * a + backdrop[2] * (1 - a),
  ];
}


/* ---- copy helper ------------------------------------------------------ */

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  // stable identity so memoized rows don't re-render just because copy() was
  // recreated on the parent's re-render.
  const copy = React.useCallback((value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200);
  }, []);
  return { copied, copy };
}

/* ---- curated palette matrix ------------------------------------------- */

/** A single family: a labeled header row with the Contrast-grid action, then a
    strip of step chips (step # + hex printed in-chip in legible ink). */
/* Memoized so copying a swatch in ONE family doesn't re-render all 22 families
   (which caused a visible layout jitter). Each row only receives the copied hex
   that belongs to IT (`copied`), so a copy elsewhere is a no-op for this row. */
const FamilyRow = React.memo(function FamilyRow({
  family,
  copied,
  onCopy,
  onContrast,
}: {
  family: PaletteFamily;
  /** the copied hex IF it belongs to this family, else null */
  copied: string | null;
  onCopy: (v: string) => void;
  onContrast: (f: PaletteFamily) => void;
}) {
  return (
    // full-width row — the swatches flex to fill the whole content column so the
    // strip's right edge lines up with the headings above (no dead gutter).
    <div>
      {/* header stays at page width (NOT inside the horizontal scroll) so the
          label + Contrast-grid button are always visible without scrolling the
          color strip to the end */}
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-fg">{family.name}</span>
        <button
          type="button"
          onClick={() => onContrast(family)}
          className="shrink-0 text-[11px] font-medium text-muted transition-colors hover:text-fg"
        >
          Contrast grid
        </button>
      </div>
      {/* Chips flex to share the row width evenly on desktop; below a min width
          the row scrolls horizontally instead of squashing the chips. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-[660px] gap-1.5">
          {family.hues.map((hex, i) => {
            const rgb = hexToRgb(hex);
            const ink = inkOn(rgb);
            const step = PALETTE_STEPS[i];
            const isCopied = copied === hex;
            return (
              <button
                key={hex + i}
                type="button"
                onClick={() => onCopy(hex)}
                title={`${family.name}-${step} — click to copy ${hex}`}
                aria-label={`${family.name} ${step}, ${hex}`}
                className="group relative flex h-16 min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-lg p-1.5 text-left outline-none ring-1 ring-inset ring-black/[0.06] transition-[box-shadow] hover:ring-2 hover:ring-fg/40 focus-visible:ring-2 focus-visible:ring-fg/60 dark:ring-white/[0.08]"
                style={{ backgroundColor: hex }}
              >
                {/* step + hex — fade out on copy so "Copied!" is the sole focus */}
                <span
                  className={`text-[10px] font-semibold leading-none transition-opacity ${isCopied ? "opacity-0" : ""}`}
                  style={{ color: ink, opacity: isCopied ? 0 : 0.9 }}
                >
                  {step}
                </span>
                <span
                  className={`mt-0.5 font-mono text-[9px] leading-none transition-opacity ${isCopied ? "opacity-0" : ""}`}
                  style={{ color: ink, opacity: isCopied ? 0 : 0.65 }}
                >
                  {hex}
                </span>
                {isCopied && (
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-tight motion-safe:animate-copied-pop"
                    style={{ color: ink }}
                  >
                    Copied!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

/** Contrast-grid overlay: for the family's key steps, shows WCAG contrast of
    white and black text on each swatch, with the AA (4.5:1) verdict.

    Portalled to <body> so `position: fixed` anchors to the VIEWPORT, not the
    docs <article> (which keeps a `transform` from its fade-up animation — a
    transformed ancestor otherwise captures fixed positioning and the modal
    lands off-screen when you open it from a row far down the page). */
function ContrastGrid({ family, onClose }: { family: PaletteFamily; onClose: () => void }) {
  // Esc closes; lock body scroll while open.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock scroll WITHOUT layout shift: hiding overflow removes the scrollbar,
    // so pad the body by its width to keep content from jumping right.
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-panel p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-fg">{family.name} · text contrast</h3>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-fg/60 hover:bg-overlay/[0.06] hover:text-fg">
            Close
          </button>
        </div>
        <p className="mt-1 text-xs text-fg/55">
          WCAG ratio of black / white text on each step (AA body text needs 4.5:1).
        </p>
        <div className="mt-3 space-y-1">
          {family.hues.map((hex, i) => {
            const rgb = hexToRgb(hex);
            const cWhite = contrast(rgb, [255, 255, 255]);
            const cBlack = contrast(rgb, [0, 0, 0]);
            const best = Math.max(cWhite, cBlack);
            return (
              <div key={hex + i} className="flex items-center gap-3 rounded-lg px-2 py-1.5" style={{ backgroundColor: hex }}>
                <span className="w-10 text-[11px] font-semibold" style={{ color: inkOn(rgb) }}>
                  {PALETTE_STEPS[i]}
                </span>
                <span className="text-xs font-medium text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                  W {cWhite.toFixed(1)}
                </span>
                <span className="text-xs font-medium text-black/80 [text-shadow:0_1px_2px_rgba(255,255,255,0.5)]">
                  B {cBlack.toFixed(1)}
                </span>
                {(() => {
                  const pass = best >= 4.5;
                  const pillFg: [number, number, number, number] = pass ? [0, 170, 78, 0.25] : [0, 0, 0, 0.15];
                  const pillRgb = compositeOver(pillFg, rgb);
                  return (
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ color: inkOn(pillRgb), backgroundColor: `rgba(${pillFg[0]},${pillFg[1]},${pillFg[2]},${pillFg[3]})` }}
                    >
                      {pass ? "AA ✓" : "fail"}
                    </span>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** The full palette grid — a stack of family rows plus the contrast overlay. */
function PaletteMatrix({
  copied,
  onCopy,
}: {
  copied: string | null;
  onCopy: (v: string) => void;
}) {
  const [grid, setGrid] = React.useState<PaletteFamily | null>(null);

  return (
    <div className="not-prose mt-4">
      <div className="space-y-4">
        {PALETTE.map((family) => (
          <FamilyRow
            key={family.name}
            family={family}
            // pass the copied hex only if it belongs to THIS family — so a copy
            // in another family leaves this row's props unchanged (memo skips it)
            copied={copied && family.hues.includes(copied) ? copied : null}
            onCopy={onCopy}
            onContrast={setGrid}
          />
        ))}
      </div>
      {grid && <ContrastGrid family={grid} onClose={() => setGrid(null)} />}
    </div>
  );
}

/* ---- page ------------------------------------------------------------- */

export function ColorsDocs() {
  const { copied, copy } = useCopy();

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Colors</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        A full curated palette — every hue family in a{" "}
        <span className="text-fg">50→950</span> ramp, generated in OKLCH so a
        given step reads at the same brightness across every hue. Click any
        swatch to copy it.
      </p>

      {/* curated palette matrix */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight text-fg">
        The palette
      </h2>
      <p className="mt-1 text-sm text-fg/60">
        {PALETTE.length} families × {PALETTE_STEPS.length} steps. Every family
        shares one lightness curve, so any component can pick a step and know it
        pairs with the same step in any other hue.
      </p>
      <PaletteMatrix copied={copied} onCopy={copy} />
    </article>
  );
}
