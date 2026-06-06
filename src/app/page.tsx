"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AuthScreen } from "@/components/auth-screen";
import { ChatApp } from "@/components/chat-app";

export default function Home() {
  return (
    <>
      <AuthLoading>
        <div className="grid min-h-dvh place-items-center">
          <div className="flex items-center gap-3 text-[var(--muted)]">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="mono text-xs tracking-widest uppercase">
              establishing secure channel
            </span>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>
      <Authenticated>
        <ChatApp />
      </Authenticated>
    </>
  );
}
