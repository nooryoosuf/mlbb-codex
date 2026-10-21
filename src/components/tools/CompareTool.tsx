"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight, Search } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
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
        <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="eyebrow mb-2">Tool</div>
                <h1 className="font-display text-4xl">Compare heroes</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                    Pick two heroes to compare verified base stats, roles, and abilities side by side.
                </p>
            </header>

            <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <HeroPicker label="Hero A" hero={left} onChange={(slug) => update("a", slug)} />
                <button
                    type="button"
                    onClick={swap}
                    aria-label="Swap heroes"
                    className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-elevated text-muted transition-colors hover:text-accent"
                >
                    <ArrowLeftRight size={16} aria-hidden="true" />
                </button>
                <HeroPicker label="Hero B" hero={right} onChange={(slug) => update("b", slug)} />
            </div>

            <div className="mt-8 overflow-hidden rounded-panel border border-line">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line bg-subtle px-4 py-3 sm:grid-cols-[1fr_10rem_1fr]">
                    <CompareHead hero={left} align="left" />
                    <span className="text-center text-[10px] uppercase tracking-wider text-faint">vs</span>
                    <CompareHead hero={right} align="right" />
                </div>

                <div className="divide-y divide-line">
                    {STAT_ROWS.map((row) => {
                        const a = left.stats[row.key];
                        const b = right.stats[row.key];
                        const aText = row.kind === "range" ? statRange(a as [number, number] | null) : formatStat(a as number | null);
                        const bText = row.kind === "range" ? statRange(b as [number, number] | null) : formatStat(b as number | null);
                        return (
                            <div key={row.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2.5 text-sm">
                                <span className="font-mono text-xs text-fg">{aText}</span>
                                <span className="text-center text-[11px] text-faint">{row.label}</span>
                                <span className="text-right font-mono text-xs text-fg">{bText}</span>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                            {left.roles.map((role) => <Badge key={role} tone="accent">{role}</Badge>)}
                        </div>
                        <span className="text-center text-[11px] text-faint">Roles</span>
                        <div className="flex flex-wrap justify-end gap-1">
                            {right.roles.map((role) => <Badge key={role} tone="accent">{role}</Badge>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                            {left.lanes.map((lane) => <Badge key={lane}>{lane}</Badge>)}
                        </div>
                        <span className="text-center text-[11px] text-faint">Lanes</span>
                        <div className="flex flex-wrap justify-end gap-1">
                            {right.lanes.map((lane) => <Badge key={lane}>{lane}</Badge>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-3 text-sm">
                        <span className="text-xs text-muted">{left.damageType ?? "—"} · {left.attackType ?? "—"}</span>
                        <span className="text-center text-[11px] text-faint">Profile</span>
                        <span className="text-right text-xs text-muted">{right.damageType ?? "—"} · {right.attackType ?? "—"}</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-3 text-sm">
                        <span className="text-xs text-muted">Released {left.release ?? "—"}</span>
                        <span className="text-center text-[11px] text-faint">Release</span>
                        <span className="text-right text-xs text-muted">Released {right.release ?? "—"}</span>
                    </div>
                </div>
            </div>

            <section className="mt-10">
                <h2 className="mb-4 font-display text-2xl">Abilities</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <SkillList hero={left} />
                    <SkillList hero={right} />
                </div>
            </section>

            <p className="mt-8 text-xs text-faint">
                Stats show level 1 → 15 where available. Comparisons use the same verified dataset as hero profiles.
            </p>
        </div>
    );
}

function HeroPicker({ label, hero, onChange }: { label: string; hero: Hero; onChange: (slug: string) => void }) {
    return (
        <div>
            <label className="eyebrow mb-2 block">{label}</label>
            <div className="flex items-center gap-3 rounded-card border border-line bg-elevated p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="48px" />
                </div>
                <div className="relative min-w-0 flex-1">
                    <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <select
                        value={hero.slug}
                        onChange={(event) => onChange(event.target.value)}
                        aria-label={label}
                        className="h-9 w-full appearance-none rounded border border-line bg-bg pl-7 pr-2 text-sm text-fg outline-none focus:border-accent"
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
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="32px" />
                </div>
            )}
            <Link href={`/hero/${hero.slug}`} className="truncate font-display text-lg hover:text-accent">
                {hero.name}
            </Link>
            {align === "right" && (
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                    <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} rounded="rounded-none" sizes="32px" />
                </div>
            )}
        </div>
    );
}

function SkillList({ hero }: { hero: Hero }) {
    return (
        <div className="rounded-panel border border-line bg-elevated p-4">
            <h3 className="mb-3 text-sm font-medium">{hero.name}</h3>
            <ul className="space-y-2.5">
                {hero.skills.map((skill) => (
                    <li key={skill.id} className="flex items-start gap-2.5">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                            <SmartImage image={skillIcon(skill.icon)} alt="" name={skill.name} rounded="rounded-none" sizes="32px" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-medium text-fg">{skill.name}</span>
                                <span className="shrink-0 text-[10px] uppercase text-faint">{skill.type}</span>
                            </div>
                            {skill.cooldown && <span className="font-mono text-[10px] text-faint">CD {skill.cooldown}s</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
