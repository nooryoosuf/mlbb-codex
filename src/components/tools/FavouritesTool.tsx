"use client";

import { Heart, Trash2 } from "lucide-react";
import HeroCard from "@/components/hero/HeroCard";
import { EmptyState, LinkButton } from "@/components/ui/primitives";
import { useFavourites } from "@/lib/use-favourites";
import { heroes } from "@/data";

export default function FavouritesTool() {
    const { favourites, ready, clear } = useFavourites();
    const saved = heroes.filter((hero) => favourites.includes(hero.slug));

    if (!ready) {
        return <p className="text-sm text-muted">Loading your favourites…</p>;
    }

    if (saved.length === 0) {
        return (
            <EmptyState
                title="No favourites yet"
                description="Tap the heart on any hero card or profile to build a shortlist. Favourites are stored in this browser."
                action={<LinkButton href="/heroes">Browse heroes</LinkButton>}
            />
        );
    }

    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    <span className="text-fg">{saved.length}</span> saved locally
                </p>
                <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-danger"
                >
                    <Trash2 size={12} aria-hidden="true" /> Clear all
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {saved.map((hero) => (
                    <HeroCard key={hero.slug} hero={hero} />
                ))}
            </div>

            <p className="mt-8 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                <Heart size={11} aria-hidden="true" /> Saved locally. No account required.
            </p>
        </div>
    );
}
