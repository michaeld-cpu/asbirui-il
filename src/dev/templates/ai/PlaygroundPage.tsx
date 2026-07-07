import * as React from "react";
import { SelectMenu } from "@/components/select-menu";
import { Button, useToast } from "./ai-states";
import { Icons } from "./ai-ui";
import { MODELS, fakeCompletion, usePrompts, type ChatMessage } from "./store";

type Turn = ChatMessage & { tokens?: number; latencyMs?: number };

const chatModels = MODELS.filter((m) => m.kind === "chat");
const USER_NAME = "Mike"; // matches the signed-in user shown elsewhere in the shell

/* preset starter chips for the welcome screen — each prefills the composer
   with a starter prompt the user can edit before sending */
const PRESETS: { icon: React.ReactNode; label: string; prompt: string }[] = [
  { icon: Icons.search, label: "Research", prompt: "Research the latest trends in " },
  { icon: Icons.prompts, label: "Long-form", prompt: "Write a blog post about " },
  { icon: Icons.sparkle, label: "Brainstorm", prompt: "Brainstorm 10 ideas for " },
  { icon: Icons.logs, label: "Summarize", prompt: "Summarize the following:\n\n" },
  { icon: Icons.wand, label: "Improve", prompt: "Improve this copy:\n\n" },
];

/* one row in the # mention popover */
type Mention = { kind: "entry" | "tag"; label: string };

