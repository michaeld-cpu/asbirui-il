import { Badge } from "@/index";
import { hexToRgbTriplet, type ComponentEntry } from "./entry";

export const badgeEntry: ComponentEntry = {
  slug: "badge",
  name: "Badge",
  tagline:
    "A small status or category label. Tinted variants use low-alpha fills, so they read on both themes without per-theme overrides.",
  controls: [
    {
      type: "select",
      key: "variant",
      label: "Variant",
      default: "accent",
      options: [
        { value: "neutral", label: "neutral" },
        { value: "accent", label: "accent" },
        { value: "success", label: "success" },
        { value: "warning", label: "warning" },
        { value: "danger", label: "danger" },
        { value: "outline", label: "outline" },
      ],
    },
    { type: "toggle", key: "dot", label: "Status dot", default: true },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the "accent" variant
    <div style={{ ["--accent" as string]: hexToRgbTriplet(v.accent as string) }}>
      <Badge variant={v.variant as "accent"} dot={v.dot as boolean}>
        Operational
      </Badge>
    </div>
  ),
  code: (v) =>
    `<Badge variant="${v.variant}"${v.dot ? " dot" : ""}>Operational</Badge>`,
  importPath: `import { Badge } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "variant", type: `"neutral" | "accent" | "success" | "warning" | "danger" | "outline"`, description: "Tint; status colors for state, accent for product labels like Beta." },
    { name: "dot", type: "boolean", description: "Prepends a small status dot in the variant color." },
  ],
};
