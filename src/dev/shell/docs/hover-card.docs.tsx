import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/index";
import type { ComponentEntry } from "./entry";

export const hoverCardEntry: ComponentEntry = {
  slug: "hover-card",
  name: "Hover Card",
  tagline:
    "A hover/focus-triggered preview card. Opens after a short delay and stays open through a close delay so the pointer can travel into it. Positioned inline via side + align.",
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
    <p className="text-sm text-fg/60">
      Reviewed by{" "}
      <HoverCard>
        <HoverCardTrigger>
          <span
            tabIndex={0}
            className="cursor-default font-medium text-fg underline decoration-fg/30 underline-offset-2 outline-none"
          >
            @mikey
          </span>
        </HoverCardTrigger>
        <HoverCardContent side={v.side as "bottom"} align={v.align as "center"}>
          <p className="text-sm font-semibold text-fg">Mikey Django</p>
          <p className="mt-1 text-sm text-fg/60">
            Design engineer on the platform team. Ships the design system.
          </p>
        </HoverCardContent>
      </HoverCard>
    </p>
  ),
  code: (v) => `<HoverCard>
  <HoverCardTrigger>
    <span tabIndex={0} className="underline underline-offset-2">@mikey</span>
  </HoverCardTrigger>
  <HoverCardContent side="${v.side}" align="${v.align}">
    <p className="text-sm font-semibold text-fg">Mikey Django</p>
    <p className="mt-1 text-sm text-fg/60">Design engineer on the platform team.</p>
  </HoverCardContent>
</HoverCard>`,
  importPath: `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "openDelay", type: "number", description: "Delay before opening on hover, in ms (default 300)." },
    { name: "closeDelay", type: "number", description: "Delay before closing after the pointer leaves, in ms (default 150)." },
    { name: "asChild (trigger)", type: "boolean", description: "Render the single child as the trigger, merging props." },
    { name: "side (content)", type: `"top" | "bottom" | "left" | "right"`, description: "Which edge of the trigger the card sits on (default bottom)." },
    { name: "align (content)", type: `"start" | "center" | "end"`, description: "Cross-axis alignment against the trigger (default center)." },
  ],
};
