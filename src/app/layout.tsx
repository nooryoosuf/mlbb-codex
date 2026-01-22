import type { Metadata } from "next";
import { Oswald, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HERO CODEX // MLBB",
  description: "Tactical Hero Database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
        <div className="scanlines" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
