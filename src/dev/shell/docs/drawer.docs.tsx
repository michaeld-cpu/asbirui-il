import * as React from "react";
import {
  Button,
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function DrawerDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Drawer open={open} onOpenChange={setOpen} side={v.side as "right"}>
        <DrawerTitle>Settings</DrawerTitle>
        <DrawerDescription>
          Tune your workspace. Changes save when you click Save.
        </DrawerDescription>
        <p className="mt-4 text-sm text-fg/70">
          Autosave is on and notifications arrive every 15 minutes.
        </p>
        <DrawerFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Save
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}

export const drawerEntry: ComponentEntry = {
  slug: "drawer",
  name: "Drawer",
  tagline:
    "An edge-anchored panel over a dimmed backdrop. Portals to <body>, locks scroll, traps Tab focus, and slides in from the chosen side.",
  controls: [
    {
      type: "select",
      key: "side",
      label: "Side",
      default: "right",
      options: [
        { value: "left", label: "left" },
        { value: "right", label: "right" },
        { value: "top", label: "top" },
        { value: "bottom", label: "bottom" },
      ],
    },
  ],
  render: (v) => <DrawerDemo v={v} />,
  code: (v) => `<Drawer open={open} onOpenChange={setOpen} side="${v.side}">
  <DrawerTitle>Settings</DrawerTitle>
  <DrawerDescription>Tune your workspace.</DrawerDescription>
  <DrawerFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)}>Save</Button>
  </DrawerFooter>
</Drawer>`,
  importPath: `import {
  Drawer,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "open", type: "boolean", description: "Controlled visibility." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the drawer asks to close (Escape, backdrop)." },
    { name: "side", type: `"left" | "right" | "top" | "bottom"`, description: "Edge the panel is anchored to (default right)." },
    { name: "closeOnBackdrop", type: "boolean", description: "Backdrop click closes (default true)." },
    { name: "closeOnEscape", type: "boolean", description: "Escape closes (default true)." },
  ],
};