export function PlaygroundPage() {
  const prompts = usePrompts();
  const toast = useToast();

  const [messages, setMessages] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [model, setModel] = React.useState(chatModels[0]?.id ?? "");
  const [brandVoice, setBrandVoice] = React.useState(false);

  // # mention state
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState("");
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // entries = prompt titles (as slugs); tags = unique prompt tags
  const entries = React.useMemo<Mention[]>(
    () => prompts.map((p) => ({ kind: "entry" as const, label: p.title.replace(/\s+/g, "") })),
    [prompts],
  );
  const tags = React.useMemo<Mention[]>(() => {
    const seen = new Set<string>();
    const out: Mention[] = [];
    for (const p of prompts) for (const t of p.tags) if (!seen.has(t)) { seen.add(t); out.push({ kind: "tag", label: t }); }
    return out;
  }, [prompts]);

  const q = mentionQuery.toLowerCase();
  const matchEntries = entries.filter((e) => e.label.toLowerCase().includes(q));
  const matchTags = tags.filter((t) => t.label.toLowerCase().includes(q));
  const hasMentions = matchEntries.length + matchTags.length > 0;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model;

  // detect an in-progress "#word" at the caret to drive the mention popover
  const syncMention = (value: string) => {
    const m = /(?:^|\s)#(\w*)$/.exec(value);
    if (m) {
      setMentionOpen(true);
      setMentionQuery(m[1]);
    } else {
      setMentionOpen(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    syncMention(e.target.value);
  };

  const insertMention = (label: string) => {
    // replace the trailing "#partial" with the chosen "#label "
    setInput((v) => v.replace(/#(\w*)$/, `#${label} `));
    setMentionOpen(false);
    taRef.current?.focus();
  };

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: t }]);
    setInput("");
    setMentionOpen(false);
    const reply = fakeCompletion(t);
    const tokens = Math.floor(reply.length / 3.6) + 40;
    const latencyMs = 480 + Math.floor(Math.random() * 520);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply, tokens, latencyMs }]);
      setSending(false);
    }, 260);
  };

  // preset chip: prefill the composer (not send) and drop the caret at the end
  const applyPreset = (prompt: string) => {
    setInput(prompt);
    const ta = taRef.current;
    if (ta) {
      ta.focus();
      requestAnimationFrame(() => ta.setSelectionRange(prompt.length, prompt.length));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen && e.key === "Escape") {
      e.preventDefault();
      setMentionOpen(false);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const started = messages.length > 0;

  // the composer card, reused centered (welcome) and pinned at bottom (chat)
  const composer = (
    <div className="relative">
      {/* # mention popover */}
      {mentionOpen && hasMentions && (
        <div className="absolute bottom-full left-3 mb-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {matchEntries.length > 0 && (
            <div className="py-1.5">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Library entries</p>
              {matchEntries.map((e) => (
                <button
                  key={e.label}
                  type="button"
                  onClick={() => insertMention(e.label)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-fg transition-colors hover:bg-overlay/[0.05]"
                >
                  <span className="ai-accent font-mono">#</span>
                  {e.label}
                </button>
              ))}
            </div>
          )}
          {matchTags.length > 0 && (
            <div className="border-t border-border py-1.5">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Tags</p>
              {matchTags.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => insertMention(t.label)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-fg transition-colors hover:bg-overlay/[0.05]"
                >
                  <span className="ai-accent font-mono">#</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="ai-prompt rounded-2xl border border-border bg-panel p-2 shadow-sm">
        <textarea
          ref={taRef}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Ask anything, or type # to reference your prompt library…"
          className="max-h-48 w-full resize-none bg-transparent px-2 py-1.5 text-sm text-fg placeholder:text-fg/40 outline-none"
        />
        <div className="flex items-center gap-1 px-1 pt-1">
          <ToolbarButton icon={Icons.paperclip} label="Attach" onClick={() => toast("Attach a file")} />
          <ToolbarButton icon={Icons.book} label="Browse Prompts" onClick={() => (location.hash = "#ai/prompts")} />
          <ToolbarButton
            icon={Icons.mic}
            label={brandVoice ? "Brand Voice: on" : "No Brand Voice"}
            active={brandVoice}
            onClick={() => setBrandVoice((b) => !b)}
          />
          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton icon={Icons.wand} label="Improve" onClick={() => toast("Improving your prompt…")} />
            <button
              type="button"
              onClick={() => submit(input)}
              disabled={!input.trim() || sending}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded-full ai-bg-accent text-white transition-opacity disabled:opacity-40"
            >
              {Icons.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* thin top bar — model picker + new chat, kept out of the way */}
      <div className="mb-2 flex items-center justify-end gap-2">
        <SelectMenu
          aria-label="Model"
          value={model}
          onValueChange={setModel}
          options={chatModels.map((m) => ({ value: m.id, label: m.label }))}
          align="end"
          className="w-auto min-w-[10rem] bg-panel font-medium hover:bg-overlay/[0.03]"
        />
        {started && (
          <Button variant="secondary" onClick={() => setMessages([])}>
            {Icons.plus}New chat
          </Button>
        )}
      </div>

      {!started ? (
        /* centered welcome — logo, greeting, composer, then preset chips */
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-2xl text-center">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ai-bg-accent text-white shadow-lg [&_svg]:h-6 [&_svg]:w-6">
              {Icons.logo}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              What do you want to do, {USER_NAME}?
            </h1>

            <div className="mt-8 text-left">{composer}</div>

            <p className="mt-8 text-xs font-medium text-fg/60 dark:text-fg/45">Start with a preset</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.prompt)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm font-medium text-fg/80 transition-colors hover:border-[rgb(var(--accent)/0.4)] hover:bg-overlay/[0.03] hover:text-fg"
                >
                  <span className="ai-accent">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* conversation view — scrolls, composer pinned below */
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-5 py-2">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl rounded-br-sm ai-bg-accent-soft px-3.5 py-2.5 text-sm text-fg">
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white [background-color:rgb(var(--accent))]">
                      {Icons.logo}
                    </span>
                    <div className="min-w-0 flex-1">
                      {/* response sits flat — no bubble background */}
                      <div className="px-0.5 py-0.5 text-sm text-fg">
                        <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      </div>
                      {/* per-response actions */}
                      <ResponseActions
                        onCopy={() => {
                          navigator.clipboard?.writeText(m.content);
                          toast("Copied response");
                        }}
                        onSpeak={() => toast("Reading aloud…")}
                        onUp={() => toast("Thanks for the feedback")}
                        onDown={() => toast("Thanks — we'll improve")}
                        onRegenerate={() => submit(messages[i - 1]?.content ?? "")}
                        meta={
                          m.tokens != null && m.latencyMs != null
                            ? `${m.tokens} tokens · ${m.latencyMs}ms · ${modelLabel}`
                            : undefined
                        }
                      />
                    </div>
                  </div>
                ),
              )}
              {sending && (
                <div className="flex justify-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white [background-color:rgb(var(--accent))]">
                    {Icons.logo}
                  </span>
                  <div className="flex items-center gap-1 px-0.5 py-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mx-auto mt-4 w-full max-w-3xl">
            {composer}
            <p className="mt-2 px-1 text-center text-[11px] text-fg/50 dark:text-fg/40">
              Sandbox · {modelLabel} · nothing here is saved
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "ai-bg-accent-soft ai-accent" : "text-fg/70 hover:bg-overlay/[0.05] hover:text-fg"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* Per-response action row — copy, read aloud, up/down vote, regenerate. Sits
   under every assistant reply. `up`/`down` are mutually-exclusive local state so
   the chosen vote stays highlighted; the rest are one-shot toasts. */
function ResponseActions({
  onCopy,
  onSpeak,
  onUp,
  onDown,
  onRegenerate,
  meta,
}: {
  onCopy: () => void;
  onSpeak: () => void;
  onUp: () => void;
  onDown: () => void;
  onRegenerate: () => void;
  meta?: string;
}) {
  const [vote, setVote] = React.useState<"up" | "down" | null>(null);
  return (
    <div className="mt-1 flex items-center gap-0.5">
      <ActionButton icon={Icons.copy} label="Copy" onClick={onCopy} />
      <ActionButton icon={Icons.volume} label="Read aloud" onClick={onSpeak} />
      <ActionButton
        icon={Icons.thumbUp}
        label="Good response"
        active={vote === "up"}
        onClick={() => {
          setVote((v) => (v === "up" ? null : "up"));
          onUp();
        }}
      />
      <ActionButton
        icon={Icons.thumbDown}
        label="Bad response"
        active={vote === "down"}
        onClick={() => {
          setVote((v) => (v === "down" ? null : "down"));
          onDown();
        }}
      />
      <ActionButton icon={Icons.regenerate} label="Regenerate" onClick={onRegenerate} />
      {meta && (
        <span className="ml-2 truncate text-[11px] text-fg/60 dark:text-fg/40">{meta}</span>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        active ? "ai-accent" : "text-fg/50 hover:bg-overlay/[0.06] hover:text-fg/80"
      }`}
    >
      {icon}
    </button>
  );
}
