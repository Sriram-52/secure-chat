import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Upsert the current user's profile + public key. Called once on first login
// after the browser generates its RSA keypair.
export const registerKey = mutation({
  args: { spki: v.string() },
  handler: async (ctx, { spki }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await authComponent.safeGetAuthUser(ctx);
    const userId = identity.subject;
    const name = user?.name || user?.email || "Anonymous";
    const email = user?.email || "";

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { name, email, spki });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        name,
        email,
        spki,
        createdAt: Date.now(),
      });
    }
  },
});

// The current user's id (identity.subject) + display fields. The client uses
// this id so its participant sorting matches what the server stores.
export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await authComponent.safeGetAuthUser(ctx);
    return {
      userId: identity.subject,
      name: user?.name || user?.email || "You",
      email: user?.email || "",
    };
  },
});

// Everyone except me — the directory to start a chat with.
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const all = await ctx.db.query("profiles").collect();
    return all
      .filter((p) => p.userId !== identity.subject)
      .map((p) => ({ userId: p.userId, name: p.name, email: p.email }));
  },
});

// A user's public key, for encrypting messages to them.
export const getPublicKey = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const p = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return p?.spki ?? null;
  },
});
