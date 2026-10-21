"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroSplash, heroPortrait } from "@/lib/images";
import { heroes, getHeroOfTheDay, type Hero } from "@/data";
import { useHydrated } from "@/lib/store";

const QUICK_LINKS = [
    { href: "/heroes", label: "Heroes" },
    { href: "/items", label: "Items" },
    { href: "/emblems", label: "Emblems" },
    { href: "/tools/compare", label: "Compare" },
    { href: "/tools/counters", label: "Counters" },
];

export default function HeroMasthead() {
    // Resolved after hydration so the static build does not freeze on its build date.
    const hydrated = useHydrated();
    const spotlight: Hero = hydrated ? getHeroOfTheDay() : heroes[0];

    return (
        <section className="relative isolate overflow-hidden border-b border-line">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_-10%,var(--accent-soft),transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />
            </div>

            <div className="mx-auto grid max-w-shell gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-16">
                <div className="max-w-xl">
                    <div className="eyebrow mb-5 flex items-center gap-2">
                        <Sparkles size={12} className="text-accent" aria-hidden="true" />
                        Mobile Legends companion
                    </div>

                    <h1 className="font-display text-[2.75rem] leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.25rem]">
                        Know every hero.
                        <br />
                        <span className="text-accent">Master every match.</span>
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                        Verified stats, skills, skins, and matchups for all {heroes.length} Mobile Legends
                        heroes — plus the tools to compare them and plan your next build.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/heroes"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-strong"
                        >
                            <Search size={16} aria-hidden="true" />
                            Browse the roster
                        </Link>
                        <Link
                            href={`/hero/${spotlight.slug}`}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line-strong px-5 text-sm font-semibold text-fg transition-colors hover:bg-subtle"
                        >
                            Hero of the day
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-6 text-sm">
                        {QUICK_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-fg">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <Link href={`/hero/${spotlight.slug}`} className="group block">
                        <div className="relative overflow-hidden rounded-panel border border-line-strong bg-elevated shadow-panel">
                            <SmartImage
                                image={heroSplash(spotlight)}
                                alt={`${spotlight.name} splash art`}
                                name={spotlight.name}
                                priority
                                sizes="(max-width: 1024px) 100vw, 46vw"
                                rounded="rounded-none"
                                imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 sm:p-5">
                                <div className="h-20 w-14 shrink-0 overflow-hidden rounded border border-white/20 sm:h-24 sm:w-16">
                                    <SmartImage
                                        image={heroPortrait(spotlight)}
                                        alt={`${spotlight.name} portrait`}
                                        name={spotlight.name}
                                        rounded="rounded-none"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                                        Hero of the day
                                    </div>
                                    <h2 className="truncate font-display text-2xl text-white sm:text-3xl">
                                        {spotlight.name}
                                    </h2>
                                    <p className="truncate text-xs text-white/70">
                                        {spotlight.title ?? spotlight.roles.join(" · ")}
                                    </p>
                                </div>
                                <span className="hidden shrink-0 rounded-full border border-white/25 px-3 py-1 text-[11px] text-white/80 transition-colors group-hover:border-accent group-hover:text-accent sm:block">
                                    View profile
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
