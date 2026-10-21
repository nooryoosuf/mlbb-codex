"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { createStoredStore, useStoredStore } from "@/lib/store";
import { Search, SlidersHorizontal, X, LayoutGrid, Rows3, Heart, Check } from "lucide-react";
import HeroCard from "@/components/hero/HeroCard";
import { EmptyState } from "@/components/ui/primitives";
import { useFavourites } from "@/lib/use-favourites";
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
        setQuery("");
        setRoles([]);
        setLanes([]);
        setFavouritesOnly(false);
    }

    const filterPanel = (
        <div className="space-y-7">
            <div>
                <div className="eyebrow mb-3">Role</div>
                <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => {
                        const active = roles.includes(role);
                        return (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setRoles((value) => toggleValue(value, role))}
                                aria-pressed={active}
                                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${active
                                        ? "border-accent bg-accent-soft text-accent"
                                        : "border-line text-muted hover:border-line-strong hover:text-fg"
                                    }`}
                            >
                                {active && <Check size={11} aria-hidden="true" />}
                                {role}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="eyebrow mb-3">Lane</div>
                <div className="flex flex-wrap gap-2">
                    {LANES.map((lane) => {
                        const active = lanes.includes(lane);
                        return (
                            <button
                                key={lane}
                                type="button"
                                onClick={() => setLanes((value) => toggleValue(value, lane))}
                                aria-pressed={active}
                                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${active
                                        ? "border-accent bg-accent-soft text-accent"
                                        : "border-line text-muted hover:border-line-strong hover:text-fg"
                                    }`}
                            >
                                {active && <Check size={11} aria-hidden="true" />}
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
                    disabled={!ready}
                    className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors disabled:opacity-50 ${favouritesOnly
                            ? "border-accent bg-accent-soft text-accent"
                            : "border-line text-muted hover:border-line-strong hover:text-fg"
                        }`}
                >
                    <Heart size={12} fill={favouritesOnly ? "currentColor" : "none"} aria-hidden="true" />
                    Favourites only
                    {ready && favourites.length > 0 && <span className="font-mono text-[10px]">{favourites.length}</span>}
                </button>
            </div>

            <div>
                <div className="eyebrow mb-3">Sort by</div>
                <div className="flex flex-wrap gap-2">
                    {SORTS.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setSort(option.key)}
                            aria-pressed={sort === option.key}
                            className={`h-8 rounded-full border px-3 text-xs font-medium transition-colors ${sort === option.key
                                    ? "border-accent bg-accent-soft text-accent"
                                    : "border-line text-muted hover:border-line-strong hover:text-fg"
                                }`}
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
                    className="text-xs font-medium text-accent underline-offset-4 hover:underline"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="search"
                        placeholder="Search by name, role, lane, specialty…"
                        aria-label="Search heroes"
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

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-elevated px-3 text-sm font-medium text-fg lg:hidden"
                    >
                        <SlidersHorizontal size={15} aria-hidden="true" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-accent-contrast">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <div className="flex h-11 items-center rounded-md border border-line bg-elevated p-1">
                        <button
                            type="button"
                            onClick={() => viewStore.write("grid")}
                            aria-pressed={view === "grid"}
                            aria-label="Grid view"
                            className={`grid h-8 w-8 place-items-center rounded transition-colors ${view === "grid" ? "bg-subtle text-fg" : "text-faint hover:text-fg"}`}
                        >
                            <LayoutGrid size={15} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => viewStore.write("compact")}
                            aria-pressed={view === "compact"}
                            aria-label="Compact view"
                            className={`grid h-8 w-8 place-items-center rounded transition-colors ${view === "compact" ? "bg-subtle text-fg" : "text-faint hover:text-fg"}`}
                        >
                            <Rows3 size={15} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                <aside className="hidden w-56 shrink-0 lg:block">
                    <div className="sticky top-24">{filterPanel}</div>
                </aside>

                <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted" aria-live="polite">
                            <span className="font-mono text-fg">{results.length}</span> of {heroes.length} heroes
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-xs font-medium text-muted underline-offset-4 hover:text-fg hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {results.length === 0 ? (
                        <EmptyState
                            title="No heroes match"
                            description="Try removing a filter or searching for a different name."
                            action={
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="inline-flex h-9 items-center rounded-md border border-line-strong px-3 text-sm font-medium text-fg hover:bg-subtle"
                                >
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
                        <ul className="divide-y divide-line overflow-hidden rounded-card border border-line">
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-line-strong bg-elevated p-5 pb-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-display text-xl">Filters</h2>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                aria-label="Close filters"
                                className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-subtle hover:text-fg"
                            >
                                <X size={17} aria-hidden="true" />
                            </button>
                        </div>
                        {filterPanel}
                        <button
                            type="button"
                            onClick={() => setFiltersOpen(false)}
                            className="mt-8 h-11 w-full rounded-md bg-accent text-sm font-semibold text-accent-contrast"
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
        <li className="flex items-center gap-3 bg-elevated px-3 py-2.5 transition-colors hover:bg-subtle">
            <a href={`/hero/${hero.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded border border-line bg-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={hero.portrait ?? ""}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </div>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{hero.name}</span>
                    <span className="block truncate text-xs text-faint">
                        {[...hero.roles, ...hero.lanes].join(" · ")}
                    </span>
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-faint sm:block">
                    {hero.damageType ?? "—"}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-faint md:block">
                    {hero.releaseYear ?? "—"}
                </span>
            </a>
            <button
                type="button"
                onClick={() => toggle(hero.slug)}
                aria-pressed={favourite}
                aria-label={`${favourite ? "Remove" : "Add"} ${hero.name} ${favourite ? "from" : "to"} favourites`}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded transition-colors ${favourite ? "text-accent" : "text-faint hover:text-fg"}`}
            >
                <Heart size={14} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
            </button>
        </li>
    );
}
