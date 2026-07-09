import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  FilterChips,
} from "@/index";

/*
  Blocks docs (#blocks/<slug>). Unlike single components, a "block" is a larger,
  composed UI section — a dashboard stat row, an auth form, a table toolbar —
  shown in a FULL-WIDTH framed preview with Preview / Code tabs + Copy (shadcn's
  blocks model). No per-prop Customize panel: blocks are compositions you copy
  wholesale and edit in place. Data-driven off BLOCKS so adding one is a single
  entry (render + code).
*/

/* ---- icons ------------------------------------------------------------ */

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
const CheckIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const SearchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
  </svg>
);
const InboxIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" />
  </svg>
);
const PlusIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ---- registry types --------------------------------------------------- */

type BlockEntry = {
  slug: string;
  name: string;
  tagline: string;
  render: () => React.ReactNode;
  code: string;
  /** span the full 2-col grid in the overview (for inherently wide blocks). */
  wide?: boolean;
};

/* ---- block: stat cards row -------------------------------------------- */

const STATS = [
  { label: "Total revenue", value: "$48,080", delta: "+12.5%", up: true },
  { label: "Active users", value: "8,420", delta: "+4.1%", up: true },
  { label: "Avg. latency", value: "690 ms", delta: "-0.5%", up: false },
  { label: "Success rate", value: "97.6%", delta: "+1.2%", up: true },
];

function StatCardsBlock() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
          <p className="text-xs font-medium text-fg/60">{s.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              s.up ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            }`}
          >
            {s.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---- block: login form ------------------------------------------------ */

const inputCls =
  "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg/35 outline-none transition-colors focus:[border-color:rgb(var(--accent)/0.6)]";

function LoginBlock() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
      <h2 className="text-lg font-semibold tracking-tight text-fg">Welcome back</h2>
      <p className="mt-1 text-sm text-fg/60">Sign in to your account to continue.</p>
      <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg/70">Email</label>
          <input type="email" placeholder="you@company.com" className={inputCls} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-fg/70">Password</label>
            <a href="#" className="text-xs text-accent-soft-fg hover:underline">Forgot?</a>
          </div>
          <input type="password" placeholder="••••••••" className={inputCls} />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-solid px-3 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-fg/55">
        Don't have an account? <a href="#" className="text-accent-soft-fg hover:underline">Sign up</a>
      </p>
    </div>
  );
}

/* ---- block: data-table toolbar ---------------------------------------- */

function TableToolbarBlock() {
  const [status, setStatus] = React.useState("all");
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[12rem] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/45">{SearchIcon}</span>
          <input placeholder="Search records…" className={`${inputCls} pl-9`} />
        </div>
        <FilterChips
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
          ]}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg bg-solid px-3 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85">
            {PlusIcon}
            New
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem>Record</DropdownMenuItem>
            <DropdownMenuItem>Import CSV</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Clear all</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-4 border-b border-border bg-panel px-4 py-2.5 text-xs font-medium text-fg/70">
          <span className="flex-1">Name</span>
          <span className="w-24">Status</span>
          <span className="w-24 text-right">Updated</span>
        </div>
        {["Aurora API", "Billing sync", "Webhook relay"].map((r, i) => (
          <div key={r} className="flex items-center gap-4 border-b border-border/60 px-4 py-2.5 text-sm text-fg/80 last:border-0">
            <span className="flex-1">{r}</span>
            <span className="w-24 text-fg/60">{i === 1 ? "Paused" : "Active"}</span>
            <span className="w-24 text-right text-fg/50">2h ago</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- block: empty state ----------------------------------------------- */

function EmptyStateBlock() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-panel/40 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-overlay/[0.06] text-fg/45">
        {InboxIcon}
      </span>
      <h2 className="mt-4 text-base font-semibold text-fg">No projects yet</h2>
      <p className="mt-1.5 max-w-xs text-sm text-fg/55">
        Create your first project to start routing requests and tracking usage.
      </p>
      <button className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-solid px-3.5 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85">
        {PlusIcon}
        New project
      </button>
    </div>
  );
}

/* ---- registry --------------------------------------------------------- */

const BLOCKS: BlockEntry[] = [
  {
    slug: "stat-cards",
    name: "Stat cards",
    tagline: "A responsive row of KPI tiles — label, value, and a trend delta. A dashboard staple.",
    wide: true,
    render: () => <StatCardsBlock />,
    code: `const stats = [
  { label: "Total revenue", value: "$48,080", delta: "+12.5%", up: true },
  { label: "Active users",  value: "8,420",   delta: "+4.1%",  up: true },
  { label: "Avg. latency",  value: "690 ms",  delta: "-0.5%",  up: false },
  { label: "Success rate",  value: "97.6%",   delta: "+1.2%",  up: true },
];

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map((s) => (
    <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
      <p className="text-xs font-medium text-fg/60">{s.label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
      <span className={cn("mt-2 inline-flex rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        s.up ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600")}>
        {s.delta}
      </span>
    </div>
  ))}
