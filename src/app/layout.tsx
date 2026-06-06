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

export const metadata: Metadata = {
  title: "Cipher — end-to-end encrypted chat",
  description:
    "A messaging demo where the server only ever sees ciphertext. Keys are generated in your browser; messages are encrypted before they leave.",
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
