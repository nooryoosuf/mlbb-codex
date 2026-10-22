import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import RelationshipGraph, { type GraphEdge, type GraphNode } from "@/components/lore/RelationshipGraph";
import { SectionHeader } from "@/components/ui/primitives";
import {
    LORE_RELATIONS,
    RELATION_META,
    RELATION_TYPES,
    getHeroRegion,
    getLoreProfile,
} from "@/data/lore";
import { heroes } from "@/data";

export const metadata: Metadata = {
    title: "Relationship graph",
    description:
        "Explore the curated relationships of the Land of Dawn: kinship, romance, alliances, rivalries, conflicts and mentorships, each with a cited source.",
    alternates: { canonical: "/lore/relationships" },
};

export default function RelationshipsPage() {
    const connected = new Set(LORE_RELATIONS.flatMap((relation) => [relation.a, relation.b]));
    const degree = new Map<string, number>();
    for (const relation of LORE_RELATIONS) {
        degree.set(relation.a, (degree.get(relation.a) ?? 0) + 1);
        degree.set(relation.b, (degree.get(relation.b) ?? 0) + 1);
    }

    const nodes: GraphNode[] = [...connected]
        .map((slug) => heroes.find((hero) => hero.slug === slug))
        .filter((hero): hero is (typeof heroes)[number] => Boolean(hero))
        .map((hero) => {
            const region = getHeroRegion(hero.slug);
            return {
                slug: hero.slug,
                name: hero.name,
                regionId: region?.id ?? null,
                regionName: region?.name ?? hero.region ?? "Unplaced",
                featured: Boolean(getLoreProfile(hero.slug)),
                degree: degree.get(hero.slug) ?? 0,
            };
        })
        .sort((left, right) => left.name.localeCompare(right.name));

    const edges: GraphEdge[] = LORE_RELATIONS.map((relation) => ({
        a: relation.a,
        b: relation.b,
        type: relation.type,
        label: relation.label,
        note: relation.note,
    }));

    const mostConnected = [...nodes].sort((left, right) => right.degree - left.degree).slice(0, 5);
    const conflicts = LORE_RELATIONS.filter(
        (relation) => relation.type === "conflict" || relation.type === "rivalry"
    ).slice(0, 6);

    return (
        <>
            <PageHeader
                index="07.02"
                eyebrow="Relationship graph"
                title="Who stands beside whom."
                description="Every line is a relationship recorded in a hero's own file, grouped by kind and cited at the source. Clusters follow region; edges cross them freely, because the war does."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{nodes.length}</span> connected heroes</span>
                        <span><span className="text-fg">{edges.length}</span> cited links</span>
                        <span><span className="text-fg">{RELATION_TYPES.length}</span> relation types</span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <RelationshipGraph nodes={nodes} edges={edges} />

                <section className="mt-16">
                    <SectionHeader
                        index="01"
                        eyebrow="Reading the map"
                        title="Types of bond"
                        description="The legend is editorial: a label states what the sources record, not how the characters feel about it."
                    />
                    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                        {RELATION_TYPES.map((type) => {
                            const meta = RELATION_META[type];
                            const count = LORE_RELATIONS.filter((relation) => relation.type === type).length;
                            return (
                                <div key={type} className="bg-elevated p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2" style={{ backgroundColor: meta.color }} />
                                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg">
                                                {meta.label}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[10px] text-faint">{count}</span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-muted">{meta.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div>
                        <SectionHeader index="02" eyebrow="Hubs" title="Most connected" />
                        <ol className="divide-y divide-line border border-line bg-elevated">
                            {mostConnected.map((node, index) => (
                                <li key={node.slug}>
                                    <Link
                                        href={`/lore/heroes/${node.slug}`}
                                        className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-subtle"
                                    >
                                        <span className="font-mono text-[9px] text-faint">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm text-fg transition-colors group-hover:text-accent">
                                                {node.name}
                                            </span>
                                            <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                                                {node.regionName}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[10px] text-accent">{node.degree}</span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div>
                        <SectionHeader index="03" eyebrow="Fault lines" title="Open conflicts" />
                        <div className="space-y-2">
                            {conflicts.map((relation) => (
                                <article key={`${relation.a}-${relation.b}-${relation.type}`} className="border border-line bg-elevated p-4">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <span className="text-sm text-fg">
                                            <Link href={`/lore/heroes/${relation.a}`} className="transition-colors hover:text-accent">
                                                {nameOf(relation.a)}
                                            </Link>
                                            <span className="mx-2 text-faint">×</span>
                                            <Link href={`/lore/heroes/${relation.b}`} className="transition-colors hover:text-accent">
                                                {nameOf(relation.b)}
                                            </Link>
                                        </span>
                                        <span
                                            className="font-mono text-[8px] uppercase tracking-[0.12em]"
                                            style={{ color: RELATION_META[relation.type].color }}
                                        >
                                            {relation.label}
                                        </span>
                                    </div>
                                    {relation.note && (
                                        <p className="mt-2 text-xs leading-relaxed text-muted">{relation.note}</p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

function nameOf(slug: string): string {
    return heroes.find((hero) => hero.slug === slug)?.name ?? slug;
}
