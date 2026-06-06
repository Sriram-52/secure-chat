import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Mounts Better Auth's HTTP routes (sign-in, OAuth callbacks, etc.).
authComponent.registerRoutes(http, createAuth);

export default http;
