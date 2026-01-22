
export interface MetaHero {
    id: string; // "saber", "gusion" - standardized lowercase
    name: string; // "Saber", "Gusion"
    role: string;
    winRate: number;
    pickRate: number;
    banRate: number;
    tier: "S+" | "S" | "A" | "B" | "C" | "D";
    coreItems: string[]; // List of item names
    counters: string[]; // List of hero names
}

export interface MetaItem {
    name: string;
    icon: string;
    // Add other properties if needed
}

// URLs for data fetching - utilizing the user provided hint about raw URLs
// If these exact URLs fail, we will need to update them.
const HERO_META_URL = "https://raw.githubusercontent.com/nooryoosuf/mlbb-front/main/src/data/hero-meta-final.json";
const ITEM_META_URL = "https://raw.githubusercontent.com/nooryoosuf/mlbb-front/main/src/data/item-meta-final.json";

// In-memory cache
let heroCache: MetaHero[] | null = null;
let itemCache: MetaItem[] | null = null;

export async function fetchMetaHeroes(): Promise<MetaHero[]> {
    if (heroCache) return heroCache;

    try {
        const res = await fetch(HERO_META_URL, { next: { revalidate: 3600 } });
        if (!res.ok) {
            console.warn(`[MetaAPI] Failed to fetch hero meta: ${res.status} ${res.statusText}`);
            return generateMockHeroMeta(); // Fallback to mock data to prevent UI crash
        }

        const rawData = await res.json();
        heroCache = processHeroData(rawData);
        return heroCache!;
    } catch (error) {
        console.error("[MetaAPI] Error fetching hero meta:", error);
        return generateMockHeroMeta();
    }
}

export async function fetchMetaItems(): Promise<MetaItem[]> {
    if (itemCache) return itemCache;

    try {
        const res = await fetch(ITEM_META_URL, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        // Assume data structure matches or process it
        itemCache = data;
        return itemCache!;
    } catch (e) {
        // console.error(e); 
        return [];
    }
}

// Logic to determine S-Tier
// We process raw data and calculate tier if not provided
function processHeroData(rawData: any[]): MetaHero[] {
    return rawData.map(hero => {
        const winRate = parseFloat(hero.win_rate || hero.winRate || "50");
        const pickRate = parseFloat(hero.pick_rate || hero.pickRate || "1");
        const banRate = parseFloat(hero.ban_rate || hero.banRate || "0");

        return {
            id: (hero.name || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
            name: hero.name,
            role: hero.role || "Unknown",
            winRate,
            pickRate,
            banRate,
            tier: calculateTier(winRate, pickRate, banRate),
            coreItems: hero.core_items || [],
            counters: hero.counters || []
        };
    });
}

function calculateTier(wr: number, pr: number, br: number): MetaHero['tier'] {
    // S-Tier Logic:
    // High Win Rate (54%+) or Massive Presence (Pick+Ban > 60%)

    const presence = pr + br;

    if (wr >= 56 || presence >= 80) return "S+";
    if (wr >= 53 || presence >= 60) return "S";
    if (wr >= 51 || presence >= 40) return "A";
    if (wr >= 48) return "B";
    if (wr >= 45) return "C";
    return "D";
}

// Fallback Mock Data in case Fetch Fails
function generateMockHeroMeta(): MetaHero[] {
    return [
        { id: "saber", name: "Saber", role: "Assassin", winRate: 51.5, pickRate: 2.5, banRate: 15.0, tier: "A", coreItems: ["Blade of Heptaseas", "Hunter Strike"], counters: ["Layla"] },
        { id: "gusion", name: "Gusion", role: "Assassin", winRate: 49.2, pickRate: 8.5, banRate: 12.0, tier: "A", coreItems: ["Genius Wand", "Divine Glaive"], counters: ["Hanabi"] },
        { id: "fanny", name: "Fanny", role: "Assassin", winRate: 54.2, pickRate: 1.5, banRate: 60.0, tier: "S", coreItems: ["Blade of Despair", "Malefic Roar"], counters: ["Layla"] },
        { id: "nolan", name: "Nolan", role: "Assassin", winRate: 56.5, pickRate: 4.5, banRate: 75.0, tier: "S+", coreItems: ["Hunter Strike", "Blade of Despair"], counters: ["Layla"] },
        { id: "joy", name: "Joy", role: "Assassin", winRate: 55.8, pickRate: 2.0, banRate: 40.0, tier: "S", coreItems: ["Genius Wand", "Holy Crystal"], counters: ["Layla"] },
        // ... more mocks if needed to ensure UI isn't empty
    ];
}
