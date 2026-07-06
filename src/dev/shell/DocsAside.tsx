/*
  Right-hand aside for the docs shell (React-Bits-style): a highlighted promo
  card plus a small "what's inside" summary. Hidden below xl so the content
  column keeps its width on smaller screens.
*/

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const inside = [
  { label: "Components", value: "12+" },
  { label: "Design tokens", value: "40+" },
  { label: "Themes", value: "2" },
];

export function DocsAside() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto py-10 pl-6 pr-6 xl:block">
      {/* promo card */}
      <div className="overflow-hidden rounded-xl border border-border bg-panel p-4">
        <span className="inline-flex rounded-md bg-overlay/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fg/70">
          Internal
        </span>
        <h3 className="mt-3 text-sm font-semibold text-fg">
          Ship faster with AsbirUI
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-fg/55">
          Accessible components, one palette, copy-paste source — everything an
          AsbirTech team needs to start a screen.
        </p>
        <a
          href="#components"
          className="mt-3 inline-flex items-center gap-1.5 rounded-asbir bg-solid px-3 py-1.5 text-xs font-semibold text-fg-invert transition-colors hover:bg-solid/85"
        >
          Browse components
          <span>{ArrowIcon}</span>
        </a>
      </div>

      {/* what's inside */}
      <div className="mt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          What's inside
        </p>
        <dl className="space-y-2">
          {inside.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <dt className="text-fg/60">{row.label}</dt>
              <dd className="font-medium text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-muted">
        AsbirUI · v0.1 alpha
        <br />
        <span className="text-muted/70">Owned by AsbirTech</span>
      </p>
    </aside>
  );
}
