# Cipher — end-to-end encrypted chat

A 1:1 messaging app where **the server only ever sees ciphertext**. Keys are
generated in the browser, messages are encrypted before they leave, and the
backend stores nothing it can read.

**Stack:** Next.js (App Router, React 19) · Convex (reactive realtime DB) ·
Better Auth (email/password + Google + GitHub) · Web Crypto API · deployed on
Vercel + Convex Cloud.

> A ground-up rewrite of an earlier version (React/Vite + NestJS + Stream Chat +
> Firebase). The rebuild collapses four services into two managed ones and makes
> the encryption — not the plumbing — the center of the app.

## How the encryption works

The interesting part isn't "it uses RSA." It's the **hybrid scheme**, which is
what real end-to-end encryption actually does, and why.

**Why not just RSA?** RSA-OAEP can only encrypt ~190 bytes — it physically can't
encrypt a real message. So RSA protects only a small symmetric key, and a
symmetric cipher does the bulk work:

1. Each browser generates an **RSA-OAEP-2048** keypair on first sign-in. The
   private key is created **non-extractable** and stored as a `CryptoKey` in
   **IndexedDB** — never serialized, never sent. Only the **public** key (SPKI)
   is uploaded.
2. To send, the browser generates a fresh random **AES-GCM-256** key, encrypts
   the body with it, then **wraps (RSA-encrypts) that AES key once per
   participant** with their public key.
3. The server stores only: ciphertext, IV, and the two wrapped keys.
4. To read, a participant unwraps *their* copy of the AES key with their private
   key, then decrypts the body.

Because the AES key is wrapped for **both** participants (including the sender),
either side can read the history — which solves the classic "the sender can't
decrypt their own sent messages" problem without storing the plaintext twice.

**See it yourself:** every message bubble has a *show ciphertext* toggle that
reveals exactly what's stored server-side. The Convex dashboard shows the same —
rows of base64 gibberish.

### Honest limitations

This is a portfolio demo, not Signal:

- **Keys are per-browser.** A new device gets a new keypair and can't read old
  history. Real apps solve this with encrypted key backup / cross-device sync.
- **No forward secrecy or sender authentication.** Production would add ephemeral
  keys (e.g. the Signal double-ratchet) and message signing.
- **Public-key delivery is trusted.** Clients trust the server to serve the right
  public key; a full threat model needs key verification (safety numbers).

## Architecture

- `convex/` — schema + functions. `messages`/`conversations` store ciphertext
  only; `profiles` holds each user's public key + display info. Auth tables are
  owned by the Better Auth Convex component. Realtime is automatic (Convex
  queries are reactive — no WebSocket code).
- `src/lib/crypto.ts` — the entire crypto layer (keygen, IndexedDB persistence,
  hybrid encrypt/decrypt) on the Web Crypto API, zero dependencies.
- `src/components/` — sign-in, user directory, conversation.

## Run it locally

```bash
pnpm install
npx convex dev      # provisions a dev deployment + generates types, leave running
pnpm dev            # http://localhost:3000
```

In the Convex deployment, set `BETTER_AUTH_SECRET` and `SITE_URL`
(`http://localhost:3000`). Google/GitHub sign-in also need their OAuth client
id/secret set in Convex. The frontend reads `NEXT_PUBLIC_CONVEX_URL` /
`NEXT_PUBLIC_CONVEX_SITE_URL` from `.env.local` (written by `convex dev`).
