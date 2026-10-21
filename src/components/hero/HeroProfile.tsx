"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    Check,
    Swords,
    Shield,
    Sparkles,
    Crosshair,
    Clock,
    Droplet,
    ArrowUpRight,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { useFavourites } from "@/lib/use-favourites";
import { heroSplash, heroPortrait, skinImage, skillIcon } from "@/lib/images";
import {
    formatStat,
    statRange,
    getHeroNeighbours,
    getRelatedHeroes,
    type Hero,
    type HeroSkill,
} from "@/data";

const TYPE_LABEL: Record<string, string> = {
    passive: "Passive",
    active: "Skill",
    ultimate: "Ultimate",
};

export default function HeroProfile({ hero }: { hero: Hero }) {
    const { isFavourite, toggle, ready } = useFavourites();
    const [copied, setCopied] = useState(false);
    const [activeSkin, setActiveSkin] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<string | null>(null);

    const favourite = ready && isFavourite(hero.slug);
    const neighbours = getHeroNeighbours(hero.slug);
    const related = getRelatedHeroes(hero, 6);
    const skinsWithArt = hero.skins.filter((skin) => skin.image);
    const selectedSkin = skinsWithArt.find((skin) => skin.id === activeSkin) ?? null;

    async function share() {
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            if (navigator.share) {
                await navigator.share({ title: `${hero.name} — MLBB Codex`, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            /* user cancelled */
        }
    }

    return (
        <div>
            {/* ---------- Hero masthead ---------- */}
            <section className="relative isolate border-b border-line">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <SmartImage
                        image={heroSplash(hero)}
                        alt=""
                        name={hero.name}
                        priority
                        sizes="100vw"
                        rounded="rounded-none"
                        className="h-full w-full opacity-35"
                        imgClassName="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/45" />
                </div>

                <div className="mx-auto max-w-shell px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-faint">
                        <Link href="/" className="hover:text-fg">Home</Link>
                        <span aria-hidden="true">/</span>
                        <Link href="/heroes" className="hover:text-fg">Heroes</Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-muted" aria-current="page">{hero.name}</span>
                    </nav>

                    <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
                        <div className="relative w-28 shrink-0 sm:w-36">
                            <SmartImage
                                image={heroPortrait(hero)}
                                alt={`${hero.name} portrait`}
                                name={hero.name}
                                priority
                                sizes="144px"
                                className="border border-line-strong shadow-panel"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                {hero.roles.map((role) => (
                                    <Badge key={role} tone="accent">{role}</Badge>
                                ))}
                                {hero.lanes.map((lane) => (
                                    <Badge key={lane}>{lane}</Badge>
                                ))}
                            </div>

                            <h1 className="font-display text-4xl leading-none tracking-tight sm:text-6xl">
                                {hero.name}
                            </h1>
                            {hero.title && (
                                <p className="mt-2 text-base text-muted sm:text-lg">{hero.title}</p>
                            )}

                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggle(hero.slug)}
                                    aria-pressed={favourite}
                                    className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors ${favourite
                                            ? "border-accent bg-accent-soft text-accent"
                                            : "border-line-strong text-fg hover:bg-subtle"
                                        }`}
                                >
                                    <Heart size={14} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
                                    {favourite ? "Favourited" : "Favourite"}
                                </button>
                                <button
                                    type="button"
                                    onClick={share}
                                    className="inline-flex h-9 items-center gap-2 rounded-md border border-line-strong px-3 text-sm font-medium text-fg transition-colors hover:bg-subtle"
                                >
                                    {copied ? <Check size={14} aria-hidden="true" /> : <Share2 size={14} aria-hidden="true" />}
                                    {copied ? "Link copied" : "Share"}
                                </button>
                                {neighbours && (
                                    <div className="ml-auto flex items-center gap-1">
                                        <Link
                                            href={`/hero/${neighbours.previous.slug}`}
                                            className="inline-flex h-9 items-center gap-1 rounded-md border border-line-strong px-2.5 text-xs text-muted transition-colors hover:text-fg"
                                            aria-label={`Previous hero: ${neighbours.previous.name}`}
                                        >
                                            <ChevronLeft size={14} aria-hidden="true" />
                                            <span className="hidden sm:inline">{neighbours.previous.name}</span>
                                        </Link>
                                        <Link
                                            href={`/hero/${neighbours.next.slug}`}
                                            className="inline-flex h-9 items-center gap-1 rounded-md border border-line-strong px-2.5 text-xs text-muted transition-colors hover:text-fg"
                                            aria-label={`Next hero: ${neighbours.next.name}`}
                                        >
                                            <span className="hidden sm:inline">{neighbours.next.name}</span>
                                            <ChevronRight size={14} aria-hidden="true" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="min-w-0 space-y-12">
                        {/* ---------- Overview ---------- */}
                        <section aria-labelledby="overview-heading">
                            <h2 id="overview-heading" className="eyebrow mb-4">Overview</h2>
                            <p className="max-w-3xl text-base leading-relaxed text-muted">
                                {hero.lore || `${hero.name} is a ${hero.roles.join("/").toLowerCase()} hero best played in the ${hero.lanes.join(" and ").toLowerCase()}.`}
                            </p>

                            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
                                <MetaCell label="Damage" value={hero.damageType} />
                                <MetaCell label="Attack" value={hero.attackType} />
                                <MetaCell label="Resource" value={hero.resource} />
                                <MetaCell label="Released" value={hero.release ?? "Unknown"} />
                            </dl>

                            {hero.specialties.length > 0 && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-faint">Specialty:</span>
                                    {hero.specialties.map((specialty) => (
                                        <Badge key={specialty}>{specialty}</Badge>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ---------- Skills ---------- */}
                        <section aria-labelledby="skills-heading">
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <h2 id="skills-heading" className="font-display text-3xl">Abilities</h2>
                                <span className="font-mono text-xs text-faint">{hero.skills.length} skills</span>
                            </div>

                            <div className="divide-y divide-line overflow-hidden rounded-card border border-line">
                                {hero.skills.map((skill, index) => (
                                    <SkillRow key={skill.id} skill={skill} index={index} />
                                ))}
                            </div>
                        </section>

                        {/* ---------- Skins ---------- */}
                        {skinsWithArt.length > 0 && (
                            <section aria-labelledby="skins-heading">
                                <div className="mb-4 flex items-end justify-between gap-4">
                                    <h2 id="skins-heading" className="font-display text-3xl">Skins</h2>
                                    <span className="font-mono text-xs text-faint">
                                        {skinsWithArt.length} with artwork
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                                    {skinsWithArt.map((skin) => (
                                        <button
                                            key={skin.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveSkin(skin.id);
                                                setLightbox(skin.image);
                                            }}
                                            className={`group overflow-hidden rounded-card border text-left transition-colors ${selectedSkin?.id === skin.id
                                                    ? "border-accent"
                                                    : "border-line hover:border-line-strong"
                                                }`}
                                        >
                                            <SmartImage
                                                image={skinImage(skin.image)}
                                                alt={`${skin.name} skin`}
                                                name={skin.name}
                                                rounded="rounded-none"
                                                sizes="(max-width: 640px) 30vw, 15vw"
                                            />
                                            <span className="block px-2 py-2">
                                                <span className="block truncate text-xs font-medium text-fg">
                                                    {skin.name}
                                                </span>
                                                {skin.rarity && (
                                                    <span className="block truncate text-[10px] text-faint">
                                                        {skin.rarity}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-3 text-xs text-faint">
                                    Artwork shown for reference. Availability is not tracked here.
                                </p>
                            </section>
                        )}

                        {/* ---------- Matchups ---------- */}
                        {(hero.strongAgainst.length > 0 || hero.weakAgainst.length > 0 || hero.synergies.length > 0) && (
                            <section aria-labelledby="matchups-heading">
                                <h2 id="matchups-heading" className="mb-4 font-display text-3xl">Matchups</h2>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <MatchupColumn
                                        title="Strong against"
                                        icon={Swords}
                                        tone="success"
                                        slugs={hero.strongAgainst}
                                        note={hero.relationNotes.strong}
                                    />
                                    <MatchupColumn
                                        title="Weak against"
                                        icon={Shield}
                                        tone="danger"
                                        slugs={hero.weakAgainst}
                                        note={hero.relationNotes.weak}
                                    />
                                    <MatchupColumn
                                        title="Pairs well with"
                                        icon={Sparkles}
                                        tone="accent"
                                        slugs={hero.synergies}
                                        note={hero.relationNotes.assist}
                                    />
                                </div>
                                <p className="mt-3 text-xs text-faint">
                                    Matchup notes are editorial guidance from the data source, not official win-rate statistics.
                                </p>
                            </section>
                        )}
                    </div>

                    {/* ---------- Sidebar ---------- */}
                    <aside className="space-y-6">
                        <section className="rounded-panel border border-line bg-elevated p-5">
                            <h2 className="mb-4 font-display text-xl">Base stats</h2>
                            <dl className="space-y-3">
                                <StatRow label="HP" value={statRange(hero.stats.hp)} />
                                <StatRow label="HP regen" value={formatStat(hero.stats.hpRegen)} />
                                {hero.stats.mana && hero.stats.mana[1] > 0 && (
                                    <StatRow label="Mana" value={statRange(hero.stats.mana)} />
                                )}
                                <StatRow label="Physical attack" value={statRange(hero.stats.physicalAttack)} />
                                <StatRow label="Physical defense" value={statRange(hero.stats.physicalDefense)} />
                                <StatRow label="Magic defense" value={statRange(hero.stats.magicDefense)} />
                                <StatRow label="Movement speed" value={formatStat(hero.stats.movementSpeed)} />
                                {hero.stats.attackRange !== null && (
                                    <StatRow label="Attack range" value={formatStat(hero.stats.attackRange)} />
                                )}
                            </dl>
                            <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-faint">
                                Values show level 1 → level 15 where the source provides both.
                            </p>
                        </section>

                        {(hero.ratings.offense !== null || hero.ratings.difficulty !== null) && (
                            <section className="rounded-panel border border-line bg-elevated p-5">
                                <h2 className="mb-4 font-display text-xl">Ratings</h2>
                                <div className="space-y-3.5">
                                    <RatingBar label="Offense" value={hero.ratings.offense} />
                                    <RatingBar label="Durability" value={hero.ratings.durability} />
                                    <RatingBar label="Ability effects" value={hero.ratings.abilityEffects} />
                                    <RatingBar label="Difficulty" value={hero.ratings.difficulty} />
                                </div>
                            </section>
                        )}

                        {related.length > 0 && (
                            <section className="rounded-panel border border-line bg-elevated p-5">
                                <h2 className="mb-3 font-display text-xl">Related heroes</h2>
                                <ul className="space-y-1">
                                    {related.map((other) => (
                                        <li key={other.slug}>
                                            <Link
                                                href={`/hero/${other.slug}`}
                                                className="flex items-center gap-2.5 rounded px-1.5 py-1.5 transition-colors hover:bg-subtle"
                                            >
                                                <span className="h-8 w-8 shrink-0 overflow-hidden rounded border border-line">
                                                    <SmartImage
                                                        image={heroPortrait(other)}
                                                        alt=""
                                                        name={other.name}
                                                        rounded="rounded-none"
                                                        sizes="32px"
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm">{other.name}</span>
                                                <ArrowUpRight size={13} className="shrink-0 text-faint" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <Link
                            href={`/tools/compare?a=${hero.slug}`}
                            className="flex items-center justify-between gap-3 rounded-panel border border-line bg-elevated p-5 transition-colors hover:border-accent"
                        >
                            <span>
                                <span className="block text-sm font-medium">Compare {hero.name}</span>
                                <span className="block text-xs text-muted">Against any other hero</span>
                            </span>
                            <Crosshair size={17} className="shrink-0 text-accent" aria-hidden="true" />
                        </Link>
                    </aside>
                </div>
            </div>

            {/* ---------- Lightbox ---------- */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Skin artwork"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md bg-white/10 text-white hover:bg-white/20"
                        onClick={() => setLightbox(null)}
                        aria-label="Close image"
                    >
                        <Crosshair size={16} aria-hidden="true" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightbox}
                        alt="Skin artwork"
                        className="max-h-[88dvh] max-w-full rounded-card object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

function MetaCell({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="bg-elevated px-4 py-3">
            <dt className="text-[10px] uppercase tracking-wider text-faint">{label}</dt>
            <dd className="mt-0.5 truncate text-sm font-medium text-fg">{value ?? "—"}</dd>
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-mono text-xs text-fg">{value}</dd>
        </div>
    );
}

function RatingBar({ label, value }: { label: string; value: number | null }) {
    const pct = value === null ? 0 : Math.min(100, (value / 10) * 100);
    return (
        <div>
            <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs text-muted">{label}</span>
                <span className="font-mono text-[11px] text-fg">{value ?? "—"}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-subtle">
                <div className="h-full rounded-full bg-accent/80" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function SkillRow({ skill, index }: { skill: HeroSkill; index: number }) {
    return (
        <article className="bg-elevated p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-line bg-subtle">
                    <SmartImage
                        image={skillIcon(skill.icon)}
                        alt=""
                        name={String(index + 1)}
                        rounded="rounded-none"
                        sizes="48px"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-fg">{skill.name}</h3>
                        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-faint">
                            {TYPE_LABEL[skill.type] ?? skill.type}
                        </span>
                        {skill.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] text-faint">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {skill.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{skill.description}</p>
                    )}

                    {(skill.cooldown || skill.cost) && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] text-faint">
                            {skill.cooldown && (
                                <span className="inline-flex items-center gap-1">
                                    <Clock size={11} aria-hidden="true" /> {skill.cooldown}s
                                </span>
                            )}
                            {skill.cost && (
                                <span className="inline-flex items-center gap-1">
                                    <Droplet size={11} aria-hidden="true" /> {skill.cost}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function MatchupColumn({
    title,
    icon: Icon,
    tone,
    slugs,
    note,
}: {
    title: string;
    icon: typeof Swords;
    tone: "success" | "danger" | "accent";
    slugs: string[];
    note?: string;
}) {
    const colour =
        tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-accent";
    return (
        <div className="rounded-card border border-line bg-elevated p-4">
            <h3 className={`mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${colour}`}>
                <Icon size={13} aria-hidden="true" />
                {title}
            </h3>
            {slugs.length === 0 ? (
                <p className="text-xs text-faint">No data for this hero.</p>
            ) : (
                <div className="flex flex-wrap gap-1.5">
                    {slugs.map((slug) => (
                        <Link
                            key={slug}
                            href={`/hero/${slug}`}
                            className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
                        >
                            {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Link>
                    ))}
                </div>
            )}
            {note && <p className="mt-3 text-[11px] leading-relaxed text-faint">{note}</p>}
        </div>
    );
}
