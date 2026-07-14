import * as React from "react";
import type { BlockEntry, BlockVariant } from "./blocks/entry";
import { statCardsBlock } from "./blocks/stat-cards.blocks";
import { loginBlock } from "./blocks/login.blocks";
import { tableToolbarBlock } from "./blocks/table-toolbar.blocks";
import { emptyStateBlock } from "./blocks/empty-state.blocks";

/*
  Blocks docs (#blocks/…) — shadcn's blocks model, three levels deep so it
  scales as every family grows a long list of variants:

    #blocks                     → family gallery (one card per block family)
    #blocks/<family>            → variant gallery (a card per variant in that
                                   family — the "inside" page, also a grid so it
                                   never turns into an endless stack)
    #blocks/<family>/<variant>  → single variant: Preview / Code tabs + Copy

  Each card scales its real block to fit the stage on both axes (same fit as the
  components gallery), so it reads as a faithful mini-preview. One file per
  family lives in ./blocks/; adding a variant is a single entry there.
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

/* ---- shared scaled thumbnail ------------------------------------------ */

const THUMB_W = 640; // design width a block renders at before scaling
const THUMB_PAD = 24; // breathing room so nothing kisses the stage edges

/** Renders `node` at a fixed design width, scaled to fit the stage on both
    axes and centered — a faithful, non-interactive mini-preview. */
function ScaledThumb({ node }: { node: React.ReactNode }) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(0.4);

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
    <div ref={boxRef} className="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
      <div
        ref={contentRef}
        className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
        style={{ width: THUMB_W, transform: `translate(-50%, -50%) scale(${scale})` }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-center px-4">{node}</div>
      </div>
    </div>
  );
}

/* ---- family gallery card (overview) ----------------------------------- */

function BlockGalleryCard({ block }: { block: BlockEntry }) {
  return (
    <a
      href={`#blocks/${block.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas transition-colors hover:border-fg/20"
    >
      <ScaledThumb node={block.variants[0].render()} />
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

/* ---- variant gallery card (inside a family) --------------------------- */

function VariantGalleryCard({ block, variant }: { block: BlockEntry; variant: BlockVariant }) {
  return (
    <a
      href={`#blocks/${block.slug}/${variant.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas transition-colors hover:border-fg/20"
    >
      <ScaledThumb node={variant.render()} />
      <div className="flex items-start justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{variant.title}</p>
          {variant.description && (
            <p className="mt-0.5 truncate text-xs text-fg/55">{variant.description}</p>
          )}
        </div>
        <code className="mt-0.5 shrink-0 rounded-md border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] text-fg/60">
          {variant.id}
        </code>
      </div>
    </a>
  );
}

/* ---- variant detail (preview / code) ---------------------------------- */

function VariantDetail({ block, variant }: { block: BlockEntry; variant: BlockVariant }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(variant.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  // sibling variants for quick prev/next-style browsing without going back up
  const idx = block.variants.findIndex((v) => v.id === variant.id);

  return (
    <article className="animate-fade-up py-10">
      <a
        href={`#blocks/${block.slug}`}
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← {block.name}
      </a>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <code className="rounded-md border border-border bg-panel px-2 py-0.5 font-mono text-xs text-fg/70">
          {variant.id}
        </code>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">{variant.title}</h1>
        <span className="text-xs text-fg/45">
          {idx + 1} of {block.variants.length}
        </span>
      </div>
      {variant.description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg/60">{variant.description}</p>
      )}

      <div className="mt-5">
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
          <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-border bg-canvas p-6 sm:p-10">
            {variant.render()}
          </div>
        ) : (
          <pre className="max-h-[560px] overflow-auto rounded-xl border border-border bg-panel px-4 py-3.5 text-[13px] leading-relaxed text-fg/85">
            <code>{variant.code}</code>
          </pre>
        )}
      </div>

      {/* other variants in this family */}
      {block.variants.length > 1 && (
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-fg/40">
            More {block.name.toLowerCase()} variants
          </p>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {block.variants
              .filter((v) => v.id !== variant.id)
              .map((v) => (
                <VariantGalleryCard key={v.id} block={block} variant={v} />
              ))}
          </div>
        </div>
      )}
    </article>
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

/* ---- views ------------------------------------------------------------ */

/** The inside page for a family: a grid gallery of its variants. */
function FamilyGallery({ block }: { block: BlockEntry }) {
  return (
    <article className="animate-fade-up py-10">
      <a
        href="#blocks"
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← All blocks
      </a>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{block.name}</h1>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-fg/55">
          {block.variants.length} variant{block.variants.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">{block.tagline}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {block.variants.map((v) => (
          <VariantGalleryCard key={v.id} block={block} variant={v} />
        ))}
      </div>
    </article>
  );
}

/** The top-level index: a grid gallery of families. */
function FamilyGalleryIndex() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Blocks</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        Composed, copy-paste UI sections built from AsbirUI components and tokens
        — dashboards, forms, toolbars. Each block ships in multiple variants:
        drop one in, swap the data, ship.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {BLOCKS.map((b) => (
          <BlockGalleryCard key={b.slug} block={b} />
        ))}
      </div>
    </article>
  );
}

/* ---- page router ------------------------------------------------------ */

/** `slug` is the sub-path after "blocks/" — "" (index), "<family>", or
    "<family>/<variant>". */
export function BlocksDocs({ slug }: { slug: string }) {
  if (!slug) return <FamilyGalleryIndex />;

  const [familySlug, variantId] = slug.split("/");
  const block = BLOCKS.find((b) => b.slug === familySlug);

  // unknown family → fall back to the index
  if (!block) return <FamilyGalleryIndex />;

  if (variantId) {
    const variant = block.variants.find((v) => v.id === variantId);
    // unknown variant → show the family gallery
    return variant ? <VariantDetail block={block} variant={variant} /> : <FamilyGallery block={block} />;
  }

  return <FamilyGallery block={block} />;
}
