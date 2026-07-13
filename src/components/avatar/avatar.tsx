import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Avatar — a user/agent picture with graceful fallback.

    <Avatar src={user.photo} name="Mike Sander" />
    <Avatar name="Lumina Agent" size="lg" status="online" />

  If `src` is missing or fails to load, the fallback shows the initials
  derived from `name` on a deterministic tinted background (same name →
  same tint), so lists stay scannable without photos. `status` renders a
  presence dot pinned to the corner.
*/

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Used for alt text, initials, and the fallback tint. */
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "away" | "offline";
}

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

const statusColor: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-fg/30",
};

/* deterministic tint from the name — 6 accent-adjacent hues */
const TINTS = [
  "bg-violet-500/20 text-violet-700 dark:text-violet-300",
  "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  "bg-rose-500/20 text-rose-700 dark:text-rose-300",
  "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function tintFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return TINTS[Math.abs(h) % TINTS.length];
}

export function Avatar({ src, name, size = "md", status, className, ...props }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = src && !errored;
  return (
    <span
      className={cn("relative inline-flex shrink-0 select-none align-middle", sizes[size], className)}
      {...props}
    >
      {/* overflow-hidden wrapper: clips to the circle AND pins the root's
          baseline to its border box, so swapping photo ⇄ initials (different
          intrinsic baselines) can't shift the avatar in the line box */}
      <span className="block h-full w-full overflow-hidden rounded-full">
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            role="img"
            aria-label={name}
            className={cn(
              "flex h-full w-full items-center justify-center font-semibold",
              tintFor(name)
            )}
          >
            {initials(name)}
          </span>
        )}
      </span>
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 right-0 h-1/4 min-h-2 w-1/4 min-w-2 rounded-full ring-2 ring-panel",
            statusColor[status]
          )}
        />
      )}
    </span>
  );
}
