"use client";

import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import { useFavourites } from "@/lib/use-favourites";
import SmartImage from "@/components/ui/SmartImage";
import { heroCardArt } from "@/lib/images";
import type { Hero } from "@/data";

export default function HeroCard({ hero, priority = false }: { hero: Hero; priority?: boolean }) {
    const { isFavourite, toggle, ready } = useFavourites();
    const favourite = ready && isFavourite(hero.slug);

    return (
        <article className="group relative">
            <Link
                href={`/hero/${hero.slug}`}
                className="block overflow-hidden rounded-card border border-line bg-elevated transition-all duration-300 hover:border-line-strong hover:shadow-panel"
            >
                <div className="relative">
                    <SmartImage
                        image={heroCardArt(hero)}
                        alt={`${hero.name} splash art`}
                        name={hero.name}
                        priority={priority}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        rounded="rounded-none"
                        className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-3.5">
                        <h3 className="font-display text-xl leading-tight text-white drop-shadow">{hero.name}</h3>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-white/65">
                            {hero.roles.join(" · ")}
                        </p>
                    </div>

                    <span className="pointer-events-none absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
                    <span className="truncate text-[11px] text-faint">{hero.lanes.join(" · ")}</span>
                    <span className="shrink-0 font-mono text-[10px] text-faint">
                        {hero.releaseYear ?? "—"}
                    </span>
                </div>
            </Link>

            <button
                type="button"
                onClick={() => toggle(hero.slug)}
                aria-pressed={favourite}
                aria-label={`${favourite ? "Remove" : "Add"} ${hero.name} ${favourite ? "from" : "to"} favourites`}
                className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition-colors ${favourite
                        ? "bg-accent text-accent-contrast"
                        : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
                    }`}
            >
                <Heart size={14} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
            </button>
        </article>
    );
}
