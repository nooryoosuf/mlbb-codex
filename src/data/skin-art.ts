import raw from "./skin_art.json";

export interface SkinArtwork {
    url: string;
    width: number;
    height: number;
}

const art = raw.skins as Record<string, Record<string, SkinArtwork>>;

/**
 * Full-width (16:9) skin splash artwork from MLBBDex / Mobile Legends Wiki.
 * Falls back to null so callers can use the skin thumbnail if ever needed.
 */
export function getSkinArt(heroSlug: string, skinId: string): SkinArtwork | null {
    return art[heroSlug]?.[skinId] ?? null;
}

export const skinArtSource = raw.source;
