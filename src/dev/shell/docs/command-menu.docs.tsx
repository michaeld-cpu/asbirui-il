import * as React from "react";
import { Button, CommandMenu, useCommandMenuShortcut } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function CommandMenuDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState<string | null>(null);
  useCommandMenuShortcut(setOpen);
  const hints = v.hints as boolean;
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Open command menu
        <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg/45">
          ⌘K
        </kbd>
      </Button>
      {last && <p className="font-mono text-xs text-fg/50">ran: {last}</p>}
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        groups={[
          {
            heading: "Navigate",
            items: [
              { id: "components", label: "Go to Components", hint: hints ? "G C" : undefined, onSelect: () => setLast("Go to Components") },
              { id: "templates", label: "Open Templates", hint: hints ? "G T" : undefined, onSelect: () => setLast("Open Templates") },
              { id: "tokens", label: "View Tokens", onSelect: () => setLast("View Tokens") },
            ],
          },
          {
            heading: "Actions",
            items: [
              { id: "copy", label: "Copy install command", hint: hints ? "⌘ C" : undefined, onSelect: () => setLast("Copy install command") },
              { id: "theme", label: "Toggle theme", onSelect: () => setLast("Toggle theme") },
              { id: "deploy", label: "Deploy to production", disabled: true, onSelect: () => setLast("Deploy") },
            ],
          },
        ]}
      />
    </div>
  );
}

export const commandMenuEntry: ComponentEntry = {
  slug: "command-menu",
  name: "Command Menu",
  tagline:
    "The ⌘K palette — fuzzy-filtered actions in a modal. Subsequence matching (\"gtc\" hits \"Go to Components\"), arrow-key navigation, and a proper listbox for screen readers.",
  controls: [{ type: "toggle", key: "hints", label: "Shortcut hints", default: true }],
  render: (v) => <CommandMenuDemo v={v} />,
  code: (v) => `const [open, setOpen] = useState(false);
useCommandMenuShortcut(setOpen); // binds ⌘K / Ctrl+K

<CommandMenu
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      heading: "Navigate",
      items: [
        { id: "components", label: "Go to Components",${v.hints ? ` hint: "G C",` : ""} onSelect: () => go("#components") },
        { id: "templates", label: "Open Templates", onSelect: () => go("#templates") },
      ],
    },
  ]}
/>`,
  importPath: `import { CommandMenu, useCommandMenuShortcut } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "open / onOpenChange", type: "boolean / (open) => void", description: "Controlled visibility; useCommandMenuShortcut wires ⌘K for you." },
    { name: "groups", type: "CommandGroup[]", description: "{ heading?, items } sections; items are { id, label, keywords?, icon?, hint?, disabled?, onSelect }." },
    { name: "placeholder", type: "string", description: "Search input placeholder." },
    { name: "emptyMessage", type: "string", description: "Shown when the filter matches nothing." },
  ],
};
