import * as React from "react";
import { cn } from "../../lib/cn";

/*
  CopyButton — copies a string and confirms with a check.

    <CopyButton value="npm i @asbirtech/asbir-ui" />
    <CopyButton value={token} label="Copy token" />

  Ghost icon button by default; swaps to a check for 1.5s after a
  successful copy and announces "Copied" to screen readers. Falls back to
  a hidden-textarea copy when the Clipboard API is unavailable (http).
*/

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onCopy"> {
  /** The text placed on the clipboard. */
  value: string;
  /** Accessible name; defaults to "Copy to clipboard". */
  label?: string;
  onCopy?: (value: string) => void;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, label = "Copy to clipboard", onCopy, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef<number | null>(null);

    React.useEffect(() => {
      return () => {
        if (timer.current) window.clearTimeout(timer.current);
      };
    }, []);

    const handleClick = async () => {
      await copyText(value);
      onCopy?.(value);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={copied ? "Copied" : label}
        onClick={handleClick}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md text-fg/50 outline-none transition-colors hover:bg-overlay/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
          copied && "text-emerald-500 hover:text-emerald-500",
          className
        )}
        {...props}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";
