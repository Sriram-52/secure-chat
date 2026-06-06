import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function requireParticipant(
  ctx: QueryCtx,
  conversationId: Id<"conversations">,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const convo = await ctx.db.get(conversationId);
  if (!convo) return null;
  if (
    convo.participantA !== identity.subject &&
    convo.participantB !== identity.subject
  ) {
    return null;
  }
  return { me: identity.subject, convo };
}

// Reactive query — Convex pushes new messages to both clients automatically.
export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const ok = await requireParticipant(ctx, conversationId);
    if (!ok) return [];
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId),
      )
      .collect();
  },
});

// Stores ciphertext only — the plaintext never reaches the server.
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    iv: v.string(),
    ciphertext: v.string(),
    wrappedKeyForA: v.string(),
    wrappedKeyForB: v.string(),
  },
  handler: async (ctx, args) => {
    const ok = await requireParticipant(ctx, args.conversationId);
    if (!ok) throw new Error("Not a participant in this conversation");
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: ok.me,
      iv: args.iv,
      ciphertext: args.ciphertext,
      wrappedKeyForA: args.wrappedKeyForA,
      wrappedKeyForB: args.wrappedKeyForB,
      createdAt: Date.now(),
    });
  },
});
