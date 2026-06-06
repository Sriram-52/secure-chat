"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { encryptMessage, decryptMessage } from "@/lib/crypto";

type Props = {
  conversationId: Id<"conversations">;
  myUserId: string;
  mySpki: string;
  privateKey: CryptoKey;
  other: { userId: string; name: string };
};

export function Conversation({
  conversationId,
  myUserId,
  mySpki,
  privateKey,
  other,
}: Props) {
  const otherSpki = useQuery(api.profiles.getPublicKey, {
    userId: other.userId,
  });
  const messages = useQuery(api.messages.listMessages, { conversationId });
  const send = useMutation(api.messages.sendMessage);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [plain, setPlain] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // I am participant A if my id sorts first (matches the server's ordering).
  const amA = [myUserId, other.userId].sort()[0] === myUserId;
  const spkiA = amA ? mySpki : otherSpki;
  const spkiB = amA ? otherSpki : mySpki;

  // Decrypt any messages we haven't decrypted yet.
  useEffect(() => {
    if (!messages) return;
    let cancelled = false;
    (async () => {
      for (const m of messages) {
        if (plain[m._id]) continue;
        const wrappedKey = amA ? m.wrappedKeyForA : m.wrappedKeyForB;
        try {
          const text = await decryptMessage(
            { iv: m.iv, ciphertext: m.ciphertext, wrappedKey },
            privateKey,
          );
          if (cancelled) return;
          setPlain((p) => ({ ...p, [m._id]: text }));
        } catch {
          if (cancelled) return;
          setPlain((p) => ({ ...p, [m._id]: "⚠ could not decrypt" }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [messages, amA, privateKey, plain]);

  // Stick to the bottom on new messages.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !spkiA || !spkiB) return;
    setSending(true);
    try {
      const env = await encryptMessage(text, spkiA, spkiB);
      await send({ conversationId, ...env });
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  const toggleReveal = (id: string) =>
    setRevealed((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const keyMissing = otherSpki === null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <header className="surface flex items-center justify-between border-b px-6 py-3.5">
        <div>
          <h2 className="text-base leading-tight text-[var(--text)]">
            {other.name}
          </h2>
          <p className="tag mt-0.5 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            end-to-end encrypted
          </p>
        </div>
        <span className="mono hidden text-[0.6rem] tracking-wider text-[var(--faint)] sm:block">
          RSA-OAEP · AES-GCM
        </span>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages?.length === 0 && (
            <p className="mt-10 text-center text-sm text-[var(--faint)]">
              No messages yet — say something only {other.name} can read.
            </p>
          )}
          {messages?.map((m) => {
            const mine = m.senderId === myUserId;
            const isRevealed = revealed.has(m._id);
            return (
              <div
                key={m._id}
                className="rise flex flex-col"
                style={{ alignItems: mine ? "flex-end" : "flex-start" }}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: mine
                      ? "linear-gradient(180deg, var(--accent), var(--accent-deep))"
                      : "var(--surface-2)",
                    color: mine ? "#03130a" : "var(--text)",
                    border: mine ? "none" : "1px solid var(--border)",
                    borderBottomRightRadius: mine ? "5px" : undefined,
                    borderBottomLeftRadius: mine ? undefined : "5px",
                  }}
                >
                  {isRevealed ? (
                    <span className="mono block break-all text-[0.7rem] opacity-80">
                      {m.ciphertext}
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap break-words">
                      {plain[m._id] ?? "···"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleReveal(m._id)}
                  className="mono mt-1 px-1 text-[0.58rem] uppercase tracking-wider text-[var(--faint)] transition-colors hover:text-[var(--accent)]"
                >
                  {isRevealed ? "show plaintext" : "show ciphertext"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      <div className="surface border-t px-4 py-3.5">
        <div className="mx-auto max-w-2xl">
          {keyMissing ? (
            <p className="mono py-2 text-center text-xs text-[var(--faint)]">
              Waiting for {other.name} to come online and publish a key…
            </p>
          ) : (
            <form onSubmit={submit} className="flex items-end gap-2.5">
              <textarea
                className="field max-h-32 min-h-[2.75rem] flex-1 resize-none"
                placeholder={`Message ${other.name}…`}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(e);
                  }
                }}
              />
              <button
                type="submit"
                className="btn btn-primary h-[2.75rem]"
                disabled={sending || !draft.trim() || !spkiA || !spkiB}
              >
                {sending ? "Sealing…" : "Send"}
              </button>
            </form>
          )}
          <p className="mono mt-2 text-center text-[0.58rem] tracking-wider text-[var(--faint)]">
            encrypted in-browser · the server stores only ciphertext
          </p>
        </div>
      </div>
    </div>
  );
}
