import type { Metadata } from "next";
import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const display = Instrument_Serif({
    variable: "--font-display",
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const ui = Manrope({
    variable: "--font-ui",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const mono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "MLBB Codex — Know every hero. Master every match.",
        template: "%s · MLBB Codex",
    },
    description:
        "A complete Mobile Legends: Bang Bang hero codex with verified stats, skills, skins, matchups, items, and build tools.",
    keywords: ["Mobile Legends", "MLBB", "hero database", "builds", "emblems", "counters"],
    openGraph: {
        type: "website",
        siteName: "MLBB Codex",
        title: "MLBB Codex — Know every hero. Master every match.",
        description:
            "Verified stats, skills, skins, and matchups for every Mobile Legends hero.",
        url: siteUrl,
    },
    twitter: {
        card: "summary_large_image",
        title: "MLBB Codex",
        description: "Verified stats, skills, skins, and matchups for every Mobile Legends hero.",
    },
    alternates: { canonical: "/" },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${display.variable} ${ui.variable} ${mono.variable}`}>
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-contrast"
                >
                    Skip to content
                </a>
                <SiteHeader />
                <main id="main" className="min-h-[70dvh]">
                    {children}
                </main>
                <SiteFooter />
            </body>
        </html>
    );
}
