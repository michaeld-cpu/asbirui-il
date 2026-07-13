/*
  Categorized navigation for the docs shell (React-Bits-style grouped sidebar).
  Items marked `soon` render dimmed and non-interactive — they signal the
  roadmap without being dead links. The three real routes (components / docs /
  tokens) map to the hash router; everything else is a placeholder anchor.
*/

export type DocsNavItem = {
  label: string;
  href: string; // "#components" etc.; "#" for not-yet-built
  soon?: boolean;
};

export type DocsNavGroup = {
  heading: string;
  items: DocsNavItem[];
  /* `always` groups (Get Started, Foundations) stay in the sidebar on every
     page; the rest only appear when you're inside that section. */
  always?: boolean;
};

/**
 * For a bare category route (e.g. "components"), the route its first real
 * navigable item points to (e.g. "components/dropdown-menu"). Categories no
 * longer have an "Overview" landing page — clicking the category lands you on
 * its first item instead. Returns null when there's no real destination (the
 * group only has `soon` placeholders, or the bare route IS the first item), in
 * which case the bare route renders as-is.
 */
export function landingRouteFor(base: string): string | null {
  const group = docsNav.find((g) => CATEGORY_HEADINGS[base] === g.heading);
  if (!group) return null;
  const first = group.items.find(
    (it) => !it.soon && stripHash(it.href) !== base && it.href !== "#"
  );
  return first ? stripHash(first.href) : null;
}

/* Maps a bare category route to its sidebar group heading. These are the
   sections whose "Overview" landing was removed — visiting the bare route now
   redirects to the group's first real item. */
const CATEGORY_HEADINGS: Record<string, string> = {
  components: "Components",
  // NOTE: no "templates" — "#templates" is a real landing page (the template
  // catalogue), so it must render as-is, not redirect to its first item.
  "test-cases": "Test Cases",
};

function stripHash(href: string): string {
  return href.replace(/^#/, "");
}

export const docsNav: DocsNavGroup[] = [
  {
    heading: "Get Started",
    always: true,
    items: [
      { label: "Introduction", href: "#docs" },
      { label: "Installation", href: "#docs", soon: true },
      { label: "Theming", href: "#docs", soon: true },
    ],
  },
  {
    heading: "Foundations",
    always: true,
    items: [
      { label: "Tokens", href: "#tokens" },
      { label: "Colors", href: "#tokens/colors" },
      { label: "Typography", href: "#tokens", soon: true },
      { label: "Spacing & radius", href: "#tokens", soon: true },
    ],
  },
  {
    heading: "Components",
    items: [
      { label: "Avatar", href: "#components/avatar" },
      { label: "Badge", href: "#components/badge" },
      { label: "Button", href: "#components/button" },
      { label: "Card", href: "#components/card" },
      { label: "Checkbox", href: "#components/checkbox" },
      { label: "Command Menu", href: "#components/command-menu" },
      { label: "Copy Button", href: "#components/copy-button" },
      { label: "Data Table", href: "#components/data-table" },
      { label: "Dialog", href: "#components/dialog" },
      { label: "Dropdown Menu", href: "#components/dropdown-menu" },
      { label: "Empty State", href: "#components/empty-state" },
      { label: "Filter Chips", href: "#components/filter-chips" },
      { label: "Input", href: "#components/input" },
      { label: "Skeleton", href: "#components/skeleton" },
      { label: "Tabs", href: "#components/tabs" },
      { label: "Theme Toggle", href: "#components/theme-toggle" },
      { label: "Toast", href: "#components/toast" },
      { label: "Tooltip", href: "#components/tooltip" },
    ],
  },
  {
    heading: "Blocks",
    /* Composed UI sections (shadcn-style). The bare "#blocks" route shows all
       block families; each family page stacks its numbered variants. Add
       variants in src/dev/shell/blocks/<slug>.blocks.tsx. */
    items: [
      { label: "All blocks", href: "#blocks" },
      { label: "Stat cards", href: "#blocks/stat-cards" },
      { label: "Login form", href: "#blocks/login" },
      { label: "Table toolbar", href: "#blocks/table-toolbar" },
      { label: "Empty state", href: "#blocks/empty-state" },
    ],
  },
  {
    heading: "Brand Kits",
    always: true,
    /* Per-project brand kits. The index ("#brand-kits") lists every project;
       each project's kit lives at "#brand-kits/<slug>". Add real projects to
       PROJECTS in BrandKitsDocs.tsx as they're onboarded. */
    items: [
      { label: "Tripket PH", href: "#brand-kits/tripket-ph" },
      { label: "PlanOut", href: "#brand-kits/planout" },
      { label: "Asbir Tech Web", href: "#brand-kits/asbir-tech-web" },
      { label: "ProjectPlaza", href: "#brand-kits/projectplaza" },
      { label: "BeetzeePlay", href: "#brand-kits/beetzeeplay" },
    ],
  },
  {
    heading: "Templates",
    items: [
      { label: "All templates", href: "#templates" },
      { label: "AI console", href: "#ai" },
    ],
  },
  {
    heading: "Test Cases",
    items: [
      { label: "States", href: "#test-cases", soon: true },
      { label: "Edge cases", href: "#test-cases", soon: true },
    ],
  },
];
