import type { Metadata } from "next";
import FavouritesTool from "@/components/tools/FavouritesTool";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Favourites",
    description: "Your saved Mobile Legends heroes, stored locally in this browser.",
    alternates: { canonical: "/tools/favourites" },
};

export default function FavouritesPage() {
    return (
        <>
            <PageHeader
                index="04.3"
                eyebrow="Tool"
                title="Favourites"
                description="A shortlist of the heroes you are learning or main."
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <FavouritesTool />
            </div>
        </>
    );
}
