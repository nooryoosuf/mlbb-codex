"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { heroes } from "@/data";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";

export default function HeroQuickSearch() {
    const [query, setQuery] = useState("");
    const deferred = useDeferredValue(query);

    const matches = useMemo(() => {
        const q = deferred.trim().toLowerCase();
        if (!q) return [];
        return heroes
            .filter((hero) => {
                const haystack = [hero.name, hero.title ?? "", ...hero.roles, ...hero.lanes, ...hero.specialties]
                    .join(" ")
                    .toLowerCase();
                return haystack.includes(q);
            })
            .slice(0, 8);
    }, [deferred]);

    return (
        <div className="relative z-20">
            <div className="relative flex items-stretch border border-line-strong bg-elevated transition-colors focus-within:border-accent">
                <span className="grid w-12 shrink-0 place-items-center border-r border-line text-accent" aria-hidden="true">
                    <Search size={17} />
                </span>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder="Search heroes, roles, lanes"
                    aria-label="Quick hero search"
                    className="h-14 w-full bg-transparent px-4 text-base text-fg outline-none placeholder:font-mono placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.18em] placeholder:text-faint sm:text-lg"
                />
                {query ? (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="grid w-12 shrink-0 place-items-center text-faint transition-colors hover:text-fg"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                ) : (
                    <span className="hidden shrink-0 items-center pr-4 font-mono text-[9px] uppercase tracking-[0.2em] text-faint sm:flex">
                        Type to filter
                    </span>
                )}
            </div>

            {deferred.trim() && (
                <div className="absolute inset-x-0 top-[calc(100%+2px)] overflow-hidden border border-line-strong bg-elevated shadow-panel clip-notch">
                    {matches.length === 0 ? (
                        <p className="px-5 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                            No heroes match &ldquo;{deferred}&rdquo;
                        </p>
                    ) : (
                        <ul className="max-h-[22rem] overflow-y-auto">
                            {matches.map((hero) => (
                                <li key={hero.slug} className="border-b border-line last:border-b-0">
                                    <Link
                                        href={`/hero/${hero.slug}`}
                                        onClick={() => setQuery("")}
                                        className="group flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-subtle"
                                    >
                                        <div className="h-12 w-8 shrink-0 border border-line">
                                            <SmartImage
                                                image={heroPortrait(hero)}
                                                alt=""
                                                name={hero.name}
                                                sizes="32px"
                                            />
                                        </div>
                                        <span className="min-w-0 flex-1">
                                            <span className="display block truncate text-lg leading-none transition-colors group-hover:text-accent">
                                                {hero.name}
                                            </span>
                                            <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                {[...hero.roles, ...hero.lanes].join(" / ")}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            size={14}
                                            className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-accent"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
