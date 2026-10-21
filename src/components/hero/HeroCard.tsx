"use client";

import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import { useFavourites } from "@/lib/use-favourites";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import type { Hero } from "@/data";

export default function HeroCard({ hero, priority = false }: { hero: Hero; priority?: boolean }) {
    const { isFavourite, toggle, ready } = useFavourites();
    const favourite = ready && isFavourite(hero.slug);

    return (
        <article className="group relative">
            <Link
                href={`/hero/${hero.slug}`}
                className="relative block overflow-hidden border border-line bg-elevated transition-colors duration-300 hover:border-accent/70"
            >
                <div className="relative aspect-[24/39] overflow-hidden">
                    <SmartImage
                        image={heroPortrait(hero)}
                        alt={`${hero.name} portrait`}
                        name={hero.name}
                        priority={priority}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                        className="h-full w-full"
                        imgClassName="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(4,5,6,0.92)_0%,rgba(4,5,6,0.25)_38%,transparent_62%)]" />
                    <div className="pointer-events-none absolute inset-0 border border-accent/0 transition-colors duration-300 group-hover:border-accent/25" />

                    <span className="absolute right-2 top-2 font-mono text-[9px] tracking-[0.18em] text-white/45">
                        {hero.releaseYear ?? ""}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="flex items-end justify-between gap-2">
                            <h3 className="display text-[1.35rem] leading-[0.9] text-white">
                                {hero.name}
                            </h3>
                            <ArrowUpRight
                                size={15}
                                className="mb-0.5 shrink-0 translate-y-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                            {hero.roles.join(" / ")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-line bg-elevated px-3 py-2">
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {hero.lanes.join(" / ")}
                    </span>
                    <span className="h-px w-6 bg-accent/50 transition-all duration-300 group-hover:w-10 group-hover:bg-accent" />
                </div>
            </Link>

            <button
                type="button"
                onClick={() => toggle(hero.slug)}
                aria-pressed={favourite}
                aria-label={`${favourite ? "Remove" : "Add"} ${hero.name} ${favourite ? "from" : "to"} favourites`}
                className={`absolute left-2 top-2 grid h-7 w-7 place-items-center border backdrop-blur transition-colors ${
                    favourite
                        ? "border-accent bg-accent text-accent-contrast"
                        : "border-white/20 bg-black/35 text-white/75 hover:border-white/50 hover:text-white"
                }`}
            >
                <Heart size={12} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
            </button>
        </article>
    );
}
