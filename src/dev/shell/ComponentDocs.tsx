import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  FilterChips,
} from "@/index";
import {
  ComponentPlayground,
  type Control,
  type ControlValues,
} from "./component-playground";

/*
  Live component documentation for the #components/<slug> routes.

  Each entry pairs a real, interactive render of a library component (Preview)
  with its prop reference, a usage snippet, and install instructions — the
  "docs / tokens / usage / installation" surface. Data-driven off COMPONENTS so
  adding a component is a single entry, and the shell (navbar + sidebar) is
  reused as-is.
*/

/* ---- shared doc chrome ------------------------------------------------ */

/** Copyable code block with a header + copy button. */
function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="not-prose mt-4 overflow-hidden rounded-xl border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {lang}
        </span>
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

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="not-prose mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-panel text-xs text-fg">
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs text-fg">{r.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-accent-soft-fg">
                {r.type}
              </td>
              <td className="px-4 py-2.5 text-fg/70">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PropRow = { name: string; type: string; description: string };

type ComponentEntry = {
  slug: string;
  name: string;
  tagline: string;
  /** Customize-panel controls; their values drive `render` and `code`. */
  controls: Control[];
  /** Live demo for the given control values. */
  render: (v: ControlValues) => React.ReactNode;
  /** Copyable code reflecting the current control values. */
  code: (v: ControlValues) => string;
  props: PropRow[];
  importPath: string;
};

/* ---- live demos ------------------------------------------------------- */

const ChevronIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const CheckIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* Live dropdown demo driven by Customize values (align/side/min-width/destructive). */
function DropdownDemo({ v }: { v: ControlValues }) {
  const [period, setPeriod] = React.useState("Last 7 days");
  const [open, setOpen] = React.useState(false);
  const periods = ["Last 24 hours", "Last 7 days", "Last 30 days"];
  const align = v.align as "start" | "end";
  const side = v.side as "top" | "bottom";
  const minW = v.minWidth as number;
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-asbir border border-border bg-panel px-3 py-1.5 text-sm font-medium text-fg/80 outline-none transition-colors hover:bg-overlay/[0.05] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring">
        {period}
        <span className={`text-fg/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          {ChevronIcon}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        // clamp to the viewport so a wide min-width can't overflow on mobile
        style={{ minWidth: `min(${minW}px, calc(100vw - 1.5rem))` }}
      >
        <DropdownMenuLabel>Time range</DropdownMenuLabel>
        {periods.map((p) => (
          <DropdownMenuItem key={p} onSelect={() => setPeriod(p)}>
            <span className="flex-1">{p}</span>
            {p === period && <span className="text-accent-soft-fg">{CheckIcon}</span>}
          </DropdownMenuItem>
        ))}
        {v.destructive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Clear</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function dropdownCode(v: ControlValues): string {
  const clear = v.destructive
    ? `\n    <DropdownMenuSeparator />\n    <DropdownMenuItem destructive>Clear</DropdownMenuItem>`
    : "";
  return `<DropdownMenu>
  <DropdownMenuTrigger>Last 7 days ▾</DropdownMenuTrigger>
  <DropdownMenuContent
    align="${v.align}"
    side="${v.side}"
    style={{ minWidth: ${v.minWidth} }}
  >
    <DropdownMenuLabel>Time range</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => setPeriod("24h")}>
      Last 24 hours
    </DropdownMenuItem>${clear}
  </DropdownMenuContent>
</DropdownMenu>`;
}

/* Live filter-chips demo driven by Customize values (label + accent color). */
function FilterChipsDemo({ v }: { v: ControlValues }) {
  const [status, setStatus] = React.useState("all");
  const label = (v.label as string) || undefined;
  // scope the accent override to just this demo so the swatch drives the chips
  return (
    <div style={{ ["--accent" as string]: hexToRgbTriplet(v.accent as string) }}>
      <FilterChips
        label={label}
        value={status}
        onValueChange={setStatus}
        options={[
          { value: "all", label: "All" },
          { value: "2xx", label: "2xx" },
          { value: "4xx", label: "4xx" },
          { value: "5xx", label: "5xx" },
        ]}
      />
    </div>
  );
}

function filterChipsCode(v: ControlValues): string {
  const labelLine = v.label ? `\n  label="${v.label}"` : "";
  return `<FilterChips${labelLine}
  value={status}
  onValueChange={setStatus}
  options={[
    { value: "all", label: "All" },
    { value: "2xx", label: "2xx" },
    { value: "4xx", label: "4xx" },
    { value: "5xx", label: "5xx" },
  ]}
/>`;
}

/** "#rrggbb" → "r g b" triplet for the --accent CSS var (rgb(var(--accent))). */
function hexToRgbTriplet(hex: string): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return "139 92 246"; // fallback violet
  return `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}`;
}

/* ---- registry --------------------------------------------------------- */

const COMPONENTS: ComponentEntry[] = [
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    tagline:
      "An accessible menu-button: click or keyboard to open, arrow-key navigation, Escape to close. Composable trigger / content / item parts.",
    controls: [
      {
        type: "select",
        key: "align",
        label: "Align",
        default: "start",
        options: [
          { value: "start", label: "start" },
          { value: "end", label: "end" },
        ],
      },
      {
        type: "select",
        key: "side",
        label: "Side",
        default: "bottom",
        options: [
          { value: "bottom", label: "bottom" },
          { value: "top", label: "top" },
        ],
      },
      { type: "slider", key: "minWidth", label: "Min width", min: 120, max: 320, step: 4, default: 192, boundToStageWidth: true },
      { type: "toggle", key: "destructive", label: "Show 'Clear'", default: true },
    ],
    render: (v) => <DropdownDemo v={v} />,
    code: dropdownCode,
    importPath: `// named parts (standard)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@asbirtech/asbir-ui";

