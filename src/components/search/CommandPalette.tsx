"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, CornerDownLeft, ArrowUp, ArrowDown, User, Package } from "lucide-react";
import { heroes, items, type Hero, type Item } from "@/data";

type Result =
    | { kind: "hero"; hero: Hero }
    | { kind: "item"; item: Item };

function score(query: string, target: string): number {
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (!q) return 0;
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 60;
    // subsequence match
    let qi = 0;
    for (let i = 0; i < t.length && qi < q.length; i += 1) {
        if (t[i] === q[qi]) qi += 1;
    }
    return qi === q.length ? 30 : 0;
}

function PaletteBody({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const results = useMemo<Result[]>(() => {
        const q = query.trim();
        if (!q) {
            return heroes.slice(0, 6).map((hero) => ({ kind: "hero" as const, hero }));
        }
        const heroHits = heroes
            .map((hero) => {
                const haystacks = [hero.name, hero.title ?? "", ...hero.roles, ...hero.lanes, ...hero.specialties];
                const best = Math.max(...haystacks.map((h) => score(q, h)));
                return { hero, best };
            })
            .filter((entry) => entry.best > 0)
            .sort((a, b) => b.best - a.best)
            .slice(0, 6)
            .map((entry) => ({ kind: "hero" as const, hero: entry.hero }));

        const itemHits = items
            .map((item) => ({ item, best: Math.max(score(q, item.name), score(q, item.summary)) }))
            .filter((entry) => entry.best > 0)
            .sort((a, b) => b.best - a.best)
            .slice(0, 3)
            .map((entry) => ({ kind: "item" as const, item: entry.item }));

        return [...heroHits, ...itemHits];
    }, [query]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((value) => (value + 1) % Math.max(results.length, 1));
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((value) => (value - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
            } else if (event.key === "Enter") {
                const result = results[active];
                if (!result) return;
                event.preventDefault();
                onClose();
                router.push(result.kind === "hero" ? `/hero/${result.hero.slug}` : `/items/${result.item.slug}`);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [results, active, onClose, router]);

    useEffect(() => {
        const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
        node?.scrollIntoView({ block: "nearest" });
    }, [active]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
            <button
                type="button"
                aria-label="Close search"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-xl border border-line-strong bg-elevated animate-fade-up">
                <div className="h-0.5 w-full bg-accent" />
                <div className="flex items-center gap-3 border-b border-line px-4">
                    <Search size={16} className="text-accent" aria-hidden="true" />
                    <input
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setActive(0);
                        }}
                        placeholder="Search heroes, roles, lanes, items…"
                        className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-faint"
                        aria-label="Search query"
                        autoComplete="off"
                        spellCheck={false}
                        autoFocus
                    />
                    <kbd className="border border-line bg-subtle px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">ESC</kbd>
                </div>

                <div ref={listRef} className="max-h-[52vh] overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm text-fg">No matches for &ldquo;{query}&rdquo;</p>
                            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                Try a hero name, role, lane, or item
                            </p>
                        </div>
                    ) : (
                        results.map((result, index) => {
                            const isActive = index === active;
                            const href = result.kind === "hero" ? `/hero/${result.hero.slug}` : `/items/${result.item.slug}`;
                            const label = result.kind === "hero" ? result.hero.name : result.item.name;
                            const meta =
                                result.kind === "hero"
                                    ? [...result.hero.roles, ...result.hero.lanes].join(" / ")
                                    : [result.item.category, result.item.summary].filter(Boolean).join(" / ");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    data-index={index}
                                    onClick={onClose}
                                    onMouseEnter={() => setActive(index)}
                                    className={`relative flex items-center gap-3 border-b border-line px-4 py-2.5 transition-colors last:border-b-0 ${
                                        isActive ? "bg-subtle" : ""
                                    }`}
                                >
                                    <span
                                        className={`absolute inset-y-0 left-0 w-0.5 bg-accent transition-opacity ${
                                            isActive ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    <span className="w-6 shrink-0 font-mono text-[9px] text-faint">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="grid h-8 w-8 shrink-0 place-items-center border border-line bg-bg text-faint">
                                        {result.kind === "hero" ? <User size={13} /> : <Package size={13} />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-fg">{label}</span>
                                        <span className="block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                                            {meta}
                                        </span>
                                    </span>
                                    {isActive && <CornerDownLeft size={13} className="shrink-0 text-accent" aria-hidden="true" />}
                                </Link>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><ArrowUp size={10} /> <ArrowDown size={10} /> navigate</span>
                        <span className="flex items-center gap-1"><CornerDownLeft size={10} /> open</span>
                    </span>
                    <span>
                        {results.length} result{results.length === 1 ? "" : "s"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return <PaletteBody onClose={onClose} />;
}
