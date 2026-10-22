import rawFacts from "../lore_facts.json";

/**
 * Lore data model.
 *
 * Two layers are kept deliberately separate:
 *  1. `lore_facts.json` — machine-read fields lifted from community wiki
 *     infoboxes (origin, species, affiliation, relationships, intro, source).
 *  2. the curated records — hand-written summaries, relationship edges,
 *     factions, world entries, eras and discoveries, each carrying a
 *     confidence level and a citation.
 *
 * The curated layer never invents names, dates or events that are absent from
 * a cited source. Where the community record is ambiguous the entry is marked
 * `suggested` or `unconfirmed` instead of being presented as canon.
 */

export type LoreConfidence = "confirmed" | "suggested" | "unconfirmed";
export type LoreSourceKind = "official" | "community";

export interface LoreSource {
    label: string;
    url: string;
    kind: LoreSourceKind;
}

export interface LoreFacts {
    slug: string;
    name: string;
    source: string;
    fullName: string;
    alias: string[];
    birthday: string;
    origin: string;
    born: string;
    age: string;
    species: string;
    gender: string;
    title: string;
    occupation: string;
    nationality: string;
    religion: string;
    affiliation: string[];
    weapons: string[];
    height: string;
    relationships: string[];
    intro: string;
    status: string;
}

export interface LoreChapter {
    title: string;
    body: string;
}

export interface HeroLoreProfile {
    slug: string;
    epithet: string;
    era: string;
    status: string;
    quote?: string;
    summary: string;
    chapters: LoreChapter[];
    motifs: string[];
    factionIds: string[];
    sources: LoreSource[];
    confidence: LoreConfidence;
    featured?: boolean;
}

export type RelationType =
    | "family"
    | "romance"
    | "alliance"
    | "rivalry"
    | "conflict"
    | "mentorship";

export interface LoreRelation {
    a: string;
    b: string;
    type: RelationType;
    label: string;
    note?: string;
    confidence: LoreConfidence;
    source?: LoreSource;
}

export type FactionKind =
    | "order"
    | "house"
    | "army"
    | "court"
    | "sect"
    | "guild"
    | "tribe"
    | "alliance";

export interface LoreFaction {
    id: string;
    name: string;
    kind: FactionKind;
    regionId: string;
    summary: string;
    creed: string;
    members: string[];
    allies?: string[];
    rivals?: string[];
    sources: LoreSource[];
    confidence: LoreConfidence;
}

export type WorldKind = "region" | "subregion" | "landmark";

export interface LoreWorldEntry {
    id: string;
    name: string;
    kind: WorldKind;
    parentId?: string;
    tagline: string;
    summary: string;
    details: string[];
    factionIds: string[];
    heroSlugs?: string[];
    sources: LoreSource[];
    confidence: LoreConfidence;
}

export interface LoreEra {
    id: string;
    name: string;
    span: string;
    summary: string;
}

export interface LoreEvent {
    id: string;
    eraId: string;
    title: string;
    summary: string;
    heroSlugs: string[];
    sources: LoreSource[];
    confidence: LoreConfidence;
}

export interface LoreArc {
    id: string;
    title: string;
    eraId: string;
    summary: string;
    beats: string[];
    heroSlugs: string[];
    sources: LoreSource[];
    confidence: LoreConfidence;
}

export type DiscoveryCategory =
    | "kinship"
    | "romance"
    | "rivalry"
    | "place"
    | "artifact"
    | "identity";

export interface LoreDiscovery {
    id: string;
    title: string;
    body: string;
    category: DiscoveryCategory;
    heroSlugs?: string[];
    worldId?: string;
    sources: LoreSource[];
    confidence: LoreConfidence;
}

const WIKI = "https://mobile-legends.fandom.com/wiki/";

export function wiki(page: string, anchor?: string): LoreSource {
    return {
        label: `Mobile Legends Wiki — ${page}`,
        url: `${WIKI}${encodeURIComponent(page.replace(/ /g, "_"))}${anchor ? `#${anchor}` : ""}`,
        kind: "community",
    };
}

export const OFFICIAL_LORE: LoreSource = {
    label: "Mobile Legends official lore hub",
    url: "https://play.mobilelegends.com/lore/",
    kind: "official",
};

export const LAND_OF_DAWN = wiki("Land of Dawn");

export const LORE_FACTS: Record<string, LoreFacts> = (
    rawFacts as unknown as { heroes: Record<string, LoreFacts> }
).heroes;

export const CONFIDENCE_LABEL: Record<LoreConfidence, string> = {
    confirmed: "Confirmed",
    suggested: "Suggested",
    unconfirmed: "Unconfirmed",
};

export const RELATION_META: Record<
    RelationType,
    { label: string; color: string; description: string }
> = {
    family: {
        label: "Kinship",
        color: "#d8a657",
        description: "Blood, adoption or ancestry recorded in a hero's own file.",
    },
    romance: {
        label: "Romance",
        color: "#e06c91",
        description: "Courtship, love interests or betrothals.",
    },
    alliance: {
        label: "Alliance",
        color: "#7ec48f",
        description: "Sworn companions, squads or shared causes.",
    },
    rivalry: {
        label: "Rivalry",
        color: "#c98a4b",
        description: "Competition, betrayal or an unresolved contest.",
    },
    conflict: {
        label: "Conflict",
        color: "#e2604c",
        description: "Open enmity, war or a hunt.",
    },
    mentorship: {
        label: "Mentorship",
        color: "#7aa6d6",
        description: "Teacher and student, or patron and protégé.",
    },
};

export const RELATION_TYPES: RelationType[] = [
    "family",
    "romance",
    "alliance",
    "rivalry",
    "conflict",
    "mentorship",
];

export const FEATURED_LORE_ERAS = [
    "The Endless War",
    "The Present Age",
    "The Fall of Ridgeburg",
    "The Second Plane War",
    "The Age of the Ancient Ones",
] as const;
