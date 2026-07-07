import * as React from "react";
import { PageHeader, Button, Badge, Field, inputCls, ConfirmDialog, Modal, useToast } from "./ai-states";
import { useMembers, inviteMember, removeMember, memberTone, type Member } from "./store";

const ROLES: Member["role"][] = ["Owner", "Admin", "Developer", "Billing"];

const ROLE_INFO: { role: Member["role"]; desc: string }[] = [
  { role: "Owner", desc: "Full control of the workspace, billing, and members. Cannot be removed." },
  { role: "Admin", desc: "Manage API keys, prompts, members, and settings — everything except deleting the workspace." },
  { role: "Developer", desc: "Create and use API keys, prompts, and the playground. No billing or member access." },
  { role: "Billing", desc: "View usage and manage invoices and payment methods. No engineering access." },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function TeamPage() {
  const members = useMembers();
  const toast = useToast();

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Member["role"]>("Developer");
  const [error, setError] = React.useState<string | null>(null);

  const [removing, setRemoving] = React.useState<Member | null>(null);

  const resetInvite = () => {
    setName("");
    setEmail("");
    setRole("Developer");
    setError(null);
  };

  const closeInvite = () => {
    setInviteOpen(false);
    resetInvite();
  };

  const submitInvite = () => {
    if (!name.trim()) return setError("Name is required.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError("Enter a valid email address.");
    inviteMember({ name: name.trim(), email: email.trim(), role });
    toast("Invitation sent");
    closeInvite();
  };

  const confirmRemove = () => {
    if (!removing) return;
    removeMember(removing.id);
    toast(`Removed ${removing.name}`);
    setRemoving(null);
  };

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Manage who has access to this workspace and what they can do."
        action={<Button onClick={() => setInviteOpen(true)}>Invite member</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs capitalize text-fg">
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 transition-colors hover:bg-overlay/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fg/15 text-[11px] font-semibold text-fg">
                        {initials(m.name)}
                      </span>
                      <div>
                        <p className="font-medium text-fg">{m.name}</p>
                        <p className="text-xs text-fg/70 dark:text-fg/55">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-overlay/[0.08] text-fg/70">{m.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={memberTone[m.status]}>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={m.role === "Owner"}
                      onClick={() => setRemoving(m)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold text-fg">Roles</h2>
        <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">What each role can do in this workspace.</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {ROLE_INFO.map((r) => (
            <div key={r.role} className="flex gap-3">
              <Badge className="h-fit bg-overlay/[0.08] text-fg/70">{r.role}</Badge>
              <dd className="text-sm text-fg/60">{r.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Modal open={inviteOpen} title="Invite member" onClose={closeInvite}>
        <div className="space-y-4">
          <Field label="Name">
            <input className={inputCls} value={name} placeholder="Jane Cooper" onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email" error={error ?? undefined}>
            <input className={inputCls} value={email} placeholder="jane@lumina.ai" type="email" onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Role" hint="Owner can only be reassigned from settings.">
            <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value as Member["role"])}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={closeInvite}>Cancel</Button>
            <Button onClick={submitInvite}>Send invitation</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!removing}
        title="Remove member"
        description={removing ? `Remove ${removing.name} (${removing.email}) from this workspace? They will lose all access immediately.` : ""}
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
}
