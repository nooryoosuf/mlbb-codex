import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LoreSources, { ConfidenceBadge } from "@/components/lore/LoreSources";
import { HeroChips } from "@/components/lore/HeroLinks";
import { getWorldEntry, type LoreDiscovery } from "@/data/lore";
import { heroes } from "@/data";

const CATEGORY_LABEL: Record<LoreDiscovery["category"], string> = {
    kinship: "Kinship",
    romance: "Romance",
    rivalry: "Rivalry",
    place: "Place",
    artifact: "Artifact",
    identity: "Identity",
};

export default function DailyDiscovery({
    discovery,
    compact = false,
}: {
    discovery: LoreDiscovery;
    compact?: boolean;
}) {
    const discoveryHeroes = (discovery.heroSlugs ?? [])
        .map((slug) => heroes.find((hero) => hero.slug === slug))
        .filter((hero): hero is (typeof heroes)[number] => Boolean(hero));
    const world = discovery.worldId ? getWorldEntry(discovery.worldId) : undefined;

    return (
        <article className="panel relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-30 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_65%)]" />
            <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                            Daily discovery
                        </span>
                        <span className="h-px w-6 bg-line-strong" />
                        <span className="eyebrow">{CATEGORY_LABEL[discovery.category]}</span>
                    </div>
                    <ConfidenceBadge confidence={discovery.confidence} />
                </div>

                <div className={`px-5 ${compact ? "py-4" : "py-6"}`}>
                    <h2 className={`display max-w-2xl ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
                        {discovery.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{discovery.body}</p>

                    {world && (
                        <Link
                            href={`/lore/world/${world.id}`}
                            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
                        >
                            {world.name}
                            <ArrowUpRight size={10} aria-hidden="true" />
                        </Link>
                    )}

                    {discoveryHeroes.length > 0 && (
                        <div className="mt-4">
                            <HeroChips heroes={discoveryHeroes} />
                        </div>
                    )}

                    <div className="mt-4 border-t border-line pt-3">
                        <LoreSources sources={discovery.sources} compact />
                    </div>
                </div>
            </div>
        </article>
    );
}
