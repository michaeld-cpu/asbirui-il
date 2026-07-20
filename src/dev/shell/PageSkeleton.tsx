/*
  PageSkeleton — the Suspense fallback shown while a lazily-loaded docs page
  chunk is fetched. A quiet shimmer: a title + subtitle line, then a grid of
  soft blocks, matching the docs column's rhythm so the swap-in feels seamless.

  Uses `animate-pulse` (Tailwind) on token-driven surfaces so it works in both
  themes. Purely presentational; no props needed for the common case.
*/

import * as React from "react";

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-overlay/[0.08] ${className}`} />;
}

/** An <img> that shows a shimmer placeholder until it loads, then fades in.
    Wrap-and-forward: pass the usual img props; `wrapperClassName` styles the
    positioned container (give it the size/rounding you'd put on the img). */
export function SkeletonImg({
  wrapperClassName = "",
  className = "",
  onLoad,
  onError,
  ...img
}: React.ImgHTMLAttributes<HTMLImageElement> & { wrapperClassName?: string }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <span className={`relative block overflow-hidden ${wrapperClassName}`}>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-overlay/[0.08]" aria-hidden="true" />}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...img}
        className={`h-full w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true); // drop the shimmer even on error so it doesn't pulse forever
          onError?.(e);
        }}
      />
    </span>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse py-10" aria-hidden="true">
      {/* title + subtitle */}
      <Bar className="h-8 w-56" />
      <Bar className="mt-4 h-4 w-full max-w-xl" />
      <Bar className="mt-2 h-4 w-full max-w-md" />

      {/* content blocks — a responsive grid of soft tiles */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <Bar className="h-40 w-full rounded-none" />
            <div className="space-y-2 p-3.5">
              <Bar className="h-3.5 w-2/3" />
              <Bar className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A bare, chrome-less skeleton for full-viewport template previews (loaded
    inside iframes) — a faint centered pulse so the frame isn't blank. */
export function PreviewSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas" aria-hidden="true">
      <div className="w-full max-w-5xl animate-pulse px-6">
        <Bar className="h-8 w-48" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bar key={i} className="h-24 w-full" />
          ))}
        </div>
        <Bar className="mt-6 h-64 w-full" />
      </div>
    </div>
  );
}
