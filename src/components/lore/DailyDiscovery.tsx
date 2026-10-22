import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LoreSources, { ConfidenceBadge } from "@/components/lore/LoreSources";
import { HeroChips } from "@/components/lore/HeroLinks";
import SmartImage from "@/components/ui/SmartImage";
import { heroSplash } from "@/lib/images";
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
    const leadHero = !compact ? discoveryHeroes[0] : undefined;

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

                <div className={leadHero ? "grid lg:grid-cols-[minmax(0,1fr)_19rem]" : ""}>
                    {leadHero && (
                        <Link
                            href={`/lore/heroes/${leadHero.slug}`}
                            className="group relative order-first overflow-hidden border-b border-line bg-subtle lg:order-last lg:h-full lg:border-b-0 lg:border-l"
                        >
                            <div className="relative aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
                                <SmartImage
                                    image={heroSplash(leadHero)}
                                    alt={`${leadHero.name} skin artwork`}
                                    name={leadHero.name}
                                    sizes="(max-width: 1024px) 100vw, 304px"
                                    priority
                                    className="h-full w-full"
                                    imgClassName="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(4,5,6,0.94)_0%,transparent_68%)]" />
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <span className="eyebrow text-white/60">Linked hero</span>
                                    <p className="display mt-1 text-2xl leading-none text-white">{leadHero.name}</p>
                                    {leadHero.title && (
                                        <p className="mt-1 truncate text-xs text-white/60">{leadHero.title}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

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
            </div>
        </article>
    );
}
