import * as React from "react";
import { PageHeader, Tabs, Button, Badge, Field, FormSelect, inputCls, CodeBlock, ConfirmDialog, Modal, useToast } from "./ai-states";
import { MODELS } from "./store";

type Session = { id: string; device: string; location: string; lastActive: string; current: boolean };
type Webhook = { id: string; url: string; events: string[]; status: "Active" | "Disabled" };

const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro · Chrome", location: "Singapore, SG", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 15 · Safari", location: "Singapore, SG", lastActive: "2 hours ago", current: false },
  { id: "s3", device: "Windows · Firefox", location: "Frankfurt, DE", lastActive: "3 days ago", current: false },
];

const SEED_WEBHOOKS: Webhook[] = [
  { id: "wh_01", url: "https://api.acme.com/hooks/lumina", events: ["request.completed", "invoice.paid"], status: "Active" },
  { id: "wh_02", url: "https://ops.acme.com/lumina/alerts", events: ["request.failed"], status: "Disabled" },
];

const EVENT_TYPES = ["request.completed", "request.failed", "invoice.paid", "invoice.failed", "key.created", "key.revoked"];

const SAMPLE_PAYLOAD = `{
  "id": "evt_9f2c1a7b",
  "type": "request.completed",
  "created": 1751760000,
  "data": {
    "request_id": "req_1042",
    "model": "aurora-large",
    "endpoint": "chat",
    "status": 200,
    "latency_ms": 612,
    "tokens": { "input": 842, "output": 311 },
    "cost": 0.0184
  }
}`;

const webhookTone: Record<Webhook["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Disabled: "bg-fg/10 text-fg/70 dark:text-fg/50",
};

function tabsFor(tab: string) {
  return [
    { label: "General", href: "#ai/settings", active: tab === "" },
    { label: "Security", href: "#ai/settings/security", active: tab === "security" },
    { label: "Webhooks", href: "#ai/settings/webhooks", active: tab === "webhooks" },
  ];
}

function GeneralTab() {
  const toast = useToast();
  const [orgName, setOrgName] = React.useState("Lumina AI");
  const [defaultModel, setDefaultModel] = React.useState(MODELS[0].id);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold text-fg">Organization</h2>
        <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">Basic details for this workspace.</p>
        <div className="mt-4 space-y-4">
          <Field label="Organization name">
            <input className={inputCls} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </Field>
          <Field label="Default model" hint="Used when a request does not specify a model.">
            <FormSelect
              ariaLabel="Default model"
              value={defaultModel}
              onValueChange={setDefaultModel}
              options={MODELS.map((m) => ({ value: m.id, label: m.label }))}
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={() => toast("Settings saved")}>Save changes</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-rose-500/30 bg-panel p-5">
        <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Danger zone</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-fg">Delete this workspace</p>
            <p className="mt-0.5 text-sm text-fg/70 dark:text-fg/55">Permanently removes all keys, prompts, logs, and members. This cannot be undone.</p>
          </div>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete workspace</Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete workspace"
        description="This will permanently delete the Lumina AI workspace and all associated data. This action cannot be undone."
        confirmLabel="Delete workspace"
        danger
        onConfirm={() => {
          setConfirmDelete(false);
          toast("Workspace deletion scheduled");
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function SecurityTab() {
  const toast = useToast();
  const [twoFa, setTwoFa] = React.useState(true);
  const [sessions, setSessions] = React.useState<Session[]>(SESSIONS);
  const [ipRanges, setIpRanges] = React.useState("203.0.113.0/24\n198.51.100.14");

  const revoke = (id: string) => {
    setSessions((s) => s.filter((x) => x.id !== id));
    toast("Session revoked");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-border bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-fg">Two-factor authentication</h2>
            <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">Require a second factor for all members when signing in.</p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[rgb(var(--accent))]"
              checked={twoFa}
              onChange={(e) => {
                setTwoFa(e.target.checked);
                toast(e.target.checked ? "2FA enabled" : "2FA disabled");
              }}
            />
            <span className="text-sm text-fg/70">{twoFa ? "Enabled" : "Disabled"}</span>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold text-fg">Active sessions</h2>
        <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">Devices currently signed in to your account.</p>
        <ul className="mt-4 divide-y divide-border">
          {sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg">
                  {s.device}
                  {s.current && <Badge className="bg-overlay/[0.08] text-fg/60">This device</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-fg/70 dark:text-fg/55">{s.location} · {s.lastActive}</p>
              </div>
              <Button variant="ghost" size="sm" disabled={s.current} onClick={() => revoke(s.id)}>Revoke</Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold text-fg">Allowed IP ranges</h2>
        <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">One CIDR range or address per line. Leave empty to allow all.</p>
        <textarea
          className={`${inputCls} mt-4 h-28 resize-y font-mono text-xs`}
          value={ipRanges}
          onChange={(e) => setIpRanges(e.target.value)}
          spellCheck={false}
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={() => toast("IP ranges updated")}>Save ranges</Button>
        </div>
      </div>
    </div>
  );
}

function WebhooksTab() {
  const toast = useToast();
  const [hooks, setHooks] = React.useState<Webhook[]>(SEED_WEBHOOKS);
  const [addOpen, setAddOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [events, setEvents] = React.useState<string[]>(["request.completed"]);
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setUrl("");
    setEvents(["request.completed"]);
    setError(null);
  };
  const close = () => {
    setAddOpen(false);
    reset();
  };
  const toggleEvent = (evt: string) =>
    setEvents((e) => (e.includes(evt) ? e.filter((x) => x !== evt) : [...e, evt]));

  const submit = () => {
    if (!/^https:\/\/\S+/.test(url.trim())) return setError("Enter a valid https:// URL.");
    if (events.length === 0) return setError("Select at least one event.");
    setHooks((h) => [...h, { id: `wh_${String(h.length + 1).padStart(2, "0")}`, url: url.trim(), events, status: "Active" }]);
    toast("Endpoint added");
    close();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-fg">Endpoints</h2>
          <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">Receive real-time event notifications at your URLs.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add endpoint</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs capitalize text-fg">
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Events</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {hooks.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-fg/80">{h.url}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {h.events.map((e) => (
                        <Badge key={e} className="bg-overlay/[0.08] text-fg/60">{e}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={webhookTone[h.status]}>{h.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-fg">Sample payload</h2>
        <CodeBlock lang="json" code={SAMPLE_PAYLOAD} />
      </div>

      <Modal open={addOpen} title="Add endpoint" onClose={close}>
        <div className="space-y-4">
          <Field label="Endpoint URL" error={error ?? undefined}>
            <input className={inputCls} value={url} placeholder="https://api.example.com/hooks" onChange={(e) => setUrl(e.target.value)} />
          </Field>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-fg">Events</span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {EVENT_TYPES.map((evt) => (
                <label key={evt} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-fg/70 transition-colors hover:bg-overlay/[0.05]">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-[rgb(var(--accent))]"
                    checked={events.includes(evt)}
                    onChange={() => toggleEvent(evt)}
                  />
                  <span className="font-mono">{evt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button onClick={submit}>Add endpoint</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function SettingsPage({ tab }: { tab: string }) {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your workspace, security, and integrations." />
      <Tabs tabs={tabsFor(tab)} />
      {tab === "security" ? <SecurityTab /> : tab === "webhooks" ? <WebhooksTab /> : <GeneralTab />}
    </div>
  );
}
