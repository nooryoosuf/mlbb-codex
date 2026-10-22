import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import LoreSources, { ConfidenceBadge } from "@/components/lore/LoreSources";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { heroPortrait, heroSplash } from "@/lib/images";
import { heroes } from "@/data";
import {
    CONFIDENCE_LABEL,
    RELATION_META,
    RELATION_TYPES,
    getArcsForHero,
    getEventsForHero,
    getHeroLore,
    wiki,
    type LoreFacts,
} from "@/data/lore";

export const dynamicParams = false;

export function generateStaticParams() {
    return heroes.map((hero) => ({ id: hero.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const entry = getHeroLore(id);
    if (!entry) return { title: "Lore dossier not found" };

    const description =
        entry.profile?.summary ??
        `${entry.hero.name}${entry.facts.origin ? ` of ${entry.facts.origin}` : ""} — origin, species, affiliations and recorded relationships.`;

    return {
        title: `${entry.hero.name} — Lore`,
        description,
        alternates: { canonical: `/lore/heroes/${entry.hero.slug}` },
        openGraph: {
            title: `${entry.hero.name} — Lore · MLBB Codex`,
            description,
            images: entry.hero.splash ? [{ url: entry.hero.splash, alt: `${entry.hero.name} splash art` }] : undefined,
        },
    };
}

const FACT_ROWS: { key: keyof LoreFacts; label: string }[] = [
    { key: "fullName", label: "Full name" },
    { key: "alias", label: "Aliases" },
    { key: "birthday", label: "Birthday" },
    { key: "origin", label: "Origin" },
    { key: "born", label: "Born" },
    { key: "age", label: "Age" },
    { key: "species", label: "Species" },
    { key: "gender", label: "Gender" },
    { key: "title", label: "Title" },
    { key: "occupation", label: "Occupation" },
    { key: "nationality", label: "Nationality" },
    { key: "religion", label: "Religion" },
    { key: "affiliation", label: "Affiliation" },
    { key: "weapons", label: "Weapons" },
    { key: "height", label: "Height" },
];

function trimIntro(intro: string): string {
    const clean = intro.replace(/\s+/g, " ").trim();
    if (clean.length <= 560) return clean;
    const slice = clean.slice(0, 560);
    const boundary = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("; "));
    return `${slice.slice(0, boundary > 240 ? boundary + 1 : 560).trim()}…`;
}

function isEmptyFact(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value.filter(Boolean).length === 0;
    return !value || /^(unknown|n\/a|none|—|-)$/i.test(value.trim());
}

export default async function LoreHeroPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const entry = getHeroLore(id);
    if (!entry) notFound();

    const { hero, facts, profile, region, factions, relations } = entry;
    const events = getEventsForHero(hero.slug);
    const arcs = getArcsForHero(hero.slug);
    const sources = profile?.sources?.length
        ? profile.sources
        : [facts.source ? { label: `Mobile Legends Wiki — ${hero.name}`, url: facts.source, kind: "community" as const } : wiki(hero.name)];

    const groupedRelations = RELATION_TYPES.map((type) => ({
        type,
        items: relations.filter((relation) => relation.relation.type === type),
    })).filter((group) => group.items.length > 0);

    return (
        <>
            <PageHeader
                index="07.01"
                eyebrow="Lore dossier"
                title={hero.name}
                description={profile?.epithet ?? hero.title ?? undefined}
                image={heroSplash(hero)}
                imageAlt={`${hero.name} skin artwork`}
                portrait={heroPortrait(hero)}
                portraitAlt={`${hero.name} portrait`}
                meta={
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="accent">Lore dossier</Badge>
                        {facts.species && <Badge>{facts.species}</Badge>}
                        {region && (
                            <Link href={`/lore/world/${region.id}`}>
                                <Badge>{region.name}</Badge>
                            </Link>
                        )}
                        <ConfidenceBadge confidence={profile?.confidence ?? "suggested"} />
                        <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                            {relations.length} recorded links · {events.length + arcs.length} story threads
                        </span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
                    <div className="min-w-0 space-y-12">
                        <section aria-labelledby="summary-heading">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="font-mono text-[10px] tracking-[0.2em] text-accent">01</span>
                                <h2 id="summary-heading" className="eyebrow">In brief</h2>
                            </div>
                            <p className="max-w-3xl text-base leading-relaxed text-muted">
                                {profile?.summary ?? trimIntro(facts.intro)}
                            </p>
                            {profile?.quote && (
                                <blockquote className="mt-6 border-l-2 border-accent pl-4">
                                    <p className="text-lg leading-relaxed text-fg">“{profile.quote}”</p>
                                    <footer className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Attributed in the hero&apos;s wiki entry
                                    </footer>
                                </blockquote>
                            )}
                            {profile?.motifs && profile.motifs.length > 0 && (
                                <div className="mt-5 flex flex-wrap items-center gap-1.5">
                                    <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                                        Motifs
                                    </span>
                                    {profile.motifs.map((motif) => (
                                        <span key={motif} className="tag h-6">{motif}</span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {profile && profile.chapters.length > 0 && (
                            <section aria-labelledby="story-heading">
                                <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">02</span>
                                        <h2 id="story-heading" className="display text-3xl">The story</h2>
                                    </div>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        {profile.chapters.length} chapters
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    {profile.chapters.map((chapter, index) => (
                                        <article key={chapter.title} className="border-l border-line pl-4 sm:pl-6">
                                            <div className="flex items-baseline gap-3">
                                                <span className="font-mono text-[9px] text-faint">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <h3 className="display text-xl leading-tight">{chapter.title}</h3>
                                            </div>
                                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                                                {chapter.body}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section aria-labelledby="relations-heading">
                            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">03</span>
                                    <h2 id="relations-heading" className="display text-3xl">Relations</h2>
                                </div>
                                <Link
                                    href="/lore/relationships"
                                    className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
                                >
                                    Full graph
                                    <ArrowUpRight size={10} aria-hidden="true" />
                                </Link>
                            </div>

                            {groupedRelations.length === 0 ? (
                                <p className="border border-dashed border-line-strong px-4 py-8 text-sm text-faint">
                                    No curated relationship edges for this hero yet. The wiki infobox may still list
                                    relationships in the sidebar.
                                </p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {groupedRelations.map((group) => {
                                        const meta = RELATION_META[group.type];
                                        return (
                                            <div key={group.type} className="border border-line bg-elevated">
                                                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                                                    <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">
                                                        <span className="h-1.5 w-1.5" style={{ backgroundColor: meta.color }} />
                                                        {meta.label}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-faint">{group.items.length}</span>
                                                </div>
                                                <ul className="divide-y divide-line">
                                                    {group.items.map((item) => (
                                                        <li key={`${item.hero.slug}-${item.relation.type}`}>
                                                            <Link
                                                                href={`/lore/heroes/${item.hero.slug}`}
                                                                className="group block px-4 py-2.5 transition-colors hover:bg-subtle"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="h-12 w-9 shrink-0 overflow-hidden border border-line bg-subtle">
                                                                        <SmartImage
                                                                            image={heroPortrait(item.hero)}
                                                                            alt=""
                                                                            name={item.hero.name}
                                                                            sizes="36px"
                                                                            className="h-full w-full"
                                                                        />
                                                                    </span>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-baseline justify-between gap-2">
                                                                            <span className="text-sm text-fg transition-colors group-hover:text-accent">
                                                                                {item.hero.name}
                                                                            </span>
                                                                            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                                                                {item.label}
                                                                            </span>
                                                                        </div>
                                                                        {item.note && (
                                                                            <p className="mt-1 text-[11px] leading-relaxed text-muted">
                                                                                {item.note}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {events.length + arcs.length > 0 && (
                            <section aria-labelledby="threads-heading">
                                <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">04</span>
                                    <h2 id="threads-heading" className="display text-3xl">Story threads</h2>
                                </div>
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <article key={event.id} className="border border-line bg-elevated p-4">
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <h3 className="display text-lg leading-tight">{event.title}</h3>
                                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                    Timeline event
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted">{event.summary}</p>
                                            <div className="mt-3">
                                                <LoreSources sources={event.sources} confidence={event.confidence} compact />
                                            </div>
                                        </article>
                                    ))}
                                    {arcs.map((arc) => (
                                        <article key={arc.id} className="border border-line bg-elevated p-4">
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <h3 className="display text-lg leading-tight">{arc.title}</h3>
                                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                    Arc · {arc.beats.length} beats
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted">{arc.summary}</p>
                                            <ol className="mt-3 space-y-1.5">
                                                {arc.beats.map((beat, index) => (
                                                    <li key={beat} className="flex gap-2 text-[12px] leading-relaxed text-muted">
                                                        <span className="font-mono text-[9px] text-accent/70">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        {beat}
                                                    </li>
                                                ))}
                                            </ol>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!profile && (
                            <section className="border border-dashed border-line-strong p-5">
                                <h2 className="display text-xl">Curated dossier in progress</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                                    This hero has a sourced facts record but no hand-written chapters yet. The
                                    infobox data and the wiki introduction above remain the reliable layer; treat
                                    the absence of a chapter as a gap in this project, not in the character.
                                </p>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-4">
                        <section className="border border-line bg-elevated">
                            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                                <h2 className="display text-lg leading-none">Identity</h2>
                                <ConfidenceBadge confidence={profile?.confidence ?? "suggested"} />
                            </div>
                            <dl className="divide-y divide-line">
                                {FACT_ROWS.map((row) => {
                                    const value = facts[row.key];
                                    if (isEmptyFact(value)) return null;
                                    return (
                                        <div key={row.key} className="flex gap-4 px-5 py-2.5">
                                            <dt className="w-20 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                {row.label}
                                            </dt>
                                            <dd className="min-w-0 text-xs leading-relaxed text-fg">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                            <div className="px-5 py-3">
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                    {CONFIDENCE_LABEL[profile?.confidence ?? "suggested"]} · wiki infobox
                                </span>
                            </div>
                        </section>

                        {factions.length > 0 && (
                            <section className="border border-line bg-elevated">
                                <div className="border-b border-line px-5 py-3.5">
                                    <h2 className="display text-lg leading-none">Factions</h2>
                                </div>
                                <ul className="divide-y divide-line">
                                    {factions.map((faction) => (
                                        <li key={faction.id} className="px-5 py-3">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-sm text-fg">{faction.name}</span>
                                                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                                    {faction.kind}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[11px] leading-relaxed text-muted">{faction.creed}</p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {region && (
                            <Link
                                href={`/lore/world/${region.id}`}
                                className="group block border border-line bg-elevated p-5 transition-colors hover:border-accent"
                            >
                                <span className="eyebrow">Region</span>
                                <div className="mt-2 flex items-center justify-between gap-3">
                                    <h2 className="display text-xl leading-none transition-colors group-hover:text-accent">
                                        {region.name}
                                    </h2>
                                    <ArrowUpRight size={14} className="text-faint group-hover:text-accent" aria-hidden="true" />
                                </div>
                                <p className="mt-2 text-xs leading-relaxed text-muted">{region.tagline}</p>
                            </Link>
                        )}

                        <LoreSources sources={sources} confidence={profile?.confidence ?? "suggested"} />

                        <Link
                            href={`/hero/${hero.slug}`}
                            className="group flex items-center justify-between gap-3 border border-line bg-elevated px-5 py-4 transition-colors hover:border-accent"
                        >
                            <span>
                                <span className="block text-sm font-medium">Gameplay dossier</span>
                                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    Stats, abilities and skins
                                </span>
                            </span>
                            <SmartImage
                                image={heroPortrait(hero)}
                                alt=""
                                name={hero.name}
                                sizes="24px"
                                className="h-10 w-7 shrink-0 border border-line"
                            />
                        </Link>
                    </aside>
                </div>
            </div>
        </>
    );
}
