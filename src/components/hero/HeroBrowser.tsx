"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, Rows3, Heart, Check, ArrowUpRight } from "lucide-react";
import HeroCard from "@/components/hero/HeroCard";
import { EmptyState } from "@/components/ui/primitives";
import { useFavourites } from "@/lib/use-favourites";
import { createStoredStore, useStoredStore } from "@/lib/store";
import { heroes, ROLES, LANES, type Role, type Lane, type Hero } from "@/data";

type SortKey = "name" | "release" | "difficulty" | "lane";
type ViewMode = "grid" | "compact";

const SORTS: { key: SortKey; label: string }[] = [
    { key: "name", label: "A–Z" },
    { key: "release", label: "Newest" },
    { key: "difficulty", label: "Difficulty" },
    { key: "lane", label: "Lane" },
];

const viewStore = createStoredStore<ViewMode>("mlbb-codex:hero-view", "grid", (raw) => {
    const value = raw.replace(/"/g, "");
    return value === "grid" || value === "compact" ? value : null;
});

function toggleValue<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function HeroBrowser() {
    const [query, setQuery] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [lanes, setLanes] = useState<Lane[]>([]);
    const [favouritesOnly, setFavouritesOnly] = useState(false);
    const [sort, setSort] = useState<SortKey>("name");
    const view = useStoredStore(viewStore);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const { favourites, ready } = useFavourites();
    const deferredQuery = useDeferredValue(query);

    useEffect(() => {
        document.body.style.overflow = filtersOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filtersOpen]);

    const results = useMemo(() => {
        const q = deferredQuery.trim().toLowerCase();
        let list: Hero[] = heroes.filter((hero) => {
            if (roles.length && !hero.roles.some((role) => roles.includes(role))) return false;
            if (lanes.length && !hero.lanes.some((lane) => lanes.includes(lane))) return false;
            if (favouritesOnly && !favourites.includes(hero.slug)) return false;
            if (!q) return true;
            const haystack = [
                hero.name,
                hero.title ?? "",
                ...hero.roles,
                ...hero.lanes,
                ...hero.specialties,
                hero.damageType ?? "",
                hero.attackType ?? "",
                hero.region ?? "",
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });

        list = [...list].sort((a, b) => {
            switch (sort) {
                case "release":
                    return (b.releaseYear ?? 0) - (a.releaseYear ?? 0) || a.name.localeCompare(b.name);
                case "difficulty":
                    return (b.ratings.difficulty ?? 0) - (a.ratings.difficulty ?? 0) || a.name.localeCompare(b.name);
                case "lane":
                    return (a.lanes[0] ?? "").localeCompare(b.lanes[0] ?? "") || a.name.localeCompare(b.name);
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return list;
    }, [deferredQuery, roles, lanes, favouritesOnly, favourites, sort]);

    const activeFilterCount = roles.length + lanes.length + (favouritesOnly ? 1 : 0);
    const hasFilters = activeFilterCount > 0 || query.trim().length > 0;

    function clearAll() {
        setRoles([]);
        setLanes([]);
        setFavouritesOnly(false);
        setQuery("");
    }

    const filterPanel = (
        <div className="space-y-7">
            <div>
                <div className="eyebrow mb-3">Role</div>
                <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((role) => {
                        const active = roles.includes(role);
                        return (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setRoles((value) => toggleValue(value, role))}
                                aria-pressed={active}
                                data-active={active}
                                className="tag"
                            >
                                {active && <Check size={10} aria-hidden="true" />}
                                {role}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="eyebrow mb-3">Lane</div>
                <div className="flex flex-wrap gap-1.5">
                    {LANES.map((lane) => {
                        const active = lanes.includes(lane);
                        return (
                            <button
                                key={lane}
                                type="button"
                                onClick={() => setLanes((value) => toggleValue(value, lane))}
                                aria-pressed={active}
                                data-active={active}
                                className="tag"
                            >
                                {active && <Check size={10} aria-hidden="true" />}
                                {lane}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="eyebrow mb-3">Collection</div>
                <button
                    type="button"
                    onClick={() => setFavouritesOnly((value) => !value)}
                    aria-pressed={favouritesOnly}
                    data-active={favouritesOnly}
                    disabled={!ready}
                    className="tag disabled:opacity-50"
                >
                    <Heart size={11} fill={favouritesOnly ? "currentColor" : "none"} aria-hidden="true" />
                    Favourites only
                    {ready && favourites.length > 0 && <span className="opacity-70">{favourites.length}</span>}
                </button>
            </div>

            <div>
                <div className="eyebrow mb-3">Sort by</div>
                <div className="flex flex-wrap gap-1.5">
                    {SORTS.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setSort(option.key)}
                            aria-pressed={sort === option.key}
                            data-active={sort === option.key}
                            className="tag"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeFilterCount > 0 && (
                <button
                    type="button"
                    onClick={clearAll}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-strong"
                >
                    Reset filters
                </button>
            )}
        </div>
    );

    return (
        <div>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-0 top-0 grid h-full w-11 place-items-center border-r border-line text-faint" aria-hidden="true">
                        <Search size={15} />
                    </span>
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="search"
                        placeholder="Search heroes"
                        aria-label="Search heroes"
                        className="field pl-14"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="absolute right-0 top-0 grid h-full w-11 place-items-center text-faint transition-colors hover:text-fg"
                        >
                            <X size={15} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="btn btn-ghost h-11 gap-2 px-4 lg:hidden"
                    >
                        <SlidersHorizontal size={14} aria-hidden="true" />
                        Filters
                        {activeFilterCount > 0 && <span className="text-accent">{activeFilterCount}</span>}
                    </button>

                    <div className="flex h-11 items-stretch border border-line bg-elevated">
                        <button
                            type="button"
                            onClick={() => viewStore.write("grid")}
                            aria-pressed={view === "grid"}
                            aria-label="Grid view"
                            className={`grid w-11 place-items-center border-r border-line transition-colors ${
                                view === "grid" ? "bg-subtle text-accent" : "text-faint hover:text-fg"
                            }`}
                        >
                            <LayoutGrid size={15} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => viewStore.write("compact")}
                            aria-pressed={view === "compact"}
                            aria-label="Compact view"
                            className={`grid w-11 place-items-center transition-colors ${
                                view === "compact" ? "bg-subtle text-accent" : "text-faint hover:text-fg"
                            }`}
                        >
                            <Rows3 size={15} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-10">
                <aside className="hidden w-52 shrink-0 lg:block">
                    <div className="sticky top-24 border-t border-line pt-6">{filterPanel}</div>
                </aside>

                <div className="min-w-0 flex-1">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                        <p className="flex items-baseline gap-2.5" aria-live="polite">
                            <span className="display text-3xl leading-none">{results.length}</span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                                of {heroes.length} heroes
                            </span>
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {results.length === 0 ? (
                        <EmptyState
                            title="No heroes match"
                            description="Try removing a filter or searching for a different name."
                            action={
                                <button type="button" onClick={clearAll} className="btn btn-ghost">
                                    Clear filters
                                </button>
                            }
                        />
                    ) : view === "grid" ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                            {results.map((hero, index) => (
                                <HeroCard key={hero.slug} hero={hero} priority={index < 4} />
                            ))}
                        </div>
                    ) : (
                        <ul className="border-t border-line">
                            {results.map((hero) => (
                                <CompactRow key={hero.slug} hero={hero} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {filtersOpen && (
                <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setFiltersOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <div className="absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto border-t border-line-strong bg-bg p-5 pb-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="display text-2xl">Filters</h2>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                aria-label="Close filters"
                                className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-fg"
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </div>
                        {filterPanel}
                        <button
                            type="button"
                            onClick={() => setFiltersOpen(false)}
                            className="btn btn-primary mt-9 w-full"
                        >
                            Show {results.length} heroes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function CompactRow({ hero }: { hero: Hero }) {
    const { isFavourite, toggle, ready } = useFavourites();
    const favourite = ready && isFavourite(hero.slug);
    return (
        <li className="border-b border-line">
            <div className="group flex items-center gap-4 transition-colors hover:bg-elevated">
                <a href={`/hero/${hero.slug}`} className="flex min-w-0 flex-1 items-center gap-4 px-1 py-2.5">
                    <div className="h-14 w-9 shrink-0 overflow-hidden border border-line bg-subtle">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={hero.portrait ?? ""} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                    </div>
                    <span className="min-w-0 flex-1">
                        <span className="display block truncate text-xl leading-none transition-colors group-hover:text-accent">
                            {hero.name}
                        </span>
                        <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                            {[...hero.roles, ...hero.lanes].join(" / ")}
                        </span>
                    </span>
                    <span className="hidden w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:block">
                        {hero.damageType ?? "—"}
                    </span>
                    <span className="hidden w-12 shrink-0 font-mono text-[10px] text-faint md:block">
                        {hero.releaseYear ?? "—"}
                    </span>
                    <ArrowUpRight
                        size={15}
                        className="mr-2 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                    />
                </a>
                <button
                    type="button"
                    onClick={() => toggle(hero.slug)}
                    aria-pressed={favourite}
                    aria-label={`${favourite ? "Remove" : "Add"} ${hero.name} ${favourite ? "from" : "to"} favourites`}
                    className={`mr-1 grid h-8 w-8 shrink-0 place-items-center border transition-colors ${
                        favourite ? "border-accent text-accent" : "border-transparent text-faint hover:text-fg"
                    }`}
                >
                    <Heart size={14} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
                </button>
            </div>
        </li>
    );
}
