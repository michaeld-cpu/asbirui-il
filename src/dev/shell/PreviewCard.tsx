import * as React from "react";

type PreviewCardProps = {
  href?: string;
  project?: string;
  name: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
};

export function PreviewCard({
  href = "#",
  project,
  name,
  meta,
  children,
}: PreviewCardProps) {
  return (
    <div className="group relative -translate-y-0 transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]">
        <a href={href} aria-label={name} className="absolute inset-0 z-0" />

        {/* preview well */}
        <div className="pointer-events-none relative z-[1] flex aspect-[4/3] flex-1 items-center justify-center overflow-hidden bg-canvas p-6 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
          {children}
        </div>

        {/* hover label overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex translate-y-3 items-center gap-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 pt-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
            <h3 className="truncate text-sm font-medium text-white">{name}</h3>
            {project && (
              <p className="shrink-0 truncate text-[10px] uppercase tracking-wide text-white/60">
                {project}
              </p>
            )}
          </div>
          {meta != null && (
            <span className="shrink-0 text-xs text-white/70">{meta}</span>
          )}
        </div>
      </div>
    </div>
  );
}
