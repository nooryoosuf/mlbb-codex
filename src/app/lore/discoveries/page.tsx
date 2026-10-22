import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import DailyDiscovery from "@/components/lore/DailyDiscovery";
import { SectionHeader } from "@/components/ui/primitives";
import { LORE_DISCOVERIES, type DiscoveryCategory } from "@/data/lore";

export const metadata: Metadata = {
    title: "Lore discoveries",
    description:
        "Sourced details from the Land of Dawn: hidden kinships, old romances, sealed tyrants, cursed cities and the objects that bind them.",
    alternates: { canonical: "/lore/discoveries" },
};

const CATEGORIES: { id: DiscoveryCategory; label: string; blurb: string }[] = [
    { id: "kinship", label: "Kinship", blurb: "Blood, adoption and ancestry hiding in plain sight." },
    { id: "romance", label: "Romance", blurb: "Betrothals, crushes and the wars they cause." },
    { id: "rivalry", label: "Rivalry", blurb: "Old partners, sealed tyrants and unresolved contests." },
    { id: "place", label: "Places", blurb: "Cities that are not what their names suggest." },
    { id: "artifact", label: "Artifacts", blurb: "Objects with enough history to run their own plot." },
    { id: "identity", label: "Identity", blurb: "Ages, prototypes and reincarnations." },
];

export default function DiscoveriesPage() {
    return (
        <>
            <PageHeader
                index="07.05"
                eyebrow="Discoveries"
                title="The details the roster hides."
                description="A growing index of sourced revelations: the siblings, the centuries, the prototypes and the cursed city that the hero select screen never explains."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{LORE_DISCOVERIES.length}</span> discoveries</span>
                        <span><span className="text-fg">{CATEGORIES.length}</span> categories</span>
                        <span>Every entry cited</span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="space-y-16">
                    {CATEGORIES.map((category, index) => {
                        const entries = LORE_DISCOVERIES.filter(
                            (discovery) => discovery.category === category.id
                        );
                        if (entries.length === 0) return null;
                        return (
                            <section key={category.id} aria-labelledby={`category-${category.id}`}>
                                <SectionHeader
                                    index={String(index + 1).padStart(2, "0")}
                                    eyebrow={category.label}
                                    title={`${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
                                    description={category.blurb}
                                />
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {entries.map((discovery) => (
                                        <DailyDiscovery key={discovery.id} discovery={discovery} compact />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
