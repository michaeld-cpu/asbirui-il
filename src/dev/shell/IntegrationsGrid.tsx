/*
  IntegrationsGrid — the "Built on tools your team already trusts" section.
  Text-only cards: a title and a blurb; a tinted "Coming Soon" pill (top-right)
  marks what we're bringing next (Vue, Kotlin, Jetpack Compose, SwiftUI).
  Token-driven card surfaces so it themes with the rest of the site.
*/

type Tech = {
  id: string;
  title: string;
  href?: string;
  blurb: string;
  soon?: boolean;
};

const TECH: Tech[] = [
  { id: "react", title: "React", href: "https://react.dev", blurb: "Function components with a hooks-first API. Every part is a single readable file you can copy and own." },
  { id: "ts", title: "TypeScript", href: "https://www.typescriptlang.org", blurb: "Props, variants, and slots are typed end to end, so your editor catches mistakes before runtime." },
  { id: "tailwind", title: "Tailwind CSS", href: "https://tailwindcss.com", blurb: "Utility-driven styling with zero runtime cost — every surface reads from the same semantic tokens." },
  { id: "radix", title: "Radix", href: "https://www.radix-ui.com", blurb: "Accessibility and behaviour from battle-tested primitives — keyboard nav, focus management, ARIA." },
  { id: "vite", title: "Vite", href: "https://vitejs.dev", blurb: "An instant dev server and fast, tree-shakeable builds. The docs app you're reading is Vite-powered." },
  { id: "tokens", title: "Design tokens", href: "#tokens", blurb: "One semantic palette of CSS variables that flips between light and dark themes with no rework." },
  { id: "vue", title: "Vue", soon: true, blurb: "The same components and tokens, rendered the Vue way — bring AsbirUI to your Vue apps unchanged." },
  { id: "kotlin", title: "Kotlin", soon: true, blurb: "Native Android styling and components, mapped to the same design tokens you already use on the web." },
  { id: "compose", title: "Jetpack Compose", soon: true, blurb: "Declarative Android UI with matching motion — the AsbirUI system, rendered the Compose way." },
  { id: "swiftui", title: "SwiftUI", soon: true, blurb: "First-class iOS styling and animations so your Apple apps share the same look and feel." },
];

function TechCard({ tech }: { tech: Tech }) {
  const external = tech.href?.startsWith("http");
  const clickable = !!tech.href && !tech.soon;
  const Tag = clickable ? "a" : "div";
  return (
    <Tag
      {...(clickable ? { href: tech.href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) } : {})}
      className={`relative flex flex-col bg-canvas p-6 ${clickable ? "cursor-pointer" : ""}`}
    >
      {tech.soon && (
        <span className="absolute right-5 top-5 rounded-md bg-[#3B82F6]/15 px-2.5 py-1 text-[10px] font-semibold text-[#60A5FA]">
          Coming Soon
        </span>
      )}
      <p className="text-[15px] font-semibold text-fg">{tech.title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-fg/55">{tech.blurb}</p>
    </Tag>
  );
}

export function IntegrationsGrid() {
  /* no card containers — hairline grid lines between cells (gap-px over the
     border color; each cell paints the canvas back on top) */
  return (
    <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
      {TECH.map((t) => (
        <TechCard key={t.id} tech={t} />
      ))}
      {/* teaser fills the rest of the last row (and reads as its own cell) */}
      <div className="flex flex-col justify-center bg-canvas p-6 sm:col-span-2 lg:col-span-2">
        <p className="text-[15px] font-semibold text-fg">
          And we're just getting started<span className="text-fg/40">…</span>
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-fg/55">
          More frameworks, platforms, and tooling are on the roadmap — one design system, everywhere your team ships.
        </p>
      </div>
    </div>
  );
}
