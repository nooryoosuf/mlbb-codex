import type { Metadata } from "next";
import { emblems, talents } from "@/data/emblems";
import { EmblemGrid } from "@/components/emblems/EmblemGrid";

export const metadata: Metadata = {
    title: "Emblems",
    description:
        "The current Mobile Legends role emblem system with attributes, recommended heroes, and the full talent pool.",
    alternates: { canonical: "/emblems" },
};

export default function EmblemsPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 max-w-2xl">
                <div className="eyebrow mb-3">Loadout</div>
                <h1 className="font-display text-4xl leading-tight sm:text-5xl">Emblems</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    The role-based emblem sets introduced in the current system, with their stats and the
                    talent pool you can mix across them.
                </p>
            </header>

            <EmblemGrid emblems={emblems} talents={talents} />
        </div>
    );
}
