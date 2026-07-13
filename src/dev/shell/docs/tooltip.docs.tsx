import { Button, Tooltip } from "@/index";
import type { ComponentEntry } from "./entry";

export const tooltipEntry: ComponentEntry = {
  slug: "tooltip",
  name: "Tooltip",
  tagline:
    "A hover/focus label for icon buttons and truncated text. Appears after a delay on hover, immediately on keyboard focus, and hides on Escape.",
  controls: [
    {
      type: "select",
      key: "side",
      label: "Side",
      default: "top",
      options: [
        { value: "top", label: "top" },
        { value: "bottom", label: "bottom" },
        { value: "left", label: "left" },
        { value: "right", label: "right" },
      ],
    },
    { type: "slider", key: "delay", label: "Delay (ms)", min: 0, max: 1000, step: 50, default: 300 },
  ],
  render: (v) => (
    <Tooltip
      content="Copies the install command"
      side={v.side as "top"}
      delay={v.delay as number}
    >
      <Button variant="outline" size="sm">
        Hover or focus me
      </Button>
    </Tooltip>
  ),
  code: (v) => `<Tooltip
  content="Copies the install command"
  side="${v.side}"
  delay={${v.delay}}
>
  <Button variant="outline" size="sm">Hover or focus me</Button>
</Tooltip>`,
  importPath: `import { Tooltip } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "content", type: "ReactNode", description: "The bubble's text." },
    { name: "side", type: `"top" | "bottom" | "left" | "right"`, description: "Which edge of the trigger the bubble hangs off." },
    { name: "delay", type: "number", description: "Hover delay in ms (default 300); keyboard focus shows immediately." },
    { name: "children", type: "ReactNode", description: "The trigger — gets aria-describedby while the tooltip is open." },
  ],
};
