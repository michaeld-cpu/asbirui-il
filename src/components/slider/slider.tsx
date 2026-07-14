import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Slider — a single-value range control.

    <Slider value={vol} onValueChange={setVol} />
    <Slider value={p} onValueChange={setP} min={0} max={100} step={5} showValue />

  A real <input type="range"> restyled: a background gradient paints the filled
  portion (accent) up to the thumb and leaves the rest as the track wash, so it
  stays keyboard- and screen-reader-accessible for free. `showValue` renders the
  current value alongside the track.
*/

export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step"
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Show the current value next to the track. */
  showValue?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, defaultValue, onValueChange, min = 0, max = 100, step = 1, disabled, showValue = false, className, ...props }, ref) => {
    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue ?? min);
    const current = controlled ? (value as number) : internal;

    const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;
    const fill = `linear-gradient(to right, rgb(var(--accent)) 0% ${pct}%, rgb(var(--overlay) / 0.15) ${pct}% 100%)`;

    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!controlled) setInternal(next);
            onValueChange?.(next);
          }}
          style={{ background: fill }}
          className={cn(
            "h-1.5 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-transparent outline-none transition-[background] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform",
            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm",
            "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
            className
          )}
          {...props}
        />
        {showValue && (
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-fg/70">{current}</span>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";
