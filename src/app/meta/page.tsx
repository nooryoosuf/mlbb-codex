import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MetaTable from "@/components/meta/MetaTable";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import { heroes, meta, type MetaHero } from "@/data";

export const metadata: Metadata = {
    title: "Live meta",
    description: "Current Mobile Legends win, pick and ban rates for every hero, plus tier ranking.",
    alternates: { canonical: "/meta" },
};

const SPOTLIGHTS = [
    { key: "banRate" as const, label: "Most banned", tone: "text-accent" },
    { key: "pickRate" as const, label: "Most picked", tone: "text-fg" },
    { key: "winRate" as const, label: "Highest win rate", tone: "text-success" },
];

export default function MetaPage() {
    const portrait = new Map(heroes.map((hero) => [hero.slug, hero]));
    const leaders = SPOTLIGHTS.map((spot) => {
        const candidates = meta.heroes.filter((entry) => entry[spot.key] !== null && (entry.pickRate ?? 0) >= 0.5);
        const best = [...candidates].sort((a, b) => (b[spot.key] ?? 0) - (a[spot.key] ?? 0))[0] as MetaHero | undefined;
        return { ...spot, hero: best };
    });

    return (
        <>
            <PageHeader
                index="01"
                eyebrow="Live ranked"
                title="Meta board"
                description="Win, pick and ban rates from ranked play, all ranks, rolling seven days. Use it to read the draft, not as a promise."
                meta={
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                        <span>Snapshot {meta.snapshot}</span>
                        <span>/</span>
                        <span>{meta.heroes.length} heroes measured</span>
                        <span>/</span>
                        <a href={meta.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                            MythicLab
                        </a>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="grid gap-3 md:grid-cols-3">
                    {leaders.map((leader) => {
                        const hero = leader.hero ? portrait.get(leader.hero.slug) : undefined;
                        return (
                            <div key={leader.label} className="border border-line bg-elevated">
                                <div className={`border-b border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] ${leader.tone}`}>
                                    {leader.label}
                                </div>
                                {leader.hero && hero ? (
                                    <Link href={`/hero/${leader.hero.slug}`} className="group flex items-center gap-4 p-4">
                                        <span className="h-24 w-16 shrink-0 border border-line-strong">
                                            <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="64px" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="display block truncate text-3xl leading-none transition-colors group-hover:text-accent">
                                                {leader.hero.name}
                                            </span>
                                            <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                {leader.hero.lane} · Tier {leader.hero.tier ?? "—"}
                                            </span>
                                            <span className={`mt-3 block font-mono text-2xl leading-none ${leader.tone}`}>
                                                {leader.hero[leader.key]?.toFixed(2)}%
                                            </span>
                                        </span>
                                        <ArrowUpRight size={15} className="shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                                    </Link>
                                ) : (
                                    <p className="p-4 text-sm text-faint">No data.</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <MetaTable />
                </div>

                <div className="mt-6 space-y-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-faint">
                    <p>{meta.source}</p>
                    <p className="normal-case tracking-normal">{meta.attribution}</p>
                    <p>
                        Tier letters follow MythicLab&apos;s power score (win rate, pick and ban pressure, pro lift). Pick rates are
                        unreliable for heroes picked under 0.5% of matches.
                    </p>
                </div>
            </div>
        </>
    );
}
