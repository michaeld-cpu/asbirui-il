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
import { Pagination } from "@/index";
import {
  ComponentPlayground,
  defaultsFor,
  type ControlValues,
} from "./component-playground";
import { hexToRgbTriplet, type ComponentEntry, type PropRow } from "./docs/entry";
import { avatarEntry } from "./docs/avatar.docs";
import { badgeEntry } from "./docs/badge.docs";
import { buttonEntry } from "./docs/button.docs";
import { cardEntry } from "./docs/card.docs";
import { checkboxEntry } from "./docs/checkbox.docs";
import { commandMenuEntry } from "./docs/command-menu.docs";
import { copyButtonEntry } from "./docs/copy-button.docs";
import { dataTableEntry } from "./docs/data-table.docs";
import { dialogEntry } from "./docs/dialog.docs";
import { emptyStateEntry } from "./docs/empty-state.docs";
import { inputEntry } from "./docs/input.docs";
import { skeletonEntry } from "./docs/skeleton.docs";
import { tabsEntry } from "./docs/tabs.docs";
import { themeToggleEntry } from "./docs/theme-toggle.docs";
import { toastEntry } from "./docs/toast.docs";
import { tooltipEntry } from "./docs/tooltip.docs";
// batch 2 (24 components)
import { switchEntry } from "./docs/switch.docs";
import { radioGroupEntry } from "./docs/radio-group.docs";
import { selectEntry } from "./docs/select.docs";
import { textareaEntry } from "./docs/textarea.docs";
import { sliderEntry } from "./docs/slider.docs";
import { formFieldEntry } from "./docs/form-field.docs";
import { searchInputEntry } from "./docs/search-input.docs";
import { accordionEntry } from "./docs/accordion.docs";
import { progressEntry } from "./docs/progress.docs";
import { circularProgressEntry } from "./docs/circular-progress.docs";
import { avatarGroupEntry } from "./docs/avatar-group.docs";
import { timelineEntry } from "./docs/timeline.docs";
import { kbdEntry } from "./docs/kbd.docs";
import { popoverEntry } from "./docs/popover.docs";
import { hoverCardEntry } from "./docs/hover-card.docs";
import { drawerEntry } from "./docs/drawer.docs";
import { breadcrumbsEntry } from "./docs/breadcrumbs.docs";
import { paginationEntry } from "./docs/pagination.docs";
import { segmentedControlEntry } from "./docs/segmented-control.docs";
import { alertEntry } from "./docs/alert.docs";
import { spinnerEntry } from "./docs/spinner.docs";
import { statusBadgeEntry } from "./docs/status-badge.docs";
import { usageMeterEntry } from "./docs/usage-meter.docs";
import { descriptionListEntry } from "./docs/description-list.docs";

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

/* ComponentEntry / PropRow live in ./docs/entry — one entry file per
   component under ./docs/, composed into COMPONENTS below. */

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

/* ---- registry --------------------------------------------------------- */

const COMPONENTS: ComponentEntry[] = [
  accordionEntry,
  alertEntry,
  avatarEntry,
  avatarGroupEntry,
  badgeEntry,
  breadcrumbsEntry,
  buttonEntry,
  cardEntry,
  checkboxEntry,
  circularProgressEntry,
  commandMenuEntry,
  copyButtonEntry,
  dataTableEntry,
  descriptionListEntry,
  dialogEntry,
  drawerEntry,
  emptyStateEntry,
  formFieldEntry,
  hoverCardEntry,
  inputEntry,
  kbdEntry,
  paginationEntry,
  popoverEntry,
  progressEntry,
  radioGroupEntry,
  searchInputEntry,
  segmentedControlEntry,
  selectEntry,
  skeletonEntry,
  sliderEntry,
  spinnerEntry,
  statusBadgeEntry,
  switchEntry,
  tabsEntry,
  textareaEntry,
  themeToggleEntry,
  timelineEntry,
  toastEntry,
  tooltipEntry,
  usageMeterEntry,
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

/* ---- index gallery (#components) -------------------------------------- */

const PER_PAGE = 12;

/** A gallery tile: the component's name over a scaled-down, non-interactive
    thumbnail of its live default render. The whole card navigates to the
    component's detail page. Mirrors the Blocks/Motion gallery treatment
    (bg-canvas + hover:border-fg/20).

    The card is a <div role="link"> — NOT an <a> — because the thumbnail may
    render a demo that itself contains anchors (e.g. Breadcrumbs), and an <a>
    inside an <a> is invalid DOM. Navigation is a hash write with Enter/Space
    handled for keyboard. */
function ComponentGalleryCard({ entry }: { entry: ComponentEntry }) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);
  const DESIGN_W = 360; // width the demo renders at before scaling to fit
  const STAGE_PAD = 24; // breathing room so nothing kisses the stage edges

  // Fit the (fixed design-width) demo into the stage on BOTH axes, so a tall
  // demo (Accordion, Timeline) scales down to fit instead of being cropped by
  // the stage's overflow-hidden. Never scale up past 1.
  React.useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;
    const update = () => {
      const availW = box.clientWidth - STAGE_PAD * 2;
      const availH = box.clientHeight - STAGE_PAD * 2;
      const rawH = content.scrollHeight || 1;
      const next = Math.min(1, availW / DESIGN_W, availH / rawH);
      setScale(next > 0 ? next : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  const go = () => {
    window.location.hash = `#components/${entry.slug}`;
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={entry.name}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-canvas outline-none transition-colors hover:border-fg/20 focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* thumbnail stage — scales a non-interactive default render to fit both axes */}
      <div ref={boxRef} className="relative flex h-52 items-center justify-center overflow-hidden border-b border-border">
        <div
          ref={contentRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
          style={{ width: DESIGN_W, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          <div className="flex items-center justify-center px-4">
            {entry.render(defaultsFor(entry.controls))}
          </div>
        </div>
      </div>
      <div className="px-3.5 py-3">
        <p className="truncate text-sm font-semibold text-fg">{entry.name}</p>
      </div>
    </div>
  );
}

function ComponentsIndex() {
  const [page, setPage] = React.useState(1);
  const sorted = React.useMemo(
    () => [...COMPONENTS].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = sorted.slice(start, start + PER_PAGE);

  const gotoPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Components</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        {sorted.length} accessible, token-driven React components — each with a live playground,
        prop reference, and copy-paste install. Pick one to dive in.
      </p>

      <div className="not-prose mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry) => (
          <ComponentGalleryCard key={entry.slug} entry={entry} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs text-fg/45">
            {start + 1}–{Math.min(start + PER_PAGE, sorted.length)} of {sorted.length}
          </p>
          <Pagination page={page} total={totalPages} onPageChange={gotoPage} />
        </div>
      )}
    </article>
  );
}

/* ---- page ------------------------------------------------------------- */

export function ComponentDocs({ slug }: { slug: string }) {
  // bare #components → the browsable, paginated gallery index
  if (!slug) return <ComponentsIndex />;

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
