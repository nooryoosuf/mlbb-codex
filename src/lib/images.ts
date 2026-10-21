import type { Hero } from "@/data";
import { getSkinArt } from "@/data/skin-art";
import { asset } from "@/lib/base-path";

const FALLBACK_HUE_SEED = 0;

/**
 * Central image resolution. Every component asks this module for artwork
 * instead of concatenating paths, so a provider change is a one-file edit.
 */
export type ImageVariant = "portrait" | "icon" | "splash" | "skin" | "skill" | "item";

export interface ResolvedImage {
    src: string | null;
    /** Aspect ratio hint used to reserve space and avoid layout shift. */
    aspect: string;
    /** True when we know the asset is a local file we control. */
    local: boolean;
}

export function heroPortrait(hero: Pick<Hero, "portrait" | "slug">): ResolvedImage {
    return {
        src: asset(hero.portrait),
        aspect: "240 / 390",
        local: Boolean(hero.portrait?.startsWith("/")),
    };
}

export function heroSplash(
    hero: Pick<Hero, "splash" | "portrait"> & Partial<Pick<Hero, "slug" | "skins">>
): ResolvedImage {
    if (hero.slug && hero.skins && hero.skins.length > 0) {
        const candidates = hero.skins.length > 1 ? hero.skins.slice(1) : hero.skins;
        const latest =
            [...candidates]
                .filter((skin) => {
                    const art = getSkinArt(hero.slug!, skin.id);
                    return Boolean(art && art.width > art.height);
                })
                .sort((a, b) => (a.release ?? "").localeCompare(b.release ?? ""))
                .at(-1) ??
            hero.skins.at(-1);
        const latestArt = latest ? getSkinArt(hero.slug, latest.id) : null;
        if (latestArt) {
            return {
                src: latestArt.url,
                aspect: "16 / 9",
                local: false,
            };
        }
    }
    return {
        src: asset(hero.splash),
        aspect: "16 / 9",
        local: Boolean(hero.splash?.startsWith("/")),
    };
}

export function heroCardArt(hero: Pick<Hero, "splash" | "portrait">): ResolvedImage {
    const splash = heroSplash(hero);
    if (splash.src && splash.src !== asset(hero.portrait)) return splash;
    return { ...heroPortrait({ portrait: hero.portrait, slug: "" }), aspect: "16 / 9" };
}

export function skillIcon(src: string | null): ResolvedImage {
    return { src: asset(src), aspect: "1 / 1", local: Boolean(src?.startsWith("/")) };
}

export function itemIcon(src: string | null): ResolvedImage {
    return { src: asset(src), aspect: "1 / 1", local: Boolean(src?.startsWith("/")) };
}

export function skinImage(src: string | null): ResolvedImage {
    return { src: asset(src), aspect: "240 / 390", local: Boolean(src?.startsWith("/")) };
}

/** Deterministic gradient used as a graceful placeholder behind artwork. */
export function placeholderGradient(seed: string): string {
    let hash = FALLBACK_HUE_SEED;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 360;
    }
    return `linear-gradient(150deg, hsl(${hash} 24% 18%), hsl(${(hash + 40) % 360} 18% 10%))`;
}

export function initials(name: string): string {
    return name
        .split(/[\s'’-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}
