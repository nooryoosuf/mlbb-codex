import { heroes, type Hero } from "../index";
import {
    LORE_FACTS,
    RELATION_META,
    type HeroLoreProfile,
    type LoreDiscovery,
    type LoreEra,
    type LoreFaction,
    type LoreRelation,
    type LoreWorldEntry,
    type WorldKind,
} from "./core";
import { LORE_FACTIONS } from "./factions";
import { HERO_LORE_PROFILES, PROFILE_BY_SLUG } from "./profiles";
import { LORE_RELATIONS } from "./relations";
import { LORE_ARCS, LORE_DISCOVERIES, LORE_ERAS, LORE_EVENTS } from "./story";
import { LANDMARK_ENTRIES } from "./world-landmarks";
import { REGION_ENTRIES } from "./world-regions";

export * from "./core";
export { HERO_LORE_PROFILES, LORE_FACTIONS, LORE_RELATIONS, LORE_ERAS, LORE_EVENTS, LORE_ARCS, LORE_DISCOVERIES };

export const LORE_WORLD: LoreWorldEntry[] = [...REGION_ENTRIES, ...LANDMARK_ENTRIES];

const WORLD_BY_ID = new Map(LORE_WORLD.map((entry) => [entry.id, entry]));
const FACTION_BY_ID = new Map(LORE_FACTIONS.map((entry) => [entry.id, entry]));
const ERA_BY_ID = new Map(LORE_ERAS.map((entry) => [entry.id, entry]));
const HERO_BY_SLUG = new Map(heroes.map((hero) => [hero.slug, hero]));

const REGION_NAME_TO_ID: Record<string, string> = {
    "Moniyan Empire": "moniyan-empire",
    Abyss: "the-abyss",
    "The Abyss": "the-abyss",
    "Azrya Woodlands": "azrya-woodlands",
    "Cadia Riverlands": "cadia-riverlands",
    "Northern Vale": "northern-vale",
    "The Barren Lands": "the-barren-lands",
    "Agelta Drylands": "agelta-drylands",
    Eruditio: "eruditio",
    "Vonetis Sea": "vonetis-sea",
    "Celestial Palace": "celestial-palace",
    "Sanctum Island": "sanctum-island",
    "Nebula Chronorift": "nebula-chronorift",
    Alaghat: "alaghat",
    Kastiya: "kastiya",
    "Laboratory 1718": "laboratory-1718",
    "Los Pecados": "los-pecados",
};

const RELATIONS_BY_SLUG = new Map<string, LoreRelation[]>();
for (const relation of LORE_RELATIONS) {
    for (const slug of [relation.a, relation.b]) {
        const list = RELATIONS_BY_SLUG.get(slug) ?? [];
        list.push(relation);
        RELATIONS_BY_SLUG.set(slug, list);
    }
}

export interface HeroRelation {
    hero: Hero;
    relation: LoreRelation;
    label: string;
    note?: string;
}

export interface HeroLoreEntry {
    hero: Hero;
    facts: (typeof LORE_FACTS)[string];
    profile: HeroLoreProfile | undefined;
    region: LoreWorldEntry | undefined;
    factions: LoreFaction[];
    relations: HeroRelation[];
}

export function getLoreProfile(slug: string): HeroLoreProfile | undefined {
    return PROFILE_BY_SLUG.get(slug);
}

export function getLoreFacts(slug: string) {
    return LORE_FACTS[slug];
}

export function getLoreFaction(id: string): LoreFaction | undefined {
    return FACTION_BY_ID.get(id);
}

export function getWorldEntry(id: string): LoreWorldEntry | undefined {
    return WORLD_BY_ID.get(id);
}

export function getEra(id: string): LoreEra | undefined {
    return ERA_BY_ID.get(id);
}

export function getHeroRelations(slug: string): HeroRelation[] {
    const list = RELATIONS_BY_SLUG.get(slug) ?? [];
    return list
        .flatMap((relation) => {
            const otherSlug = relation.a === slug ? relation.b : relation.a;
            const hero = HERO_BY_SLUG.get(otherSlug);
            if (!hero) return [];
            return [{ hero, relation, label: relation.label, note: relation.note }];
        })
        .sort(
            (left, right) =>
                RELATION_META[left.relation.type].label.localeCompare(
                    RELATION_META[right.relation.type].label
                ) || left.hero.name.localeCompare(right.hero.name)
        );
}

export function getHeroFactions(slug: string): LoreFaction[] {
    return LORE_FACTIONS.filter((faction) => faction.members.includes(slug));
}

