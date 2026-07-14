import * as React from "react";
import { cn } from "../../lib/cn";

/*
  RadioGroup — a single-choice set with the house radio dot.

    <RadioGroup value={plan} onValueChange={setPlan}>
      <RadioGroupItem value="free">Free</RadioGroupItem>
      <RadioGroupItem value="pro">Pro</RadioGroupItem>
    </RadioGroup>

  role="radiogroup"/role="radio" with roving arrow-key focus (Up/Down/Left/Right
  wrap, Home/End jump), mirroring Tabs. Only the selected item — or the first
  when nothing is selected — is tabbable, so Tab enters the group once and arrows
  move within it. Each item is a circular dot (accent inner fill when selected)
  plus its label. Controlled via value/onValueChange.
*/

type RadioGroupCtxValue = {
  value: string | undefined;
  setValue: (v: string) => void;
  name: string | undefined;
  disabled: boolean;
};
const RadioGroupCtx = React.createContext<RadioGroupCtxValue | null>(null);

function useRadioGroupCtx(part: string): RadioGroupCtxValue {
  const ctx = React.useContext(RadioGroupCtx);
  if (!ctx) throw new Error(`<${part}> must be used inside <RadioGroup>`);
  return ctx;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shared name for the underlying inputs (form submission). */
  name?: string;
  disabled?: boolean;
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = controlled ? value : internal;
  const ref = React.useRef<HTMLDivElement | null>(null);

  const setValue = (v: string) => {
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const radios = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])') ?? []
    );
    if (radios.length === 0) return;
    const idx = radios.indexOf(document.activeElement as HTMLButtonElement);
    let next = idx;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = idx <= 0 ? radios.length - 1 : idx - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = idx === radios.length - 1 ? 0 : idx + 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = radios.length - 1;
    e.preventDefault();
    radios[next]?.focus();
    radios[next]?.click();
  };

  return (
    <RadioGroupCtx.Provider value={{ value: current, setValue, name, disabled }}>
      <div
        ref={ref}
        role="radiogroup"
        onKeyDown={onKeyDown}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
}

export interface RadioGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
  value: string;
  disabled?: boolean;
}

export function RadioGroupItem({ value, disabled, className, children, onClick, ...props }: RadioGroupItemProps) {
  const ctx = useRadioGroupCtx("RadioGroupItem");
  const selected = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;

  return (
    <label
      className={cn("inline-flex items-center gap-2 text-sm text-fg", isDisabled && "opacity-50", className)}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={isDisabled}
        tabIndex={selected || (ctx.value === undefined) ? 0 : -1}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          ctx.setValue(value);
        }}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
          selected ? "border-accent" : "border-border"
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn("h-2 w-2 rounded-full bg-accent transition-transform", selected ? "scale-100" : "scale-0")}
        />
      </button>
      {children != null && <span className="select-none">{children}</span>}
    </label>
  );
}
