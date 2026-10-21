import type { Metadata } from "next";
import { items } from "@/data";
import ItemBrowser from "@/components/items/ItemBrowser";

export const metadata: Metadata = {
    title: "Items",
    description: `Browse all ${items.length} Mobile Legends items with stats, passives, recipes, and recommended users.`,
    alternates: { canonical: "/items" },
};

export default function ItemsPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 max-w-2xl">
                <div className="eyebrow mb-3">Equipment</div>
                <h1 className="font-display text-4xl leading-tight sm:text-5xl">Item database</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    Every item in the current dataset with its bonuses, passive effects, and build path.
                </p>
            </header>
            <ItemBrowser />
        </div>
    );
}
