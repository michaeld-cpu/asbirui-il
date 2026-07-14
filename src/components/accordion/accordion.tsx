import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Accordion — collapsible sections, single- or multiple-open.

    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a">
        <AccordionTrigger>What's included?</AccordionTrigger>
        <AccordionContent>Everything in the base plan, plus…</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Can I cancel?</AccordionTrigger>
        <AccordionContent>Any time, no questions asked.</AccordionContent>
      </AccordionItem>
    </Accordion>

  Controlled via value/onValueChange, or uncontrolled via defaultValue. Content
  animates open with the grid-rows 0fr→1fr trick (an inner overflow-hidden div),
  so height eases without measuring JS; the chevron rotates 180°. Real button +
  aria-expanded/aria-controls wiring, region role on the panel, ids from a
  module seq counter.
*/

let accordionSeq = 0;

type AccordionCtxValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};
const AccordionCtx = React.createContext<AccordionCtxValue | null>(null);

function useAccordionCtx(part: string): AccordionCtxValue {
  const ctx = React.useContext(AccordionCtx);
  if (!ctx) throw new Error(`<${part}> must be used inside <Accordion>`);
  return ctx;
}

type ItemCtxValue = { value: string; open: boolean; baseId: string };
const ItemCtx = React.createContext<ItemCtxValue | null>(null);

function useItemCtx(part: string): ItemCtxValue {
  const ctx = React.useContext(ItemCtx);
  if (!ctx) throw new Error(`<${part}> must be used inside <AccordionItem>`);
  return ctx;
}

type SingleProps = {
  type: "single";
  /** Allow the open item to close itself. */
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type MultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = (SingleProps | MultipleProps) & {
  children: React.ReactNode;
  className?: string;
};

export function Accordion(props: AccordionProps) {
  const { type, children, className } = props;

  const controlled = props.value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(() => {
    if (type === "single") {
      const dv = (props as SingleProps).defaultValue;
      return dv ? [dv] : [];
    }
    const dv = (props as MultipleProps).defaultValue;
    return dv ?? [];
  });

  const open: string[] = controlled
    ? type === "single"
      ? (props.value as string | undefined)
        ? [props.value as string]
        : []
      : ((props.value as string[]) ?? [])
    : internal;

  const commit = React.useCallback(
    (next: string[]) => {
      if (type === "single") {
        const single = props as SingleProps;
        if (!controlled) setInternal(next);
        single.onValueChange?.(next[0] ?? "");
      } else {
        const multi = props as MultipleProps;
        if (!controlled) setInternal(next);
        multi.onValueChange?.(next);
      }
    },
    // props is read fresh each render; controlled/type are stable enough
    [controlled, type, props]
  );

  const isOpen = React.useCallback((value: string) => open.includes(value), [open]);

  const toggle = React.useCallback(
    (value: string) => {
      if (type === "single") {
        const collapsible = (props as SingleProps).collapsible ?? false;
        if (open.includes(value)) {
          commit(collapsible ? [] : [value]);
        } else {
          commit([value]);
        }
      } else {
        commit(open.includes(value) ? open.filter((v) => v !== value) : [...open, value]);
      }
    },
    [type, props, open, commit]
  );

  return (
    <AccordionCtx.Provider value={{ isOpen, toggle }}>
      <div className={cn("divide-y divide-border rounded-xl border border-border bg-panel", className)}>
        {children}
      </div>
    </AccordionCtx.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { isOpen } = useAccordionCtx("AccordionItem");
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++accordionSeq;
  const open = isOpen(value);
  return (
    <ItemCtx.Provider value={{ value, open, baseId: `asbir-accordion-${seq.current}` }}>
      <div className={cn("px-1", className)} {...props}>
        {children}
      </div>
    </ItemCtx.Provider>
  );
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { toggle } = useAccordionCtx("AccordionTrigger");
  const { value, open, baseId } = useItemCtx("AccordionTrigger");
  return (
    <h3 className="flex">
      <button
        type="button"
        id={`${baseId}-trigger`}
        aria-expanded={open}
        aria-controls={`${baseId}-content`}
        onClick={() => toggle(value)}
        className={cn(
          "flex w-full items-center justify-between gap-4 rounded-asbir px-4 py-3.5 text-left text-sm font-medium text-fg outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        <span className="min-w-0">{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-4 w-4 shrink-0 text-fg/55 transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  );
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { open, baseId } = useItemCtx("AccordionContent");
  return (
    <div
      id={`${baseId}-content`}
      role="region"
      aria-labelledby={`${baseId}-trigger`}
      hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        <div className={cn("px-4 pb-4 pt-0 text-sm leading-relaxed text-fg/70", className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}
