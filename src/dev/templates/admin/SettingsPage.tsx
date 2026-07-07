import * as React from "react";
import { useMembers } from "./store";
import {
  PageHeader,
  Tabs,
  Button,
  Badge,
  Field,
  inputCls,
  useToast,
} from "./admin-states";

const invoices = [
  { date: "Jun 1, 2026", amount: "$29.00", status: "Paid", tone: "bg-emerald-500/15 text-emerald-400" },
  { date: "May 1, 2026", amount: "$29.00", status: "Paid", tone: "bg-emerald-500/15 text-emerald-400" },
  { date: "Apr 1, 2026", amount: "$29.00", status: "Paid", tone: "bg-emerald-500/15 text-emerald-400" },
];

export function SettingsPage({ tab }: { tab: string }) {
  const toast = useToast();

  const tabs = [
    { label: "Profile", href: "#admin/settings", active: tab === "" },
    { label: "Team", href: "#admin/settings/team", active: tab === "team" },
    { label: "Billing", href: "#admin/settings/billing", active: tab === "billing" },
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, team, and billing preferences."
      />
      <Tabs tabs={tabs} />

      {tab === "team" ? (
        <TeamTab />
      ) : tab === "billing" ? (
        <BillingTab toast={toast} />
      ) : (
        <ProfileTab toast={toast} />
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5 sm:p-6">{children}</div>
  );
}

function ProfileTab({ toast }: { toast: (m: string) => void }) {
  const [name, setName] = React.useState("Jane Cooper");
  const [email, setEmail] = React.useState("jane@example.com");
  const [bio, setBio] = React.useState("Product lead focused on design systems.");

  function save(e: React.FormEvent) {
    e.preventDefault();
    toast("Saved");
  }

  return (
    <form onSubmit={save} className="max-w-2xl">
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="h-16 w-16 shrink-0 rounded-full bg-fg/15" />
          <div>
            <Button type="button" variant="secondary" size="sm">
              Change
            </Button>
            <p className="mt-1.5 text-xs text-fg/45">JPG or PNG, up to 2MB.</p>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <input
              className={inputCls}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Bio" hint="A short description shown on your profile.">
            <textarea
              className={`${inputCls} min-h-[96px] resize-y`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </Card>
    </form>
  );
}

function TeamTab() {
  const [workspace, setWorkspace] = React.useState("Acme Workspace");
  const { data } = useMembers();

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <Field label="Workspace name" hint="Visible to everyone in the workspace.">
          <input
            className={inputCls}
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
          />
        </Field>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-fg">Members</h3>
          <a
            href="#admin/members"
            className="text-sm text-fg/60 transition-colors hover:text-fg"
          >
            Manage members
          </a>
        </div>
        <ul className="divide-y divide-border/60">
          {data.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="h-8 w-8 shrink-0 rounded-full bg-fg/15" />
              <span className="flex-1 text-sm font-medium text-fg">{m.name}</span>
              <Badge className="bg-overlay/[0.08] text-fg/70">{m.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function BillingTab({ toast }: { toast: (m: string) => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-fg/45">Current plan</p>
            <p className="mt-0.5 text-lg font-semibold text-fg">Pro — $29/mo</p>
            <p className="mt-1 text-sm text-fg/55">Billed monthly. Renews Jul 1, 2026.</p>
          </div>
          <Button variant="secondary">Change plan</Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-fg">Payment method</h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-12 items-center justify-center rounded-md border border-border bg-canvas text-xs font-medium text-fg/60">
              VISA
            </span>
            <span className="text-sm text-fg/70">•••• 4242</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast("Saved")}>
            Update
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-fg">Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg/50">
                <th className="px-2 py-2.5 font-normal">Date</th>
                <th className="px-2 py-2.5 font-normal">Amount</th>
                <th className="px-2 py-2.5 font-normal">Status</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.date} className="border-b border-border/60 last:border-0">
                  <td className="px-2 py-3 text-fg/80">{inv.date}</td>
                  <td className="px-2 py-3 text-fg/80">{inv.amount}</td>
                  <td className="px-2 py-3">
                    <Badge className={inv.tone}>{inv.status}</Badge>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
