import * as React from "react";
import type { BlockEntry, BlockVariant } from "./blocks/entry";
import { statCardsBlock } from "./blocks/stat-cards.blocks";
import { loginBlock } from "./blocks/login.blocks";
import { tableToolbarBlock } from "./blocks/table-toolbar.blocks";
import { emptyStateBlock } from "./blocks/empty-state.blocks";

/*
  Blocks docs (#blocks/<slug>) — shadcn's blocks model. A block is a FAMILY of
  numbered variants (login-01, login-02, …); the family page stacks every
  variant as its own full-width framed preview with Preview / Code tabs +
  Copy. No per-prop Customize panel: blocks are compositions you copy
  wholesale and edit in place. One file per family lives in ./blocks/;
  adding a variant is a single entry there (render + code).
*/

const BLOCKS: BlockEntry[] = [statCardsBlock, loginBlock, tableToolbarBlock, emptyStateBlock];

export const BLOCK_SLUGS = BLOCKS.map((b) => b.slug);

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

/* ---- variant showcase (one preview/code section) ----------------------- */

function VariantShowcase({ variant }: { variant: BlockVariant }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(variant.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="mt-10 first:mt-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <code className="rounded-md border border-border bg-panel px-2 py-0.5 font-mono text-xs text-fg/70">
          {variant.id}
        </code>
        <h2 className="text-base font-semibold tracking-tight text-fg">{variant.title}</h2>
      </div>
      {variant.description && (
        <p className="mt-1.5 max-w-2xl text-sm text-fg/60">{variant.description}</p>
      )}

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
            {variant.render()}
          </div>
        ) : (
          <pre className="max-h-[520px] overflow-auto rounded-xl border border-border bg-panel px-4 py-3.5 text-[13px] leading-relaxed text-fg/85">
            <code>{variant.code}</code>
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

/* A compact gallery tile: the family's name over a scaled-down,
   non-interactive thumbnail of its FIRST variant. Whole card links to the
   family page. The thumbnail renders the real block at a fixed "design
   width" and scales it to fit, so it reads as a faithful mini-preview. */
const THUMB_W = 640; // design width the block renders at before scaling
const THUMB_PAD = 24; // breathing room so nothing kisses the stage edges

function BlockGalleryCard({ block }: { block: BlockEntry }) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(0.4);

  // Fit the fixed design-width block into the stage on BOTH axes (same as the
  // components gallery) so tall/short blocks scale to fit rather than crop, and
  // are always centered — the inner render is centered within THUMB_W too.
  React.useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;
    const update = () => {
      const availW = box.clientWidth - THUMB_PAD * 2;
      const availH = box.clientHeight - THUMB_PAD * 2;
      const rawH = content.scrollHeight || 1;
      const next = Math.min(1, availW / THUMB_W, availH / rawH);
      setScale(next > 0 ? next : 0.4);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <a
      href={`#blocks/${block.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas transition-colors hover:border-fg/20"
    >
      {/* thumbnail stage — fixed aspect, scales the block to fit both axes, centered */}
      <div ref={boxRef} className="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
        <div
          ref={contentRef}
          className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
          style={{ width: THUMB_W, transform: `translate(-50%, -50%) scale(${scale})` }}
          aria-hidden="true"
        >
          <div className="flex items-center justify-center px-4">{block.variants[0].render()}</div>
        </div>
      </div>
      {/* caption */}
      <div className="flex items-start justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{block.name}</p>
          <p className="mt-0.5 truncate text-xs text-fg/55">{block.tagline}</p>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-fg/55">
          {block.variants.length} variant{block.variants.length === 1 ? "" : "s"}
        </span>
      </div>
    </a>
  );
}

/* ---- page ------------------------------------------------------------- */

export function BlocksDocs({ slug }: { slug: string }) {
  // a specific family → its stacked variant showcases; otherwise the gallery
  const one = BLOCKS.find((b) => b.slug === slug);

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        {one ? one.name : "Blocks"}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        {one
          ? one.tagline
          : "Composed, copy-paste UI sections built from AsbirUI components and tokens — dashboards, forms, toolbars. Each block ships in multiple variants: drop one in, swap the data, ship."}
      </p>

      {one ? (
        one.variants.map((v) => <VariantShowcase key={v.id} variant={v} />)
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
