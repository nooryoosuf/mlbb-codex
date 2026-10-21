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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="search"
                        placeholder="Search items by name or effect…"
                        aria-label="Search items"
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
                <p className="text-sm text-muted">
                    <span className="font-mono text-fg">{results.length}</span> items
                </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {categories.map(([name, count]) => {
                    const active = category === name;
                    return (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setCategory(name)}
                            aria-pressed={active}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${active
                                    ? "border-accent bg-accent-soft text-accent"
                                    : "border-line text-muted hover:border-line-strong hover:text-fg"
                                }`}
                        >
                            {name}
                            <span className="font-mono text-[10px] opacity-70">{count}</span>
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
            className="group flex gap-3.5 rounded-card border border-line bg-elevated p-3.5 transition-colors hover:border-line-strong"
        >
            <div className="h-14 w-14 shrink-0">
                <SmartImage
                    image={itemIcon(item.image)}
                    alt={`${item.name} icon`}
                    name={item.name}
                    sizes="56px"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="truncate text-sm font-semibold text-fg">{item.name}</h2>
                    <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </div>
                <p className="truncate text-xs text-muted">{item.summary}</p>
                {item.bonus && (
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-faint">{item.bonus}</p>
                )}
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-faint">
                    {item.category && <span className="uppercase tracking-wider">{item.category}</span>}
                    {item.price !== null && <span className="font-mono">{item.price}g</span>}
                </div>
            </div>
        </Link>
    );
}
