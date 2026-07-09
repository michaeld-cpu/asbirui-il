/*
  Docs content column — React-Bits-style prose (Introduction / Mission /
  principles). Copy is keyed by route so Components / Docs / Tokens each read
  differently while sharing one layout.
*/

type Principle = { title: string; body: string };

type DocsPage = {
  eyebrow: string;
  title: string;
  lead: string[];
  missionTitle: string;
  mission: string;
  principlesIntro: string;
  principles: Principle[];
};

const pages: Record<string, DocsPage> = {
  docs: {
    eyebrow: "Get Started",
    title: "Introduction",
    lead: [
      "AsbirUI is AsbirTech's internal collection of accessible, themeable React components — built on one palette and shipped straight from the source.",
      "This isn't a heavyweight framework. It's a thin, opinionated layer over the stack you already use, so the components feel native to whatever you're building.",
    ],
    missionTitle: "Mission",
    mission:
      "The goal is simple — give every AsbirTech product a consistent, well-crafted starting point so teams spend their time on the product, not on rebuilding buttons and tables for the tenth time.",
    principlesIntro: "To make that happen, the library is committed to a few principles:",
    principles: [
      {
        title: "Own the code",
        body: "Copy a component into your repo and tweak it — you get the source, not just an import.",
      },
      {
        title: "One palette",
        body: "Every component draws from the same semantic tokens, so a single change re-themes the whole system.",
      },
      {
        title: "Accessible by default",
        body: "Keyboard nav, focus rings, and ARIA come from Radix primitives underneath.",
      },
      {
        title: "Light & dark, built in",
        body: "Themes flip through CSS variables — no duplicated styles, no flash.",
      },
    ],
  },
  components: {
    eyebrow: "Components",
    title: "Overview",
    lead: [
      "The component set covers the primitives most AsbirTech screens reach for first — buttons, inputs, cards, dialogs, tables, and the layout pieces around them.",
      "Each one is a single file you can read top to bottom: props are explicit, variants are typed, and there's no hidden runtime.",
    ],
    missionTitle: "How they're built",
    mission:
      "Components are composed from the same tokens the app shell uses, styled with Tailwind, and given accessible behaviour by Radix primitives. Nothing is a black box.",
    principlesIntro: "What you can expect from every component:",
    principles: [
      {
        title: "Typed props",
        body: "Props, variants, and slots are typed end-to-end so your editor catches mistakes.",
      },
      {
        title: "Composable",
        body: "Small pieces that snap together — no monolithic all-in-one widgets.",
      },
      {
        title: "Themed",
        body: "Every color, radius, and shadow reads from a token, never a one-off value.",
      },
      {
        title: "Copy-paste ready",
        body: "Grab the source and go; the component is yours to modify.",
      },
    ],
  },
  templates: {
    eyebrow: "Templates",
    title: "Overview",
    lead: [
      "Templates are production-shaped starter kits built entirely on AsbirUI components and tokens. Each one is a full multi-screen flow — routing glue included — so you can clone it, swap the data, and ship.",
      "Two live templates ship today: the AI console (violet theme) and the Admin dashboard. Both are router-agnostic — the hash-route switch is the only glue, and it's designed to be swapped for React Router, TanStack, or Next.",
    ],
    missionTitle: "How they're built",
    mission:
      "Every screen is composed from the same components and semantic tokens the rest of the library uses. Nothing is a one-off mockup — the homepage preview is a live render of the actual template page, scaled to fit.",
    principlesIntro: "What each template gives you:",
    principles: [
      {
        title: "Real screens",
        body: "Overview, forms, detail, list, settings, auth, and 404 — the pages every internal app needs, not a single hero shot.",
      },
      {
        title: "Router-agnostic",
        body: "Pages and layout never import a router. The route switch is a single file you replace with your own.",
      },
      {
        title: "Themed end-to-end",
        body: "The AI console ships its own violet theme layered over the same token names, proving the system re-themes cleanly.",
      },
      {
        title: "Copy and go",
        body: "Clone the template directory, point it at your data, and you're a step ahead of a blank file.",
      },
    ],
  },
  "test-cases": {
    eyebrow: "Test Cases",
    title: "Overview",
    lead: [
      "This is the QA reference for the library — a catalogue of the states and edge cases every component is expected to handle, so nothing regresses quietly.",
      "Each component is exercised across its variants and its awkward states: empty, loading, error, overflow, and the boundaries in between. If a case lives here, it's a case the component must survive.",
    ],
    missionTitle: "Why a test-case page",
    mission:
      "A component library is only trustworthy if its rough edges are known and pinned down. Documenting the cases makes the expected behaviour explicit — for reviewers, for adopters, and for the next person who touches the code.",
    principlesIntro: "The cases are grouped into:",
    principles: [
      {
        title: "Variants",
        body: "Every size, tone, and layout a component exposes, rendered side by side so a visual regression is obvious.",
      },
      {
        title: "States",
        body: "Empty, loading, disabled, error, and success — the states real screens spend most of their time in.",
      },
      {
        title: "Edge cases",
        body: "Long text, overflow, missing data, and unusual inputs that break naïve implementations.",
      },
      {
        title: "Accessibility",
        body: "Keyboard traversal, focus order, and ARIA — checked, not assumed, since the behaviour comes from Radix underneath.",
      },
    ],
  },
  tokens: {
    eyebrow: "Foundations",
    title: "Tokens",
    lead: [
      "Tokens are the single source of truth for color, spacing, radius, and type. Every component reads from them, so the whole system moves together.",
      "They're plain CSS custom properties, split into a raw brand ramp and a set of semantic tokens that flip between light and dark themes.",
    ],
    missionTitle: "Why tokens first",
    mission:
      "Designing against tokens instead of raw values means a rebrand or a theme tweak is a handful of variable edits — not a find-and-replace across the codebase.",
    principlesIntro: "The token system is organized into:",
    principles: [
      {
        title: "Brand ramp",
        body: "Theme-independent raw scale (--brand-50 … --brand-950), centered on the logomark.",
      },
      {
        title: "Semantic tokens",
        body: "accent, fg, muted, border, canvas, panel — these flip with the theme.",
      },
      {
        title: "Radius & spacing",
        body: "One radius token (--as-radius) keeps corners consistent across components.",
      },
      {
        title: "Two themes",
        body: "Light and dark are two value sets over the same token names.",
      },
    ],
  },
};

const CheckIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function DocsContent({ route }: { route: string }) {
  const page = pages[route] ?? pages.docs;

  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        {page.title}
      </h1>

      <div className="mt-6 space-y-4">
        {page.lead.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-fg/70">
            {p}
          </p>
        ))}
      </div>

      <hr className="my-10 border-border" />

      <h2 className="text-2xl font-semibold tracking-tight text-fg">
        {page.missionTitle}
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-fg/70">
        {page.mission}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-fg/70">
        {page.principlesIntro}
      </p>

      <ul className="mt-5 space-y-3">
        {page.principles.map((pr) => (
          <li key={pr.title} className="flex gap-2.5">
            <span className="text-fg/50">{CheckIcon}</span>
            <p className="text-[15px] leading-relaxed text-fg/70">
              <span className="font-medium text-fg">{pr.title}:</span> {pr.body}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
