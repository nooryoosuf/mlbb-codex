import type { Metadata } from "next";
import HeroBrowser from "@/components/hero/HeroBrowser";
import PageHeader from "@/components/layout/PageHeader";
import { heroes, items } from "@/data";

export const metadata: Metadata = {
    title: "Heroes",
    description: `Browse all ${heroes.length} Mobile Legends heroes. Filter by role, lane, and favourites; compare stats, skills, and skins.`,
    alternates: { canonical: "/heroes" },
};

export default function HeroesPage() {
    return (
        <>
            <PageHeader
                index="02"
                eyebrow="The roster"
                title="Every hero. One codex."
                description={`Search all ${heroes.length} heroes, combine role and lane filters, and open any dossier for verified stats, abilities, skins and matchups.`}
                meta={
                    <div className="flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{heroes.length}</span> heroes</span>
                        <span><span className="text-fg">{items.length}</span> items</span>
                        <span><span className="text-fg">134</span> dossiers</span>
                    </div>
                }
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <HeroBrowser />
            </div>
        </>
    );
}
