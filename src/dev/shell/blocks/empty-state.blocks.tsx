import { Button, EmptyState } from "@/index";
import type { BlockEntry } from "./entry";

const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" />
  </svg>
);
const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ---- 01 · call to action --------------------------------------------------- */

function CallToAction() {
  return (
    <EmptyState
      className="mx-auto w-full max-w-md"
      icon={InboxIcon}
      title="No projects yet"
      description="Create your first project to start routing requests and tracking usage"
      action={<Button size="sm">New project</Button>}
    />
  );
}

/* ---- 02 · onboarding steps --------------------------------------------------- */

const STEPS = [
  { title: "Create a project", detail: "Name it and pick a region", done: true },
  { title: "Add an API key", detail: "Scope it to the environments you need", done: false },
  { title: "Send your first request", detail: "Use the quickstart snippet", done: false },
];

function OnboardingSteps() {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-border px-6 py-8">
      <h2 className="text-sm font-semibold text-fg">Finish setting up</h2>
      <p className="mt-1 text-xs leading-relaxed text-fg/55">
        Your workspace is empty until the first request lands
      </p>
      <ol className="mt-5 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                s.done
                  ? "bg-accent text-accent-fg"
                  : "border border-border text-fg/50"
              }`}
            >
              {s.done ? CheckIcon : i + 1}
            </span>
            <span>
              <span className={`block text-sm font-medium ${s.done ? "text-fg/45 line-through" : "text-fg"}`}>
                {s.title}
              </span>
              <span className="block text-xs text-fg/50">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <Button size="sm" variant="secondary" className="mt-5">
        Continue setup
      </Button>
    </div>
  );
}

/* ---- registry ------------------------------------------------------------------ */

export const emptyStateBlock: BlockEntry = {
  slug: "empty-state",
  name: "Empty state",
  tagline: "The nothing-here-yet moment — a single call to action, or an onboarding checklist that walks users in.",
  variants: [
    {
      id: "empty-state-01",
      title: "Call to action",
      description: "The library EmptyState component: icon tile, title, description, primary action.",
      render: () => <CallToAction />,
      code: `import { Button, EmptyState } from "@asbirtech/asbir-ui";

<EmptyState
  icon={<InboxIcon />}
  title="No projects yet"
  description="Create your first project to start routing requests and tracking usage"
  action={<Button size="sm">New project</Button>}
/>`,
    },
    {
      id: "empty-state-02",
      title: "Onboarding steps",
      description: "A numbered checklist with completed steps struck through — for empty states users can work their way out of.",
      render: () => <OnboardingSteps />,
      code: `import { Button } from "@asbirtech/asbir-ui";

const steps = [
  { title: "Create a project", detail: "Name it and pick a region", done: true },
  { title: "Add an API key", detail: "Scope it to the environments you need", done: false },
  { title: "Send your first request", detail: "Use the quickstart snippet", done: false },
];

<div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-border px-6 py-8">
  <h2 className="text-sm font-semibold text-fg">Finish setting up</h2>
  <p className="mt-1 text-xs text-fg/55">Your workspace is empty until the first request lands</p>
  <ol className="mt-5 space-y-3">
    {steps.map((s, i) => (
      <li key={s.title} className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
          s.done ? "bg-accent text-accent-fg" : "border border-border text-fg/50")}>
          {s.done ? <CheckIcon /> : i + 1}
        </span>
        <span>
          <span className={cn("block text-sm font-medium", s.done ? "text-fg/45 line-through" : "text-fg")}>
            {s.title}
          </span>
          <span className="block text-xs text-fg/50">{s.detail}</span>
        </span>
      </li>
    ))}
  </ol>
  <Button size="sm" variant="secondary" className="mt-5">Continue setup</Button>
</div>`,
    },
  ],
};
