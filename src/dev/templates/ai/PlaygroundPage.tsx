import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/dropdown-menu";
import { Button, useToast } from "./ai-states";
import { Icons } from "./ai-ui";
import { MODELS, fakeCompletion } from "./store";
import { upsertRun, newRunId, useActiveRunId, setActiveRunId, useRun, type Turn } from "./playground-runs";

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

export function PlaygroundPage() {
  const toast = useToast();

  // The live conversation belongs to a run id. The sidebar drives which run is
  // open via the shared activeRunId; selecting one there loads it here.
  const activeRunId = useActiveRunId();
  const activeRun = useRun(activeRunId);

  const [messages, setMessages] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [model, setModel] = React.useState(chatModels[0]?.id ?? "");
  const [brandVoice, setBrandVoice] = React.useState(false);

  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Load the run the sidebar selected. Guard against clobbering the live thread
  // with its own snapshot: only swap when the target id actually changes.
  const loadedId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (activeRunId === loadedId.current) return;
    loadedId.current = activeRunId;
    setMessages(activeRun ? activeRun.turns : []);
    setInput("");
  }, [activeRunId, activeRun]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || sending) return;
    // first message of a fresh thread → mint + activate a run id
    let runId = activeRunId;
    if (!runId) {
      runId = newRunId();
      loadedId.current = runId;
      setActiveRunId(runId);
    }
    setSending(true);
    const next: Turn[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    const reply = fakeCompletion(t);
    const tokens = Math.floor(reply.length / 3.6) + 40;
    const latencyMs = 480 + Math.floor(Math.random() * 520);
    window.setTimeout(() => {
      setMessages((m) => {
        const withReply: Turn[] = [...m, { role: "assistant", content: reply, tokens, latencyMs }];
        // persist the run under its stable id so the sidebar reflects it live
        if (runId) upsertRun(runId, withReply, modelLabel);
        return withReply;
      });
      setSending(false);
    }, 260);
  };

  // preset chip: prefill the composer (not send), caret at end
  const applyPreset = (prompt: string) => {
    setInput(prompt);
    const ta = taRef.current;
    if (ta) {
      ta.focus();
      requestAnimationFrame(() => ta.setSelectionRange(prompt.length, prompt.length));
    }
  };

  // start a blank thread (the current one is already persisted after each reply)
  const newChat = () => {
    loadedId.current = null;
    setActiveRunId(null);
    setMessages([]);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const started = messages.length > 0;

  // the composer card, reused centered (welcome) and pinned at bottom (chat)
  const composer = (
    <div className="ai-prompt rounded-2xl border border-border bg-panel p-2 shadow-sm">
      <textarea
        ref={taRef}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={2}
        placeholder="Ask anything…"
        className="max-h-48 w-full resize-none bg-transparent px-2 py-1.5 text-sm text-fg placeholder:text-fg/40 outline-none"
      />
      <div className="flex items-center gap-1 px-1 pt-1">
        <ToolbarButton icon={Icons.paperclip} label="Attach" onClick={() => toast("Attach a file")} />
        <ToolbarButton
          icon={Icons.mic}
          label={brandVoice ? "Brand Voice: on" : "No Brand Voice"}
          active={brandVoice}
          onClick={() => setBrandVoice((b) => !b)}
        />
        {/* model switcher — pops up the model list (opens upward so it clears
            the composer). */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Model"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-fg/70 outline-none transition-colors hover:bg-overlay/[0.05] hover:text-fg focus-visible:bg-overlay/[0.05] focus-visible:text-fg"
          >
            <span className="ai-accent [&_svg]:h-4 [&_svg]:w-4">{Icons.sparkle}</span>
            {modelLabel}
            <span className="text-fg/50">{Icons.chevronDown}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="mb-2 min-w-[12rem]">
            {chatModels.map((m) => (
              <DropdownMenuItem key={m.id} onSelect={() => setModel(m.id)}>
                <span className="flex-1">{m.label}</span>
                {m.id === model && (
                  <span className="text-accent-soft-fg [&_svg]:h-3.5 [&_svg]:w-3.5">{Icons.check}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* thin top bar — "new chat" only; rendered mid-conversation */}
      {started && (
        <div className="mb-2 flex items-center justify-end">
          <Button variant="secondary" onClick={newChat}>
            {Icons.plus}New chat
          </Button>
        </div>
      )}

      {!started ? (
        /* centered welcome — logo, greeting, composer, then preset chips */
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-2xl text-center">
            <span className="ai-iconmark mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white [&_svg]:relative [&_svg]:z-10 [&_svg]:h-6 [&_svg]:w-6">
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

/* Per-response action row — copy, read aloud, up/down vote, regenerate. */
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
      {meta && <span className="ml-2 truncate text-[11px] text-fg/60 dark:text-fg/40">{meta}</span>}
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
