"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getOrCreateKeyPair, exportPublicKey } from "@/lib/crypto";

export type Keys = { keyPair: CryptoKeyPair; spki: string };

// Ensures this browser has an RSA keypair (generating it on first run) and
// publishes the public key to the server. The private key never leaves here.
export function useKeys(enabled: boolean): Keys | null {
  const registerKey = useMutation(api.profiles.registerKey);
  const [keys, setKeys] = useState<Keys | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      const keyPair = await getOrCreateKeyPair();
      const spki = await exportPublicKey(keyPair);
      if (cancelled) return;
      setKeys({ keyPair, spki });
      await registerKey({ spki });
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, registerKey]);

  return keys;
}
