import * as React from "react";
import { useTheme } from "./theme-context";

/*
  Catalyst-style paired device preview for the homepage Templates section.

  Two live renders of the SAME template, each in its own <iframe> so it gets a
  real viewport width and the template's responsive breakpoints fire naturally:

    • Desktop frame — the AI console at a wide design width, scaled to fill the
      aspect-ratio stage. Shows the full sidebar rail + table layout.
    • Phone frame   — the same console at 390px, floating bottom-right in a
      device bezel. At that width the template renders its true mobile layout
      (hamburger drawer + stacked cards), not a shrunk desktop.

  Both iframes load "#preview/ai" (see main.tsx PreviewView) — a chrome-free
  render of the template. Non-interactive; the wrapping <a> owns navigation.
*/

const DESKTOP_W = 1280; // logical width the desktop frame renders at
const DESKTOP_H = 800;
const PHONE_W = 390; // iPhone-ish logical width — narrow enough to hit the mobile layout
const PHONE_H = 844;

// message channel used to push theme changes into the preview iframes
export const PREVIEW_THEME_MSG = "asbir-preview-theme";

/** The template render loaded into every frame. The initial theme is threaded
    into the URL for a correct first paint (no flash on mount); after that the
    src is STABLE so a theme toggle never reloads the iframe — instead we
    postMessage the new theme in and the frame crossfades in place. */
function previewSrc(initialTheme: string) {
  return `${window.location.pathname}?frame=1&t=${initialTheme}#preview/ai`;
}

/** Resolve the theme the frame should FIRST paint with, synchronously — matches
    the no-flash script (stored → system → dark). Using this to freeze the src
    (rather than the provider's default "dark") avoids a dark→stored flip on
    load when the stored theme is light. */
function initialFrameTheme(): string {
  try {
    const stored = localStorage.getItem("asbir-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

export function TemplatePreview() {
  const { theme } = useTheme();
  // Freeze the src at the resolved initial theme, so later toggles don't change
  // the URL and remount the iframe (which caused the black flash).
  const srcRef = React.useRef<string | null>(null);
  if (srcRef.current === null) srcRef.current = previewSrc(initialFrameTheme());
  const src = srcRef.current;

  const frameRefs = React.useRef<Set<HTMLIFrameElement>>(new Set());
  const registerFrame = React.useCallback((el: HTMLIFrameElement | null) => {
    // Track live iframes so we can broadcast theme changes to each.
    const set = frameRefs.current;
    if (el) set.add(el);
  }, []);

  // Broadcast theme changes to every mounted frame; each applies it with its
  // own view-transition crossfade, so the frames fade in lockstep with the page
  // instead of reloading to black.
  React.useEffect(() => {
    frameRefs.current.forEach((el) => {
      el.contentWindow?.postMessage({ type: PREVIEW_THEME_MSG, theme }, "*");
    });
  }, [theme]);

  return (
    <div className="absolute inset-0 select-none">
      {/* Desktop render — fills the whole stage. */}
      <ScaledFrame
        src={src}
        width={DESKTOP_W}
        height={DESKTOP_H}
        title="Desktop dashboard preview"
        className="absolute inset-0"
        iframeRef={registerFrame}
      />

      {/* Floating phone — bezel + screen, anchored bottom-right over the
          desktop frame, Catalyst-style. */}
      <PhoneFrame src={src} iframeRef={registerFrame} />
    </div>
  );
}

function PhoneFrame({
  src,
  iframeRef,
}: {
  src: string;
  iframeRef: (el: HTMLIFrameElement | null) => void;
}) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-[4%] w-[26%] min-w-[130px] max-w-[340px] translate-y-[8%]"
      aria-hidden="true"
    >
      {/* feather band — same slanted-hatch echo as the desktop frame, offset
          around the phone so it reads as its own framed element. Kept tight
          (p-[3.5%]) so the band hugs the phone rather than ballooning around it;
          no bottom padding so the phone runs off the bottom edge (no chin).
          Separation from the desktop comes from this band + the bezel border,
          not a drop shadow. */}
      <div className="relative px-[3.5%] pt-[3.5%]">
        <div
          className="pointer-events-none absolute inset-0 rounded-t-[1.7rem] border border-b-0"
          style={{
            borderColor: "rgb(var(--accent) / 0.12)",
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgb(var(--accent) / 0.12) 0px, rgb(var(--accent) / 0.12) 1px, transparent 1px, transparent 7px)",
          }}
        />

        {/* bezel — token-driven so it's a dark device in dark mode and a soft
            light one in light mode (never a flat pure-black slab). Bottom bezel
            removed: no bottom padding/border/radius, so the device continues
            off the card's bottom edge instead of showing a chin. */}
        <div
          className="relative overflow-hidden rounded-t-[1.5rem] border-2 border-b-0 border-border bg-panel px-[3.5%] pt-[3.5%] ring-1 ring-overlay/[0.06]"
          style={{ aspectRatio: `${PHONE_W} / ${PHONE_H}` }}
        >
          {/* screen — the same template at phone width, so it renders its mobile
              layout (hamburger + stacked cards). */}
          <div className="relative h-full w-full overflow-hidden rounded-t-[1rem] border border-b-0 border-border bg-canvas">
            <ScaledFrame
              src={src}
              width={PHONE_W}
              height={PHONE_H}
              title="Mobile dashboard preview"
              className="absolute inset-0"
              iframeRef={iframeRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Renders a fixed logical-WIDTH iframe scaled to fill its parent box, so the
    template inside always sees `width` CSS pixels (triggering the correct
    responsive breakpoints) regardless of the on-screen frame size.

    The iframe's logical HEIGHT is derived from the live box aspect ratio
    (boxH / scale), not a fixed `height` — so the template's content always
    fills the box top-to-bottom with NO dead space, whatever the stage's
    aspect ratio ends up being at a given viewport width. `height` is only the
    initial/min logical height used before the box is measured. The parent
    supplies its own position/size via `className`. */
function ScaledFrame({
  src,
  width,
  height,
  title,
  className,
  iframeRef,
}: {
  src: string;
  width: number;
  height: number;
  title: string;
  className?: string;
  iframeRef?: (el: HTMLIFrameElement | null) => void;
}) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = React.useState(false);
  const [dims, setDims] = React.useState({
    scale: width < 500 ? 0.5 : 0.3,
    logicalH: height,
  });

  React.useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      // Scale by width so the template renders at exactly `width` logical px.
      const scale = box.clientWidth / width;
      // Logical height that, once scaled, exactly covers the box — so content
      // fills the full box height and never leaves a black band at the bottom.
      const logicalH = scale > 0 ? box.clientHeight / scale : height;
      setDims({ scale, logicalH });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={boxRef} className={`relative overflow-hidden ${className ?? ""}`}>
      {/* shimmer skeleton until the iframe loads */}
      {!ready && <div className="absolute inset-0 animate-pulse bg-overlay/[0.08]" aria-hidden="true" />}
      <iframe
        ref={iframeRef}
        title={title}
        src={src}
        tabIndex={-1}
        aria-hidden="true"
        loading="lazy"
        scrolling="no"
        onLoad={() => setReady(true)}
        className={`pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-canvas transition-opacity duration-500 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width,
          height: dims.logicalH,
          transform: `scale(${dims.scale})`,
        }}
      />
    </div>
  );
}
