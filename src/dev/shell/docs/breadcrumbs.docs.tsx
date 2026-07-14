import { Breadcrumbs } from "@/index";
import type { ComponentEntry } from "./entry";

export const breadcrumbsEntry: ComponentEntry = {
  slug: "breadcrumbs",
  name: "Breadcrumbs",
  tagline:
    "A navigational path trail. Renders a nav > ol with chevron separators; the last item is the current page (aria-current). A long trail collapses its middle to an ellipsis.",
  controls: [],
  render: () => (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "AsbirUI" },
      ]}
    />
  ),
  code: () => `<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "AsbirUI" },
  ]}
/>`,
  importPath: `import { Breadcrumbs } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "items", type: "{ label: React.ReactNode; href?: string }[]", description: "Data-driven crumbs; the last is treated as the current page." },
    { name: "children", type: "React.ReactNode", description: "Alternative to items — compose <BreadcrumbItem> children directly." },
    { name: "maxItems", type: "number", description: "Collapse the middle once the trail exceeds this many crumbs (default 4)." },
    { name: "itemsAfterCollapse", type: "number", description: "Trailing crumbs kept visible when collapsed (default 1)." },
  ],
};