</div>`,
  },
  {
    slug: "login",
    name: "Login form",
    tagline: "A centered sign-in card — email, password, forgot-password link, and a submit button.",
    render: () => <LoginBlock />,
    code: `<div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
  <h2 className="text-lg font-semibold tracking-tight text-fg">Welcome back</h2>
  <p className="mt-1 text-sm text-fg/60">Sign in to your account to continue.</p>
  <form className="mt-5 space-y-3">
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg/70">Email</label>
      <input type="email" placeholder="you@company.com" className={inputCls} />
    </div>
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-fg/70">Password</label>
        <a href="#" className="text-xs text-accent-soft-fg">Forgot?</a>
      </div>
      <input type="password" placeholder="••••••••" className={inputCls} />
    </div>
    <button className="w-full rounded-lg bg-solid px-3 py-2 text-sm font-semibold text-fg-invert">
      Sign in
    </button>
  </form>
</div>`,
  },
  {
    slug: "table-toolbar",
    name: "Table toolbar",
    tagline: "A data-table header: search field, FilterChips status filter, and a New dropdown action.",
    wide: true,
    render: () => <TableToolbarBlock />,
    code: `<div className="flex flex-wrap items-center gap-3">
  <div className="relative min-w-[12rem] flex-1">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/45">
      <SearchIcon />
    </span>
    <input placeholder="Search records…" className={cn(inputCls, "pl-9")} />
  </div>

  <FilterChips
    label="Status"
    value={status}
    onValueChange={setStatus}
    options={[
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
    ]}
  />

  <DropdownMenu>
    <DropdownMenuTrigger className="… bg-solid text-fg-invert">
      <PlusIcon /> New
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Record</DropdownMenuItem>
      <DropdownMenuItem>Import CSV</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive>Clear all</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`,
  },
  {
    slug: "empty-state",
    name: "Empty state",
    tagline: "A centered placeholder — icon, title, description, and a primary call to action.",
    render: () => <EmptyStateBlock />,
    code: `<div className="mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-panel/40 px-6 py-14 text-center">
  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-overlay/[0.06] text-fg/45">
    <InboxIcon />
  </span>
  <h2 className="mt-4 text-base font-semibold text-fg">No projects yet</h2>
  <p className="mt-1.5 max-w-xs text-sm text-fg/55">
    Create your first project to start routing requests and tracking usage.
  </p>
  <button className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-solid px-3.5 py-2 text-sm font-semibold text-fg-invert">
    <PlusIcon /> New project
  </button>
</div>`,
  },
];

export const BLOCK_SLUGS = BLOCKS.map((b) => b.slug);

/* ---- preview + code ---------------------------------------------------- */

function BlockShowcase({ block }: { block: BlockEntry }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(block.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-fg">{block.name}</h2>
          <p className="mt-1 max-w-2xl text-sm text-fg/60">{block.tagline}</p>
        </div>
      </div>

      <div className="mt-3">
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
            <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{copied ? CheckIcon : CodeIcon}</span>
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>

        {tab === "preview" ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-border bg-canvas p-6 sm:p-10">
            {block.render()}
          </div>
        ) : (
          <pre className="max-h-[520px] overflow-auto rounded-xl border border-border bg-panel px-4 py-3.5 text-[13px] leading-relaxed text-fg/85">
            <code>{block.code}</code>
          </pre>
        )}
      </div>
    </section>
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
        active ? "bg-overlay/[0.06] text-fg" : "text-fg/60 hover:text-fg"
      }`}
    >
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {children}
    </button>
  );
}

/* ---- gallery card (overview) ------------------------------------------ */

/* A compact gallery tile: the block's name over a scaled-down, non-interactive
   thumbnail of the live block. Whole card links to the full block page. The
   thumbnail renders the real block at a fixed "design width" and scales it to
   fit, so it reads as a faithful mini-preview (like the homepage template
   preview). */
const THUMB_W = 640; // design width the block renders at before scaling

function BlockGalleryCard({ block }: { block: BlockEntry }) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(0.4);

  React.useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => setScale(box.clientWidth / THUMB_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <a
      href={`#blocks/${block.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas transition-colors hover:border-fg/20"
    >
      {/* thumbnail stage — fixed aspect, clips the scaled block, centered */}
      <div ref={boxRef} className="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
          style={{ width: THUMB_W, transform: `translate(-50%, -50%) scale(${scale})` }}
          aria-hidden="true"
        >
          <div className="px-4">{block.render()}</div>
        </div>
      </div>
      {/* caption */}
      <div className="px-3.5 py-3">
        <p className="truncate text-sm font-semibold text-fg">{block.name}</p>
        <p className="mt-0.5 truncate text-xs text-fg/55">{block.tagline}</p>
      </div>
    </a>
  );
}

/* ---- page ------------------------------------------------------------- */

export function BlocksDocs({ slug }: { slug: string }) {
  // a specific block → full showcase; otherwise the gallery of all blocks
  const one = BLOCKS.find((b) => b.slug === slug);

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        {one ? one.name : "Blocks"}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        {one
          ? one.tagline
          : "Composed, copy-paste UI sections built from AsbirUI components and tokens — dashboards, forms, toolbars. Drop one in, swap the data, ship."}
      </p>

      {one ? (
        <BlockShowcase block={one} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BLOCKS.map((b) => (
            <BlockGalleryCard key={b.slug} block={b} />
          ))}
        </div>
      )}
    </article>
  );
}
