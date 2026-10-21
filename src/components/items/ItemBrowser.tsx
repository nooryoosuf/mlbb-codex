"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { EmptyState } from "@/components/ui/primitives";
import { itemIcon } from "@/lib/images";
import { items, type Item } from "@/data";

export default function ItemBrowser() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<string>("All");
    const deferred = useDeferredValue(query);

    const categories = useMemo(() => {
        const counts = new Map<string, number>();
        items.forEach((item) => {
            const key = item.category ?? "Other";
            counts.set(key, (counts.get(key) ?? 0) + 1);
        });
        return [["All", items.length] as const, ...[...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))];
    }, []);

    const results = useMemo(() => {
        const q = deferred.trim().toLowerCase();
        return items.filter((item) => {
            if (category !== "All" && (item.category ?? "Other") !== category) return false;
            if (!q) return true;
            return [item.name, item.summary, item.bonus, item.passive, item.category ?? ""]
                .join(" ")
                .toLowerCase()
                .includes(q);
        });
    }, [deferred, category]);

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
                        placeholder="Search items"
                        aria-label="Search items"
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
                <div className="flex items-center justify-between gap-3 border border-line bg-elevated px-4 sm:w-56">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Results</span>
                    <span className="display text-2xl leading-none">{results.length}</span>
                </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-1.5 border-b border-line pb-5">
                {categories.map(([name, count]) => {
                    const active = category === name;
                    return (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setCategory(name)}
                            aria-pressed={active}
                            data-active={active}
                            className="tag"
                        >
                            {name}
                            <span className="opacity-60">{count}</span>
                        </button>
                    );
                })}
            </div>

            {results.length === 0 ? (
                <EmptyState title="No items match" description="Try a different name or category." />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((item) => (
                        <ItemCard key={item.slug} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ItemCard({ item }: { item: Item }) {
    return (
        <Link
            href={`/items/${item.slug}`}
            className="group relative flex gap-4 border border-line bg-elevated p-3.5 transition-colors hover:border-line-strong"
        >
            <span className="absolute left-0 top-0 h-full w-px scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
            <div className="h-14 w-14 shrink-0 border border-line bg-subtle">
                <SmartImage
                    image={itemIcon(item.image)}
                    alt={`${item.name} icon`}
                    name={item.name}
                    sizes="56px"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="display truncate text-lg leading-none transition-colors group-hover:text-accent">
                        {item.name}
                    </h2>
                    <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </div>
                <p className="mt-1.5 truncate text-xs text-muted">{item.summary}</p>
                {item.bonus && (
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-faint">{item.bonus}</p>
                )}
                <div className="mt-2 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    {item.category && <span>{item.category}</span>}
                    {item.price !== null && <span className="text-accent/80">{item.price}g</span>}
                </div>
            </div>
        </Link>
    );
}
