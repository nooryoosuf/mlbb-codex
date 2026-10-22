import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { ConfidenceBadge } from "@/components/lore/LoreSources";
import { SectionHeader } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import {
    LORE_WORLD,
    WORLD_KIND_LABEL,
    getWorldChildren,
    getWorldHeroes,
    getWorldParent,
    type LoreWorldEntry,
} from "@/data/lore";

export const metadata: Metadata = {
    title: "World atlas",
    description:
        "The Land of Dawn region by region: the Abyss, Moniyan Empire, Cadia Riverlands, Azrya Woodlands, Northern Vale, the Barren Lands, Agelta Drylands, Vonetis Sea, their subregions and landmarks.",
    alternates: { canonical: "/lore/world" },
};

export default function WorldPage() {
    const regions = LORE_WORLD.filter((entry) => entry.kind === "region");
    const subregions = LORE_WORLD.filter((entry) => entry.kind === "subregion");
    const landmarks = LORE_WORLD.filter((entry) => entry.kind === "landmark");

    return (
        <>
            <PageHeader
                index="07.03"
                eyebrow="World atlas"
                title="A continent under siege."
                description="Eight major regions, their subregions and the landmarks that anchor the stories. Placements follow the region recorded in each hero's file; where the wiki has no page, the entry is marked accordingly."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{regions.length}</span> regions</span>
                        <span><span className="text-fg">{subregions.length}</span> subregions</span>
                        <span><span className="text-fg">{landmarks.length}</span> landmarks</span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <section aria-labelledby="regions-heading">
                    <SectionHeader
                        index="01"
                        eyebrow="Major regions"
                        title="The eight theatres"
                        description="Every hero file places its subject in one of these regions or one of their subregions."
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {regions.map((region, index) => (
                            <WorldCard key={region.id} entry={region} index={index + 1} />
                        ))}
                    </div>
                </section>

                <section className="mt-16" aria-labelledby="subregions-heading">
                    <SectionHeader
                        index="02"
                        eyebrow="Subregions"
                        title="Within the borders"
                        description="Smaller territories with their own rulers, factions and problems, nested inside a major region."
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {subregions.map((entry, index) => (
                            <WorldCard key={entry.id} entry={entry} index={index + 1} />
                        ))}
                    </div>
                </section>

                <section className="mt-16" aria-labelledby="landmarks-heading">
                    <SectionHeader
                        index="03"
                        eyebrow="Landmarks"
                        title="Places that decide plots"
                        description="Cities, fortresses, forests and altars where the major arcs turn."
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {landmarks.map((entry, index) => (
                            <WorldCard key={entry.id} entry={entry} index={index + 1} />
                        ))}
                    </div>
                </section>

                <Reveal className="mt-16">
                    <div className="border border-line bg-elevated p-6">
                        <span className="eyebrow">On placement</span>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                            Region labels come from the hero infobox, not from an official map. Borders in the Land of
                            Dawn are contested and often undocumented, so a hero can be tied to a faction in one region
                            while fighting in another. Landmark entries without their own wiki page are marked{" "}
                            <span className="text-fg">Suggested</span> and cite the hero or region page they derive
                            from.
                        </p>
                    </div>
                </Reveal>
            </div>
        </>
    );
}

function WorldCard({ entry, index }: { entry: LoreWorldEntry; index: number }) {
    const worldHeroes = getWorldHeroes(entry);
    const children = getWorldChildren(entry);
    const parent = getWorldParent(entry);

    return (
        <Link
            href={`/lore/world/${entry.id}`}
            className="group flex flex-col justify-between border border-line bg-elevated p-4 transition-colors hover:border-accent"
        >
            <div>
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-accent">
                        {String(index).padStart(2, "0")}
                    </span>
                    <ConfidenceBadge confidence={entry.confidence} />
                </div>
                <h3 className="display mt-3 text-2xl leading-none transition-colors group-hover:text-accent">
                    {entry.name}
                </h3>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                    {WORLD_KIND_LABEL[entry.kind]}
                    {parent ? ` · ${parent.name}` : ""}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted">{entry.tagline}</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                <span>
                    {worldHeroes.length} heroes
                    {children.length > 0 ? ` · ${children.length} places` : ""}
                </span>
                <ArrowUpRight
                    size={12}
                    className="text-accent opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                />
            </div>
        </Link>
    );
}
