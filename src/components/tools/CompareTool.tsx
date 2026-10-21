"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait, skillIcon } from "@/lib/images";
import { heroes, formatStat, statRange, type Hero } from "@/data";

const STAT_ROWS: { key: keyof Hero["stats"]; label: string; kind: "range" | "single" }[] = [
    { key: "hp", label: "HP", kind: "range" },
    { key: "hpRegen", label: "HP regen", kind: "single" },
    { key: "mana", label: "Mana", kind: "range" },
    { key: "physicalAttack", label: "Physical attack", kind: "range" },
    { key: "physicalDefense", label: "Physical defense", kind: "range" },
    { key: "magicDefense", label: "Magic defense", kind: "range" },
    { key: "movementSpeed", label: "Movement speed", kind: "single" },
    { key: "attackRange", label: "Attack range", kind: "single" },
];

function numeric(hero: Hero, key: keyof Hero["stats"]): number | null {
    const value = hero.stats[key];
    if (Array.isArray(value)) return value[1] ?? value[0] ?? null;
    return (value as number | null) ?? null;
}

export default function CompareTool() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [left, setLeft] = useState<Hero>(
        () => heroes.find((hero) => hero.slug === searchParams.get("a")) ?? heroes[0]
    );
    const [right, setRight] = useState<Hero>(
        () => heroes.find((hero) => hero.slug === searchParams.get("b")) ?? heroes[1] ?? heroes[0]
    );

    function update(side: "a" | "b", slug: string) {
        const hero = heroes.find((candidate) => candidate.slug === slug);
        if (!hero) return;
        if (side === "a") setLeft(hero);
        else setRight(hero);
        const params = new URLSearchParams();
        params.set("a", side === "a" ? slug : left.slug);
        params.set("b", side === "b" ? slug : right.slug);
        router.replace(`/tools/compare?${params.toString()}`, { scroll: false });
    }

    function swap() {
        setLeft(right);
        setRight(left);
        router.replace(`/tools/compare?a=${right.slug}&b=${left.slug}`, { scroll: false });
    }

    return (
        <div>
            <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <HeroPicker label="Hero A" hero={left} onChange={(slug) => update("a", slug)} />
                <button
                    type="button"
                    onClick={swap}
                    aria-label="Swap heroes"
                    className="mx-auto grid h-11 w-11 place-items-center self-center border border-line-strong bg-elevated text-muted transition-colors hover:border-accent hover:text-accent"
                >
                    <ArrowLeftRight size={16} aria-hidden="true" />
                </button>
                <HeroPicker label="Hero B" hero={right} onChange={(slug) => update("b", slug)} />
            </div>

            <div className="mt-6 border border-line">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line bg-subtle px-4 py-3 sm:grid-cols-[1fr_10rem_1fr]">
                    <CompareHead hero={left} align="left" />
                    <span className="text-center font-mono text-[9px] uppercase tracking-[0.24em] text-faint">versus</span>
                    <CompareHead hero={right} align="right" />
                </div>

                <div>
                    {STAT_ROWS.map((row) => {
                        const a = left.stats[row.key];
                        const b = right.stats[row.key];
                        const aText = row.kind === "range" ? statRange(a as [number, number] | null) : formatStat(a as number | null);
                        const bText = row.kind === "range" ? statRange(b as [number, number] | null) : formatStat(b as number | null);
                        const aNum = numeric(left, row.key);
                        const bNum = numeric(right, row.key);
                        return (
                            <div
                                key={row.key}
                                className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line px-4 py-2.5 last:border-b-0"
                            >
                                <span className={`font-mono text-xs ${aNum !== null && bNum !== null && aNum > bNum ? "text-accent" : "text-fg"}`}>
                                    {aText}
                                </span>
                                <span className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    {row.label}
                                </span>
                                <span className={`text-right font-mono text-xs ${aNum !== null && bNum !== null && bNum > aNum ? "text-accent" : "text-fg"}`}>
                                    {bText}
                                </span>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b border-line px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                            {left.roles.map((role) => (
                                <span key={role} className="tag h-6">{role}</span>
                            ))}
                        </div>
                        <span className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Roles</span>
                        <div className="flex flex-wrap justify-end gap-1">
                            {right.roles.map((role) => (
                                <span key={role} className="tag h-6">{role}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b border-line px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                            {left.lanes.map((lane) => (
                                <span key={lane} className="tag h-6">{lane}</span>
                            ))}
                        </div>
                        <span className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Lanes</span>
                        <div className="flex flex-wrap justify-end gap-1">
                            {right.lanes.map((lane) => (
                                <span key={lane} className="tag h-6">{lane}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b border-line px-4 py-3">
                        <span className="font-mono text-[11px] text-muted">{left.damageType ?? "—"} · {left.attackType ?? "—"}</span>
                        <span className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Profile</span>
                        <span className="text-right font-mono text-[11px] text-muted">{right.damageType ?? "—"} · {right.attackType ?? "—"}</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-3">
                        <span className="font-mono text-[11px] text-muted">{left.release ?? "—"}</span>
                        <span className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Release</span>
                        <span className="text-right font-mono text-[11px] text-muted">{right.release ?? "—"}</span>
                    </div>
                </div>
            </div>

            <section className="mt-10">
                <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">02</span>
                    <h2 className="display text-2xl">Abilities</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <SkillList hero={left} />
                    <SkillList hero={right} />
                </div>
            </section>

            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Stats show level 1 → 15 where available. Same verified dataset as hero dossiers.
            </p>
        </div>
    );
}

function HeroPicker({ label, hero, onChange }: { label: string; hero: Hero; onChange: (slug: string) => void }) {
    return (
        <div className="border border-line bg-elevated">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="eyebrow">{label}</span>
                <span className="font-mono text-[9px] tracking-[0.16em] text-faint">{hero.roles.join(" / ")}</span>
            </div>
            <div className="flex items-center gap-3 p-3">
                <div className="h-16 w-11 shrink-0 border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="display truncate text-xl leading-none">{hero.name}</div>
                    <select
                        value={hero.slug}
                        onChange={(event) => onChange(event.target.value)}
                        aria-label={label}
                        className="mt-2 h-8 w-full appearance-none border border-line bg-bg px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted outline-none focus:border-accent"
                    >
                        {heroes.map((candidate) => (
                            <option key={candidate.slug} value={candidate.slug}>
                                {candidate.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

function CompareHead({ hero, align }: { hero: Hero; align: "left" | "right" }) {
    return (
        <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
            {align === "left" && (
                <div className="h-9 w-6 shrink-0 border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />
                </div>
            )}
            <Link href={`/hero/${hero.slug}`} className="truncate display text-xl transition-colors hover:text-accent">
                {hero.name}
            </Link>
            {align === "right" && (
                <div className="h-9 w-6 shrink-0 border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />
                </div>
            )}
        </div>
    );
}

function SkillList({ hero }: { hero: Hero }) {
    return (
        <div className="border border-line bg-elevated">
            <div className="border-b border-line px-4 py-2.5">
                <h3 className="display text-lg leading-none">{hero.name}</h3>
            </div>
            <ul className="p-2">
                {hero.skills.map((skill) => (
                    <li key={skill.id} className="flex items-start gap-2.5 px-2 py-2">
                        <div className="h-8 w-8 shrink-0 border border-line">
                            <SmartImage image={skillIcon(skill.icon)} alt="" name={skill.name} sizes="32px" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate text-xs font-medium text-fg">{skill.name}</span>
                                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">{skill.type}</span>
                            </div>
                            {skill.cooldown && (
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">CD {skill.cooldown}s</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
