import { Kbd } from "@/index";
import type { ComponentEntry } from "./entry";

export const kbdEntry: ComponentEntry = {
  slug: "kbd",
  name: "Kbd",
  tagline:
    "A keyboard-key chip. Single characters get a min width so ⌘, K, and ? line up as even squares.",
  controls: [],
  render: () => (
    <div className="flex items-center gap-3 text-sm text-fg/60">
      <span className="inline-flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span>or</span>
      <Kbd>Esc</Kbd>
    </div>
  ),
  code: () => `<span className="inline-flex items-center gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</span>

<Kbd>Esc</Kbd>`,
  importPath: `import { Kbd } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "children", type: "React.ReactNode", description: "The key glyph or label — a single character renders as an even square." },
    { name: "className", type: "string", description: "Overrides — e.g. a larger size or a different tint." },
  ],
};
