import { CopyButton } from "@/index";
import type { ComponentEntry } from "./entry";

const VALUES: Record<string, string> = {
  install: "npm install @asbirtech/asbir-ui",
  import: `import { Button } from "@asbirtech/asbir-ui";`,
};

export const copyButtonEntry: ComponentEntry = {
  slug: "copy-button",
  name: "Copy Button",
  tagline:
    "Copies a string and confirms with a check for 1.5 seconds — the little button that lives beside every code snippet and token. Announces \"Copied\" to screen readers.",
  controls: [
    {
      type: "select",
      key: "value",
      label: "Copies",
      default: "install",
      options: [
        { value: "install", label: "Install command" },
        { value: "import", label: "Import line" },
      ],
    },
  ],
  render: (v) => (
    <div className="flex max-w-full items-center gap-2 rounded-lg border border-border bg-panel py-1.5 pl-3.5 pr-1.5">
      <code className="truncate font-mono text-xs text-fg/75">
        {VALUES[v.value as string]}
      </code>
      <CopyButton value={VALUES[v.value as string]} />
    </div>
  ),
  code: (v) => `<CopyButton value={\`${VALUES[v.value as string]}\`} />`,
  importPath: `import { CopyButton } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "The text placed on the clipboard." },
    { name: "label", type: "string", description: `Accessible name (default "Copy to clipboard").` },
    { name: "onCopy", type: "(value: string) => void", description: "Called after a successful copy." },
  ],
};
