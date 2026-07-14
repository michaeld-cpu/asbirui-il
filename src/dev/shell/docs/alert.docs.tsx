import * as React from "react";
import { Alert, Button } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function AlertDemo({ v }: { v: ControlValues }) {
  const [hidden, setHidden] = React.useState(false);

  if (hidden) {
    return (
      <div className="flex items-center gap-3 text-sm text-fg/50">
        <span>Alert dismissed.</span>
        <Button variant="outline" size="sm" onClick={() => setHidden(false)}>
          Show again
        </Button>
      </div>
    );
  }

  return (
    <Alert
      variant={v.variant as "info"}
      title="Deploy queued"
      description="Your changes are building — this usually takes about a minute."
      onDismiss={v.dismissible ? () => setHidden(true) : undefined}
    />
  );
}

export const alertEntry: ComponentEntry = {
  slug: "alert",
  name: "Alert",
  tagline:
    "An inline banner for status, warnings, and errors. Each variant is a low-alpha tinted surface with a matching icon; role switches to alert for danger/warning.",
  controls: [
    {
      type: "select",
      key: "variant",
      label: "Variant",
      default: "info",
      options: [
        { value: "neutral", label: "neutral" },
        { value: "info", label: "info" },
        { value: "success", label: "success" },
        { value: "warning", label: "warning" },
        { value: "danger", label: "danger" },
      ],
    },
    { type: "toggle", key: "dismissible", label: "Dismissible", default: false },
  ],
  render: (v) => (
    <div className="w-80 max-w-full">
      <AlertDemo v={v} />
    </div>
  ),
  code: (v) =>
    `<Alert
  variant="${v.variant}"
  title="Deploy queued"
  description="Your changes are building — this usually takes about a minute."${
    v.dismissible ? "\n  onDismiss={() => setHidden(true)}" : ""
  }
/>`,
  importPath: `import { Alert } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "variant", type: `"neutral" | "info" | "success" | "warning" | "danger"`, description: "Tinted surface + icon; danger/warning also switch role to alert." },
    { name: "title", type: "React.ReactNode", description: "Bold heading line." },
    { name: "description", type: "React.ReactNode", description: "Supporting body text." },
    { name: "icon", type: "React.ReactNode", description: "Override the default icon, or pass null to drop it." },
    { name: "onDismiss", type: "() => void", description: "Adds a × button that calls this." },
    { name: "action", type: "React.ReactNode", description: "Trailing action slot (e.g. a Button)." },
  ],
};
