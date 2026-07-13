import * as React from "react";
import {
  Button,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function DialogDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Delete workspace
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        closeOnBackdrop={v.closeOnBackdrop as boolean}
        closeOnEscape={v.closeOnEscape as boolean}
      >
        <DialogTitle>Delete workspace</DialogTitle>
        <DialogDescription>
          This permanently removes the workspace and all of its render history. This can't be
          undone
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export const dialogEntry: ComponentEntry = {
  slug: "dialog",
  name: "Dialog",
  tagline:
    "A modal over a dimmed backdrop — portalled to <body>, scroll-locked, Tab-trapped, and focus-restoring. Title and description wire up the aria attributes automatically.",
  controls: [
    { type: "toggle", key: "closeOnBackdrop", label: "Close on backdrop", default: true },
    { type: "toggle", key: "closeOnEscape", label: "Close on Escape", default: true },
  ],
  render: (v) => <DialogDemo v={v} />,
  code: (v) => {
    const flags = [
      !v.closeOnBackdrop ? "  closeOnBackdrop={false}\n" : "",
      !v.closeOnEscape ? "  closeOnEscape={false}\n" : "",
    ].join("");
    return `<Dialog open={open} onOpenChange={setOpen}
${flags}>
  <DialogTitle>Delete workspace</DialogTitle>
  <DialogDescription>This can't be undone</DialogDescription>
  <DialogFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive">Delete</Button>
  </DialogFooter>
</Dialog>`;
  },
  importPath: `import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "open", type: "boolean", description: "Controlled visibility." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog asks to close (Escape, backdrop)." },
    { name: "closeOnBackdrop", type: "boolean", description: "Backdrop click closes (default true)." },
    { name: "closeOnEscape", type: "boolean", description: "Escape closes (default true)." },
    { name: "className", type: "string", description: `Panel overrides — e.g. "max-w-lg" for a wider dialog.` },
  ],
};
