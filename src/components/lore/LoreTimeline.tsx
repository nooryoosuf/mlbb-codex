import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LoreSources from "@/components/lore/LoreSources";
import { HeroChips } from "@/components/lore/HeroLinks";
import type { LoreArc, LoreEra, LoreEvent } from "@/data/lore";
import { heroes } from "@/data";

function toHeroes(slugs: string[]) {
    return slugs
        .map((slug) => heroes.find((hero) => hero.slug === slug))
        .filter((hero): hero is (typeof heroes)[number] => Boolean(hero));
}

export default function LoreTimeline({
    eras,
    events,
    arcs,
}: {
    eras: LoreEra[];
    events: LoreEvent[];
    arcs: LoreArc[];
}) {
    return (
        <div className="space-y-14">
            {eras.map((era, eraIndex) => {
                const eraEvents = events.filter((event) => event.eraId === era.id);
                const eraArcs = arcs.filter((arc) => arc.eraId === era.id);

                return (
                    <section key={era.id} aria-labelledby={`era-${era.id}`}>
                        <div className="grid gap-6 border-t border-line pt-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
                            <div className="lg:sticky lg:top-20 lg:self-start">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                                        {String(eraIndex + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                                        {era.span}
                                    </span>
                                </div>
                                <h2 id={`era-${era.id}`} className="display mt-3 text-3xl leading-[0.95] lg:text-4xl">
                                    {era.name}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-muted">{era.summary}</p>
                            </div>

                            <div className="space-y-4">
                                {eraEvents.map((event, eventIndex) => (
                                    <article key={event.id} className="border border-line bg-elevated">
                                        <div className="flex items-start gap-4 p-4">
                                            <span className="mt-0.5 font-mono text-[9px] text-faint">
                                                {String(eventIndex + 1).padStart(2, "0")}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="display text-xl leading-tight">{event.title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted">{event.summary}</p>
                                                <div className="mt-3">
                                                    <HeroChips heroes={toHeroes(event.heroSlugs)} />
                                                </div>
                                                <div className="mt-3 border-t border-line pt-2.5">
                                                    <LoreSources sources={event.sources} confidence={event.confidence} compact />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}

                                {eraArcs.map((arc) => (
                                    <article key={arc.id} className="border border-line bg-subtle/40">
                                        <div className="border-b border-line px-4 py-3">
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <h3 className="display text-lg leading-none">{arc.title}</h3>
                                                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                                    Story arc · {arc.beats.length} beats
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted">{arc.summary}</p>
                                        </div>
                                        <ol className="divide-y divide-line">
                                            {arc.beats.map((beat, index) => (
                                                <li key={beat} className="flex gap-3 px-4 py-2.5">
                                                    <span className="mt-0.5 font-mono text-[9px] text-accent/70">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="text-[13px] leading-relaxed text-muted">{beat}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
                                            <HeroChips heroes={toHeroes(arc.heroSlugs)} />
                                            <LoreSources sources={arc.sources} confidence={arc.confidence} compact />
                                        </div>
                                    </article>
                                ))}

                                {eraEvents.length === 0 && eraArcs.length === 0 && (
                                    <p className="border border-dashed border-line-strong px-4 py-10 text-center text-sm text-faint">
                                        No dated events survive for this era. The record is archaeological.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}

            <div className="border border-line bg-elevated p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="max-w-xl text-sm leading-relaxed text-muted">
                        Where chronicles disagree on order or date, this timeline avoids a false precision. Follow a
                        hero&apos;s dossier for the version told in their own file.
                    </p>
                    <Link href="/lore/heroes" className="btn btn-ghost h-9 px-4">
                        Hero dossiers
                        <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
