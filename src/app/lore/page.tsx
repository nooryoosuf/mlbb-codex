import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import DailyDiscovery from "@/components/lore/DailyDiscovery";
import { ConfidenceBadge } from "@/components/lore/LoreSources";
import SmartImage from "@/components/ui/SmartImage";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/primitives";
import { heroPortrait } from "@/lib/images";
import {
    LORE_ARCS,
    LORE_DISCOVERIES,
    LORE_ERAS,
    LORE_EVENTS,
    LORE_FACTIONS,
    LORE_RELATIONS,
    LORE_STATS,
    LORE_WORLD,
    getDiscoveryOfTheDay,
    getFeaturedLoreHeroes,
    getWorldHeroes,
} from "@/data/lore";

export const metadata: Metadata = {
    title: "Lore",
    description:
        "The story of the Land of Dawn: sourced hero dossiers, a relationship graph, regional histories, a timeline and daily lore discoveries.",
    alternates: { canonical: "/lore" },
};

const EXPLORE = [
    {
        href: "/lore/heroes",
        code: "01",
        title: "Hero dossiers",
        body: "Identity, origins, curated chapters and every recorded relationship for all 134 heroes.",
    },
    {
        href: "/lore/relationships",
        code: "02",
        title: "Relationship graph",
        body: "An interactive map of kinship, romance, alliances, rivalries and mentorships.",
    },
    {
        href: "/lore/world",
        code: "03",
        title: "World atlas",
        body: "Eight major regions, their subregions and the landmarks that anchor the stories.",
    },
    {
        href: "/lore/timeline",
        code: "04",
        title: "Timeline",
        body: "The Endless War, the Second Plane War, the fall of Ridgeburg and the present age.",
    },
    {
        href: "/lore/discoveries",
        code: "05",
        title: "Discoveries",
        body: "The sourced details that make the roster stranger than the marketing suggests.",
    },
];

