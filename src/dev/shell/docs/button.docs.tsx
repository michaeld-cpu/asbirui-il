import { Button } from "@/index";
import { hexToRgbTriplet, type ComponentEntry } from "./entry";

export const buttonEntry: ComponentEntry = {
  slug: "button",
  name: "Button",
  tagline:
    "The workhorse action element — six semantic variants, three sizes, and a width-preserving loading state. Labels never wrap.",
  controls: [
    {
      type: "select",
      key: "variant",
      label: "Variant",
      default: "accent",
      options: [
        { value: "primary", label: "primary" },
        { value: "secondary", label: "secondary" },
        { value: "outline", label: "outline" },
        { value: "ghost", label: "ghost" },
        { value: "accent", label: "accent" },
        { value: "destructive", label: "destructive" },
      ],
    },
    {
      type: "select",
      key: "size",
      label: "Size",
      default: "md",
      options: [
        { value: "sm", label: "sm" },
        { value: "md", label: "md" },
        { value: "lg", label: "lg" },
      ],
    },
    { type: "toggle", key: "loading", label: "Loading", default: false },
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the "accent" variant
    <div style={{ ["--accent" as string]: hexToRgbTriplet(v.accent as string) }}>
      <Button
        variant={v.variant as "primary"}
        size={v.size as "md"}
        loading={v.loading as boolean}
        disabled={v.disabled as boolean}
      >
        Deploy project
      </Button>
    </div>
  ),
  code: (v) => {
    const flags = `${v.loading ? " loading" : ""}${v.disabled ? " disabled" : ""}`;
    return `<Button variant="${v.variant}" size="${v.size}"${flags}>
  Deploy project
</Button>`;
  },
  importPath: `import { Button } from "@asbirtech/asbir-ui";

// the class builder is exported too, for styling links as buttons
import { buttonVariants } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "variant", type: `"primary" | "secondary" | "outline" | "ghost" | "accent" | "destructive"`, description: "Visual style; all map to semantic tokens and re-theme with the palette." },
    { name: "size", type: `"sm" | "md" | "lg" | "icon"`, description: `Height/padding preset; "icon" is a square button for a lone icon.` },
    { name: "loading", type: "boolean", description: "Shows a spinner and disables the button; width is preserved so rows never jitter." },
    { name: "disabled", type: "boolean", description: "Native disabled — dimmed and inert." },
  ],
};
