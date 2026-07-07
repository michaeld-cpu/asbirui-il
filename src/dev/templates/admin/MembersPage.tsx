import * as React from "react";
import {
  useMembers,
  inviteMember,
  removeMember,
  memberStatusTone,
  type Member,
} from "./store";
import {
  PageHeader,
  Button,
  Badge,
  Field,
  inputCls,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  TableSkeleton,
  useToast,
} from "./admin-states";

const roles: Member["role"][] = ["Owner", "Admin", "Member", "Viewer"];

export function MembersPage() {
  const { data, isLoading, error } = useMembers();
  const toast = useToast();

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Member["role"]>("Member");
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});

  const [removeTarget, setRemoveTarget] = React.useState<Member | null>(null);

  function resetInvite() {
    setName("");
    setEmail("");
    setRole("Member");
    setErrors({});
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;
    inviteMember({ name: name.trim(), email: email.trim(), role });
    setInviteOpen(false);
    resetInvite();
    toast("Invitation sent");
  }

  function confirmRemove() {
    if (!removeTarget) return;
    removeMember(removeTarget.id);
    setRemoveTarget(null);
    toast("Member removed");
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Members"
        subtitle="Manage who has access to this workspace and their roles."
        action={
          <Button onClick={() => setInviteOpen(true)}>Invite member</Button>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : error ? (
        <ErrorState />
      ) : data.length === 0 ? (
        <EmptyState
          title="No members yet"
          description="Invite teammates to collaborate in this workspace."
          action={<Button onClick={() => setInviteOpen(true)}>Invite member</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-panel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-fg/50">
                  <th className="px-4 py-3 font-normal">Member</th>
                  <th className="px-4 py-3 font-normal">Role</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-overlay/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className="h-8 w-8 shrink-0 rounded-full bg-fg/15" />
                        <span>
                          <span className="block font-medium text-fg">{m.name}</span>
                          <span className="block text-xs text-fg/45">{m.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-overlay/[0.08] text-fg/70">{m.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={memberStatusTone[m.status]}>{m.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-fg/50">{m.joined}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={m.role === "Owner"}
                        onClick={() => setRemoveTarget(m)}
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
      )}

      {/* invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setInviteOpen(false);
              resetInvite();
            }}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-panel p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-fg">Invite member</h3>
            <p className="mt-1.5 text-sm text-fg/60">
              Send an invitation to join this workspace.
            </p>
            <form onSubmit={submitInvite} className="mt-4 space-y-4">
              <Field label="Name" error={errors.name}>
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Cooper"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                />
              </Field>
              <Field label="Role">
                <select
                  className={inputCls}
                  value={role}
                  onChange={(e) => setRole(e.target.value as Member["role"])}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setInviteOpen(false);
                    resetInvite();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Send invitation</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove member"
        description={
          removeTarget
            ? `Remove ${removeTarget.name} from this workspace? They will lose access immediately.`
            : ""
        }
        confirmLabel="Remove"
        onConfirm={confirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