export default function LorePage() {
    const discovery = getDiscoveryOfTheDay();
    const featured = getFeaturedLoreHeroes().slice(0, 6);
    const regions = LORE_WORLD.filter((entry) => entry.kind === "region");
    const subregions = LORE_WORLD.filter((entry) => entry.kind === "subregion");
    const landmarks = LORE_WORLD.filter((entry) => entry.kind === "landmark");

    return (
        <>
            <PageHeader
                index="07"
                eyebrow="The Land of Dawn"
                title="The story behind the roster."
                description="Lore assembled from official Mobile Legends material and the community wiki, with every claim cited and every ambiguity marked. Start with a hero, a place, or the century that broke Necrokeep."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{LORE_STATS.heroes}</span> dossiers</span>
                        <span><span className="text-fg">{LORE_STATS.relations}</span> sourced links</span>
                        <span><span className="text-fg">{LORE_STATS.places}</span> places</span>
                        <span><span className="text-fg">{LORE_STATS.factions}</span> factions</span>
                        <span><span className="text-fg">{LORE_STATS.discoveries}</span> discoveries</span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <Reveal>
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <DailyDiscovery discovery={discovery} />

                        <div className="panel flex flex-col justify-between p-5">
                            <div>
                                <span className="eyebrow">The record</span>
                                <dl className="mt-4 space-y-3">
                                    <Metric label="Heroes with a dossier" value={LORE_STATS.heroes} />
                                    <Metric label="Curated deep dives" value={LORE_STATS.profiled} />
                                    <Metric label="Relationship edges" value={LORE_STATS.relations} />
                                    <Metric label="Connected heroes" value={LORE_STATS.connections} />
                                    <Metric label="Story eras" value={LORE_STATS.eras} />
                                </dl>
                            </div>
                            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-faint">
                                Community wikis can lag or disagree. Entries carry a confidence label instead of
                                pretending the record is uniform.
                            </p>
                        </div>
                    </div>
                </Reveal>

                <section className="mt-16" aria-labelledby="featured-heading">
                    <SectionHeader
                        index="01"
                        eyebrow="Featured dossiers"
                        title="Lives worth following"
                        description="Six of the curated deep dives: the commander who took the blame, the queen who eats empires, the dragon who swallowed a god."
                        action={
                            <Link href="/lore/heroes" className="btn btn-ghost h-9 px-4">
                                All dossiers
                                <ArrowUpRight size={12} aria-hidden="true" />
                            </Link>
                        }
                    />
                    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {featured.map((entry) => (
                            <StaggerItem key={entry.hero.slug}>
                                <Link
                                    href={`/lore/heroes/${entry.hero.slug}`}
                                    className="group block border border-line bg-elevated transition-colors hover:border-accent"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
                                        <SmartImage
                                            image={heroPortrait(entry.hero)}
                                            alt={`${entry.hero.name} portrait`}
                                            name={entry.hero.name}
                                            sizes="(max-width: 640px) 45vw, 16vw"
                                            className="h-full w-full"
                                            imgClassName="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(4,5,6,0.92)_0%,transparent_60%)]" />
                                        <div className="absolute inset-x-0 bottom-0 p-2.5">
                                            <h3 className="display text-xl leading-none text-white">{entry.hero.name}</h3>
                                            <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.14em] text-white/55">
                                                {entry.profile?.epithet}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-2.5 py-2">
                                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                            {entry.region?.name ?? entry.facts.origin}
                                        </span>
                                        <ArrowUpRight
                                            size={11}
                                            className="text-accent opacity-0 transition-opacity group-hover:opacity-100"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </section>

                <section className="mt-16" aria-labelledby="atlas-heading">
                    <SectionHeader
                        index="02"
                        eyebrow="World atlas"
                        title="Where the war is fought"
                        description={`${regions.length} major regions, ${subregions.length} subregions and ${landmarks.length} landmarks, tied to the heroes whose files place them there.`}
                        action={
                            <Link href="/lore/world" className="btn btn-ghost h-9 px-4">
                                Open the atlas
                                <ArrowUpRight size={12} aria-hidden="true" />
                            </Link>
                        }
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {regions.map((region) => {
                            const worldHeroes = getWorldHeroes(region);
                            return (
                                <Link
                                    key={region.id}
                                    href={`/lore/world/${region.id}`}
                                    className="group flex flex-col justify-between border border-line bg-elevated p-4 transition-colors hover:border-accent"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="display text-2xl leading-none transition-colors group-hover:text-accent">
                                                {region.name}
                                            </h3>
                                            <ConfidenceBadge confidence={region.confidence} />
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-muted">{region.tagline}</p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                        <span>{worldHeroes.length} heroes</span>
                                        <span className="transition-colors group-hover:text-accent">Open →</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-16" aria-labelledby="timeline-heading">
                    <SectionHeader
                        index="03"
                        eyebrow="Story timeline"
                        title="Five eras, one long war"
                        description={`${LORE_EVENTS.length} dated events and ${LORE_ARCS.length} story arcs, from the Ancient Ones to the present age.`}
                        action={
                            <Link href="/lore/timeline" className="btn btn-ghost h-9 px-4">
                                Read the timeline
                                <ArrowUpRight size={12} aria-hidden="true" />
                            </Link>
                        }
                    />
                    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
                        {LORE_ERAS.map((era, index) => (
                            <Link
                                key={era.id}
                                href="/lore/timeline"
                                className="group flex flex-col bg-elevated p-4 transition-colors hover:bg-subtle"
                            >
                                <span className="font-mono text-[9px] tracking-[0.2em] text-accent">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className="display mt-2 text-xl leading-[0.95]">{era.name}</h3>
                                <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                                    {era.span}
                                </span>
                                <p className="mt-3 text-xs leading-relaxed text-muted">{era.summary}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-16" aria-labelledby="explore-heading">
                    <SectionHeader index="04" eyebrow="Explore" title="Choose a way in" />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {EXPLORE.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex flex-col justify-between border border-line bg-elevated p-5 transition-colors hover:border-accent"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                                            {item.code}
                                        </span>
                                        <ArrowUpRight
                                            size={15}
                                            className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <h3 className="display mt-4 text-2xl leading-none">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <Reveal className="mt-16">
                    <div className="grid gap-6 border border-line bg-elevated p-6 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <span className="eyebrow">Method</span>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                                Official lore pages take priority. Community wiki text fills gaps, always linked.
                                Speculation is labelled <span className="text-fg">Suggested</span> or{" "}
                                <span className="text-fg">Unconfirmed</span>; contradictions are flagged in the entry
                                rather than smoothed over.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                            <span>{LORE_FACTIONS.length} factions</span>
                            <span className="text-accent">/</span>
                            <span>{LORE_RELATIONS.length} links</span>
                            <span className="text-accent">/</span>
                            <span>{LORE_DISCOVERIES.length} discoveries</span>
                        </div>
                    </div>
                </Reveal>
            </div>
        </>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2 last:border-b-0 last:pb-0">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-mono text-sm text-fg">{value}</dd>
        </div>
    );
}
