import * as React from "react";
import { Button, Field, inputCls } from "./admin-states";

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-fg-invert">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10h14V10" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-fg">Acme Admin</span>
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    location.hash = "#admin";
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-sm w-full rounded-xl border border-border bg-panel p-6">
        <BrandMark />
        <h1 className="mt-5 text-lg font-semibold text-fg">Sign in</h1>
        <p className="mt-1 text-sm text-fg/55">Welcome back. Enter your details to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              className={inputCls}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              autoComplete="current-password"
              className={inputCls}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-fg/55 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border bg-canvas accent-fg"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#admin/login" className="text-sm text-fg hover:underline">
              Forgot?
            </a>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-fg/55">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="secondary" className="w-full">
          Continue with SSO
        </Button>

        <p className="mt-6 text-center text-sm text-fg/55">
          No account?{" "}
          <a href="#admin/signup" className="text-fg hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
