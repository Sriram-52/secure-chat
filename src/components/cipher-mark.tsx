// The Cipher mark: a chat bubble with a keyhole — secure messaging in one glyph.
// Uses currentColor so it can be tinted via text color.
export function CipherMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M14 17 h36 a6 6 0 0 1 6 6 v15 a6 6 0 0 1 -6 6 H29 l-10 8 v-8 h-5 a6 6 0 0 1 -6 -6 V23 a6 6 0 0 1 6 -6 z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="29" r="4" fill="currentColor" />
      <path d="M30.4 30 h3.2 l1.1 8 h-5.4 z" fill="currentColor" />
    </svg>
  );
}
