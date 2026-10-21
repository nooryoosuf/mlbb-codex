import raw from "./skin_art.json";

export interface SkinArtwork {
    url: string;
    width: number;
    height: number;
}

const art = raw.skins as Record<string, Record<string, SkinArtwork>>;

/**
 * Vertical (9:16) skin poster from the Mobile Legends Wiki, when one exists.
 * Falls back to null so callers can use the local MLBBDex thumbnail.
 */
export function getSkinArt(heroSlug: string, skinId: string): SkinArtwork | null {
    return art[heroSlug]?.[skinId] ?? null;
}

export const skinArtSource = raw.source;
