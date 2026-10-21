import type { Metadata } from "next";
import HeroBrowser from "@/components/hero/HeroBrowser";
import { heroes } from "@/data";

export const metadata: Metadata = {
    title: "Heroes",
    description: `Browse all ${heroes.length} Mobile Legends heroes. Filter by role, lane, and favourites; compare stats, skills, and skins.`,
    alternates: { canonical: "/heroes" },
};

export default function HeroesPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 max-w-2xl">
                <div className="eyebrow mb-3">The roster</div>
                <h1 className="font-display text-4xl leading-tight sm:text-5xl">Every hero, in one place</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    Search the full roster, combine role and lane filters, and open any hero for
                    verified stats, skills, skins, and matchups.
                </p>
            </header>
            <HeroBrowser />
        </div>
    );
}
