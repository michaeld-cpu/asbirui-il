import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function TabsDemo({ v }: { v: ControlValues }) {
  const [tab, setTab] = React.useState("overview");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      variant={v.variant as "underline"}
      className="w-72 max-w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-fg/60">
        Deploys, domains, and recent activity live here
      </TabsContent>
      <TabsContent value="usage" className="text-sm text-fg/60">
        1,284 of 2,000 renders used this cycle
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-fg/60">
        Workspace name, members, and danger zone
      </TabsContent>
    </Tabs>
  );
}

export const tabsEntry: ComponentEntry = {
  slug: "tabs",
  name: "Tabs",
  tagline:
    "Accessible tab set with real tablist/tab/tabpanel wiring and roving arrow-key focus. Two looks: the house underline indicator, or a segmented pills bar.",
  controls: [
    {
      type: "select",
      key: "variant",
      label: "Variant",
      default: "underline",
      options: [
        { value: "underline", label: "underline" },
        { value: "pills", label: "pills" },
      ],
    },
  ],
  render: (v) => <TabsDemo v={v} />,
  code: (v) => `<Tabs value={tab} onValueChange={setTab} variant="${v.variant}">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="usage">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>`,
  importPath: `import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "The active tab's value (controlled)." },
    { name: "onValueChange", type: "(v: string) => void", description: "Called when a tab is chosen — by click or arrow keys." },
    { name: "variant", type: `"underline" | "pills"`, description: "Underline indicator (default) or a segmented pills bar." },
    { name: "value (trigger/content)", type: "string", description: "Pairs a TabsTrigger with its TabsContent panel." },
  ],
};
