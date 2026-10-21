import Link from "next/link";
import { ArrowRight, Sparkles, Swords, TrendingUp, Layers, Shield, Crosshair, Wand2 } from "lucide-react";
import HeroCard from "@/components/hero/HeroCard";
import HeroQuickSearch from "@/components/home/HeroQuickSearch";
import { SectionHeader, Badge } from "@/components/ui/primitives";
import {
    heroes,
    items,
    patches,
    countByRole,
    countByLane,
    getLatestPatch,
    type Role,
} from "@/data";

const ROLE_ICONS: Record<Role, typeof Shield> = {
    Tank: Shield,
    Fighter: Swords,
    Assassin: Crosshair,
    Mage: Wand2,
    Marksman: Crosshair,
    Support: Sparkles,
};

const FEATURED_SLUGS = ["fanny", "gusion", "chou", "tigreal", "lancelot", "angela"];

export default function HomeSections() {
    const featured = FEATURED_SLUGS.map((slug) => heroes.find((hero) => hero.slug === slug)).filter(
        (hero): hero is NonNullable<typeof hero> => Boolean(hero)
    );
    const roleCounts = countByRole();
    const laneCounts = countByLane();
    const newest = [...heroes]
        .filter((hero) => hero.releaseYear)
        .sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0) || (b.release ?? "").localeCompare(a.release ?? ""))
        .slice(0, 4);
    const latestPatch = getLatestPatch();

    return (
        <div className="mx-auto max-w-shell space-y-20 px-4 py-16 sm:px-6 lg:px-8">
            <section>
                <SectionHeader
                    eyebrow="Start here"
                    title="Find a hero fast"
                    description="Search the roster by name, role, or lane — or jump straight into the full catalogue."
                    action={
                        <Link
                            href="/heroes"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                        >
                            All {heroes.length} heroes <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    }
                />
                <HeroQuickSearch />
            </section>

            <section>
                <SectionHeader
                    eyebrow="Signature picks"
                    title="Featured heroes"
                    description="High-impact heroes worth learning first, each with verified stats and full ability data."
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    {featured.map((hero, index) => (
                        <HeroCard key={hero.slug} hero={hero} priority={index < 3} />
                    ))}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-panel border border-line bg-elevated p-6 sm:p-8">
                    <SectionHeader
                        eyebrow="Roster breakdown"
                        title="Roles and lanes"
                        description="See how the roster is distributed, then filter to the heroes that fit your playstyle."
                    />

                    <div className="space-y-6">
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-faint">
                                <Layers size={13} aria-hidden="true" /> By role
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {roleCounts.map(({ role, count }) => {
                                    const Icon = ROLE_ICONS[role];
                                    return (
                                        <Link
                                            key={role}
                                            href={`/heroes?role=${role.toLowerCase()}`}
                                            className="group inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                                        >
                                            <Icon size={12} aria-hidden="true" />
                                            {role}
                                            <span className="font-mono text-[10px] text-faint group-hover:text-accent">
                                                {count}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hairline" />

                        <div>
                            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-faint">
                                <TrendingUp size={13} aria-hidden="true" /> By lane
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {laneCounts.map(({ lane, count }) => (
                                    <Link
                                        key={lane}
                                        href={`/heroes?lane=${encodeURIComponent(lane.toLowerCase())}`}
                                        className="group inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                                    >
                                        {lane}
                                        <span className="font-mono text-[10px] text-faint group-hover:text-accent">
                                            {count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-panel border border-line bg-elevated p-6 sm:p-8">
                    <div className="eyebrow mb-2">Latest additions</div>
                    <h2 className="font-display text-2xl">Newest in the codex</h2>
                    <p className="mt-1.5 text-sm text-muted">
                        Heroes with the most recent verified release dates.
                    </p>

                    <ul className="mt-5 divide-y divide-line">
                        {newest.map((hero) => (
                            <li key={hero.slug}>
                                <Link
                                    href={`/hero/${hero.slug}`}
                                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-accent"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium">{hero.name}</span>
                                        <span className="block truncate text-xs text-faint">
                                            {hero.roles.join(" · ")} · {hero.lanes.join(" · ")}
                                        </span>
                                    </span>
                                    <span className="shrink-0 font-mono text-[11px] text-faint">
                                        {hero.releaseYear}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {latestPatch && (
                        <>
                            <div className="hairline my-5" />
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="eyebrow mb-1">Patch reference</div>
                                    <p className="text-sm font-medium">Patch {latestPatch.version}</p>
                                </div>
                                <Badge tone="neutral">Latest known</Badge>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section>
                <SectionHeader
                    eyebrow="Toolkit"
                    title="Plan before you queue"
                    description="Practical tools built on the same verified dataset."
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ToolCard
                        href="/tools/compare"
                        title="Compare heroes"
                        description="Line up two heroes side by side across stats, skills, and matchups."
                        icon={Swords}
                    />
                    <ToolCard
                        href="/tools/counters"
                        title="Counter explorer"
                        description="See who a hero is strong against, weak against, and pairs well with."
                        icon={Crosshair}
                    />
                    <ToolCard
                        href="/tools/favourites"
                        title="Favourites"
                        description="Keep a shortlist of heroes you are learning or main."
                        icon={Sparkles}
                    />
                    <ToolCard
                        href="/tools/random"
                        title="Random picker"
                        description="Undecided? Draw a hero filtered by role or lane."
                        icon={Wand2}
                    />
                </div>
            </section>

            <section>
                <SectionHeader
                    eyebrow="Reference"
                    title="Items and emblems"
                    description={`${items.length} items and the current role emblem system, ready to browse.`}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/items"
                        className="group flex items-center justify-between gap-4 rounded-panel border border-line bg-elevated p-6 transition-colors hover:border-line-strong"
                    >
                        <div>
                            <h3 className="font-display text-2xl">Item database</h3>
                            <p className="mt-1 text-sm text-muted">
                                Browse {items.length} items with stats, passives, and build paths.
                            </p>
                        </div>
                        <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/emblems"
                        className="group flex items-center justify-between gap-4 rounded-panel border border-line bg-elevated p-6 transition-colors hover:border-line-strong"
                    >
                        <div>
                            <h3 className="font-display text-2xl">Emblem system</h3>
                            <p className="mt-1 text-sm text-muted">
                                The current role-based emblems and their talent options.
                            </p>
                        </div>
                        <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <section className="rounded-panel border border-line bg-elevated p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="eyebrow mb-2">Data</div>
                        <h2 className="font-display text-2xl">Transparent sourcing</h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                            Hero metadata, base stats, skins, and artwork come from MLBBDex and the Mobile
                            Legends Wiki. Skill icons and matchup notes come from the official Moonton feed.
                            Nothing here is invented to fill gaps.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Badge tone="neutral">{heroes.length} heroes</Badge>
                        <Badge tone="neutral">{items.length} items</Badge>
                        <Badge tone="neutral">{patches.length} patches</Badge>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ToolCard({
    href,
    title,
    description,
    icon: Icon,
}: {
    href: string;
    title: string;
    description: string;
    icon: typeof Shield;
}) {
    return (
        <Link
            href={href}
            className="group rounded-panel border border-line bg-elevated p-5 transition-colors hover:border-line-strong"
        >
            <Icon size={18} className="text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight size={12} aria-hidden="true" />
            </span>
        </Link>
    );
}
