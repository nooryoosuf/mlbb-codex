import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import { getLatestPatch, heroes, meta, type MetaHero } from "@/data";

const COLUMNS = [
    {
        key: "banRate" as const,
        title: "Most banned",
        note: "Draft priority",
        tone: "bg-accent",
        text: "text-accent",
        minPick: 0,
    },
    {
        key: "pickRate" as const,
        title: "Most picked",
        note: "Popularity",
        tone: "bg-fg/80",
        text: "text-fg",
        minPick: 0,
    },
    {
        key: "winRate" as const,
        title: "Highest win rate",
        note: "Pick rate ≥ 0.5%",
        tone: "bg-success",
        text: "text-success",
        minPick: 0.5,
    },
];

function topBy(key: (typeof COLUMNS)[number]["key"], minPick: number): MetaHero[] {
    return meta.heroes
        .filter((entry) => entry[key] !== null && (entry.pickRate ?? 0) >= minPick)
        .sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0))
        .slice(0, 5);
}

export default function MetaBand() {
    const latest = getLatestPatch();
    const portrait = new Map(heroes.map((hero) => [hero.slug, hero]));

    return (
        <section aria-labelledby="live-meta-heading" className="relative border-y border-line bg-elevated/50">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
            <div className="relative mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                    <div>
                        <div className="eyebrow mb-2">
                            Live ranked
                            {latest ? ` · Patch ${latest.version}` : ""}
                            {meta.snapshot ? ` · ${meta.snapshot}` : ""}
                        </div>
                        <h2 id="live-meta-heading" className="display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.9]">
                            The current meta
                        </h2>
                    </div>
                    <Link href="/meta" className="link-arrow">
                        Full meta board <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                </div>

                <div className="mt-6 grid gap-px border border-line bg-line lg:grid-cols-3">
                    {COLUMNS.map((column) => {
                        const rows = topBy(column.key, column.minPick);
                        const max = Math.max(...rows.map((row) => row[column.key] ?? 0), 1);
                        return (
                            <div key={column.key} className="bg-bg p-4 sm:p-5">
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <h3 className={`font-mono text-[10px] uppercase tracking-[0.2em] ${column.text}`}>
                                        {column.title}
                                    </h3>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">{column.note}</span>
                                </div>
                                <ol>
                                    {rows.map((row, index) => {
                                        const hero = portrait.get(row.slug);
                                        const value = row[column.key] ?? 0;
                                        return (
                                            <li key={row.slug} className="border-b border-line last:border-b-0">
                                                <Link
                                                    href={`/hero/${row.slug}`}
                                                    className="group grid grid-cols-[1.25rem_1.75rem_1fr_auto] items-center gap-2.5 py-2.5"
                                                >
                                                    <span className="font-mono text-[9px] text-faint">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="h-9 w-6 border border-line">
                                                        {hero && <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="24px" />}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="flex items-baseline gap-1.5">
                                                            <span className="truncate text-[13px] font-medium text-fg transition-colors group-hover:text-accent">
                                                                {row.name}
                                                            </span>
                                                            <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                                                                {row.tier ?? ""}
                                                            </span>
                                                        </span>
                                                        <span className="mt-1 block h-0.5 w-full bg-subtle">
                                                            <span
                                                                className={`block h-0.5 ${column.tone}`}
                                                                style={{ width: `${Math.max(3, (value / max) * 100)}%` }}
                                                            />
                                                        </span>
                                                    </span>
                                                    <span className={`font-mono text-xs ${column.text}`}>{value.toFixed(2)}%</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        );
                    })}
                </div>

                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    <span>Official ranked statistics · all ranks · rolling 7 days</span>
                    <span className="text-faint">/</span>
                    <a
                        href={meta.url}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-accent"
                    >
                        via MythicLab
                    </a>
                    <span className="text-faint">/</span>
                    <Link href="/meta" className="transition-colors hover:text-accent">
                        Rank filters
                    </Link>
                </p>
            </div>
        </section>
    );
}
