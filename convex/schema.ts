import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The Better Auth component owns the auth tables (users/sessions/accounts).
// These are our app tables. The server only ever stores ciphertext + public keys.
export default defineSchema({
  // One row per user, written on first login after the keypair is generated.
  // Doubles as the directory for the "pick someone to chat with" list.
  profiles: defineTable({
    userId: v.string(), // Better Auth user id (identity.subject)
    name: v.string(),
    email: v.string(),
    spki: v.string(), // base64 SPKI of the user's RSA public key
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // 1:1 conversation. Participants are stored sorted (A <= B) so a pair maps
  // to exactly one conversation regardless of who starts it.
  conversations: defineTable({
    participantA: v.string(),
    participantB: v.string(),
    createdAt: v.number(),
  }).index("by_participants", ["participantA", "participantB"]),

  // Ciphertext only. The AES key is wrapped once per participant with their RSA
  // public key, so either side (including the sender) can unwrap their own slot.
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    iv: v.string(),
    ciphertext: v.string(),
    wrappedKeyForA: v.string(),
    wrappedKeyForB: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId", "createdAt"]),
});
