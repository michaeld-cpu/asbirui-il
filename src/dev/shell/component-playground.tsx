import * as React from "react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/dropdown-menu";

/*
  React-Bits-style component playground: a live Preview / Code tab pair with a
  Customize panel whose controls drive the demo's props in real time and
  regenerate the copyable code. Fully data-driven — a component doc supplies a
  `controls` spec plus `render(values)` and `code(values)`, and this module
  builds the whole surface (see ComponentDocs.tsx for the registry).
*/

/* ---- control spec ----------------------------------------------------- */

type BaseControl = { key: string; label: string };
export type Control =
  | (BaseControl & { type: "select"; options: { value: string; label: string }[]; default: string })
  | (BaseControl & {
      type: "slider";
      min: number;
      max: number;
      step: number;
      default: number;
      /** This slider drives a CSS width/min-width on the demo — cap its
          usable range to the preview stage's live width so it can never be
          dragged wider than the stage can fit. */
      boundToStageWidth?: boolean;
    })
  | (BaseControl & { type: "color"; default: string })
  | (BaseControl & { type: "toggle"; default: boolean });

export type ControlValues = Record<string, string | number | boolean>;

export function defaultsFor(controls: Control[]): ControlValues {
  const v: ControlValues = {};
  for (const c of controls) v[c.key] = c.default;
  return v;
}

/* ---- icons ------------------------------------------------------------ */

const Chevron = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Check = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const EyeIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const CodeIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
  </svg>
);

/* ---- individual controls ---------------------------------------------- */

function ControlShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel px-3 py-2.5">
      <span className="shrink-0 text-sm text-fg/70">{label}</span>
      {children}
    </div>
  );
}

