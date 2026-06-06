import { ImageResponse } from "next/og";

export const alt = "Cipher — end-to-end encrypted chat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card: Cipher mark + name + tagline on the ink-black theme.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070908",
          backgroundImage:
            "radial-gradient(900px 500px at 50% -10%, rgba(124,255,166,0.16), transparent)",
          color: "#e9efeb",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#0f1413" />
          <path
            d="M14 17 h36 a6 6 0 0 1 6 6 v15 a6 6 0 0 1 -6 6 H29 l-10 8 v-8 h-5 a6 6 0 0 1 -6 -6 V23 a6 6 0 0 1 6 -6 z"
            fill="none"
            stroke="#7cffa6"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="29" r="4" fill="#7cffa6" />
          <path d="M30.4 30 h3.2 l1.1 8 h-5.4 z" fill="#7cffa6" />
        </svg>
        <div
          style={{
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -3,
            marginTop: 28,
          }}
        >
          Cipher
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#9aa6a0",
            maxWidth: 820,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          End-to-end encrypted chat — the server only ever sees ciphertext
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#36c97a",
            letterSpacing: 6,
            marginTop: 26,
          }}
        >
          RSA-OAEP · AES-GCM · WEB CRYPTO
        </div>
      </div>
    ),
    { ...size },
  );
}
