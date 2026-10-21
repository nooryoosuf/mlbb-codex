"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Swords, Shield, Sparkles } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import { heroes, resolveHero, type Hero } from "@/data";

export default function CounterExplorer() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Hero>(heroes[0]);

    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return heroes
            .filter((hero) => hero.name.toLowerCase().includes(q))
            .slice(0, 6);
    }, [query]);

    const groups = [
        { key: "strong", title: "Strong against", icon: Swords, tone: "text-success", slugs: selected.strongAgainst, note: selected.relationNotes.strong },
        { key: "weak", title: "Weak against", icon: Shield, tone: "text-danger", slugs: selected.weakAgainst, note: selected.relationNotes.weak },
        { key: "synergy", title: "Pairs well with", icon: Sparkles, tone: "text-accent", slugs: selected.synergies, note: selected.relationNotes.assist },
    ] as const;

    return (
        <div>
            <div className="relative mb-5 max-w-md">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder="Search a hero…"
                    aria-label="Search heroes"
                    className="field pl-9"
                />
                {matches.length > 0 && (
                    <ul className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-30 border border-line-strong bg-elevated">
                        {matches.map((hero) => (
                            <li key={hero.slug} className="border-b border-line last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelected(hero);
                                        setQuery("");
                                    }}
                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-subtle"
                                >
                                    <span className="h-8 w-6 shrink-0 border border-line">
                                        <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />
                                    </span>
                                    <span className="text-sm text-fg">{hero.name}</span>
                                    <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                                        {hero.roles.join(" / ")}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-5 border border-line bg-elevated p-4">
                <div className="h-24 w-16 shrink-0 border border-line-strong">
                    <SmartImage image={heroPortrait(selected)} alt="" name={selected.name} sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="eyebrow mb-1.5">Selected hero</div>
                    <h2 className="display text-3xl leading-none">{selected.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {selected.roles.map((role) => (
                            <span key={role} className="tag h-6">{role}</span>
                        ))}
                        {selected.lanes.map((lane) => (
                            <span key={lane} className="tag h-6">{lane}</span>
                        ))}
                    </div>
                </div>
                <Link href={`/hero/${selected.slug}`} className="btn btn-ghost shrink-0">
                    Open dossier
                </Link>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
                {groups.map((group) => (
                    <section key={group.key} className="border border-line bg-elevated">
                        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
                            <h3 className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] ${group.tone}`}>
                                <group.icon size={12} aria-hidden="true" />
                                {group.title}
                            </h3>
                            <span className="font-mono text-[9px] text-faint">{group.slugs.length}</span>
                        </div>

                        {group.slugs.length === 0 ? (
                            <p className="px-4 py-6 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                                No recorded matchups
                            </p>
                        ) : (
                            <ul>
                                {group.slugs.map((slug) => {
                                    const hero = resolveHero(slug);
                                    if (!hero) return null;
                                    return (
                                        <li key={slug} className="border-b border-line last:border-b-0">
                                            <Link
                                                href={`/hero/${hero.slug}`}
                                                className="group flex items-center gap-2.5 px-4 py-2 transition-colors hover:bg-subtle"
                                            >
                                                <span className="h-8 w-6 shrink-0 border border-line">
                                                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm text-fg transition-colors group-hover:text-accent">
                                                    {hero.name}
                                                </span>
                                                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                                                    {hero.roles[0]}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {group.note && (
                            <p className="border-t border-line px-4 py-3 text-[11px] leading-relaxed text-faint">
                                {group.note}
                            </p>
                        )}
                    </section>
                ))}
            </div>

            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Matchups are contextual editorial notes from the data source, not official win-rate statistics.
            </p>
        </div>
    );
}
