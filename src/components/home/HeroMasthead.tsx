"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { heroSplash, heroPortrait } from "@/lib/images";
import { heroes, items, patches, meta, getHeroOfTheDay, getLatestPatch, type Hero } from "@/data";
import { useHydrated } from "@/lib/store";
import { SplitLines } from "@/components/ui/motion";

const skinCount = heroes.reduce((total, hero) => total + hero.skins.length, 0);

const STATS = [
    { value: heroes.length, label: "Heroes" },
    { value: items.length, label: "Items" },
    { value: skinCount, label: "Skins" },
    { value: patches.length, label: "Patches" },
];

const MOST_BANNED = [...meta.heroes]
    .filter((entry) => entry.banRate !== null)
    .sort((a, b) => (b.banRate ?? 0) - (a.banRate ?? 0))
    .slice(0, 4);

export default function HeroMasthead() {
    const hydrated = useHydrated();
    const spotlight: Hero = hydrated ? getHeroOfTheDay() : heroes[0];
    const reduce = useReducedMotion();

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const x = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 });
    const y = useSpring(my, { stiffness: 50, damping: 18, mass: 0.6 });

    useEffect(() => {
        if (reduce) return;
        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            mx.set((event.clientX / window.innerWidth - 0.5) * -18);
            my.set((event.clientY / window.innerHeight - 0.5) * -12);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
    }, [mx, my, reduce]);

    return (
        <section className="relative isolate overflow-hidden border-b border-line">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    className="absolute inset-y-[-4%] right-0 w-full lg:w-[68%]"
                    style={{ x, y }}
                    initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <SmartImage
                        image={heroSplash(spotlight)}
                        alt=""
                        name={spotlight.name}
                        priority
                        sizes="100vw"
                        className="h-full w-full"
                        imgClassName="object-cover object-top opacity-55 lg:opacity-80"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,var(--bg)_28%,transparent_78%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--bg)_0%,transparent_60%)]" />
                </motion.div>

                <div className="absolute inset-0 grid-lines opacity-70 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_72%)]" />
                <div className="absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-[140px]" />
                <div className="absolute right-0 top-0 hidden h-full w-px bg-line-strong lg:block" style={{ left: "62%" }} />
            </div>

            <div className="mx-auto flex min-h-[86svh] max-w-shell flex-col px-4 pt-14 sm:px-6 lg:px-8">
                <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16 lg:py-16">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-6 flex flex-wrap items-center gap-3"
                        >
                            <span className="inline-flex items-center gap-2 border border-line-strong bg-bg/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted backdrop-blur">
                                <span className="h-1.5 w-1.5 animate-pulse bg-accent" />
                                Mobile Legends companion
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                                Patch {getLatestPatch()?.version ?? "—"}
                            </span>
                        </motion.div>

                        <h1 className="display whitespace-normal text-[clamp(2.6rem,8vw,6.6rem)] sm:whitespace-nowrap">
                            <SplitLines
                                lines={[
                                    <span key="a">Know every hero.</span>,
                                    <span key="b" className="text-accent">Master every match.</span>,
                                ]}
                            />
                        </h1>

                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-7 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
                        >
                            Verified stats, skills, skins and matchups for all {heroes.length} heroes
                            — plus the tools to compare them and plan your next build. No invented
                            numbers, no filler.
                        </motion.p>

                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-9 flex flex-wrap items-center gap-2.5"
                        >
                            <Link href="/heroes" className="btn btn-primary">
                                <Search size={14} aria-hidden="true" />
                                Enter the codex
                            </Link>
                            <Link href={`/hero/${spotlight.slug}`} className="btn btn-ghost">
                                Spotlight: {spotlight.name}
                                <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full justify-self-end space-y-3 sm:max-w-sm lg:max-w-none"
                    >
                        <Link
                            href={`/hero/${spotlight.slug}`}
                            className="group relative block border border-line-strong bg-bg/70 p-4 backdrop-blur-md clip-notch transition-colors hover:border-accent"
                        >
                            <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
                                <span>Hero of the day</span>
                                <span className="text-accent">/ 01</span>
                            </div>

                            <div className="flex items-stretch gap-4">
                                <div className="w-16 shrink-0 border border-line-strong">
                                    <SmartImage
                                        image={heroPortrait(spotlight)}
                                        alt={`${spotlight.name} portrait`}
                                        name={spotlight.name}
                                        priority
                                        sizes="64px"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="display truncate text-3xl leading-none transition-colors group-hover:text-accent">
                                        {spotlight.name}
                                    </h2>
                                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                                        {spotlight.title ?? spotlight.roles.join(" · ")}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {[...spotlight.roles, ...spotlight.lanes].slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                                    {spotlight.releaseYear ?? "—"}
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                                    Open dossier
                                    <ArrowUpRight size={12} aria-hidden="true" />
                                </span>
                            </div>
                        </Link>

                        <div className="border border-line bg-bg/70 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                                    Live meta / ban rate
                                </span>
                                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                    {meta.snapshot}
                                </span>
                            </div>
                            <ol>
                                {MOST_BANNED.map((entry, index) => (
                                    <li key={entry.slug} className="border-b border-line last:border-b-0">
                                        <Link
                                            href={`/hero/${entry.slug}`}
                                            className="group grid grid-cols-[0.9rem_1fr_auto] items-center gap-2 px-3 py-2"
                                        >
                                            <span className="font-mono text-[9px] text-faint">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="truncate text-[12px] text-fg transition-colors group-hover:text-accent">
                                                        {entry.name}
                                                    </span>
                                                    <span className="shrink-0 border border-line px-1 font-mono text-[8px] leading-4 text-faint">
                                                        {entry.tier ?? "—"}
                                                    </span>
                                                </span>
                                                <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                                                    W {entry.winRate?.toFixed(1) ?? "—"} / P {entry.pickRate?.toFixed(1) ?? "—"}
                                                </span>
                                            </span>
                                            <span className="text-right">
                                                <span className="block font-mono text-sm leading-none text-accent">
                                                    {entry.banRate?.toFixed(1)}%
                                                </span>
                                                <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.12em] text-faint">
                                                    banned
                                                </span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                            <Link
                                href="/meta"
                                className="flex items-center justify-between border-t border-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                            >
                                Full meta board
                                <ArrowRight size={11} aria-hidden="true" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <motion.dl
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    className="grid grid-cols-2 border-t border-line sm:grid-cols-4"
                >
                    {STATS.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`flex items-baseline gap-3 px-1 py-5 sm:px-4 ${index !== 0 ? "sm:border-l sm:border-line" : ""} ${
                                index % 2 === 1 ? "border-l border-line" : ""
                            }`}
                        >
                            <dd className="display text-4xl leading-none sm:text-5xl">{stat.value}</dd>
                            <dt className="eyebrow">{stat.label}</dt>
                        </div>
                    ))}
                </motion.dl>
            </div>

            <div className="marquee overflow-hidden border-t border-line py-2.5">
                <div className="marquee-track">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                            {heroes.slice(0, 24).map((hero) => (
                                <span
                                    key={`${copy}-${hero.slug}`}
                                    className="flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint"
                                >
                                    <span className="px-5">{hero.name}</span>
                                    <span className="text-accent/60">/</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
