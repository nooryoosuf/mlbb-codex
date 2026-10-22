import {
    LORE_FACTS,
    OFFICIAL_LORE,
    wiki,
    type HeroLoreProfile,
    type LoreChapter,
    type LoreConfidence,
    type LoreSource,
} from "../core";

export function profile(
    slug: string,
    epithet: string,
    era: string,
    status: string,
    summary: string,
    chapters: LoreChapter[],
    motifs: string[],
    factionIds: string[],
    extraSources: LoreSource[] = [],
    confidence: LoreConfidence = "confirmed",
    quote?: string
): HeroLoreProfile {
    const facts = LORE_FACTS[slug];
    return {
        slug,
        epithet,
        era,
        status,
        quote,
        summary,
        chapters,
        motifs,
        factionIds,
        sources: [OFFICIAL_LORE, wiki(facts?.name ?? slug), ...extraSources],
        confidence,
        featured: true,
    };
}
