import * as React from "react";
import { cn } from "../lib/cn";

/*
  Marquee — an infinite horizontal loop for logo strips and tickers.

    <Marquee duration={28}>
      {logos.map((l) => <Logo key={l.id} {...l} />)}
    </Marquee>

  The children are rendered twice and the track translates -50%, so the loop
  is seamless at any content width. Under prefers-reduced-motion the strip
  renders static (the keyframe lives behind the media gate in motion.css).
*/

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds per full loop. Default 24. */
  duration?: number;
  /** Gap in px between items (and between the two copies). Default 40. */
  gap?: number;
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean;
  /** Pause while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Fade the strip's edges. Default true. */
  fadeEdges?: boolean;
}

export function Marquee({
  duration = 24,
  gap = 40,
  reverse = false,
  pauseOnHover = true,
  fadeEdges = true,
  className,
  style,
  children,
  ...rest
}: MarqueeProps) {
  const mask = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
  return (
    <div
      className={cn(
        "overflow-hidden",
        pauseOnHover && "as-marquee-hover-pause",
        reverse && "as-marquee-reverse",
        className
      )}
      style={{
        ...(fadeEdges ? { maskImage: mask, WebkitMaskImage: mask } : {}),
        ...style,
      }}
      {...rest}
    >
      <div
        className="as-marquee-track"
        style={{ ["--as-marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
