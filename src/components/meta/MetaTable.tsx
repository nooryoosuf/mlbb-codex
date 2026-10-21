"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import { heroes, meta, type MetaHero } from "@/data";

type SortKey = "winRate" | "pickRate" | "banRate" | "tierRank";
const TIER_ORDER: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
const SORTS: { key: SortKey; label: string }[] = [
    { key: "banRate", label: "Ban" },
    { key: "pickRate", label: "Pick" },
    { key: "winRate", label: "Win" },
    { key: "tierRank", label: "Tier" },
];

function value(entry: MetaHero, key: SortKey): number {
    if (key === "tierRank") return TIER_ORDER[entry.tier ?? ""] ?? 0;
    return entry[key] ?? 0;
}

export default function MetaTable() {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("banRate");
    const [tier, setTier] = useState<string>("all");
    const portraits = useMemo(() => new Map(heroes.map((hero) => [hero.slug, hero])), []);

    const rows = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return meta.heroes
            .filter((entry) => (tier === "all" ? true : entry.tier === tier))
            .filter((entry) => (needle ? entry.name.toLowerCase().includes(needle) : true))
            .sort((a, b) => value(b, sort) - value(a, sort));
    }, [query, sort, tier]);

    return (
        <div>
            <div className="flex flex-col gap-3 border border-line bg-elevated p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-xs flex-1">
                    <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Filter heroes…"
                        aria-label="Filter heroes"
                        className="field h-9 pl-8 text-xs"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Tier</span>
                    {["all", "S", "A", "B", "C", "D"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setTier(option)}
                            aria-pressed={tier === option}
                            className={`tag h-7 ${tier === option ? "border-accent bg-accent text-accent-contrast" : ""}`}
                        >
                            {option === "all" ? "All" : option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Sort</span>
                {SORTS.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() => setSort(option.key)}
                        aria-pressed={sort === option.key}
                        className={`tag h-7 ${sort === option.key ? "border-accent text-accent" : ""}`}
                    >
                        {option.label}
                    </button>
                ))}
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    {rows.length} heroes
                </span>
            </div>

            <div className="mt-3 border border-line">
                <div className="grid grid-cols-[1.5rem_1fr_3.5rem_4rem_4rem_4rem] items-center gap-2 border-b border-line bg-subtle px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-faint sm:grid-cols-[2rem_1fr_4rem_5rem_5rem_5rem]">
                    <span>#</span>
                    <span>Hero</span>
                    <span className="text-center">Tier</span>
                    <span className="text-right">Win</span>
                    <span className="text-right">Pick</span>
                    <span className="text-right">Ban</span>
                </div>

                {rows.map((entry, index) => {
                    const hero = portraits.get(entry.slug);
                    return (
                        <Link
                            key={entry.slug}
                            href={`/hero/${entry.slug}`}
                            className="group grid grid-cols-[1.5rem_1fr_3.5rem_4rem_4rem_4rem] items-center gap-2 border-b border-line px-3 py-2 transition-colors last:border-b-0 hover:bg-subtle sm:grid-cols-[2rem_1fr_4rem_5rem_5rem_5rem]"
                        >
                            <span className="font-mono text-[9px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                            <span className="flex min-w-0 items-center gap-2.5">
                                <span className="h-8 w-6 shrink-0 border border-line">
                                    {hero && <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-[13px] text-fg transition-colors group-hover:text-accent">
                                        {entry.name}
                                    </span>
                                    <span className="block truncate font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                                        {entry.lane}
                                    </span>
                                </span>
                            </span>
                            <span className="text-center">
                                <span className="inline-block border border-line-strong px-1.5 py-0.5 font-mono text-[9px] leading-none text-muted">
                                    {entry.tier ?? "—"}
                                </span>
                            </span>
                            <span className="text-right font-mono text-[11px] text-success">{entry.winRate?.toFixed(2) ?? "—"}</span>
                            <span className="text-right font-mono text-[11px] text-fg">{entry.pickRate?.toFixed(2) ?? "—"}</span>
                            <span className="text-right font-mono text-[11px] text-accent">{entry.banRate?.toFixed(2) ?? "—"}</span>
                        </Link>
                    );
                })}

                {rows.length === 0 && (
                    <p className="px-4 py-12 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                        No heroes match that filter
                    </p>
                )}
            </div>
        </div>
    );
}
