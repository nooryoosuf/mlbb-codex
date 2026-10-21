"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Dices, RefreshCw, Check } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { heroPortrait } from "@/lib/images";
import { heroes, ROLES, LANES, type Role, type Lane, type Hero } from "@/data";

function pick(pool: Hero[], exclude?: Hero | null): Hero {
    const candidates = exclude && pool.length > 1 ? pool.filter((hero) => hero.slug !== exclude.slug) : pool;
    return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
}

export default function RandomPicker() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [lanes, setLanes] = useState<Lane[]>([]);
    const [chosen, setChosen] = useState<Hero | null>(null);
    const [spinning, setSpinning] = useState(false);

    const pool = useMemo(
        () =>
            heroes.filter((candidate) => {
                if (roles.length && !candidate.roles.some((role) => roles.includes(role))) return false;
                if (lanes.length && !candidate.lanes.some((lane) => lanes.includes(lane))) return false;
                return true;
            }),
        [roles, lanes]
    );

    const hero = chosen && pool.some((candidate) => candidate.slug === chosen.slug) ? chosen : pool[0] ?? null;
    const draw = useCallback(() => {
        if (pool.length === 0) return;
        setSpinning(true);
        let ticks = 0;
        const timer = window.setInterval(() => {
            setChosen(pick(pool, chosen));
            ticks += 1;
            if (ticks >= 8) {
                window.clearInterval(timer);
                setSpinning(false);
            }
        }, 70);
    }, [pool, chosen]);


    function toggle<T>(list: T[], value: T): T[] {
        return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
    }

    return (
        <div>
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
                <div className="rounded-panel border border-line bg-elevated p-6 sm:p-8">
                    {hero ? (
                        <div className="flex flex-col items-center text-center">
                            <div className={`h-40 w-28 overflow-hidden rounded-card border border-line-strong shadow-panel transition-opacity ${spinning ? "opacity-60" : "opacity-100"}`}>
                                <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="112px" />
                            </div>
                            <h2 className="mt-5 font-display text-4xl">{hero.name}</h2>
                            <p className="mt-1 text-sm text-muted">{hero.title ?? "—"}</p>
                            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                {hero.roles.map((role) => <Badge key={role} tone="accent">{role}</Badge>)}
                                {hero.lanes.map((lane) => <Badge key={lane}>{lane}</Badge>)}
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={draw}
                                    disabled={pool.length === 0 || spinning}
                                    className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-50"
                                >
                                    <RefreshCw size={15} className={spinning ? "animate-spin" : ""} aria-hidden="true" />
                                    Draw again
                                </button>
                                <Link
                                    href={`/hero/${hero.slug}`}
                                    className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:bg-subtle"
                                >
                                    Open profile
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <p className="py-16 text-center text-sm text-muted">
                            No heroes match those filters. Loosen them and try again.
                        </p>
                    )}
                </div>

                <aside className="space-y-6">
                    <div>
                        <div className="eyebrow mb-3">Role</div>
                        <div className="flex flex-wrap gap-1.5">
                            {ROLES.map((role) => {
                                const active = roles.includes(role);
                                return (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setRoles((value) => toggle(value, role))}
                                        aria-pressed={active}
                                        className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs transition-colors ${active
                                                ? "border-accent bg-accent-soft text-accent"
                                                : "border-line text-muted hover:border-line-strong hover:text-fg"
                                            }`}
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
                                        onClick={() => setLanes((value) => toggle(value, lane))}
                                        aria-pressed={active}
                                        className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs transition-colors ${active
                                                ? "border-accent bg-accent-soft text-accent"
                                                : "border-line text-muted hover:border-line-strong hover:text-fg"
                                            }`}
                                    >
                                        {active && <Check size={10} aria-hidden="true" />}
                                        {lane}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-card border border-line bg-elevated p-4">
                        <p className="text-xs text-muted">
                            <span className="font-mono text-fg">{pool.length}</span> heroes in the pool
                        </p>
                        <button
                            type="button"
                            onClick={draw}
                            disabled={pool.length === 0 || spinning}
                            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-line-strong text-sm font-medium text-fg transition-colors hover:bg-subtle disabled:opacity-50"
                        >
                            <Dices size={15} aria-hidden="true" />
                            Draw
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
