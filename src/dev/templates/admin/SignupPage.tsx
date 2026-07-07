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

export function SignupPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string }>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    location.hash = "#admin";
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-sm w-full rounded-xl border border-border bg-panel p-6">
        <BrandMark />
        <h1 className="mt-5 text-lg font-semibold text-fg">Create your account</h1>
        <p className="mt-1 text-sm text-fg/55">Get started with your workspace in a minute.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <Field label="Name" error={errors.name}>
            <input
              type="text"
              autoComplete="name"
              className={inputCls}
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

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

          <Field label="Password" hint="At least 8 characters." error={errors.password}>
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" variant="primary" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-fg/55">
          Already have an account?{" "}
          <a href="#admin/login" className="text-fg hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
