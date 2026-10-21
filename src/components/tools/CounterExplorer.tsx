"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Swords, Shield, Sparkles } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
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
            <div className="relative mb-6 max-w-md">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder="Search a hero…"
                    aria-label="Search heroes"
                    className="h-11 w-full rounded-md border border-line bg-elevated pl-9 pr-3 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
                />
                {matches.length > 0 && (
                    <ul className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-card border border-line-strong bg-elevated shadow-panel">
                        {matches.map((hero) => (
                            <li key={hero.slug}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelected(hero);
                                        setQuery("");
                                    }}
                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-subtle"
                                >
                                    <span className="h-7 w-7 overflow-hidden rounded border border-line">
                                        <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="28px" />
                                    </span>
                                    <span className="text-sm text-fg">{hero.name}</span>
                                    <span className="ml-auto text-[11px] text-faint">{hero.roles.join(" · ")}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-8 flex items-center gap-4 rounded-panel border border-line bg-elevated p-4">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded border border-line-strong">
                    <SmartImage image={heroPortrait(selected)} alt="" name={selected.name} rounded="rounded-none" sizes="48px" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-display text-2xl">{selected.name}</h2>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {selected.roles.map((role) => <Badge key={role} tone="accent">{role}</Badge>)}
                        {selected.lanes.map((lane) => <Badge key={lane}>{lane}</Badge>)}
                    </div>
                </div>
                <Link href={`/hero/${selected.slug}`} className="shrink-0 text-xs font-medium text-accent hover:underline">
                    Open profile
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {groups.map((group) => (
                    <section key={group.key} className="rounded-panel border border-line bg-elevated p-5">
                        <h3 className={`mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${group.tone}`}>
                            <group.icon size={13} aria-hidden="true" />
                            {group.title}
                        </h3>

                        {group.slugs.length === 0 ? (
                            <p className="text-xs text-faint">No recorded matchups.</p>
                        ) : (
                            <ul className="space-y-1">
                                {group.slugs.map((slug) => {
                                    const hero = resolveHero(slug);
                                    if (!hero) return null;
                                    return (
                                        <li key={slug}>
                                            <Link
                                                href={`/hero/${hero.slug}`}
                                                className="flex items-center gap-2.5 rounded px-1 py-1.5 transition-colors hover:bg-subtle"
                                            >
                                                <span className="h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                                                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="32px" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm text-fg">{hero.name}</span>
                                                <span className="shrink-0 text-[10px] text-faint">{hero.roles[0]}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {group.note && (
                            <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-faint">
                                {group.note}
                            </p>
                        )}
                    </section>
                ))}
            </div>

            <p className="mt-6 text-xs text-faint">
                Matchups are contextual editorial notes from the data source, not official win-rate statistics.
            </p>
        </div>
    );
}
