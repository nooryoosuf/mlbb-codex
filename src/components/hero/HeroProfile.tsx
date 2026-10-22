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
    ArrowLeft,
    X,
    Maximize2,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { useFavourites } from "@/lib/use-favourites";
import { heroSplash, heroPortrait, skillIcon, skinImage } from "@/lib/images";
import { getSkinArt } from "@/data/skin-art";
import {
    formatStat,
    statRange,
    getHeroNeighbours,
    getRelatedHeroes,
    getMetaHero,
    meta,
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
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const favourite = ready && isFavourite(hero.slug);
    const neighbours = getHeroNeighbours(hero.slug);
    const related = getRelatedHeroes(hero, 6);
    const skinsWithArt = hero.skins.filter((skin) => skin.image || getSkinArt(hero.slug, skin.id));
    const nonDefaultSkins = skinsWithArt.length > 1 ? skinsWithArt.slice(1) : skinsWithArt;
    const latestSkin =
        [...nonDefaultSkins]
            .filter((skin) => {
                const art = getSkinArt(hero.slug, skin.id);
                return Boolean(art && art.width > art.height);
            })
            .sort((a, b) => (a.release ?? "").localeCompare(b.release ?? ""))
            .at(-1) ??
        skinsWithArt.at(-1) ??
        null;
    const latestSkinArt = latestSkin ? getSkinArt(hero.slug, latestSkin.id) : null;
    const [activeSkin, setActiveSkin] = useState(latestSkin?.id ?? skinsWithArt[0]?.id ?? "");
    const skinIndex = Math.max(0, skinsWithArt.findIndex((skin) => skin.id === activeSkin));
    const selectedSkin = skinsWithArt[skinIndex] ?? null;
    const selectedArt = selectedSkin ? getSkinArt(hero.slug, selectedSkin.id) : null;
    const bannerImage = latestSkinArt
        ? {
              src: latestSkinArt.hdUrl ?? latestSkinArt.url,
              aspect:
                  latestSkinArt.hdWidth && latestSkinArt.hdHeight
                      ? `${latestSkinArt.hdWidth} / ${latestSkinArt.hdHeight}`
                      : "16 / 9",
              local: false,
          }
        : heroSplash(hero);
    const ranked = getMetaHero(hero.slug);

    function stepSkin(direction: 1 | -1) {
        if (skinsWithArt.length === 0) return;
        const next = (skinIndex + direction + skinsWithArt.length) % skinsWithArt.length;
        setActiveSkin(skinsWithArt[next].id);
    }

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
            {/* ---------- Masthead ---------- */}
            <section className="relative isolate overflow-hidden border-b border-line">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <SmartImage
                        image={bannerImage}
                        alt=""
                        name={hero.name}
                        priority
                        sizes="100vw"
                        className="h-full w-full"
                        imgClassName="object-cover object-top opacity-45"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,var(--bg)_35%,transparent_85%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--bg)_0%,transparent_65%)]" />
                    <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_20%_10%,black,transparent_70%)]" />
                </div>

                <div className="mx-auto max-w-shell px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                        <Link href="/" className="transition-colors hover:text-fg">Home</Link>
                        <span className="text-accent">/</span>
                        <Link href="/heroes" className="transition-colors hover:text-fg">Heroes</Link>
                        <span className="text-accent">/</span>
                        <span className="text-muted" aria-current="page">{hero.name}</span>
                    </nav>

                    <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-4 flex flex-wrap gap-1.5">
                                {hero.roles.map((role) => (
                                    <span key={role} className="border border-accent bg-accent px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-contrast">
                                        {role}
                                    </span>
                                ))}
                                {hero.lanes.map((lane) => (
                                    <span key={lane} className="border border-line-strong px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                                        {lane}
                                    </span>
                                ))}
                            </div>

                            <h1 className="display text-[clamp(3rem,9vw,6.5rem)] leading-[0.82]">{hero.name}</h1>
                            {hero.title && <p className="mt-3 text-base text-muted sm:text-lg">{hero.title}</p>}

                            <div className="mt-7 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggle(hero.slug)}
                                    aria-pressed={favourite}
                                    className={`btn h-10 px-4 ${favourite ? "btn-primary" : "btn-ghost"}`}
                                >
                                    <Heart size={13} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
                                    {favourite ? "Favourited" : "Favourite"}
                                </button>
                                <button type="button" onClick={share} className="btn btn-ghost h-10 px-4">
                                    {copied ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
                                    {copied ? "Copied" : "Share"}
                                </button>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-end gap-4">
                            {neighbours && (
                                <div className="hidden flex-col gap-1 sm:flex">
                                    <Link
                                        href={`/hero/${neighbours.previous.slug}`}
                                        className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
                                        aria-label={`Previous hero: ${neighbours.previous.name}`}
                                    >
                                        <ArrowLeft size={12} aria-hidden="true" />
                                        {neighbours.previous.name}
                                    </Link>
                                    <Link
                                        href={`/hero/${neighbours.next.slug}`}
                                        className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
                                        aria-label={`Next hero: ${neighbours.next.name}`}
                                    >
                                        {neighbours.next.name}
                                        <ArrowLeft size={12} className="rotate-180" aria-hidden="true" />
                                    </Link>
                                </div>
                            )}

                            <div className="w-28 border border-line-strong sm:w-36">
                                <SmartImage
                                    image={heroPortrait(hero)}
                                    alt={`${hero.name} portrait`}
                                    name={hero.name}
                                    priority
                                    sizes="144px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="min-w-0 space-y-14">
                        {/* ---------- Overview ---------- */}
                        <section aria-labelledby="overview-heading">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="font-mono text-[10px] tracking-[0.2em] text-accent">01</span>
                                <h2 id="overview-heading" className="eyebrow">Overview</h2>
                            </div>
                            <p className="max-w-3xl text-base leading-relaxed text-muted">
                                {hero.lore || `${hero.name} is a ${hero.roles.join("/").toLowerCase()} hero best played in the ${hero.lanes.join(" and ").toLowerCase()}.`}
                            </p>

                            <dl className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                                <MetaCell label="Damage" value={hero.damageType} />
                                <MetaCell label="Attack" value={hero.attackType} />
                                <MetaCell label="Resource" value={hero.resource} />
                                <MetaCell label="Released" value={hero.release ?? "Unknown"} />
                            </dl>

                            {hero.specialties.length > 0 && (
                                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                                    <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Specialty</span>
                                    {hero.specialties.map((specialty) => (
                                        <span key={specialty} className="tag h-6">{specialty}</span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ---------- Skills ---------- */}
                        <section aria-labelledby="skills-heading">
                            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">02</span>
                                    <h2 id="skills-heading" className="display text-3xl">Abilities</h2>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                                    {hero.skills.length} skills
                                </span>
                            </div>

                            <div>
                                {hero.skills.map((skill, index) => (
                                    <SkillRow key={skill.id} skill={skill} index={index} />
                                ))}
                            </div>
                        </section>

                        {/* ---------- Skins ---------- */}
                        {skinsWithArt.length > 0 && selectedSkin && (
                            <section aria-labelledby="skins-heading">
                                <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">03</span>
                                        <h2 id="skins-heading" className="display text-3xl">Skins</h2>
                                    </div>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                                        {skinsWithArt.length} skins · full splash
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative overflow-hidden border border-line bg-elevated">
                                        <button
                                            type="button"
                                            onClick={() => setLightboxOpen(true)}
                                            className="group relative block w-full overflow-hidden bg-black/40"
                                            aria-label={`Open ${selectedSkin.name} at full size`}
                                        >
                                            <SmartImage
                                                key={selectedSkin.id}
                                                image={
                                                    selectedArt
                                                        ? {
                                                              src: selectedArt.hdUrl ?? selectedArt.url,
                                                              aspect:
                                                                  selectedArt.hdWidth && selectedArt.hdHeight
                                                                      ? `${selectedArt.hdWidth} / ${selectedArt.hdHeight}`
                                                                      : `${selectedArt.width} / ${selectedArt.height}`,
                                                              local: false,
                                                          }
                                                        : skinImage(selectedSkin.image)
                                                }
                                                alt={`${selectedSkin.name} full skin splash artwork`}
                                                name={selectedSkin.name}
                                                fit="contain"
                                                aspect="16 / 9"
                                                sizes="(max-width: 1024px) 100vw, 68vw"
                                                className="w-full bg-black/40"
                                                imgClassName="transition-transform duration-500 ease-editorial group-hover:scale-[1.02]"
                                            />
                                            <span className="
                                                absolute right-3 top-3 inline-flex items-center gap-1.5
                                                border border-line-strong bg-bg/75 px-2.5 py-1
                                                font-mono text-[9px] uppercase tracking-[0.16em] text-faint
                                                backdrop-blur transition-colors group-hover:text-accent
                                            ">
                                                <Maximize2 size={10} aria-hidden="true" />
                                                Full splash
                                            </span>
                                        </button>

                                        <div className="flex items-center justify-between gap-3 border-t border-line bg-bg/60 px-4 py-3">
                                            <div className="min-w-0">
                                                <h3 className="display truncate text-xl leading-[1.05]">{selectedSkin.name}</h3>
                                                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                                    {selectedSkin.label ?? selectedSkin.rarity ?? "Skin"} · {String(skinIndex + 1).padStart(2, "0")} / {String(skinsWithArt.length).padStart(2, "0")}
                                                    {selectedArt
                                                        ? ` · ${selectedArt.hdWidth ?? selectedArt.width}×${selectedArt.hdHeight ?? selectedArt.height}`
                                                        : ""}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => stepSkin(-1)}
                                                    className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                                                    aria-label="Previous skin"
                                                >
                                                    <ChevronLeft size={15} aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => stepSkin(1)}
                                                    className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                                                    aria-label="Next skin"
                                                >
                                                    <ChevronRight size={15} aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                        {skinsWithArt.map((skin) => {
                                            const active = skin.id === selectedSkin.id;
                                            const art = getSkinArt(hero.slug, skin.id);
                                            return (
                                                <button
                                                    key={skin.id}
                                                    type="button"
                                                    onClick={() => setActiveSkin(skin.id)}
                                                    aria-pressed={active}
                                                    className={`group relative flex flex-col overflow-hidden border text-left transition-colors ${
                                                        active ? "border-accent bg-accent-soft/40" : "border-line bg-elevated hover:border-line-strong"
                                                    }`}
                                                >
                                                    <div className="w-full overflow-hidden bg-black/30">
                                                        <SmartImage
                                                            image={
                                                                art
                                                                    ? { src: art.url, aspect: "16 / 9", local: false }
                                                                    : skinImage(skin.image)
                                                            }
                                                            alt={`${skin.name} splash thumbnail`}
                                                            name={skin.name}
                                                            fit="cover"
                                                            aspect="16 / 9"
                                                            sizes="(max-width: 640px) 48vw, 220px"
                                                            className="w-full"
                                                            imgClassName="transition-transform duration-500 ease-editorial group-hover:scale-[1.04]"
                                                        />
                                                    </div>
                                                    <span className="block border-t border-line px-2.5 py-2">
                                                        <span className="block truncate font-mono text-[9px] uppercase tracking-[0.1em] text-muted group-hover:text-fg">
                                                            {skin.name}
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ---------- Matchups ---------- */}
                        {(hero.strongAgainst.length > 0 || hero.weakAgainst.length > 0 || hero.synergies.length > 0) && (
                            <section aria-labelledby="matchups-heading">
                                <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">04</span>
                                    <h2 id="matchups-heading" className="display text-3xl">Matchups</h2>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
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
                                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    Editorial guidance from the data source, not official win-rate statistics.
                                </p>
                            </section>
                        )}
                    </div>

                    {/* ---------- Sidebar ---------- */}
                    <aside className="space-y-4">
                        {ranked && (
                            <section className="border border-line bg-elevated">
                                <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                                    <h2 className="display text-lg leading-none">Ranked now</h2>
                                    <span className="border border-accent bg-accent px-1.5 py-0.5 font-mono text-[10px] leading-none text-accent-contrast">
                                        {ranked.tier ?? "—"}
                                    </span>
                                </div>
                                <div className="space-y-3 px-5 py-4">
                                    <RateBar label="Win rate" value={ranked.winRate} tone="success" />
                                    <RateBar label="Pick rate" value={ranked.pickRate} tone="fg" />
                                    <RateBar label="Ban rate" value={ranked.banRate} tone="accent" />
                                </div>
                                <p className="border-t border-line px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                    {ranked.lane} · all ranks · 7 days · {meta.snapshot}
                                </p>
                            </section>
                        )}

                        <section className="border border-line bg-elevated">
                            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                                <h2 className="display text-lg leading-none">Base stats</h2>
                                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Lv 1 → 15</span>
                            </div>
                            <dl className="space-y-3 px-5 py-4">
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
                        </section>

                        {(hero.ratings.offense !== null || hero.ratings.difficulty !== null) && (
                            <section className="border border-line bg-elevated">
                                <div className="border-b border-line px-5 py-3.5">
                                    <h2 className="display text-lg leading-none">Ratings</h2>
                                </div>
                                <div className="space-y-4 px-5 py-4">
                                    <RatingBar label="Offense" value={hero.ratings.offense} />
                                    <RatingBar label="Durability" value={hero.ratings.durability} />
                                    <RatingBar label="Ability effects" value={hero.ratings.abilityEffects} />
                                    <RatingBar label="Difficulty" value={hero.ratings.difficulty} />
                                </div>
                            </section>
                        )}

                        {related.length > 0 && (
                            <section className="border border-line bg-elevated">
                                <div className="border-b border-line px-5 py-3.5">
                                    <h2 className="display text-lg leading-none">Related heroes</h2>
                                </div>
                                <ul className="p-2">
                                    {related.map((other) => (
                                        <li key={other.slug}>
                                            <Link
                                                href={`/hero/${other.slug}`}
                                                className="group flex items-center gap-3 px-2 py-2 transition-colors hover:bg-subtle"
                                            >
                                                <span className="h-9 w-6 shrink-0 overflow-hidden border border-line">
                                                    <SmartImage image={heroPortrait(other)} alt="" name={other.name} sizes="24px" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm transition-colors group-hover:text-accent">
                                                    {other.name}
                                                </span>
                                                <ArrowUpRight size={12} className="shrink-0 text-faint" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <Link
                            href={`/tools/compare?a=${hero.slug}`}
                            className="group flex items-center justify-between gap-3 border border-line bg-elevated px-5 py-4 transition-colors hover:border-accent"
                        >
                            <span>
                                <span className="block text-sm font-medium">Compare {hero.name}</span>
                                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    Against any other hero
                                </span>
                            </span>
                            <Crosshair size={17} className="shrink-0 text-accent transition-transform group-hover:rotate-90" aria-hidden="true" />
                        </Link>
                    </aside>
                </div>
            </div>

            {/* ---------- Lightbox ---------- */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[95] flex flex-col bg-black/95 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Skin artwork at full size"
                >
                    <div className="flex items-center justify-between gap-4 pb-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
                            {selectedSkin?.name} · Full artwork
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => stepSkin(-1)}
                                className="grid h-9 w-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-accent hover:text-accent"
                                aria-label="Previous skin"
                            >
                                <ChevronLeft size={17} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => stepSkin(1)}
                                className="grid h-9 w-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-accent hover:text-accent"
                                aria-label="Next skin"
                            >
                                <ChevronRight size={17} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="grid h-9 w-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-accent hover:text-accent"
                                onClick={() => setLightboxOpen(false)}
                                aria-label="Close image"
                            >
                                <X size={17} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="grid flex-1 place-items-center overflow-hidden"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close image"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedArt?.hdUrl ?? selectedArt?.url ?? selectedSkin?.image ?? ""}
                            alt={`${selectedSkin?.name ?? "Skin"} artwork`}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                            onClick={(event) => event.stopPropagation()}
                        />
                    </button>
                </div>
            )}
        </div>
    );
}

function MetaCell({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="bg-elevated px-4 py-3.5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{label}</dt>
            <dd className="mt-1 truncate font-mono text-xs text-fg">{value ?? "—"}</dd>
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-b-0 last:pb-0">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-mono text-[11px] text-fg">{value}</dd>
        </div>
    );
}

function RatingBar({ label, value }: { label: string; value: number | null }) {
    const pct = value === null ? 0 : Math.min(100, (value / 10) * 100);
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{label}</span>
                <span className="font-mono text-[11px] text-fg">{value ?? "—"}</span>
            </div>
            <div className="h-px w-full bg-subtle">
                <div className="h-px bg-accent" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function RateBar({ label, value, tone }: { label: string; value: number | null; tone: "success" | "fg" | "accent" }) {
    const pct = value === null ? 0 : Math.max(1, Math.min(100, value));
    const color = tone === "success" ? "bg-success" : tone === "accent" ? "bg-accent" : "bg-fg/70";
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{label}</span>
                <span className="font-mono text-[11px] text-fg">{value === null ? "—" : `${value.toFixed(2)}%`}</span>
            </div>
            <div className="h-1 w-full bg-subtle">
                <div className={`h-1 ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function SkillRow({ skill, index }: { skill: HeroSkill; index: number }) {
    return (
        <article className="group grid gap-3 border-b border-line py-5 sm:grid-cols-[2rem_3.5rem_1fr] sm:gap-4">
            <span className="font-mono text-[10px] text-faint">
                {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-12 w-12 shrink-0 border border-line bg-subtle transition-colors group-hover:border-accent/60">
                <SmartImage
                    image={skillIcon(skill.icon)}
                    alt=""
                    name={String(index + 1)}
                    sizes="48px"
                />
            </div>

            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="display text-xl leading-none">{skill.name}</h3>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                        {TYPE_LABEL[skill.type] ?? skill.type}
                    </span>
                    {skill.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                            {tag}
                        </span>
                    ))}
                </div>

                {skill.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{skill.description}</p>
                )}

                {(skill.cooldown || skill.cost) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {skill.cooldown && (
                            <span className="inline-flex items-center gap-1.5">
                                <Clock size={10} aria-hidden="true" /> {skill.cooldown}s
                            </span>
                        )}
                        {skill.cost && (
                            <span className="inline-flex items-center gap-1.5">
                                <Droplet size={10} aria-hidden="true" /> {skill.cost}
                            </span>
                        )}
                    </div>
                )}
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
        <div className="border border-line bg-elevated p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] ${colour}`}>
                    <Icon size={12} aria-hidden="true" />
                    {title}
                </h3>
                <span className="font-mono text-[9px] text-faint">{slugs.length}</span>
            </div>
            {slugs.length === 0 ? (
                <p className="text-xs text-faint">No data for this hero.</p>
            ) : (
                <div className="flex flex-wrap gap-1.5">
                    {slugs.map((slug) => (
                        <Link key={slug} href={`/hero/${slug}`} className="tag h-6">
                            {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Link>
                    ))}
                </div>
            )}
            {note && <p className="mt-3 text-[11px] leading-relaxed text-faint">{note}</p>}
        </div>
    );
}
