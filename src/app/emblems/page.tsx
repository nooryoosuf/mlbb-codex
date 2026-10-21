import type { Metadata } from "next";
import { emblems, talents } from "@/data/emblems";
import { EmblemGrid } from "@/components/emblems/EmblemGrid";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Emblems",
    description:
        "The current Mobile Legends role emblem system with attributes, recommended heroes, and the full talent pool.",
    alternates: { canonical: "/emblems" },
};

export default function EmblemsPage() {
    return (
        <>
            <PageHeader
                index="04"
                eyebrow="Loadout"
                title="Emblems"
                description="The role-based emblem sets in the current system, with their stats and the talent pool you can mix across them."
                meta={
                    <div className="flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{emblems.length}</span> emblems</span>
                        <span><span className="text-fg">{talents.length}</span> talents</span>
                    </div>
                }
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <EmblemGrid emblems={emblems} talents={talents} />
            </div>
        </>
    );
}