// or one namespace import — <Dropdown.Root>, <Dropdown.Item> …
import { Dropdown } from "@asbirtech/asbir-ui";`,
    props: [
      { name: "align", type: `"start" | "end"`, description: "Horizontal edge the content aligns to." },
      { name: "side", type: `"bottom" | "top"`, description: "Whether the menu opens downward (default) or upward." },
      { name: "onSelect", type: "(e) => void", description: "Item handler; call preventDefault() to keep the menu open." },
      { name: "destructive", type: "boolean", description: "Styles an item as a destructive action." },
      { name: "disabled", type: "boolean", description: "Disables an item — skipped by keyboard nav." },
    ],
  },
  {
    slug: "filter-chips",
    name: "Filter Chips",
    tagline:
      "A labeled, single-select row of pill toggles — a compact segmented filter. Renders as an accessible radiogroup.",
    controls: [
      {
        type: "select",
        key: "label",
        label: "Label",
        default: "Status",
        options: [
          { value: "Status", label: "Status" },
          { value: "Filter", label: "Filter" },
          { value: "", label: "(none)" },
        ],
      },
      { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
    ],
    render: (v) => <FilterChipsDemo v={v} />,
    code: filterChipsCode,
    importPath: `import { FilterChips } from "@asbirtech/asbir-ui";`,
    props: [
      { name: "value", type: "string", description: "The active option's value." },
      { name: "onValueChange", type: "(v: string) => void", description: "Called when a chip is chosen." },
      { name: "options", type: "FilterChipOption[]", description: "{ value, label } list." },
      { name: "label", type: "string", description: "Optional leading label (uppercased)." },
    ],
  },
];

export const COMPONENT_SLUGS = COMPONENTS.map((c) => c.slug);

/* ---- page ------------------------------------------------------------- */

export function ComponentDocs({ slug }: { slug: string }) {
  const entry = COMPONENTS.find((c) => c.slug === slug) ?? COMPONENTS[0];

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        {entry.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        {entry.tagline}
      </p>

      {/* live playground — Preview/Code tabs + Customize panel */}
      <ComponentPlayground
        key={entry.slug}
        controls={entry.controls}
        render={entry.render}
        code={entry.code}
      />

      {/* installation */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight text-fg">
        Installation
      </h2>
      <p className="mt-2 text-sm text-fg/60">
        Install the package, then import the component.
      </p>
      <CodeBlock lang="bash" code={`npm install @asbirtech/asbir-ui`} />
      <CodeBlock code={entry.importPath} />

      {/* props */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight text-fg">
        Props
      </h2>
      <PropsTable rows={entry.props} />
    </article>
  );
}
