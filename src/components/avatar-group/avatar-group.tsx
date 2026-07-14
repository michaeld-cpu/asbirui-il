import * as React from "react";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarProps } from "../avatar";

/*
  AvatarGroup — overlapping avatars with a +N overflow chip.

    <AvatarGroup max={4} avatars={team} />

    <AvatarGroup max={3} size="sm">
      <Avatar name="Mike Sander" />
      <Avatar name="Lumina Agent" />
      …
    </AvatarGroup>

  Pass either an `avatars` array or Avatar children. The first `max` show as a
  stack (negative margin + ring-2 ring-panel so they read as layered); the rest
  collapse into a "+K" chip styled to match.
*/

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many avatars to show before collapsing into the +K chip. */
  max?: number;
  /** Passed through to each Avatar (and used to size the +K chip). */
  size?: AvatarProps["size"];
  /** Data-driven alternative to passing Avatar children. */
  avatars?: Array<{ src?: string; name: string }>;
}

const chipSizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function AvatarGroup({
  max = 4,
  size = "md",
  avatars,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items: React.ReactNode[] = avatars
    ? avatars.map((a, i) => <Avatar key={i} src={a.src} name={a.name} size={size} />)
    : React.Children.toArray(children);

  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div className={cn("flex items-center", className)} role="group" {...props}>
      {visible.map((child, i) => (
        <span key={i} className={cn("relative rounded-full ring-2 ring-panel", i > 0 && "-ml-2.5")}>
          {React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, { size })
            : child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "relative -ml-2.5 inline-flex select-none items-center justify-center rounded-full bg-overlay/[0.08] font-semibold text-fg/70 ring-2 ring-panel",
            chipSizes[size]
          )}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
