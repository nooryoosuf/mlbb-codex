import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers, TrendingUp } from "lucide-react";
import HeroCard from "@/components/hero/HeroCard";
import HeroQuickSearch from "@/components/home/HeroQuickSearch";
import PatchNotesSection from "@/components/patches/PatchNotesSection";
import SmartImage from "@/components/ui/SmartImage";
import { SectionHeader, Badge } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import {
    heroes,
    items,
    patches,
    countByRole,
    countByLane,
    getLatestPatch,
} from "@/data";
import {
    BIRTHDAYS,
    BIRTHDAY_STATS,
    SHARED_BIRTHDAY_DATES,
    getBirthdayHeroes,
} from "@/data/birthdays";
import { LORE_STATS } from "@/data/lore";
import { asset } from "@/lib/base-path";
import { formatBirthday } from "@/lib/birthdays";

const FEATURED_SLUGS = ["fanny", "gusion", "chou", "tigreal", "lancelot", "angela"];

const TOOLS = [
    {
        href: "/tools/compare",
        title: "Compare",
        description: "Put two heroes side by side across base stats, abilities and matchups.",
    },
    {
        href: "/tools/counters",
        title: "Counters",
        description: "Read who a hero beats, who beats them, and who they pair with.",
    },
    {
        href: "/tools/random",
        title: "Random picker",
        description: "Undecided? Draw a hero constrained to a role or lane.",
    },
    {
        href: "/tools/favourites",
        title: "Favourites",
        description: "Keep a shortlist of the heroes you are learning or maining.",
    },
];

