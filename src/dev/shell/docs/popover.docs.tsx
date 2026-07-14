import { Button, Popover, PopoverContent, PopoverTrigger } from "@/index";
import type { ComponentEntry } from "./entry";

export const popoverEntry: ComponentEntry = {
  slug: "popover",
  name: "Popover",
  tagline:
    "An anchored floating panel for general content. Positioned inline against the trigger via side + align — not a portal, so it stays interactive. Closes on outside click and Escape.",
  controls: [
    {
      type: "select",
      key: "side",
      label: "Side",
      default: "bottom",
      options: [
        { value: "top", label: "top" },
        { value: "bottom", label: "bottom" },
        { value: "left", label: "left" },
        { value: "right", label: "right" },
      ],
    },
    {
      type: "select",
      key: "align",
      label: "Align",
      default: "center",
      options: [
        { value: "start", label: "start" },
        { value: "center", label: "center" },
        { value: "end", label: "end" },
      ],
    },
  ],
  render: (v) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Quick settings
        </Button>
      </PopoverTrigger>
      <PopoverContent side={v.side as "bottom"} align={v.align as "center"}>
        <p className="text-sm font-medium text-fg">Quick settings</p>
        <p className="mt-1 text-sm text-fg/60">Autosave is on.</p>
        <p className="text-sm text-fg/60">Notifications every 15 min.</p>
      </PopoverContent>
    </Popover>
  ),
  code: (v) => `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Quick settings</Button>
  </PopoverTrigger>
  <PopoverContent side="${v.side}" align="${v.align}">
    <p className="text-sm font-medium text-fg">Quick settings</p>
    <p className="mt-1 text-sm text-fg/60">Autosave is on.</p>
  </PopoverContent>
</Popover>`,
  importPath: `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "open / defaultOpen", type: "boolean", description: "Controlled or uncontrolled open state (Popover)." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the open state should change." },
    { name: "asChild (trigger)", type: "boolean", description: "Render the single child as the trigger, merging props — e.g. a Button." },
    { name: "side (content)", type: `"top" | "bottom" | "left" | "right"`, description: "Which edge of the trigger the panel sits on (default bottom)." },
    { name: "align (content)", type: `"start" | "center" | "end"`, description: "Cross-axis alignment against the trigger (default center)." },
  ],
};
