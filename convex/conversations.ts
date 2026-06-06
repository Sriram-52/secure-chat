import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Get (or lazily create) the single 1:1 conversation between me and otherUserId.
export const getOrCreateConversation = mutation({
  args: { otherUserId: v.string() },
  handler: async (ctx, { otherUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const me = identity.subject;
    if (me === otherUserId) throw new Error("Cannot chat with yourself");

    const [participantA, participantB] = [me, otherUserId].sort();

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q.eq("participantA", participantA).eq("participantB", participantB),
      )
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participantA,
      participantB,
      createdAt: Date.now(),
    });
  },
});
