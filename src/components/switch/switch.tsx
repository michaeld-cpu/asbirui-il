import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Switch — an on/off toggle for a single boolean setting.

    <Switch checked={enabled} onCheckedChange={setEnabled} />
    <label className="flex items-center gap-2">
      <Switch defaultChecked size="sm" /> Notifications
    </label>

  A real role="switch" button with aria-checked, so keyboard (Space/Enter) and
  screen readers behave. The track fills with the accent when on; the thumb
  slides across. Controlled (checked/onCheckedChange) or uncontrolled
  (defaultChecked). forwardRef points at the button.
*/

const track = cva(
  "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        md: "h-5 w-9",
      },
      on: {
        true: "bg-accent",
        false: "bg-overlay/[0.15]",
      },
    },
    defaultVariants: { size: "md", on: false },
  }
);

const thumb = cva("pointer-events-none rounded-full bg-white shadow-sm transition-transform", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
    },
    on: { true: "", false: "translate-x-0" },
  },
  compoundVariants: [
    { size: "sm", on: true, class: "translate-x-3" },
    { size: "md", on: true, class: "translate-x-4" },
  ],
  defaultVariants: { size: "md", on: false },
});

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "type">,
    Pick<VariantProps<typeof track>, "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fired with the next checked value on toggle. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, onClick, size = "md", disabled, className, ...props }, ref) => {
    const controlled = checked !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isOn = controlled ? checked : internal;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (!controlled) setInternal(!isOn);
          onCheckedChange?.(!isOn);
        }}
        className={cn(track({ size, on: isOn }), className)}
        {...props}
      >
        <span aria-hidden="true" className={thumb({ size, on: isOn })} />
      </button>
    );
  }
);
Switch.displayName = "Switch";
