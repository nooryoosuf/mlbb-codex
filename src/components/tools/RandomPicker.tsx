"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Dices, RefreshCw, Check } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
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
        <div className="grid gap-6 lg:grid-cols-[1fr_19rem]">
            <div className="relative overflow-hidden border border-line bg-elevated">
                <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
                <div className="pointer-events-none absolute -right-10 -top-16 select-none display text-[16rem] leading-none text-faint/10">
                    RNG
                </div>

                {hero ? (
                    <div className="relative flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center sm:min-h-[30rem]">
                        <div
                            className={`h-[clamp(12rem,30vh,18rem)] w-[clamp(8rem,18vw,12rem)] border border-line-strong bg-bg transition-all duration-200 ${
                                spinning ? "scale-95 opacity-50" : "opacity-100"
                            }`}
                        >
                            <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="192px" />
                        </div>
                        <div className="eyebrow mt-6">{spinning ? "Rolling" : "Your pick"}</div>
                        <h2 className="display mt-2 text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.85]">{hero.name}</h2>
                        <p className="mt-2 text-sm text-muted">{hero.title ?? "—"}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            {hero.roles.map((role) => (
                                <span key={role} className="tag h-6">{role}</span>
                            ))}
                            {hero.lanes.map((lane) => (
                                <span key={lane} className="tag h-6">{lane}</span>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={draw}
                                disabled={pool.length === 0 || spinning}
                                className="btn btn-primary"
                            >
                                <RefreshCw size={14} className={spinning ? "animate-spin" : ""} aria-hidden="true" />
                                Draw again
                            </button>
                            <Link href={`/hero/${hero.slug}`} className="btn btn-ghost">
                                Open dossier
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="px-6 py-24 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
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
                                    className={`tag h-7 ${active ? "border-accent bg-accent text-accent-contrast" : ""}`}
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
                                    className={`tag h-7 ${active ? "border-accent bg-accent text-accent-contrast" : ""}`}
                                >
                                    {active && <Check size={10} aria-hidden="true" />}
                                    {lane}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border border-line bg-elevated p-4">
                    <div className="flex items-baseline justify-between">
                        <span className="eyebrow">Pool</span>
                        <span className="font-mono text-lg text-fg">{pool.length}</span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">heroes eligible</p>
                    <button
                        type="button"
                        onClick={draw}
                        disabled={pool.length === 0 || spinning}
                        className="btn btn-ghost mt-4 w-full"
                    >
                        <Dices size={14} aria-hidden="true" />
                        Draw
                    </button>
                </div>
            </aside>
        </div>
    );
}
