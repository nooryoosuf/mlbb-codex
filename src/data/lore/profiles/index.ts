import type { HeroLoreProfile } from "../core";
import { MONIYAN_PROFILES } from "./moniyan";
import { WORLD_PROFILES } from "./world";

export const HERO_LORE_PROFILES: HeroLoreProfile[] = [
    ...MONIYAN_PROFILES,
    ...WORLD_PROFILES,
];

export const PROFILE_BY_SLUG = new Map(
    HERO_LORE_PROFILES.map((entry) => [entry.slug, entry])
);
