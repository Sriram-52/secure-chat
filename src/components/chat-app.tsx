"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { useKeys } from "@/lib/use-keys";
import { Conversation } from "@/components/conversation";
import { CipherMark } from "@/components/cipher-mark";

type Selection = {
  userId: string;
  name: string;
  conversationId: Id<"conversations">;
};

function Avatar({ name, active }: { name: string; active?: boolean }) {
  const initials = name.trim().slice(0, 2).toUpperCase() || "··";
  return (
    <div
      className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border text-xs font-semibold"
      style={{
        borderColor: active ? "var(--accent)" : "var(--border-bright)",
        background: active ? "var(--accent-glow)" : "var(--surface-2)",
        color: active ? "var(--accent)" : "var(--muted)",
      }}
    >
      {initials}
    </div>
  );
}

export function ChatApp() {
  const keys = useKeys(true);
  const me = useQuery(api.profiles.me);
  const users = useQuery(api.profiles.listUsers);
  const getOrCreate = useMutation(api.conversations.getOrCreateConversation);
  const [selected, setSelected] = useState<Selection | null>(null);

  const openChat = async (userId: string, name: string) => {
    const conversationId = await getOrCreate({ otherUserId: userId });
    setSelected({ userId, name, conversationId });
  };

  return (
    <div className="grid h-dvh grid-cols-1 md:grid-cols-[20rem_1fr]">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="surface flex min-h-0 flex-col border-r">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <CipherMark className="h-6 w-6 text-[var(--accent)]" />
            <span className="font-[family-name:var(--font-display)] text-2xl leading-none">
              Cipher
            </span>
            <span className="pulse-dot mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <button
            onClick={() => authClient.signOut()}
            className="mono text-[0.6rem] uppercase tracking-widest text-[var(--faint)] transition-colors hover:text-[var(--danger)]"
          >
            Sign out
          </button>
        </header>

        <div className="border-b px-5 py-3">
          <p className="tag mb-1">signed in</p>
          <p className="truncate text-sm text-[var(--text)]">
            {me?.name ?? "…"}
          </p>
        </div>

        <p className="tag px-5 pt-4 pb-2">directory</p>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {users === undefined && (
            <p className="px-3 py-2 text-sm text-[var(--faint)]">Loading…</p>
          )}
          {users?.length === 0 && (
            <p className="px-3 py-2 text-xs leading-relaxed text-[var(--faint)]">
              No one else here yet. Open this app in another browser and sign in
              as a second user to start an encrypted chat.
            </p>
          )}
          {users?.map((u) => {
            const active = selected?.userId === u.userId;
            return (
              <button
                key={u.userId}
                onClick={() => openChat(u.userId, u.name)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                style={{
                  background: active ? "var(--surface-2)" : "transparent",
                }}
              >
                <Avatar name={u.name} active={active} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-[var(--text)]">
                    {u.name}
                  </span>
                  <span className="block truncate text-xs text-[var(--faint)]">
                    {u.email}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="min-h-0">
        {selected && me && keys ? (
          <Conversation
            key={selected.conversationId}
            conversationId={selected.conversationId}
            myUserId={me.userId}
            mySpki={keys.spki}
            privateKey={keys.keyPair.privateKey}
            other={{ userId: selected.userId, name: selected.name }}
          />
        ) : (
          <EmptyState ready={!!keys} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ ready }: { ready: boolean }) {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-[var(--border-bright)] bg-[var(--surface-2)] shadow-[0_0_60px_-18px_var(--accent)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 10V7a6 6 0 1 1 12 0v3"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="10"
              width="16"
              height="11"
              rx="3"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Pick someone to message
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Every message is encrypted in your browser before it&apos;s sent. Not
          even the server can read it.
        </p>
        <p className="mono mt-5 text-[0.65rem] tracking-wider text-[var(--faint)]">
          {ready ? "● keypair ready" : "○ generating keypair…"}
        </p>
      </div>
    </div>
  );
}
