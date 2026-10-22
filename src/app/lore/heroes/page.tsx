import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import LoreHeroBrowser, { type LoreHeroItem } from "@/components/lore/LoreHeroBrowser";
import { LORE_STATS, getHeroRegion, getLoreFacts, getLoreProfile, getLoreHeroes } from "@/data/lore";

export const metadata: Metadata = {
    title: "Lore dossiers",
    description: `Read sourced lore dossiers for all ${LORE_STATS.heroes} Mobile Legends heroes: origins, species, affiliations and recorded relationships.`,
    alternates: { canonical: "/lore/heroes" },
};

export default function LoreHeroesPage() {
    const items: LoreHeroItem[] = getLoreHeroes().map((entry) => {
        const profile = getLoreProfile(entry.hero.slug);
        const facts = getLoreFacts(entry.hero.slug);
        const region = getHeroRegion(entry.hero.slug);
        return {
            slug: entry.hero.slug,
            name: entry.hero.name,
            title: entry.hero.title,
            region: entry.hero.region,
            regionId: region?.id ?? null,
            regionName: region?.name ?? entry.hero.region,
            roles: entry.hero.roles,
            factions: entry.factions.map((faction) => faction.name),
            featured: Boolean(profile),
            species: facts?.species ?? "",
            portrait: entry.hero.portrait,
        };
    });

    return (
        <>
            <PageHeader
                index="07.01"
                eyebrow="Lore dossiers"
                title="Every hero has a file."
                description="Filter all 134 heroes by region and faction, then open the sourced dossier. Curated deep dives are marked featured; the rest surface the facts recorded in each hero's own wiki entry."
                meta={
                    <div className="flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{items.length}</span> dossiers</span>
                        <span><span className="text-fg">{LORE_STATS.profiled}</span> featured</span>
                        <span><span className="text-fg">{LORE_STATS.relations}</span> linked relationships</span>
                    </div>
                }
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <LoreHeroBrowser items={items} />
            </div>
        </>
    );
}