export default function HomeSections() {
    const featured = FEATURED_SLUGS.map((slug) => heroes.find((hero) => hero.slug === slug)).filter(
        (hero): hero is NonNullable<typeof hero> => Boolean(hero)
    );
    const roleCounts = countByRole();
    const laneCounts = countByLane();
    const newest = [...heroes]
        .filter((hero) => hero.releaseYear)
        .sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0) || (b.release ?? "").localeCompare(a.release ?? ""))
        .slice(0, 5);
    const latestPatch = getLatestPatch();
    const totalRole = roleCounts.reduce((sum, entry) => sum + entry.count, 0);
    const specimenDate =
        SHARED_BIRTHDAY_DATES.find((date) => getBirthdayHeroes(date).length >= 3) ??
        SHARED_BIRTHDAY_DATES[0] ??
        BIRTHDAYS[0]?.date ??
        "01-01";
    const specimenHeroes = getBirthdayHeroes(specimenDate).slice(0, 3);

    return (
        <div className="mx-auto max-w-shell space-y-24 px-4 py-20 sm:px-6 lg:px-8">
            <section>
                <SectionHeader
                    index="01"
                    eyebrow="Find a hero"
                    title="Start with the roster"
                    description="Search by name, role, lane or specialty. Every profile carries verified stats, abilities, skins and matchups."
                    action={
                        <Link href="/heroes" className="link-arrow">
                            All {heroes.length} heroes <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    }
                />
                <Reveal>
                    <HeroQuickSearch />
                </Reveal>
            </section>

            <section>
                <SectionHeader
                    index="02"
                    eyebrow="Signature picks"
                    title="Featured heroes"
                    description="High-impact heroes worth learning first, each with full ability data."
                    action={
                        <Link href="/heroes" className="link-arrow">
                            Browse roster <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    }
                />
                <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    {featured.map((hero, index) => (
                        <StaggerItem key={hero.slug}>
                            <HeroCard hero={hero} priority={index < 3} />
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>

            <section>
                <SectionHeader index="03" eyebrow="Roster breakdown" title="Roles and lanes" />
                <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="bg-elevated p-6 sm:p-8">
                        <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                            <Layers size={12} aria-hidden="true" /> By role
                        </div>
                        <ul className="space-y-4">
                            {roleCounts.map(({ role, count }) => (
                                <li key={role}>
                                    <Link href={`/heroes?role=${role.toLowerCase()}`} className="group block">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-fg">
                                                {role}
                                            </span>
                                            <span className="display text-lg leading-none text-fg/80 transition-colors group-hover:text-accent">
                                                {count}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-px w-full bg-subtle">
                                            <div
                                                className="h-px bg-accent/50 transition-all duration-500 group-hover:bg-accent"
                                                style={{ width: `${(count / totalRole) * 100}%` }}
                                            />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                            <TrendingUp size={12} aria-hidden="true" /> By lane
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {laneCounts.map(({ lane, count }) => (
                                <Link
                                    key={lane}
                                    href={`/heroes?lane=${encodeURIComponent(lane.toLowerCase())}`}
                                    className="tag"
                                >
                                    {lane}
                                    <span className="text-faint">{count}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-elevated p-6 sm:p-8">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="eyebrow">Latest additions</div>
                            {latestPatch && <Badge tone="accent">Patch {latestPatch.version}</Badge>}
                        </div>
                        <ol className="divide-y divide-line">
                            {newest.map((hero, index) => (
                                <li key={hero.slug}>
                                    <Link
                                        href={`/hero/${hero.slug}`}
                                        className="group flex items-center gap-3 py-3"
                                    >
                                        <span className="font-mono text-[10px] text-faint">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium transition-colors group-hover:text-accent">
                                                {hero.name}
                                            </span>
                                            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                                {hero.roles.join(" / ")}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[10px] text-faint">
                                            {hero.releaseYear}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader
                    index="04"
                    eyebrow="Toolkit"
                    title="Plan before you queue"
                    description="Practical tools built on the same verified dataset."
                />
                <div className="border-t border-line">
                    {TOOLS.map((tool, index) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-5 transition-colors hover:bg-elevated sm:grid-cols-[3.5rem_14rem_1fr_auto] sm:gap-6"
                        >
                            <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-accent">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
                                {tool.title}
                            </span>
                            <span className="col-span-2 text-sm leading-relaxed text-muted sm:col-span-1">
                                {tool.description}
                            </span>
                            <ArrowUpRight
                                size={18}
                                className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                                aria-hidden="true"
                            />
                        </Link>
                    ))}
                </div>
            </section>

            <PatchNotesSection />

            <section>
                <SectionHeader
                    index="06"
                    eyebrow="Lore"
                    title="The story behind the stats"
                    description="Sourced dossiers, a relationship graph and an atlas of the Land of Dawn — because every pick has a history."
                    action={
                        <Link href="/lore" className="link-arrow">
                            Explore the lore <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    }
                />
                <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            href: "/lore/heroes",
                            label: "Dossiers",
                            title: "Every hero file",
                            body: `${LORE_STATS.heroes} sourced origins, species, affiliations and relationships.`,
                        },
                        {
                            href: "/lore/relationships",
                            label: "Graph",
                            title: "Who knows whom",
                            body: `${LORE_STATS.relations} cited links across kinship, romance and war.`,
                        },
                        {
                            href: "/lore/world",
                            label: "Atlas",
                            title: "The Land of Dawn",
                            body: `${LORE_STATS.regions} regions, their subregions and ${LORE_STATS.places - LORE_STATS.regions} places.`,
                        },
                        {
                            href: "/lore/timeline",
                            label: "History",
                            title: "Five eras",
                            body: "From the Ancient Ones to the present age, without invented dates.",
                        },
                    ].map((entry) => (
                        <Link
                            key={entry.href}
                            href={entry.href}
                            className="group flex flex-col justify-between bg-elevated p-5 transition-colors hover:bg-subtle"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="eyebrow">{entry.label}</span>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-faint transition-colors group-hover:text-accent"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="display mt-6 text-2xl transition-colors group-hover:text-accent">
                                    {entry.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">{entry.body}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader
                    index="07"
                    eyebrow="Community"
                    title="Who shares your birthday?"
                    description={`${BIRTHDAY_STATS.documented} documented hero birthdays, ${BIRTHDAY_STATS.sharedDates} shared dates and a card to keep.`}
                    action={
                        <Link href="/community/birthday-twin" className="link-arrow">
                            Find your twin <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    }
                />
                <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.05fr_0.95fr]">
                    <Link
                        href="/community/birthday-twin"
                        className="group relative overflow-hidden bg-elevated p-7 transition-colors hover:bg-subtle sm:p-9"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span className="eyebrow">Birthday Twin / 01</span>
                            <ArrowUpRight
                                size={18}
                                className="text-faint transition-colors group-hover:text-accent"
                                aria-hidden="true"
                            />
                        </div>
                        <h3 className="display mt-10 max-w-md text-4xl transition-colors group-hover:text-accent sm:text-5xl">
                            The day you were born is in the roster.
                        </h3>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                            Pick a month and day, reveal every matching hero, and leave with a
                            branded card. Dates are sourced, and shared birthdays are expected.
                        </p>
                        <span className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                            Open the reveal
                            <ArrowUpRight size={12} aria-hidden="true" />
                        </span>
                    </Link>

                    <div className="relative overflow-hidden bg-bg p-4 sm:p-6">
                        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
                        <div className="relative flex h-full flex-col justify-between gap-4">
                            <div className="flex items-center justify-between gap-3 border-b border-line pb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                <span>Shared date</span>
                                <span className="text-accent">{formatBirthday(specimenDate)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {specimenHeroes.map((hero) => (
                                    <div
                                        key={hero.slug}
                                        className="border border-line bg-elevated p-1.5"
                                    >
                                        <SmartImage
                                            image={{
                                                src: asset(hero.portrait),
                                                aspect: "240 / 390",
                                                local: true,
                                            }}
                                            alt={`${hero.name} portrait`}
                                            name={hero.name}
                                            priority
                                            sizes="(max-width: 640px) 28vw, 11rem"
                                        />
                                        <div className="px-1 pb-1 pt-2">
                                            <div className="display truncate text-sm leading-none sm:text-base">
                                                {hero.name}
                                            </div>
                                            <div className="mt-1 truncate font-mono text-[7px] uppercase tracking-[0.12em] text-faint">
                                                {hero.roles.join(" / ")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed text-faint">
                                {specimenHeroes.length} heroes on one date. Your birthday may have
                                more.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-px border border-line bg-line sm:grid-cols-2">
                <Link
                    href="/items"
                    className="group relative overflow-hidden bg-elevated p-7 transition-colors hover:bg-subtle sm:p-9"
                >
                    <div className="flex items-start justify-between">
                        <div className="eyebrow">Reference / {items.length} entries</div>
                        <ArrowUpRight size={18} className="text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="display mt-10 text-4xl transition-colors group-hover:text-accent sm:text-5xl">
                        Item database
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                        Stats, passives and build paths for every item in the shop.
                    </p>
                </Link>
                <Link
                    href="/emblems"
                    className="group relative overflow-hidden bg-elevated p-7 transition-colors hover:bg-subtle sm:p-9"
                >
                    <div className="flex items-start justify-between">
                        <div className="eyebrow">Reference / 7 emblems</div>
                        <ArrowUpRight size={18} className="text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="display mt-10 text-4xl transition-colors group-hover:text-accent sm:text-5xl">
                        Emblem system
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                        Role emblems, attributes and the full talent pool.
                    </p>
                </Link>
            </section>

            <section className="flex flex-col gap-6 border border-line bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <div className="eyebrow mb-2">Data</div>
                    <h2 className="display text-2xl">Transparent sourcing</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                        Metadata, base stats, skins and artwork come from MLBBDex and the Mobile Legends
                        Wiki. Skill icons and matchup notes come from the official Moonton feed. Nothing
                        is invented to fill gaps.
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Badge tone="neutral">{heroes.length} heroes</Badge>
                    <Badge tone="neutral">{items.length} items</Badge>
                    <Badge tone="neutral">{patches.length} patches</Badge>
                </div>
            </section>
        </div>
    );
}
