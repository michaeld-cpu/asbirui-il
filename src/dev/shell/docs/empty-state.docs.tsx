import { Button, EmptyState } from "@/index";
import type { ComponentEntry } from "./entry";

const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

export const emptyStateEntry: ComponentEntry = {
  slug: "empty-state",
  name: "Empty State",
  tagline:
    "The \"nothing here yet\" panel for lists, tables, and searches — dashed border, dimmed icon tile, optional action. Use it in place of the empty list, not next to it.",
  controls: [
    { type: "toggle", key: "icon", label: "Icon", default: true },
    { type: "toggle", key: "action", label: "Action button", default: true },
  ],
  render: (v) => (
    <EmptyState
      className="w-96 max-w-full"
      icon={v.icon ? InboxIcon : undefined}
      title="No deployments yet"
      description="Push to main and your first deploy shows up here"
      action={
        v.action ? (
          <Button size="sm" variant="secondary">
            Create deployment
          </Button>
        ) : undefined
      }
    />
  ),
  code: (v) => {
    const lines = [
      v.icon ? "  icon={<InboxIcon />}" : "",
      `  title="No deployments yet"`,
      `  description="Push to main and your first deploy shows up here"`,
      v.action ? `  action={<Button size="sm">Create deployment</Button>}` : "",
    ].filter(Boolean);
    return `<EmptyState\n${lines.join("\n")}\n/>`;
  },
  importPath: `import { EmptyState } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "title", type: "ReactNode", description: "The headline (required)." },
    { name: "description", type: "ReactNode", description: "One muted sentence explaining how content gets here." },
    { name: "icon", type: "ReactNode", description: "An icon rendered in the dimmed tile above the title." },
    { name: "action", type: "ReactNode", description: "Usually a <Button> — the way out of the empty state." },
  ],
};
