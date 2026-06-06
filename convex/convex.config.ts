import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

// Hosted-component mode: the Better Auth component ships its own schema, so we
// don't need a local betterAuth/ install or generated schema.
const app = defineApp();
app.use(betterAuth);

export default app;
