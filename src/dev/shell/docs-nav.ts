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
};

export const docsNav: DocsNavGroup[] = [
  {
    heading: "Get Started",
    items: [
      { label: "Introduction", href: "#docs" },
      { label: "Installation", href: "#docs", soon: true },
      { label: "Theming", href: "#docs", soon: true },
    ],
  },
  {
    heading: "Foundations",
    items: [
      { label: "Tokens", href: "#tokens" },
      { label: "Color", href: "#tokens", soon: true },
      { label: "Typography", href: "#tokens", soon: true },
      { label: "Spacing & radius", href: "#tokens", soon: true },
    ],
  },
  {
    heading: "Components",
    items: [
      { label: "Overview", href: "#components" },
      { label: "Button", href: "#components", soon: true },
      { label: "Input", href: "#components", soon: true },
      { label: "Card", href: "#components", soon: true },
      { label: "Badge", href: "#components", soon: true },
      { label: "Dialog", href: "#components", soon: true },
      { label: "Tabs", href: "#components", soon: true },
    ],
  },
  {
    heading: "Templates",
    items: [
      { label: "Overview", href: "#templates" },
      { label: "AI console", href: "#ai" },
      { label: "Admin", href: "#admin" },
    ],
  },
  {
    heading: "Test Cases",
    items: [
      { label: "Overview", href: "#test-cases" },
      { label: "States", href: "#test-cases", soon: true },
      { label: "Edge cases", href: "#test-cases", soon: true },
    ],
  },
];
