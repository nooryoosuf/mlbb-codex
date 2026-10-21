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
        <div className="relative">
            <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder="Jump to a hero — try “Fanny”, “Mage”, or “Jungle”"
                    aria-label="Quick hero search"
                    className="h-11 w-full rounded-md border border-line bg-elevated pl-9 pr-9 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-faint hover:text-fg"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                )}
            </div>

            {deferred.trim() && (
                <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-card border border-line-strong bg-elevated shadow-panel">
                    {matches.length === 0 ? (
                        <p className="px-4 py-5 text-sm text-muted">
                            No heroes match “{deferred}”.
                        </p>
                    ) : (
                        <ul className="max-h-80 overflow-y-auto p-1.5">
                            {matches.map((hero) => (
                                <li key={hero.slug}>
                                    <Link
                                        href={`/hero/${hero.slug}`}
                                        onClick={() => setQuery("")}
                                        className="flex items-center gap-3 rounded px-2.5 py-2 transition-colors hover:bg-subtle"
                                    >
                                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded border border-line">
                                            <SmartImage
                                                image={heroPortrait(hero)}
                                                alt=""
                                                name={hero.name}
                                                rounded="rounded-none"
                                                sizes="36px"
                                            />
                                        </div>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-fg">{hero.name}</span>
                                            <span className="block truncate text-xs text-faint">
                                                {[...hero.roles, ...hero.lanes].join(" · ")}
                                            </span>
                                        </span>
                                        <ArrowUpRight size={14} className="shrink-0 text-faint" aria-hidden="true" />
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
