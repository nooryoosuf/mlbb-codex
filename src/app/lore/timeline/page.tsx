import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import LoreTimeline from "@/components/lore/LoreTimeline";
import { LORE_ARCS, LORE_ERAS, LORE_EVENTS } from "@/data/lore";

export const metadata: Metadata = {
    title: "Timeline",
    description:
        "The history of the Land of Dawn, from the Ancient Ones through the Endless War and the fall of Ridgeburg to the present age.",
    alternates: { canonical: "/lore/timeline" },
};

export default function TimelinePage() {
    return (
        <>
            <PageHeader
                index="07.04"
                eyebrow="Timeline"
                title="Before the queue, there was a war."
                description="The setting's history is told in fragments: a dragon swallowing a god, a city sealed in mist, a king sleeping through a plane war. This timeline keeps only what a cited source states, and marks the rest as conjecture."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{LORE_ERAS.length}</span> eras</span>
                        <span><span className="text-fg">{LORE_EVENTS.length}</span> events</span>
                        <span><span className="text-fg">{LORE_ARCS.length}</span> arcs</span>
                    </div>
                }
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <LoreTimeline eras={LORE_ERAS} events={LORE_EVENTS} arcs={LORE_ARCS} />
            </div>
        </>
    );
}
