import "./globals.css";
import type { Metadata } from "next";
import {
  Instrument_Serif,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { getToken } from "@/lib/auth-server";

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  style: ["normal", "italic"],
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const description =
  "A messaging demo where the server only ever sees ciphertext. Keys are generated in your browser; messages are encrypted before they leave.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cipher.codebyram.dev"),
  title: "Cipher — end-to-end encrypted chat",
  description,
  openGraph: {
    title: "Cipher — end-to-end encrypted chat",
    description,
    url: "https://cipher.codebyram.dev",
    siteName: "Cipher",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cipher — end-to-end encrypted chat",
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${hanken.variable} ${jetbrains.variable}`}
    >
      <body>
        <ConvexClientProvider initialToken={token}>
          <div id="app-root">{children}</div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
