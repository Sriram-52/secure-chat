// End-to-end encryption, entirely in the browser.
//
// Scheme (hybrid): each message gets a fresh random AES-GCM-256 key that
// encrypts the plaintext. That AES key is then "wrapped" (RSA-OAEP encrypted)
// once per participant with their RSA public key. So either side — including
// the sender — can unwrap their own copy of the key and read the message,
// while the server only ever stores ciphertext + wrapped keys.
//
// Why hybrid instead of plain RSA: RSA-OAEP can only encrypt ~190 bytes, so it
// can't encrypt a real message directly. We use it only to protect the small
// AES key; AES-GCM handles the arbitrarily long message body.
//
// The RSA private key is generated non-extractable and stored as a CryptoKey
// in IndexedDB — it is never serialized and never leaves the browser.

const DB_NAME = "secure-chat";
const STORE = "keys";
const KEYPAIR_ID = "rsa-keypair";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// Returns the device keypair, generating + persisting it on first use. The
// public key is always extractable (so we can publish its SPKI); the private
// key is non-extractable and lives only in IndexedDB.
export async function getOrCreateKeyPair(): Promise<CryptoKeyPair> {
  const existing = await idbGet<CryptoKeyPair>(KEYPAIR_ID);
  if (existing) return existing;
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    false,
    ["encrypt", "decrypt"],
  );
  await idbSet(KEYPAIR_ID, pair);
  return pair;
}

export async function exportPublicKey(pair: CryptoKeyPair): Promise<string> {
  return bufToB64(await crypto.subtle.exportKey("spki", pair.publicKey));
}

async function importPublicKey(spki: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "spki",
    b64ToBuf(spki),
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"],
  );
}

export type Envelope = {
  iv: string;
  ciphertext: string;
  wrappedKeyForA: string;
  wrappedKeyForB: string;
};

// Encrypt for a sorted participant pair (A <= B). spkiA/spkiB are the SPKI
// public keys of participantA and participantB respectively.
export async function encryptMessage(
  plaintext: string,
  spkiA: string,
  spkiB: string,
): Promise<Envelope> {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(plaintext),
  );
  const rawAes = await crypto.subtle.exportKey("raw", aesKey);
  const [pubA, pubB] = await Promise.all([
    importPublicKey(spkiA),
    importPublicKey(spkiB),
  ]);
  const [wrappedA, wrappedB] = await Promise.all([
    crypto.subtle.encrypt({ name: "RSA-OAEP" }, pubA, rawAes),
    crypto.subtle.encrypt({ name: "RSA-OAEP" }, pubB, rawAes),
  ]);
  return {
    iv: bufToB64(iv.buffer),
    ciphertext: bufToB64(ciphertext),
    wrappedKeyForA: bufToB64(wrappedA),
    wrappedKeyForB: bufToB64(wrappedB),
  };
}

// Decrypt using my private key and the wrapped key for my slot (A or B).
export async function decryptMessage(
  env: { iv: string; ciphertext: string; wrappedKey: string },
  privateKey: CryptoKey,
): Promise<string> {
  const rawAes = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    b64ToBuf(env.wrappedKey),
  );
  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAes,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(b64ToBuf(env.iv)) },
    aesKey,
    b64ToBuf(env.ciphertext),
  );
  return new TextDecoder().decode(plaintext);
}
