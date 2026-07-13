import { Button, ToastProvider, useToast } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

const SAMPLES = {
  neutral: { title: "Build queued", description: "lumina-web is 3rd in line" },
  success: { title: "Deploy complete", description: "lumina-web is live on production" },
  danger: { title: "Deploy failed", description: "Type error in app/page.tsx — see logs" },
} as const;

function ToastDemo({ v }: { v: ControlValues }) {
  const toast = useToast();
  const variant = v.variant as keyof typeof SAMPLES;
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toast({ ...SAMPLES[variant], variant, duration: v.duration as number })
      }
    >
      Show toast
    </Button>
  );
}

export const toastEntry: ComponentEntry = {
  slug: "toast",
  name: "Toast",
  tagline:
    "Transient notifications stacked bottom-right. One provider at the app root; anything below it fires toasts through the useToast hook. Hover pauses the auto-dismiss timer.",
  controls: [
    {
      type: "select",
      key: "variant",
      label: "Variant",
      default: "success",
      options: [
        { value: "neutral", label: "neutral" },
        { value: "success", label: "success" },
        { value: "danger", label: "danger" },
      ],
    },
    { type: "slider", key: "duration", label: "Duration (ms)", min: 2000, max: 8000, step: 500, default: 5000 },
  ],
  render: (v) => (
    <ToastProvider>
      <ToastDemo v={v} />
    </ToastProvider>
  ),
  code: (v) => {
    const s = SAMPLES[v.variant as keyof typeof SAMPLES];
    return `// at the app root
<ToastProvider>…</ToastProvider>

// anywhere below it
const toast = useToast();
toast({
  title: "${s.title}",
  description: "${s.description}",
  variant: "${v.variant}",
  duration: ${v.duration},
});`;
  },
  importPath: `import { ToastProvider, useToast } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "title", type: "ReactNode", description: "The toast's headline (required)." },
    { name: "description", type: "ReactNode", description: "Muted supporting line." },
    { name: "variant", type: `"neutral" | "success" | "danger"`, description: "Colors the leading edge bar." },
    { name: "duration", type: "number", description: "ms before auto-dismiss (default 5000); 0 keeps it until dismissed." },
  ],
};
