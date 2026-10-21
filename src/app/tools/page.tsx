import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Tools",
    description: "Compare heroes, explore counters, keep a favourites shortlist, and draw a random pick.",
    alternates: { canonical: "/tools" },
};

const TOOLS = [
    {
        href: "/tools/compare",
        title: "Compare heroes",
        description: "Put two heroes side by side across base stats, abilities and matchups.",
    },
    {
        href: "/tools/counters",
        title: "Counter explorer",
        description: "See strong and weak matchups plus synergy partners for any hero.",
    },
    {
        href: "/tools/random",
        title: "Random picker",
        description: "Draw a hero, optionally filtered by role and lane.",
    },
    {
        href: "/tools/favourites",
        title: "Favourites",
        description: "Your saved shortlist, stored locally in this browser.",
    },
];

export default function ToolsPage() {
    return (
        <>
            <PageHeader
                index="04"
                eyebrow="Toolkit"
                title="Plan before you queue"
                description="Practical helpers built on the same verified dataset."
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="border-t border-line">
                    {TOOLS.map((tool, index) => (
                        <Reveal key={tool.href} delay={index * 0.05}>
                            <Link
                                href={tool.href}
                                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-6 transition-colors hover:bg-elevated sm:grid-cols-[4rem_18rem_1fr_auto] sm:gap-6"
                            >
                                <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-accent">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="display text-3xl transition-colors group-hover:text-accent sm:text-4xl">
                                    {tool.title}
                                </span>
                                <span className="col-span-2 text-sm leading-relaxed text-muted sm:col-span-1">
                                    {tool.description}
                                </span>
                                <ArrowUpRight
                                    size={20}
                                    className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </>
    );
}
