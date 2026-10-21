import type { Metadata } from "next";
import FavouritesTool from "@/components/tools/FavouritesTool";

export const metadata: Metadata = {
    title: "Favourites",
    description: "Your saved Mobile Legends heroes, stored locally in this browser.",
    alternates: { canonical: "/tools/favourites" },
};

export default function FavouritesPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="eyebrow mb-2">Tool</div>
                <h1 className="font-display text-4xl">Favourites</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                    A shortlist of the heroes you are learning or main.
                </p>
            </header>
            <FavouritesTool />
        </div>
    );
}
