import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL;

export const authComponent = createClient<DataModel>(components.betterAuth);

// Only enable a social provider when its credentials are present, so the demo
// works with email/password alone before any OAuth apps are registered.
function socialProviders(): BetterAuthOptions["socialProviders"] {
  const providers: NonNullable<BetterAuthOptions["socialProviders"]> = {};
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    };
  }
  return providers;
}

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Let a user who signed up with email later link Google/GitHub, and vice versa.
    account: { accountLinking: { enabled: true, allowDifferentEmails: true } },
    emailAndPassword: { enabled: true, requireEmailVerification: false },
    socialProviders: socialProviders(),
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions);

// Used by the client AuthBoundary / provider.
export const { getAuthUser } = authComponent.clientApi();

// Current signed-in user (name/email) for the app UI.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.safeGetAuthUser(ctx),
});
