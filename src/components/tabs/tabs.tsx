import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Tabs — accessible tab set with the house underline indicator.

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">…</TabsContent>
      <TabsContent value="code">…</TabsContent>
    </Tabs>

  Real role="tablist"/tab/tabpanel wiring with roving arrow-key focus
  (Left/Right/Home/End). Two looks: "underline" (default) and "pills"
  (segmented, like the docs Preview/Code switch).
*/

type TabsCtxValue = {
  value: string;
  setValue: (v: string) => void;
  variant: "underline" | "pills";
  baseId: string;
};
const TabsCtx = React.createContext<TabsCtxValue | null>(null);

function useTabsCtx(part: string): TabsCtxValue {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error(`<${part}> must be used inside <Tabs>`);
  return ctx;
}

let tabsSeq = 0;

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  variant?: "underline" | "pills";
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, variant = "underline", children, className }: TabsProps) {
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++tabsSeq;
  return (
    <TabsCtx.Provider
      value={{ value, setValue: onValueChange, variant, baseId: `asbir-tabs-${seq.current}` }}
    >
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabsCtx("TabsList");
  const ref = React.useRef<HTMLDivElement | null>(null);

  // roving focus with arrow keys
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const tabs = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []
    );
    if (tabs.length === 0) return;
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    let next = current;
    if (e.key === "ArrowLeft") next = current <= 0 ? tabs.length - 1 : current - 1;
    if (e.key === "ArrowRight") next = current === tabs.length - 1 ? 0 : current + 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    e.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        variant === "pills"
          ? "inline-flex items-center gap-1 rounded-lg border border-border bg-panel p-1"
          : "flex items-center gap-4 border-b border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = useTabsCtx("TabsTrigger");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "whitespace-nowrap text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        ctx.variant === "pills"
          ? cn(
              "rounded-md px-3 py-1.5 text-xs",
              active ? "bg-overlay/[0.08] text-fg" : "text-fg/55 hover:text-fg"
            )
          : cn(
              // underline indicator: a 2px bottom border that keeps layout
              // stable by always existing (transparent when inactive)
              "-mb-px border-b-2 px-1 pb-2.5 pt-1",
              active
                ? "border-accent text-fg"
                : "border-transparent text-fg/55 hover:border-border hover:text-fg"
            ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = useTabsCtx("TabsContent");
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn("mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    >
      {children}
    </div>
  );
}
