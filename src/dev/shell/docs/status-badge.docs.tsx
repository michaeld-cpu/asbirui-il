import { StatusBadge } from "@/index";
import type { ComponentEntry } from "./entry";

const LABELS: Record<string, string> = {
  online: "Online",
  running: "Running",
  idle: "Idle",
  paused: "Paused",
  offline: "Offline",
  failed: "Failed",
};

export const statusBadgeEntry: ComponentEntry = {
  slug: "status-badge",
  name: "Status Badge",
  tagline:
    "A dot + label live-status indicator. The dot is colored by status; live states (online/running) get a soft pulsing halo. The pill body stays neutral so the color reads as the signal.",
  controls: [
    {
      type: "select",
      key: "status",
      label: "Status",
      default: "running",
      options: [
        { value: "online", label: "online" },
        { value: "running", label: "running" },
        { value: "idle", label: "idle" },
        { value: "paused", label: "paused" },
        { value: "offline", label: "offline" },
        { value: "failed", label: "failed" },
      ],
    },
  ],
  render: (v) => (
    <StatusBadge status={v.status as "running"}>{LABELS[v.status as string]}</StatusBadge>
  ),
  code: (v) => `<StatusBadge status="${v.status}">${LABELS[v.status as string]}</StatusBadge>`,
  importPath: `import { StatusBadge } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "status", type: `"online" | "running" | "idle" | "paused" | "offline" | "failed" | …`, description: "Drives the dot color and whether it pulses (live states)." },
    { name: "children", type: "React.ReactNode", description: "Label; falls back to a title-cased status when omitted." },
  ],
};
