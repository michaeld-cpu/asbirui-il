import { Button, Checkbox, Input } from "@/index";
import type { BlockEntry } from "./entry";

const GitHubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.73c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);
const GoogleIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.8Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.72-4.96H1.29v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.99-3.1Z" />
    <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 1.29 6.62l3.99 3.1C6.22 6.87 8.87 4.76 12 4.76Z" />
  </svg>
);

/* ---- 01 · simple card ---------------------------------------------------- */

function SimpleCard() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
      <h2 className="text-lg font-semibold tracking-tight text-fg">Welcome back</h2>
      <p className="mt-1 text-sm text-fg/60">Sign in to your account to continue</p>
      <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg/70">Email</label>
          <Input type="email" placeholder="you@company.com" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-fg/70">Password</label>
            <a href="#" className="text-xs text-accent-soft-fg hover:underline">Forgot?</a>
          </div>
          <Input type="password" placeholder="••••••••" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 pt-0.5 text-xs text-fg/70">
          <Checkbox defaultChecked className="h-3.5 w-3.5" /> Remember me
        </label>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-fg/55">
        Don't have an account? <a href="#" className="text-accent-soft-fg hover:underline">Sign up</a>
      </p>
    </div>
  );
}

/* ---- 02 · social providers ---------------------------------------------- */

function SocialProviders() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
      <h2 className="text-lg font-semibold tracking-tight text-fg">Create your account</h2>
      <p className="mt-1 text-sm text-fg/60">Start your 14-day free trial</p>
      <div className="mt-5 space-y-2">
        <Button variant="outline" className="w-full gap-2 [&_svg]:h-4 [&_svg]:w-4">
          {GitHubIcon} Continue with GitHub
        </Button>
        <Button variant="outline" className="w-full gap-2 [&_svg]:h-4 [&_svg]:w-4">
          {GoogleIcon} Continue with Google
        </Button>
      </div>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-fg/40">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <Input type="email" placeholder="you@company.com" />
        <Button type="submit" variant="secondary" className="w-full">
          Continue with email
        </Button>
      </form>
      <p className="mt-4 text-center text-xs leading-relaxed text-fg/45">
        By continuing you agree to our <a href="#" className="underline">Terms</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  );
}

/* ---- 03 · split panel ----------------------------------------------------- */

function SplitPanel() {
  return (
    <div className="mx-auto grid w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-panel md:grid-cols-2">
      {/* brand side */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-7 md:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 0%, rgb(var(--accent) / 0.25), transparent 55%), radial-gradient(120% 90% at 100% 100%, rgb(var(--accent) / 0.12), transparent 55%)",
          }}
        />
        <p className="relative text-sm font-semibold tracking-tight text-fg">⟐ AsbirTech</p>
        <blockquote className="relative">
          <p className="text-sm leading-relaxed text-fg/75">
            "We shipped our internal dashboard in a week — every screen started as an AsbirUI
            block."
          </p>
          <footer className="mt-3 text-xs text-fg/50">Mikey Django · Design Engineer</footer>
        </blockquote>
      </div>
      {/* form side */}
      <div className="p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight text-fg">Sign in</h2>
        <p className="mt-1 text-sm text-fg/60">Use your work email</p>
        <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Input type="email" placeholder="you@company.com" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-xs text-fg/55">
          New here? <a href="#" className="text-accent-soft-fg hover:underline">Create an account</a>
        </p>
      </div>
    </div>
  );
}

/* ---- registry ------------------------------------------------------------- */

export const loginBlock: BlockEntry = {
  slug: "login",
  name: "Login form",
  tagline: "Sign-in and sign-up cards built from Input, Button, and Checkbox — from a minimal card to a split brand panel.",
  variants: [
    {
      id: "login-01",
      title: "Simple card",
      description: "Email + password with remember-me and a forgot-password link.",
      render: () => <SimpleCard />,
      code: `import { Button, Checkbox, Input } from "@asbirtech/asbir-ui";

<div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
  <h2 className="text-lg font-semibold tracking-tight text-fg">Welcome back</h2>
  <p className="mt-1 text-sm text-fg/60">Sign in to your account to continue</p>
  <form className="mt-5 space-y-3">
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg/70">Email</label>
      <Input type="email" placeholder="you@company.com" />
    </div>
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-fg/70">Password</label>
        <a href="#" className="text-xs text-accent-soft-fg">Forgot?</a>
      </div>
      <Input type="password" placeholder="••••••••" />
    </div>
    <label className="flex items-center gap-2 pt-0.5 text-xs text-fg/70">
      <Checkbox defaultChecked className="h-3.5 w-3.5" /> Remember me
    </label>
    <Button type="submit" className="w-full">Sign in</Button>
  </form>
</div>`,
    },
    {
      id: "login-02",
      title: "Social providers",
      description: "OAuth buttons first, an email fallback below the divider.",
      render: () => <SocialProviders />,
      code: `import { Button, Input } from "@asbirtech/asbir-ui";

<div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-6">
  <h2 className="text-lg font-semibold tracking-tight text-fg">Create your account</h2>
  <p className="mt-1 text-sm text-fg/60">Start your 14-day free trial</p>
  <div className="mt-5 space-y-2">
    <Button variant="outline" className="w-full gap-2">
      <GitHubIcon /> Continue with GitHub
    </Button>
    <Button variant="outline" className="w-full gap-2">
      <GoogleIcon /> Continue with Google
    </Button>
  </div>
  <div className="my-5 flex items-center gap-3">
    <span className="h-px flex-1 bg-border" />
    <span className="text-[11px] font-medium uppercase tracking-wider text-fg/40">or</span>
    <span className="h-px flex-1 bg-border" />
  </div>
  <form className="space-y-3">
    <Input type="email" placeholder="you@company.com" />
    <Button type="submit" variant="secondary" className="w-full">
      Continue with email
    </Button>
  </form>
</div>`,
    },
    {
      id: "login-03",
      title: "Split panel",
      description: "A two-column card: accent-washed brand panel with a quote, form on the right.",
      render: () => <SplitPanel />,
      code: `import { Button, Input } from "@asbirtech/asbir-ui";

<div className="mx-auto grid w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-panel md:grid-cols-2">
  <div className="relative hidden flex-col justify-between overflow-hidden p-7 md:flex">
    <div className="absolute inset-0" style={{
      background: "radial-gradient(120% 90% at 0% 0%, rgb(var(--accent) / 0.25), transparent 55%)" }} />
    <p className="relative text-sm font-semibold tracking-tight text-fg">⟐ AsbirTech</p>
    <blockquote className="relative">
      <p className="text-sm leading-relaxed text-fg/75">
        "We shipped our internal dashboard in a week — every screen started
        as an AsbirUI block."
      </p>
      <footer className="mt-3 text-xs text-fg/50">Mikey Django · Design Engineer</footer>
    </blockquote>
  </div>
  <div className="p-6 sm:p-7">
    <h2 className="text-lg font-semibold tracking-tight text-fg">Sign in</h2>
    <p className="mt-1 text-sm text-fg/60">Use your work email</p>
    <form className="mt-5 space-y-3">
      <Input type="email" placeholder="you@company.com" />
      <Input type="password" placeholder="Password" />
      <Button type="submit" className="w-full">Sign in</Button>
    </form>
  </div>
</div>`,
    },
  ],
};
