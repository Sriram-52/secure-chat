"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 256 262" aria-hidden>
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading("email");
    const cb = {
      onError: (ctx: { error: { message: string } }) => {
        setError(ctx.error.message);
        setLoading(null);
      },
      onSuccess: () => setLoading(null),
    };
    if (mode === "signup") {
      await authClient.signUp.email(
        { name: name || email.split("@")[0], email, password },
        cb,
      );
    } else {
      await authClient.signIn.email({ email, password }, cb);
    }
  };

  const social = async (provider: "github" | "google") => {
    setError(null);
    setLoading(provider);
    await authClient.signIn.social(
      { provider },
      {
        onError: (ctx: { error: { message: string } }) => {
          setError(ctx.error.message);
          setLoading(null);
        },
      },
    );
  };

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="rise w-full max-w-[26rem]">
        {/* Brand */}
        <div className="mb-9 text-center">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-bright)] bg-[var(--surface-2)] shadow-[0_0_40px_-12px_var(--accent)]">
            <LockGlyph />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight">
            Cipher
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            End-to-end encrypted chat. Your keys are made in this browser —
            <span className="text-[var(--text)]">
              {" "}
              the server only ever sees ciphertext.
            </span>
          </p>
        </div>

        <div className="surface rounded-[18px] p-6 shadow-2xl">
          {/* OAuth */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className="btn btn-ghost"
              disabled={loading !== null}
              onClick={() => social("github")}
            >
              <GithubIcon /> GitHub
            </button>
            <button
              className="btn btn-ghost"
              disabled={loading !== null}
              onClick={() => social("google")}
            >
              <GoogleIcon /> Google
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="tag">or with email</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <form onSubmit={submit} className="grid gap-3">
            {mode === "signup" && (
              <input
                className="field"
                placeholder="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            )}
            <input
              className="field"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />

            {error && (
              <p className="mono text-xs leading-relaxed text-[var(--danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-1"
              disabled={loading !== null}
            >
              {loading === "email"
                ? "Encrypting…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <button
            className="mt-4 w-full text-center text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
          >
            {mode === "signin"
              ? "No account yet? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="mono mt-6 text-center text-[0.65rem] leading-relaxed tracking-wider text-[var(--faint)]">
          RSA-OAEP-2048 · AES-GCM-256 · keys never leave your device
        </p>
      </div>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 10V7a6 6 0 1 1 12 0v3"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="3"
        stroke="var(--accent)"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="15" r="1.6" fill="var(--accent)" />
    </svg>
  );
}