function SelectControl({
  c,
  value,
  onChange,
}: {
  c: Extract<Control, { type: "select" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const label = c.options.find((o) => o.value === value)?.label ?? value;
  return (
    <ControlShell label={c.label}>
      <DropdownMenu>
        <DropdownMenuTrigger className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-fg outline-none transition-colors hover:bg-overlay/[0.05] focus-visible:bg-overlay/[0.05]">
          {label}
          <span className="text-fg/50 transition-transform duration-200 group-aria-expanded:rotate-180">{Chevron}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[16rem]">
          {c.options.map((o) => (
            <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)}>
              <span className="flex-1">{o.label}</span>
              {o.value === value && <span className="text-accent-soft-fg [&_svg]:h-3.5 [&_svg]:w-3.5">{Check}</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ControlShell>
  );
}

function SliderControl({
  c,
  value,
  onChange,
  maxOverride,
  onBlockedAtCap,
}: {
  c: Extract<Control, { type: "slider" }>;
  value: number;
  onChange: (v: number) => void;
  /** Clamp the slider's usable range below `c.max` — e.g. so a "min width"
      control can't be dragged wider than the preview stage can fit, which
      would silently force the demo to override `align`/position to avoid
      spilling out of the stage instead of honoring what was picked. */
  maxOverride?: number;
  /** Called when the user tries to drag past the current cap. */
  onBlockedAtCap?: () => void;
}) {
  // Round the live-measured override down to the control's own step grid —
  // raw layout measurements are fractional pixels, and without this both the
  // displayed value and the thumb's snap position come out as unrounded
  // floats (e.g. "234.3046875").
  const max =
    maxOverride !== undefined
      ? Math.max(c.min, Math.min(c.max, c.min + Math.floor((maxOverride - c.min) / c.step) * c.step))
      : c.max;
  const clamped = Math.min(value, max);
  React.useEffect(() => {
    if (clamped !== value) onChange(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);
  const constrained = max < c.max;
  const atCap = constrained && clamped >= max;
  return (
    <ControlShell label={c.label}>
      <div className="flex flex-1 items-center justify-end gap-3 pl-2">
        <input
          type="range"
          min={c.min}
          max={c.max}
          step={c.step}
          value={clamped}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (constrained && next >= max) onBlockedAtCap?.();
            onChange(Math.min(next, max));
          }}
          onPointerDown={() => {
            if (atCap) onBlockedAtCap?.();
          }}
          aria-label={c.label}
          aria-valuemax={max}
          className={`h-1.5 w-full max-w-[10rem] appearance-none rounded-full bg-overlay/[0.12] accent-[rgb(var(--accent))] ${
            atCap ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        />
        <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-fg">
          {clamped}
        </span>
      </div>
    </ControlShell>
  );
}

/* ---- color math (hex ⇄ rgb ⇄ hsv) ------------------------------------- */

type RGB = { r: number; g: number; b: number };
type HSV = { h: number; s: number; v: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
function hexToRgb(hex: string): RGB {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return { r: 139, g: 92, b: 246 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}
function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/* Drag helper: maps pointer movement over `el` to a 0..1 (x, y) and streams it
   while the pointer is down, anywhere on the page (setPointerCapture). */
function useDragArea(onMove: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handle = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      onMove(clamp((clientX - r.left) / r.width, 0, 1), clamp((clientY - r.top) / r.height, 0, 1));
    },
    [onMove],
  );
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handle(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 0) return; // only while dragging
    handle(e.clientX, e.clientY);
  };
  return { ref, onPointerDown, onPointerMove };
}

/* ---- color control: swatch trigger + HSV popover picker --------------- */

function ColorControl({
  c,
  value,
  onChange,
}: {
  c: Extract<Control, { type: "color" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  // hue is tracked locally so dragging into pure black/white doesn't lose it
  const rgb = hexToRgb(value);
  const derived = rgbToHsv(rgb);
  const [hue, setHue] = React.useState(derived.h);
  const hsv: HSV = { h: hue, s: derived.s, v: derived.v };

  const commit = (next: HSV) => {
    setHue(next.h);
    onChange(rgbToHex(hsvToRgb(next)));
  };

  // outside-click / Escape close
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sv = useDragArea((x, y) => commit({ h: hue, s: x, v: 1 - y }));
  const hueBar = useDragArea((x) => commit({ ...hsv, h: x * 360 }));

  const hueColor = rgbToHex(hsvToRgb({ h: hue, s: 1, v: 1 }));

  // The picker renders INLINE and full-width inside this control's own card,
  // expanding the panel downward (React-Bits style) rather than floating as an
  // absolute popover — which used to overflow the panel edge / go off-screen.
  return (
    <div
      ref={wrapRef}
      className="rounded-lg border border-border bg-panel px-3 py-2.5"
    >
      {/* header row: label + swatch toggle + hex input */}
      <div className="flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-fg/70">{c.label}</span>
        <div className="flex items-center gap-2">
          {/* native color-picker button — opens the OS picker / eyedropper */}
          {/* swatch toggle for the inline HSV picker below */}
          <button
            type="button"
            aria-label={`${c.label}: toggle picker`}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="h-6 w-6 shrink-0 rounded-md border border-border transition-transform hover:scale-110"
            style={{ backgroundColor: value }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v);
              if (/^#?[\da-f]{6}$/i.test(v)) setHue(rgbToHsv(hexToRgb(v)).h);
            }}
            spellCheck={false}
            className="w-24 rounded-md border border-border bg-canvas px-2 py-1 font-mono text-xs text-fg outline-none focus:[border-color:rgb(var(--accent)/0.6)]"
          />
        </div>
      </div>

      {open && (
        <div className="mt-3 border-t border-border/60 pt-3">
          {/* saturation / value pad — wide, not too tall */}
          <div
            {...sv}
            className="relative h-32 w-full cursor-crosshair touch-none overflow-hidden rounded-lg"
            style={{ backgroundColor: hueColor }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000, transparent)" }} />
            <span
              className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
            />
          </div>

          {/* hue slider */}
          <div
            {...hueBar}
            className="relative mt-3 h-3 w-full cursor-pointer touch-none rounded-full"
            style={{
              background:
                "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
            }}
          >
            <span
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>

          {/* preset swatches */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PRESET_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                onClick={() => {
                  onChange(hex);
                  setHue(rgbToHsv(hexToRgb(hex)).h);
                }}
                className="h-6 w-6 rounded-md border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const PRESET_SWATCHES = [
  "#8b5cf6", "#7c3aed", "#6366f1", "#3b82f6", "#06b6d4", "#10b981",
  "#84cc16", "#eab308", "#f97316", "#ef4444", "#ec4899", "#f43f5e",
  "#ffffff", "#94a3b8", "#111111",
];

function ToggleControl({
  c,
  value,
  onChange,
}: {
  c: Extract<Control, { type: "toggle" }>;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <ControlShell label={c.label}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={c.label}
        onClick={() => onChange(!value)}
        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          value ? "[background-color:rgb(var(--accent))]" : "bg-overlay/[0.15]"
        }`}
      >
        <span className={`h-4 w-4 rounded-full bg-white transition-transform ${value ? "translate-x-4" : ""}`} />
      </button>
    </ControlShell>
  );
}

function renderControl(
  c: Control,
  value: ControlValues[string],
  set: (v: ControlValues[string]) => void,
  sliderMaxOverrides: Record<string, number>,
  onSliderBlockedAtCap: () => void
) {
  switch (c.type) {
    case "select":
      return <SelectControl c={c} value={value as string} onChange={set} />;
    case "slider":
      return (
        <SliderControl
          c={c}
          value={value as number}
          onChange={set}
          maxOverride={sliderMaxOverrides[c.key]}
          onBlockedAtCap={onSliderBlockedAtCap}
        />
      );
    case "color":
      return <ColorControl c={c} value={value as string} onChange={set} />;
    case "toggle":
      return <ToggleControl c={c} value={value as boolean} onChange={set} />;
  }
}

/* ---- customize panel -------------------------------------------------- */

function CustomizePanel({
  controls,
  values,
  onChange,
  onReset,
  sliderMaxOverrides,
  onSliderBlockedAtCap,
}: {
  controls: Control[];
  values: ControlValues;
  onChange: (key: string, v: ControlValues[string]) => void;
  onReset: () => void;
  sliderMaxOverrides: Record<string, number>;
  onSliderBlockedAtCap: () => void;
}) {
  return (
    <div className="not-prose mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-fg">Customize</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md px-2 py-1 text-xs font-medium text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map((c) => (
          <React.Fragment key={c.key}>
            {renderControl(c, values[c.key], (v) => onChange(c.key, v), sliderMaxOverrides, onSliderBlockedAtCap)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ---- preview stage (grows to contain an open overlay) ----------------- */

const STAGE_MIN = 240;
const STAGE_PAD = 24;

function PreviewStage({
  children,
  onWidthChange,
}: {
  children: React.ReactNode;
  /** Reports the width available for a popover to grow into from its
      trigger's current edge — the min of "room to the right" and "room to
      the left" — so a "min width" slider can cap itself to what will
      actually fit regardless of which `align` the demo currently uses. */
  onWidthChange?: (width: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = React.useState(STAGE_MIN);
  // vertical anchor for the demo while an overlay is open:
  //   "center" — nothing open
  //   "start"  — a downward (side="bottom") menu → anchor top, grow down
  //   "end"    — an upward  (side="top")    menu → anchor bottom so the menu
  //              has the full stage height above it to open into
  const [anchor, setAnchor] = React.useState<"center" | "start" | "end">("center");
  const onWidthChangeRef = React.useRef(onWidthChange);
  onWidthChangeRef.current = onWidthChange;

  React.useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const observedMenus = new Set<HTMLElement>();
    const measure = () => {
      const trigger = stage.querySelector<HTMLElement>('[aria-haspopup="menu"]');
      if (trigger && onWidthChangeRef.current) {
        const stageRect = stage.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const roomRight = stageRect.right - triggerRect.left;
        const roomLeft = triggerRect.right - stageRect.left;
        onWidthChangeRef.current(Math.max(0, Math.min(roomRight, roomLeft)));
      }
      const menus = stage.querySelectorAll<HTMLElement>('[role="menu"]');
      // keep the ResizeObserver attached to whatever menu(s) are currently
      // mounted — a menu's own size can change (e.g. min-width edited while
      // open) without any stage-level mutation to re-trigger measurement.
      menus.forEach((m) => {
        if (!observedMenus.has(m)) {
          ro.observe(m);
          observedMenus.add(m);
        }
      });
      if (menus.length === 0) {
        setAnchor("center");
        setMinHeight(STAGE_MIN);
        return;
      }
      const box = stage.getBoundingClientRect();
      let needed = STAGE_MIN;
      let opensUp = false;
      menus.forEach((m) => {
        const r = m.getBoundingClientRect();
        if (r.height === 0) return;
        // a menu whose middle sits above the stage's middle is opening upward
        if ((r.top + r.bottom) / 2 < (box.top + box.bottom) / 2) opensUp = true;
        // grow to fit the menu's full extent (both directions) within the stage
        needed = Math.max(needed, r.bottom - box.top + STAGE_PAD, box.bottom - r.top + STAGE_PAD);
      });
      setAnchor(opensUp ? "end" : "start");
      setMinHeight(needed);
    };
    const mo = new MutationObserver(measure);
    // watch class/style too — toggling `side`/`align`/min-width on an already-open
    // menu changes its layout without touching aria-expanded/data-state, and a
    // stale anchor/height then lets the menu overflow past the stage.
    mo.observe(stage, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-expanded", "data-state", "class", "style"],
    });
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    measure();
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  const anchorClass =
    anchor === "start" ? "items-start pt-14" : anchor === "end" ? "items-end pb-14" : "items-center";

  return (
    <div
      ref={ref}
      data-dropdown-boundary
      className={`relative flex justify-center rounded-xl border border-border bg-canvas p-8 transition-[min-height] duration-200 ease-out ${anchorClass}`}
      style={{ minHeight }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(rgb(var(--fg-rgb) / 0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent 78%)",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---- the playground (Preview/Code tabs + Customize) ------------------- */

export function ComponentPlayground({
  controls,
  render,
  code,
}: {
  controls: Control[];
  render: (v: ControlValues) => React.ReactNode;
  code: (v: ControlValues) => string;
}) {
  const [values, setValues] = React.useState<ControlValues>(() => defaultsFor(controls));
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [copied, setCopied] = React.useState(false);
  const [stageWidth, setStageWidth] = React.useState<number | null>(null);
  const [showCapToast, setShowCapToast] = React.useState(false);
  const capToastTimer = React.useRef<number | undefined>(undefined);

  // One-shot, debounced: dragging a capped slider fires onBlockedAtCap on
  // every pointermove past the limit, but the user only needs to be told once.
  const notifyBlockedAtCap = React.useCallback(() => {
    setShowCapToast(true);
    window.clearTimeout(capToastTimer.current);
    capToastTimer.current = window.setTimeout(() => setShowCapToast(false), 3200);
  }, []);
  React.useEffect(() => () => window.clearTimeout(capToastTimer.current), []);

  const set = (key: string, v: ControlValues[string]) => setValues((prev) => ({ ...prev, [key]: v }));
  const reset = () => setValues(defaultsFor(controls));

  // Cap any slider that drives a CSS width to the room actually available
  // from the trigger's current edge (see PreviewStage), so dragging it can't
  // force the demo to overflow the stage — which would otherwise silently
  // override whatever align/position the user picked just to avoid spilling
  // out.
  const sliderMaxOverrides = React.useMemo(() => {
    if (stageWidth == null) return {};
    const overrides: Record<string, number> = {};
    for (const c of controls) {
      if (c.type === "slider" && c.boundToStageWidth) overrides[c.key] = stageWidth;
    }
    return overrides;
  }, [controls, stageWidth]);

  const snippet = code(values);
  const copy = () => {
    navigator.clipboard?.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="not-prose mt-4">
      {/* tab bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-panel p-0.5">
          <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={EyeIcon}>
            Preview
          </TabButton>
          <TabButton active={tab === "code"} onClick={() => setTab("code")} icon={CodeIcon}>
            Code
          </TabButton>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
        >
          <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{copied ? Check : CodeIcon}</span>
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>

      {tab === "preview" ? (
        <PreviewStage onWidthChange={setStageWidth}>{render(values)}</PreviewStage>
      ) : (
        <pre className="overflow-x-auto rounded-xl border border-border bg-panel px-4 py-3.5 text-[13px] leading-relaxed text-fg/85">
          <code>{snippet}</code>
        </pre>
      )}

      <CustomizePanel
        controls={controls}
        values={values}
        onChange={set}
        onReset={reset}
        sliderMaxOverrides={sliderMaxOverrides}
        onSliderBlockedAtCap={notifyBlockedAtCap}
      />

      <CapToast show={showCapToast} />
    </div>
  );
}

/** Explains why a bound slider stopped early — fires once per drag instead of
    a persistent numeric readout that goes stale the moment the window widens.

    Portalled to <body> so `position: fixed` anchors to the VIEWPORT, not the
    docs <article> (which keeps a `transform` from its fade-up animation — a
    transformed ancestor otherwise captures fixed positioning and the toast
    ends up pinned inside the scrolled article instead of floating over it;
    see the same fix in ColorsDocs.tsx / MotionPromoCard.tsx). */
function CapToast({ show }: { show: boolean }) {
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 z-[9999] flex justify-center px-4 transition-all duration-200 ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <div className="pointer-events-auto max-w-full rounded-full border border-border bg-panel px-4 py-2 text-center text-xs font-medium text-fg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]">
        Can't display at this size — switch to a wider screen for the full range.
      </div>
    </div>,
    document.body
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "ai-bg-accent-soft ai-accent bg-overlay/[0.06] text-fg" : "text-fg/60 hover:text-fg"
      }`}
    >
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {children}
    </button>
  );
}
