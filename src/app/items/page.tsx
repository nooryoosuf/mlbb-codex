import type { Metadata } from "next";
import { items } from "@/data";
import ItemBrowser from "@/components/items/ItemBrowser";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Items",
    description: `Browse all ${items.length} Mobile Legends items with stats, passives, recipes, and recommended users.`,
    alternates: { canonical: "/items" },
};

export default function ItemsPage() {
    return (
        <>
            <PageHeader
                index="03"
                eyebrow="Equipment"
                title="Item database"
                description="Every item in the current dataset with its bonuses, passive effects and build path."
                meta={
                    <div className="flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span><span className="text-fg">{items.length}</span> items</span>
                        <span><span className="text-fg">7</span> categories</span>
                    </div>
                }
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <ItemBrowser />
            </div>
        </>
    );
}
