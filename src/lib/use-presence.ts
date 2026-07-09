import * as React from "react";

/*
  usePresence — keep an element mounted through its exit animation.

  Popover-style components (dropdown, select, tooltip, …) usually do
  `if (!open) return null`, which unmounts instantly and kills any exit
  animation. usePresence bridges that gap: when `open` flips to false it keeps
  the node mounted (status "exiting") and applies your exit class, then
  unmounts once the CSS animation ends.

    const { mounted, status } = usePresence(open);
    if (!mounted) return null;
    return <div data-state={status} className={status === "exiting" ? "animate-menu-out" : "animate-menu-in"} />;

  `status` is "entering" | "exiting". It's also written to `data-state`
  ("open" / "closed") on the ref target when you spread `presenceProps`, so you
  can drive styles purely from CSS if you prefer.

  Reduced motion: when the user prefers reduced motion (or the element has no
  running animation), exit resolves on the next frame instead of waiting.
*/

export type PresenceStatus = "entering" | "exiting";

export interface UsePresenceResult {
  /** Whether the element should be in the tree at all. */
  mounted: boolean;
  /** Current transition phase. */
  status: PresenceStatus;
  /** Ref to attach to the animated element (drives animationend detection). */
  ref: React.RefObject<HTMLElement>;
  /** Convenience props: `ref` + `data-state` ("open" | "closed"). */
  presenceProps: {
    ref: React.RefObject<HTMLElement>;
    "data-state": "open" | "closed";
  };
}

export function usePresence(open: boolean): UsePresenceResult {
  const [mounted, setMounted] = React.useState(open);
  const [status, setStatus] = React.useState<PresenceStatus>(
    open ? "entering" : "exiting"
  );
  const ref = React.useRef<HTMLElement>(null);

  // Phase 1 — react to `open`. Opening mounts + marks entering. Closing only
  // flips the status to "exiting"; it does NOT touch the DOM or listeners here,
  // so it can't catch the trailing animationend of the entrance animation (that
  // race was what unmounted the menu instantly with no exit animation).
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setStatus("entering");
    } else if (mounted) {
      setStatus("exiting");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Phase 2 — runs only once the "exiting" status (and thus the exit class /
  // data-state="closed") has been committed to the DOM. We force a reflow so
  // the exit animation is guaranteed to start fresh, then unmount when it ends.
  React.useEffect(() => {
    if (status !== "exiting" || !mounted) return;
    const node = ref.current;
    if (!node) {
      setMounted(false);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Force a reflow so a just-swapped animation-name actually restarts.
    void node.offsetHeight;

    const hasAnimation =
      !prefersReduced &&
      typeof getComputedStyle !== "undefined" &&
      getComputedStyle(node).animationName !== "none";

    if (!hasAnimation) {
      const raf = requestAnimationFrame(() => setMounted(false));
      return () => cancelAnimationFrame(raf);
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setMounted(false);
    };
    node.addEventListener("animationend", finish);
    node.addEventListener("animationcancel", finish);
    // Safety net: if animationend never fires, unmount after a generous timeout.
    const fallback = setTimeout(finish, 400);
    return () => {
      node.removeEventListener("animationend", finish);
      node.removeEventListener("animationcancel", finish);
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, mounted]);

  return {
    mounted,
    status,
    ref,
    presenceProps: {
      ref,
      "data-state": status === "exiting" ? "closed" : "open",
    },
  };
}
