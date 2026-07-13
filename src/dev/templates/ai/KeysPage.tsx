import * as React from "react";
import {
  Button,
  Badge,
  Field,
  inputCls,
  PageHeader,
  CodeBlock,
  EmptyState,
  ConfirmDialog,
  Modal,
  useToast,
} from "./ai-states";
import { Checkbox } from "@/index";
import { Icons } from "./ai-ui";
import { useApiKeys, createApiKey, revokeApiKey, deleteApiKey, keyStatusTone } from "./store";
import type { ApiKey } from "./store";

const SCOPES: { id: string; label: string; hint: string }[] = [
  { id: "chat", label: "chat", hint: "Aurora chat + completions endpoints" },
  { id: "embeddings", label: "embeddings", hint: "Vectorize text via the embeddings API" },
  { id: "images", label: "images", hint: "Generate and edit images with Aurora Vision" },
];

function CopyButton({ value, onCopied }: { value: string; onCopied: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          navigator.clipboard?.writeText(value);
        } catch {
          /* clipboard unavailable */
        }
        onCopied();
      }}
      className="inline-flex items-center justify-center rounded-md p-1 text-fg/70 dark:text-fg/55 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
      aria-label="Copy"
      title="Copy"
    >
      {Icons.copy}
    </button>
  );
}

export function KeysPage() {
  const keys = useApiKeys();
  const toast = useToast();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [scopes, setScopes] = React.useState<string[]>(["chat"]);
  const [nameError, setNameError] = React.useState<string | undefined>();
  const [issuedKey, setIssuedKey] = React.useState<string | null>(null);

  const [revokeTarget, setRevokeTarget] = React.useState<ApiKey | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ApiKey | null>(null);

  function resetCreate() {
    setName("");
    setScopes(["chat"]);
    setNameError(undefined);
    setIssuedKey(null);
  }

  function openCreate() {
    resetCreate();
    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
    // clear after close so the reveal state doesn't flash on the next open
    setTimeout(resetCreate, 0);
  }

  function toggleScope(id: string) {
    setScopes((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function submitCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Give the key a recognizable name.");
      return;
    }
    if (scopes.length === 0) {
      setNameError(undefined);
      toast("Select at least one scope");
      return;
    }
    // real mutation — adds a row and returns the one-time full token
    const { token } = createApiKey(trimmed, scopes);
    toast("API key created");
    setIssuedKey(token);
  }

  return (
    <div>
      <PageHeader
        title="API keys"
        subtitle="Authenticate requests to the Lumina AI platform. Keys carry the scopes you grant them — treat them like passwords and never embed them in client-side code."
        action={
          <Button variant="primary" size="md" onClick={openCreate}>
            {Icons.plus}
            Create key
          </Button>
        }
      />

      {keys.length === 0 ? (
        <EmptyState
          title="No API keys yet"
          description="Create a scoped key to start calling Aurora models. Keys are shown in full only once at creation — store them in a secret manager, never in source control."
          action={
            <Button variant="primary" size="md" onClick={openCreate}>
              {Icons.plus}
              Create key
            </Button>
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-panel">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs capitalize text-fg">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Key</th>
                    <th className="px-4 py-3 font-medium">Scopes</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Last used</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr
                      key={k.id}
                      className={`border-b border-border/60 last:border-0 transition-colors hover:bg-overlay/[0.03] ${k.status === "revoked" ? "opacity-60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-fg">{k.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded-md bg-overlay/[0.05] px-2 py-1 font-mono text-xs text-fg/80">
                            {k.prefix}…
                          </code>
                          <CopyButton value={k.prefix} onCopied={() => toast("Key prefix copied")} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {k.scopes.length === 0 ? (
                            <span className="text-xs text-fg/70 dark:text-fg/55">none</span>
                          ) : (
                            k.scopes.map((s) => (
                              <Badge key={s} className="ai-bg-accent-soft ai-accent">
                                {s}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-fg/70 dark:text-fg/55">{k.created}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-fg/70 dark:text-fg/55">{k.lastUsed}</td>
                      <td className="px-4 py-3">
                        <Badge className={keyStatusTone[k.status]}>{k.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {k.status === "active" && (
                            <Button variant="secondary" size="sm" onClick={() => setRevokeTarget(k)}>
                              Revoke
                            </Button>
                          )}
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(k)}>
                            {Icons.trash}
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-3 text-xs text-fg/70 dark:text-fg/55">
            Revoking a key immediately rejects any request that presents it — active integrations will start
            returning 401. Deleting removes the record and its usage audit trail permanently.
          </p>
        </>
      )}

      <Modal open={createOpen} title="Create API key" onClose={closeCreate}>
        {issuedKey ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-fg">Your new key is ready.</p>
              <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">
                Copy it now and store it somewhere secure. For security,{" "}
                <span className="text-fg">you won't be able to see this again.</span>
              </p>
            </div>
            <CodeBlock code={issuedKey} lang="text" />
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  try {
                    navigator.clipboard?.writeText(issuedKey);
                  } catch {
                    /* clipboard unavailable */
                  }
                  toast("API key copied to clipboard");
                }}
              >
                {Icons.copy}
                Copy key
              </Button>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
              This is the only time the full key is displayed. If you lose it, revoke this key and create a new
              one.
            </div>
            <div className="flex justify-end border-t border-border pt-4">
              <Button variant="primary" size="md" onClick={closeCreate}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field
              label="Key name"
              hint="A label to identify where this key is used, e.g. “production-backend”."
              error={nameError}
            >
              <input
                autoFocus
                className={inputCls}
                placeholder="production-backend"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitCreate();
                }}
              />
            </Field>

            <div>
              <div className="mb-1.5 text-sm font-medium text-fg">Scopes</div>
              <p className="mb-2 text-xs text-fg/70 dark:text-fg/55">
                Grant only the access this key needs. Narrow scopes limit blast radius if the key leaks.
              </p>
              <div className="space-y-2">
                {SCOPES.map((s) => {
                  const checked = scopes.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-canvas px-3 py-2.5 transition-colors hover:bg-overlay/[0.03]"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleScope(s.id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block font-mono text-sm text-fg">{s.label}</span>
                        <span className="block text-xs text-fg/70 dark:text-fg/55">{s.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost" size="md" onClick={closeCreate}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={submitCreate}>
                Create key
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke API key"
        description={
          revokeTarget
            ? `Revoke “${revokeTarget.name}”? Any request using this key will immediately be rejected with 401. This cannot be undone.`
            : ""
        }
        confirmLabel="Revoke key"
        danger
        onConfirm={() => {
          if (revokeTarget) {
            revokeApiKey(revokeTarget.id);
            toast("API key revoked");
          }
          setRevokeTarget(null);
        }}
        onCancel={() => setRevokeTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete API key"
        description={
          deleteTarget
            ? `Permanently delete “${deleteTarget.name}”? This removes the key record and its usage history. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete key"
        danger
        onConfirm={() => {
          if (deleteTarget) {
            deleteApiKey(deleteTarget.id);
            toast("API key deleted");
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
