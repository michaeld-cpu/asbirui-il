import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Skeleton — loading placeholder shapes.

    <Skeleton className="h-4 w-40" />          // a text line
    <Skeleton variant="circle" className="h-9 w-9" />
    <SkeletonText lines={3} />                  // a paragraph

  A gentle opacity pulse (no shimmer sweep — the restraint matches the rest
  of the system). Set width/height with utility classes.
*/

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "block" | "circle";
}

export function Skeleton({ className, variant = "block", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-overlay/[0.08]",
        variant === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of placeholder lines; the last is shortened like real prose. */
  lines?: number;
}

export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}
