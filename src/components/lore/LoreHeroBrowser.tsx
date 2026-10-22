"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";

export interface LoreHeroItem {
    slug: string;
    name: string;
    title: string | null;
    region: string | null;
    regionId: string | null;
    regionName: string | null;
    roles: string[];
    factions: string[];
    featured: boolean;
    species: string;
    portrait: string | null;
}

export default function LoreHeroBrowser({ items }: { items: LoreHeroItem[] }) {
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState("all");
    const [faction, setFaction] = useState("all");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    const regions = useMemo(() => {
        const map = new Map<string, string>();
        for (const item of items) {
            if (item.regionId && item.regionName) map.set(item.regionId, item.regionName);
        }
        return [...map.entries()].sort((left, right) => left[1].localeCompare(right[1]));
    }, [items]);

    const factions = useMemo(() => {
        const set = new Set<string>();
        for (const item of items) for (const name of item.factions) set.add(name);
        return [...set].sort((left, right) => left.localeCompare(right));
    }, [items]);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return items.filter((item) => {
            if (region !== "all" && item.regionId !== region) return false;
            if (faction !== "all" && !item.factions.includes(faction)) return false;
            if (featuredOnly && !item.featured) return false;
            if (!needle) return true;
            return [item.name, item.title, item.species, item.regionName, ...item.roles, ...item.factions]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(needle);
        });
    }, [items, query, region, faction, featuredOnly]);

    const hasFilters = query !== "" || region !== "all" || faction !== "all" || featuredOnly;

    return (
        <div>
            <div className="border border-line bg-elevated">
                <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
                    <label className="relative flex min-w-0 flex-1 items-center">
                        <Search size={14} className="pointer-events-none absolute left-3 text-faint" aria-hidden="true" />
                        <span className="sr-only">Search lore dossiers</span>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search by name, title, species or faction"
                            className="h-10 w-full border border-line bg-bg pl-9 pr-9 font-mono text-[11px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute right-2 grid h-6 w-6 place-items-center text-faint hover:text-fg"
                                aria-label="Clear search"
                            >
                                <X size={13} aria-hidden="true" />
                            </button>
                        )}
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Region</span>
                            <select
                                value={region}
                                onChange={(event) => setRegion(event.target.value)}
                                className="h-10 border border-line bg-bg px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted outline-none focus:border-accent"
                            >
                                <option value="all">All regions</option>
                                {regions.map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Faction</span>
                            <select
                                value={faction}
                                onChange={(event) => setFaction(event.target.value)}
                                className="h-10 max-w-[13rem] border border-line bg-bg px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted outline-none focus:border-accent"
                            >
                                <option value="all">All factions</option>
                                {factions.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button
                            type="button"
                            onClick={() => setFeaturedOnly((value) => !value)}
                            aria-pressed={featuredOnly}
                            className={`h-10 border px-3 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                                featuredOnly
                                    ? "border-accent bg-accent-soft text-accent"
                                    : "border-line text-muted hover:border-line-strong hover:text-fg"
                            }`}
                        >
                            Featured only
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                    <span>
                        <span className="text-fg">{filtered.length}</span> of {items.length} dossiers
                    </span>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setRegion("all");
                                setFaction("all");
                                setFeaturedOnly(false);
                            }}
                            className="transition-colors hover:text-accent"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="mt-10 border border-dashed border-line-strong px-6 py-16 text-center text-sm text-muted">
                    No dossier matches those filters.
                </p>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filtered.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/lore/heroes/${item.slug}`}
                            className="group flex flex-col overflow-hidden border border-line bg-elevated transition-colors hover:border-accent"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
                                <SmartImage
                                    image={heroPortrait({ portrait: item.portrait, slug: item.slug })}
                                    alt={`${item.name} portrait`}
                                    name={item.name}
                                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                                    className="h-full w-full"
                                    imgClassName="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(4,5,6,0.9)_0%,transparent_55%)]" />
                                {item.featured && (
                                    <span className="absolute left-2 top-2 border border-accent/60 bg-bg/80 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-accent backdrop-blur">
                                        Featured
                                    </span>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-2.5">
                                    <h3 className="display text-xl leading-none text-white">{item.name}</h3>
                                    <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.14em] text-white/55">
                                        {item.title ?? item.roles.join(" / ")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-2">
                                <span className="truncate font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                    {item.regionName ?? "Unplaced"}
                                </span>
                                <span className="h-px w-4 bg-accent/50 transition-all duration-300 group-hover:w-7 group-hover:bg-accent" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
