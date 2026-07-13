import { Avatar } from "@/index";
import type { ComponentEntry } from "./entry";

/* self-contained placeholder photo so the demo never needs the network */
const AVATAR_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="15" fill="rgba(255,255,255,0.9)"/><path d="M17 88c5-17 17-25 31-25s26 8 31 25Z" fill="rgba(255,255,255,0.9)"/></svg>`
  );

export const avatarEntry: ComponentEntry = {
  slug: "avatar",
  name: "Avatar",
  tagline:
    "A user picture with graceful fallback — missing or broken images become initials on a deterministic tint (same name, same color), so lists stay scannable without photos.",
  controls: [
    {
      type: "select",
      key: "size",
      label: "Size",
      default: "md",
      options: [
        { value: "xs", label: "xs" },
        { value: "sm", label: "sm" },
        { value: "md", label: "md" },
        { value: "lg", label: "lg" },
      ],
    },
    {
      type: "select",
      key: "status",
      label: "Status",
      default: "online",
      options: [
        { value: "none", label: "(none)" },
        { value: "online", label: "online" },
        { value: "away", label: "away" },
        { value: "offline", label: "offline" },
      ],
    },
    { type: "toggle", key: "image", label: "With photo", default: false },
  ],
  render: (v) => (
    <Avatar
      name="Mikey Django"
      src={v.image ? AVATAR_SRC : undefined}
      size={v.size as "md"}
      status={v.status === "none" ? undefined : (v.status as "online")}
    />
  ),
  code: (v) => {
    const lines = [
      v.image ? `  src={user.photo}` : "",
      `  name="Mikey Django"`,
      `  size="${v.size}"`,
      v.status !== "none" ? `  status="${v.status}"` : "",
    ].filter(Boolean);
    return `<Avatar\n${lines.join("\n")}\n/>`;
  },
  importPath: `import { Avatar } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "src", type: "string", description: "Image URL; on load failure the initials fallback takes over." },
    { name: "name", type: "string", description: "Required — drives alt text, the initials, and the fallback tint." },
    { name: "size", type: `"xs" | "sm" | "md" | "lg"`, description: "Diameter preset." },
    { name: "status", type: `"online" | "away" | "offline"`, description: "Presence dot pinned to the corner." },
  ],
};