export function getHeroRegion(slug: string): LoreWorldEntry | undefined {
    const hero = HERO_BY_SLUG.get(slug);
    if (!hero?.region) return undefined;
    const id = REGION_NAME_TO_ID[hero.region];
    return id ? WORLD_BY_ID.get(id) : undefined;
}

export function getHeroLore(slug: string): HeroLoreEntry | undefined {
    const hero = HERO_BY_SLUG.get(slug);
    const facts = LORE_FACTS[slug];
    if (!hero || !facts) return undefined;
    return {
        hero,
        facts,
        profile: PROFILE_BY_SLUG.get(slug),
        region: getHeroRegion(slug),
        factions: getHeroFactions(slug),
        relations: getHeroRelations(slug),
    };
}

export function getLoreHeroes(): HeroLoreEntry[] {
    return heroes
        .map((hero) => getHeroLore(hero.slug))
        .filter((entry): entry is HeroLoreEntry => Boolean(entry))
        .sort((left, right) => left.hero.name.localeCompare(right.hero.name));
}

export function getFeaturedLoreHeroes(): HeroLoreEntry[] {
    return HERO_LORE_PROFILES.map((entry) => getHeroLore(entry.slug)).filter(
        (entry): entry is HeroLoreEntry => Boolean(entry)
    );
}

function collectWorldHeroIds(entry: LoreWorldEntry): Set<string> {
    const ids = new Set<string>(entry.heroSlugs ?? []);
    for (const hero of heroes) {
        if (hero.region && REGION_NAME_TO_ID[hero.region] === entry.id) ids.add(hero.slug);
    }
    for (const child of LORE_WORLD) {
        if (child.parentId !== entry.id) continue;
        for (const id of collectWorldHeroIds(child)) ids.add(id);
    }
    return ids;
}

export function getWorldHeroes(entry: LoreWorldEntry): Hero[] {
    return [...collectWorldHeroIds(entry)]
        .map((slug) => HERO_BY_SLUG.get(slug))
        .filter((hero): hero is Hero => Boolean(hero))
        .sort((left, right) => left.name.localeCompare(right.name));
}

export function getWorldChildren(entry: LoreWorldEntry): LoreWorldEntry[] {
    return LORE_WORLD.filter((candidate) => candidate.parentId === entry.id);
}

export function getWorldParent(entry: LoreWorldEntry): LoreWorldEntry | undefined {
    return entry.parentId ? WORLD_BY_ID.get(entry.parentId) : undefined;
}

export function getWorldFactions(entry: LoreWorldEntry): LoreFaction[] {
    return entry.factionIds
        .map((id) => FACTION_BY_ID.get(id))
        .filter((faction): faction is LoreFaction => Boolean(faction));
}

export function getHeroesForWorld(worldId: string): Hero[] {
    const entry = WORLD_BY_ID.get(worldId);
    return entry ? getWorldHeroes(entry) : [];
}

export function getDiscoveriesForHero(slug: string): LoreDiscovery[] {
    return LORE_DISCOVERIES.filter((entry) => entry.heroSlugs?.includes(slug));
}

export function getEventsForHero(slug: string) {
    return LORE_EVENTS.filter((entry) => entry.heroSlugs.includes(slug));
}

export function getArcsForHero(slug: string) {
    return LORE_ARCS.filter((entry) => entry.heroSlugs.includes(slug));
}

/** Deterministic daily discovery based on the UTC date. */
export function getDiscoveryOfTheDay(date = new Date()): LoreDiscovery {
    const dayNumber = Math.floor(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000
    );
    return LORE_DISCOVERIES[dayNumber % LORE_DISCOVERIES.length];
}

export function getDiscoveryById(id: string): LoreDiscovery | undefined {
    return LORE_DISCOVERIES.find((entry) => entry.id === id);
}

export const WORLD_KIND_LABEL: Record<WorldKind, string> = {
    region: "Major region",
    subregion: "Subregion",
    landmark: "Landmark",
};

export const LORE_STATS = {
    heroes: heroes.length,
    profiled: HERO_LORE_PROFILES.length,
    relations: LORE_RELATIONS.length,
    connections: new Set(LORE_RELATIONS.flatMap((relation) => [relation.a, relation.b])).size,
    regions: REGION_ENTRIES.length,
    places: LORE_WORLD.length,
    factions: LORE_FACTIONS.length,
    eras: LORE_ERAS.length,
    discoveries: LORE_DISCOVERIES.length,
};
