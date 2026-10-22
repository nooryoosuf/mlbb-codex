import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import LoreSources, { ConfidenceBadge } from "@/components/lore/LoreSources";
import { FactionList, HeroPortraitGrid, HeroChips } from "@/components/lore/HeroLinks";
import DailyDiscovery from "@/components/lore/DailyDiscovery";
import { SectionHeader } from "@/components/ui/primitives";
import {
    LORE_DISCOVERIES,
    LORE_WORLD,
    WORLD_KIND_LABEL,
    getWorldChildren,
    getWorldEntry,
    getWorldFactions,
    getWorldHeroes,
    getWorldParent,
} from "@/data/lore";

export const dynamicParams = false;

export function generateStaticParams() {
    return LORE_WORLD.map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const entry = getWorldEntry(id);
    if (!entry) return { title: "Place not found" };
    return {
        title: `${entry.name} — World`,
        description: entry.summary,
        alternates: { canonical: `/lore/world/${entry.id}` },
    };
}

export default async function WorldEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const entry = getWorldEntry(id);
    if (!entry) notFound();

    const parent = getWorldParent(entry);
    const children = getWorldChildren(entry);
    const worldHeroes = getWorldHeroes(entry);
    const factions = getWorldFactions(entry);
    const discoveries = LORE_DISCOVERIES.filter((discovery) => discovery.worldId === entry.id);

    return (
        <>
            <PageHeader
                index="07.03"
                eyebrow={WORLD_KIND_LABEL[entry.kind]}
                title={entry.name}
                description={entry.tagline}
                meta={
                    <div className="flex flex-wrap items-center gap-2">
                        <ConfidenceBadge confidence={entry.confidence} />
                        {parent && (
                            <Link href={`/lore/world/${parent.id}`}>
                                <span className="inline-flex items-center gap-1 border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
                                    Part of {parent.name}
                                </span>
                            </Link>
                        )}
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                            {worldHeroes.length} heroes · {factions.length} factions · {children.length} places
                        </span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                    <Link href="/lore" className="transition-colors hover:text-fg">Lore</Link>
                    <span className="text-accent">/</span>
                    <Link href="/lore/world" className="transition-colors hover:text-fg">World</Link>
                    {parent && (
                        <>
                            <span className="text-accent">/</span>
                            <Link href={`/lore/world/${parent.id}`} className="transition-colors hover:text-fg">
                                {parent.name}
                            </Link>
                        </>
                    )}
                    <span className="text-accent">/</span>
                    <span className="text-muted" aria-current="page">{entry.name}</span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
                    <div className="min-w-0 space-y-12">
                        <section aria-labelledby="summary-heading">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="font-mono text-[10px] tracking-[0.2em] text-accent">01</span>
                                <h2 id="summary-heading" className="eyebrow">The place</h2>
                            </div>
                            <p className="max-w-3xl text-base leading-relaxed text-muted">{entry.summary}</p>

                            {entry.details.length > 0 && (
                                <ul className="mt-6 space-y-2.5 border-l border-line pl-5">
                                    {entry.details.map((detail) => (
                                        <li key={detail} className="text-sm leading-relaxed text-muted">
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {children.length > 0 && (
                            <section aria-labelledby="children-heading">
                                <SectionHeader
                                    index="02"
                                    eyebrow="Within"
                                    title={entry.kind === "region" ? "Subregions and landmarks" : "Landmarks"}
                                />
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/lore/world/${child.id}`}
                                            className="group flex items-center justify-between gap-3 border border-line bg-elevated px-4 py-3 transition-colors hover:border-accent"
                                        >
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm text-fg transition-colors group-hover:text-accent">
                                                    {child.name}
                                                </span>
                                                <span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                                                    {WORLD_KIND_LABEL[child.kind]} · {child.tagline}
                                                </span>
                                            </span>
                                            <ArrowUpRight size={12} className="shrink-0 text-faint group-hover:text-accent" aria-hidden="true" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {factions.length > 0 && (
                            <section aria-labelledby="factions-heading">
                                <SectionHeader index="03" eyebrow="Powers here" title="Factions" />
                                <FactionList factions={factions} />
                            </section>
                        )}

                        <section aria-labelledby="heroes-heading">
                            <SectionHeader
                                index="04"
                                eyebrow="Cast"
                                title="Heroes of this place"
                                description="Placed here by their infobox region, or attached to a landmark inside it."
                            />
                            <HeroPortraitGrid heroes={worldHeroes} />
                        </section>

                        {discoveries.length > 0 && (
                            <section aria-labelledby="discoveries-heading">
                                <SectionHeader index="05" eyebrow="Discoveries" title="What the record reveals" />
                                <div className="space-y-4">
                                    {discoveries.map((discovery) => (
                                        <DailyDiscovery key={discovery.id} discovery={discovery} compact />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-4">
                        <section className="border border-line bg-elevated">
                            <div className="border-b border-line px-5 py-3.5">
                                <h2 className="display text-lg leading-none">At a glance</h2>
                            </div>
                            <dl className="divide-y divide-line">
                                <Row label="Kind" value={WORLD_KIND_LABEL[entry.kind]} />
                                {parent && <Row label="Region" value={parent.name} />}
                                <Row label="Heroes" value={String(worldHeroes.length)} />
                                <Row label="Factions" value={String(factions.length)} />
                                <Row label="Places" value={String(children.length)} />
                                <Row label="Confidence" value={entry.confidence} />
                            </dl>
                        </section>

                        {worldHeroes.length > 0 && (
                            <section className="border border-line bg-elevated">
                                <div className="border-b border-line px-5 py-3.5">
                                    <h2 className="display text-lg leading-none">Key figures</h2>
                                </div>
                                <div className="p-4">
                                    <HeroChips heroes={worldHeroes.slice(0, 12)} />
                                </div>
                            </section>
                        )}

                        <LoreSources sources={entry.sources} confidence={entry.confidence} />
                    </aside>
                </div>
            </div>
        </>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-3 px-5 py-2.5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{label}</dt>
            <dd className="text-right text-xs capitalize text-fg">{value}</dd>
        </div>
    );
}
