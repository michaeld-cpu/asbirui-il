# BedrockUI

> The dependable foundation for React UIs — accessible, themeable components.

BedrockUI is a React-first component library in the same space as **Radix UI**,
**shadcn/ui**, and **Hero UI**. It combines accessible primitives with a clean,
token-driven design system you can adopt as-is or fully own.

- ⚛️ **React 18+** with full TypeScript types
- 🎨 **Tailwind CSS** design tokens (light + dark)
- ♿ **Accessibility** built in
- 🌲 Tree-shakeable, no runtime lock-in

## Install

```bash
npm install bedrockui
```

Peer dependencies: `react` and `react-dom` (>=18).

## Usage

```tsx
import { Button } from "bedrockui";
import "bedrockui/styles.css";

export function Example() {
  return (
    <div className="flex gap-3">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost" size="lg">
        Ghost
      </Button>
    </div>
  );
}
```

### Dark mode

Tokens respond to a `dark` class **or** `[data-theme="dark"]` on any ancestor:

```tsx
<div data-theme="dark">
  <Button>Dark themed</Button>
</div>
```

## Local development

```bash
npm install
npm run dev        # dev playground at http://localhost:5173
npm run build      # build the library into dist/
npm run typecheck  # type-check without emitting
```

## Roadmap

See the project board for the component backlog (Input, Select, Dialog, Tabs,
Toast, and more). Current release: **v0.1.0 (alpha)**.

## License

MIT © michaeld-cpu
