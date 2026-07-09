# AsbirUI

> AsbirTech's internal design system — a Tailwind preset (tokens), components,
> a motion layer, and product templates.

AsbirUI is **layered on Tailwind CSS** (and, over time, headless primitives),
not a from-scratch competitor to them. Its job is to give every AsbirTech app
the same look by default: one OKLCH palette, one set of semantic tokens, and a
growing set of components/blocks/templates built on them.

- **Tailwind preset** — the shareable design system (colors, radius, fonts,
  animations) that every app extends.
- **React 18+**, full TypeScript types, light + dark.
- **Motion** — opt-in animations built on `framer-motion` (optional peer).

## Install

```bash
npm install @asbirtech/asbir-ui
```

Peer dependencies: `react`, `react-dom` (>=18). `framer-motion` (>=11) only if
you use `@asbirtech/asbir-ui/motion`.

## Setup (the design system)

Two things wire AsbirUI into an app — the **preset** (gives you the token class
names like `bg-panel`, `text-fg`, `rounded-asbir`) and the **stylesheet** (gives
those classes real values + light/dark switching):

```ts
// tailwind.config.ts
import asbirPreset from "@asbirtech/asbir-ui/preset";

export default {
  presets: [asbirPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

```ts
// app entry (once)
import "@asbirtech/asbir-ui/styles.css";
```

Now the whole app can use AsbirUI's tokens directly — `className="bg-panel
text-fg rounded-asbir"` — and every shipped component matches automatically.

### Re-theming

Every color is a CSS variable. Override them in your own stylesheet and the
entire system follows — no component changes:

```css
:root { --accent: 139 92 246; }   /* space-separated RGB */
```

### Components

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@asbirtech/asbir-ui";

<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => {}}>Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### Dark mode

Tokens respond to a `dark` class **or** `[data-theme="dark"]` on any ancestor:

```tsx
<div data-theme="dark">…</div>
```

## Exports

| Entry | What |
|-------|------|
| `@asbirtech/asbir-ui` | Components + `cn` (imports the base tokens). |
| `@asbirtech/asbir-ui/preset` | The shareable Tailwind preset. |
| `@asbirtech/asbir-ui/styles.css` | Compiled token values + component styles. |
| `@asbirtech/asbir-ui/motion` | `Reveal`, `Stagger` (needs `framer-motion`). |
| `@asbirtech/asbir-ui/motion.css` | Zero-runtime CSS microinteractions. |

## Local development

```bash
npm install
npm run dev        # dev playground at http://localhost:5173
npm run build      # build the library into dist/
npm run typecheck  # type-check without emitting
```

## Roadmap

Shipped: `DropdownMenu`, `FilterChips`, the motion layer, and the token preset.
Generic primitives (Button, Input, Dialog, Tabs) are best adopted from a headless
library and restyled with the preset rather than rebuilt. The library's own focus
is the preset, blocks, and product templates (e.g. the Lumina AI console).
Current release: **v0.1.0 (alpha)**.

## License

MIT © AsbirTech
