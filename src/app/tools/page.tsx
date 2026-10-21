import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Crosshair, Swords, Wand2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Tools",
    description: "Compare heroes, explore counters, keep a favourites shortlist, and draw a random pick.",
    alternates: { canonical: "/tools" },
};

const TOOLS = [
    {
        href: "/tools/compare",
        title: "Compare heroes",
        description: "Put two heroes side by side across base stats, abilities, and matchups.",
        icon: Swords,
    },
    {
        href: "/tools/counters",
        title: "Counter explorer",
        description: "See strong and weak matchups plus synergy partners for any hero.",
        icon: Crosshair,
    },
    {
        href: "/tools/favourites",
        title: "Favourites",
        description: "Your saved shortlist, stored locally in this browser.",
        icon: Heart,
    },
    {
        href: "/tools/random",
        title: "Random picker",
        description: "Draw a hero, optionally filtered by role and lane.",
        icon: Wand2,
    },
];

export default function ToolsPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 max-w-2xl">
                <div className="eyebrow mb-3">Toolkit</div>
                <h1 className="font-display text-4xl leading-tight sm:text-5xl">Tools</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    Practical helpers built on the same verified hero dataset.
                </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex items-start gap-4 rounded-panel border border-line bg-elevated p-6 transition-colors hover:border-line-strong"
                    >
                        <tool.icon size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                            <h2 className="font-display text-2xl">{tool.title}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted">{tool.description}</p>
                        </div>
                        <ArrowRight size={16} className="mt-1 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
