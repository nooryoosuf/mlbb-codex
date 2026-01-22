import { Skill } from "../components/hero/SkillTerminal";

export interface Hero {
    id: string;
    name: string;
    role: string;
    lane: "JUNGLE" | "EXP LANE" | "GOLD LANE" | "MID LANE" | "ROAM";
    class: string;
    specialty: string;
    primaryColor: string;
    quote: string;
    image: string;
    gallery: string[];
    stats: {
        offense: number;
        difficulty: number;
        durability: number;
        control: number;
    };
    skills: Skill[];
    biography: string;
    relationships: {
        name: string;
        type: string;
        image: string;
        heroId?: string;
    }[];
    inspiration: string;
    counters: {
        strongAgainst: string[];
        weakAgainst: string[];
    };
    loadout: {
        emblem: string;
        talents: string[];
        battleSpell: string;
    };
    damageType: "Physical" | "Magic" | "True";
    resource: "Mana" | "Energy" | "None";
    voiceLine: string;
    attackType: "Melee" | "Ranged";
    isFeatured?: boolean;
    equipment: {
        name: string;
        icon: string;
        attribute: string;
    }[];
    difficulty: "Easy" | "Normal" | "Hard";
}

export const getRoleDefaults = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("assassin")) {
        return {
            emblem: "Assassin",
            talents: ["Rupture", "Master Assassin", "Killing Spree"],
            battleSpell: "Retribution"
        };
    }
    if (r.includes("marksman")) {
        return {
            emblem: "Marksman",
            talents: ["Fatal", "Weapon Master", "Quantum Charge"],
            battleSpell: "Inspire"
        };
    }
    if (r.includes("mage")) {
        return {
            emblem: "Mage",
            talents: ["Inspiration", "Bargain Hunter", "Lethal Ignition"],
            battleSpell: "Flameshot"
        };
    }
    if (r.includes("tank")) {
        return {
            emblem: "Tank",
            talents: ["Firmness", "Tenacity", "Concussive Blast"],
            battleSpell: "Flicker"
        };
    }
    if (r.includes("fighter")) {
        return {
            emblem: "Fighter",
            talents: ["Agility", "Festival of Blood", "Brave Smite"],
            battleSpell: "Flicker"
        };
    }
    if (r.includes("support")) {
        return {
            emblem: "Support",
            talents: ["Vitality", "Gift", "Focusing Mark"],
            battleSpell: "Revitalize"
        };
    }
    return {
        emblem: "Common",
        talents: [],
        battleSpell: "Execute"
    };
};

const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

const createHero = (data: Partial<Hero> & { name: string; id: string }): Hero => {
    // Standardize naming for files
    // Special cases for files that don't follow Title Case exactly
    const specialFileNames: Record<string, string> = {
        "chang_e": "Chang_e",
        "yi_sun_shin": "Yi Sun-shin",
        "popol_and_kupa": "Popol and Kupa",
        "yu_zhong": "Yu Zhong",
        "luo_yi": "Luo Yi",
        "lapu_lapu": "Lapu-lapu",
        "x_borg": "X-Borg"
    };

    const fileName = specialFileNames[data.id] || toTitleCase(data.name);

    const baseHero: Hero = {
        id: data.id,
        name: data.name,
        role: data.role || "HERO",
        lane: data.lane || "EXP LANE",
        class: data.class || "FIGHTER",
        specialty: data.specialty || "Damage",
        primaryColor: data.primaryColor || "#ffffff",
        quote: data.quote || "I'LL NEVER BACK DOWN.",
        image: data.image || `/heroes/${fileName}.png`,
        gallery: data.gallery || [`/heroes/${fileName}.png`],
        stats: data.stats || { offense: 50, difficulty: 50, durability: 50, control: 50 },
        skills: data.skills || [],
        biography: data.biography || "Subject description classified. Tactical data pending decryption.",
        relationships: data.relationships || [],
        inspiration: data.inspiration || "Original MLBB design.",
        counters: data.counters || { strongAgainst: [], weakAgainst: [] },
        loadout: data.loadout || getRoleDefaults(data.class || "FIGHTER"),
        damageType: data.damageType || "Physical",
        resource: data.resource || "Mana",
        voiceLine: data.voiceLine || "Mission accepted.",
        attackType: data.attackType || "Melee",
        isFeatured: data.isFeatured || false,
        difficulty: data.stats?.difficulty ? (data.stats.difficulty > 70 ? "Hard" : data.stats.difficulty > 40 ? "Normal" : "Easy") : "Normal",
        equipment: data.equipment || []
    };
    return { ...baseHero, ...data };
};

export const heroes: Hero[] = [
    createHero({
        id: "saber", name: "SABER", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", isFeatured: true,
        primaryColor: "#ff4655", specialty: "Charge / Reap", voiceLine: "Kill all at once!",
        quote: "I'M A MAN WITH A MISSION.",
        biography: "Once a legendary swordsman, Saber was subjected to genetic modification. He now searches for his lost memory.",
        equipment: [{ name: "Blade of Heptaseas", icon: "blade", attribute: "Penetration" }],
        counters: { strongAgainst: ["Layla", "Miya", "Eudora", "Hanabi"], weakAgainst: ["Tigreal", "Akai", "Khufra"] }
    }),
    createHero({
        id: "gusion", name: "GUSION", class: "ASSASSIN", lane: "JUNGLE", damageType: "Magic", attackType: "Melee", isFeatured: true,
        primaryColor: "#a30eff", specialty: "Burst / Damage", voiceLine: "The perfect combination of might and magic.",
        biography: "The fourth son of the Paxley family, Gusion rebelled against their mage traditions to master the blade.",
        counters: { strongAgainst: ["Layla", "Hanabi", "Lesley"], weakAgainst: ["Khufra", "Ruby", "Minsitthar"] }
    }),
    createHero({
        id: "fanny", name: "FANNY", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", isFeatured: true,
        primaryColor: "#ffaa00", specialty: "Chase / Finisher", voiceLine: "Sir, what's your command!",
        biography: "The sister of Tigreal, Fanny uses steel cables to zip across the battlefield like a skylark.",
        counters: { strongAgainst: ["Layla", "Eudora", "Vale"], weakAgainst: ["Khufra", "Saber", "Franco", "Minsitthar"] }
    }),
    createHero({
        id: "chou", name: "CHOU", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", isFeatured: true,
        primaryColor: "#ffe500", specialty: "Chase / Control", voiceLine: "Wipe out all injustice!",
        biography: "Born in the slums, Chou mastered Kung-Fu to fight for the oppressed.",
        counters: { strongAgainst: ["Layla", "Gord", "Eudora"], weakAgainst: ["Thamuz", "Terizla", "Phoveus"] }
    }),
    createHero({ id: "layla", name: "LAYLA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", isFeatured: true, primaryColor: "#00ccff", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion", "Fanny"] } }),
    createHero({ id: "miya", name: "MIYA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", isFeatured: true, primaryColor: "#55aaff" }),
    createHero({ id: "nana", name: "NANA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", isFeatured: true, primaryColor: "#ff66aa", counters: { strongAgainst: ["Odette", "Gord"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "tigreal", name: "TIGREAL", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", isFeatured: true, primaryColor: "#ffcc00", counters: { strongAgainst: ["Odette", "Guinevere"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "alucard", name: "ALUCARD", class: "FIGHTER", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", isFeatured: true, primaryColor: "#ff4444", counters: { strongAgainst: ["Layla", "Miya"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "balmond", name: "BALMOND", class: "FIGHTER", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", isFeatured: true, primaryColor: "#ff6600", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "aamon", name: "AAMON", class: "ASSASSIN", lane: "JUNGLE", damageType: "Magic", attackType: "Melee", primaryColor: "#55aaff", counters: { strongAgainst: ["Layla", "Miya"], weakAgainst: ["Saber", "Ruby"] } }),
    createHero({ id: "akai", name: "AKAI", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#00ff00", counters: { strongAgainst: ["Fanny", "Lancelot"], weakAgainst: ["Diggie", "Valir"] } }),
    createHero({ id: "aldous", name: "ALDOUS", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4400", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "alice", name: "ALICE", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#cc00ff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Baxia"] } }),
    createHero({ id: "alpha", name: "ALPHA", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff3333", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Baxia"] } }),
    createHero({ id: "angela", name: "ANGELA", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Ranged", primaryColor: "#ff99cc", counters: { strongAgainst: ["Aldous"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "argus", name: "ARGUS", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#00ff33", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "arlott", name: "ARLOTT", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff1111", counters: { strongAgainst: ["Miya"], weakAgainst: ["Phoveus", "Khufra"] } }),
    createHero({ id: "atlas", name: "ATLAS", class: "TANK", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#0066ff", counters: { strongAgainst: ["Odette"], weakAgainst: ["Diggie", "Valir"] } }),
    createHero({ id: "aulus", name: "AULUS", class: "FIGHTER", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffaa00", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Baxia"] } }),
    createHero({ id: "aurora", name: "AURORA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00eeff", counters: { strongAgainst: ["Odette"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "badang", name: "BADANG", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "bane", name: "BANE", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#4d4dff", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Baxia"] } }),
    createHero({ id: "barats", name: "BARATS", class: "TANK", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff8800", counters: { strongAgainst: ["Fanny"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "baxia", name: "BAXIA", class: "TANK", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#663300", counters: { strongAgainst: ["Esmeralda", "Uranus"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "beatrix", name: "BEATRIX", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ff4444", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "belerick", name: "BELERICK", class: "TANK", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#00cc00", counters: { strongAgainst: ["Miya", "Hanabi"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "benedetta", name: "BENEDETTA", class: "ASSASSIN", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#aaaaaa", counters: { strongAgainst: ["Layla", "Miya"], weakAgainst: ["Phoveus", "Khufra"] } }),
    createHero({ id: "brody", name: "BRODY", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ff8000", counters: { strongAgainst: ["Claude", "Layla"], weakAgainst: ["Saber", "Lesley"] } }),
    createHero({ id: "bruno", name: "BRUNO", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffff00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "carmilla", name: "CARMILLA", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#ff0044", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "cecillion", name: "CECILLION", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ff0066", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "chang_e", name: "CHANG_E", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffff99", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Lolita"] } }),
    createHero({ id: "claude", name: "CLAUDE", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffaa00", counters: { strongAgainst: ["Miya"], weakAgainst: ["Moskov", "Saber"] } }),
    createHero({ id: "clint", name: "CLINT", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffcc66", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "cyclops", name: "CYCLOPS", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#0066ff", counters: { strongAgainst: ["Gusion"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "diggie", name: "DIGGIE", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffcc", counters: { strongAgainst: ["Atlas", "Tigreal"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "dyrroth", name: "DYRROTH", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#cc00ff", counters: { strongAgainst: ["Tigreal", "Johnson"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "edith", name: "EDITH", class: "TANK", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "esmeralda", name: "ESMERALDA", class: "MAGE", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Phoveus", "Harith"], weakAgainst: ["Baxia", "Saber"] } }),
    createHero({ id: "estes", name: "ESTES", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ffcc", counters: { strongAgainst: ["Aldous"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "eudora", name: "EUDORA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ccff", counters: { strongAgainst: ["Fanny", "Gusion"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "faramis", name: "FARAMIS", class: "SUPPORT", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ff88", counters: { strongAgainst: ["Gloo", "Sun"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "floryn", name: "FLORYN", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffccff", counters: { strongAgainst: ["Aldous"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "franco", name: "FRANCO", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#00bbff", counters: { strongAgainst: ["Fanny", "Lancelot"], weakAgainst: ["Tigreal", "Karrie"] } }),
    createHero({ id: "fredrinn", name: "FREDRINN", class: "TANK", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff9900", counters: { strongAgainst: ["Layla"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "freya", name: "FREYA", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Zilong"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "gatotkaca", name: "GATOTKACA", class: "TANK", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Layla", "Miya"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "gloo", name: "GLOO", class: "TANK", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#cc00ff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Faramis", "Saber"] } }),
    createHero({ id: "gord", name: "GORD", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#3300ff", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "granger", name: "GRANGER", class: "MARKSMAN", lane: "JUNGLE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ff0000", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "grock", name: "GROCK", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#663300", counters: { strongAgainst: ["Fanny"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "guinevere", name: "GUINEVERE", class: "FIGHTER", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#9900cc", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "hanabi", name: "HANABI", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ff0066", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "hanzo", name: "HANZO", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4400", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "harith", name: "HARITH", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Khufra", "Phoveus", "Saber"] } }),
    createHero({ id: "harley", name: "HARLEY", class: "MAGE", lane: "JUNGLE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ff0000", counters: { strongAgainst: ["Squishies"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "hayabusa", name: "HAYABUSA", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4444", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Khufra"] } }),
    createHero({ id: "helcurt", name: "HELCURT", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#330066", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "hilda", name: "HILDA", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff6600", counters: { strongAgainst: ["Layla"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "hylos", name: "HYLOS", class: "TANK", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#00ffcc", counters: { strongAgainst: ["Fanny", "Natalia"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "irithel", name: "IRITHEL", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffaa00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "jawhead", name: "JAWHEAD", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "johnson", name: "JOHNSON", class: "TANK", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#0099ff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "joy", name: "JOY", class: "ASSASSIN", lane: "JUNGLE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffff00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Phoveus", "Khufra", "Minsitthar"] } }),
    createHero({ id: "julian", name: "JULIAN", class: "FIGHTER", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ff0000" }),
    createHero({ id: "kadita", name: "KADITA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#00ffff", counters: { strongAgainst: ["Squishies"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "kagura", name: "KAGURA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#cc99ff", counters: { strongAgainst: ["Squishies"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "kaja", name: "KAJA", class: "FIGHTER", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Fanny", "Lancelot"], weakAgainst: ["Saber", "Natalia"] } }),
    createHero({ id: "karina", name: "KARINA", class: "ASSASSIN", lane: "JUNGLE", damageType: "Magic", attackType: "Melee", primaryColor: "#9900ff", counters: { strongAgainst: ["Layla", "Miya"], weakAgainst: ["Saber", "Khufra"] } }),
    createHero({ id: "karrie", name: "KARRIE", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Tanks", "Tigreal", "Johnson"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "khaleed", name: "KHALEED", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "khufra", name: "KHUFRA", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#663300", counters: { strongAgainst: ["Fanny", "Lancelot", "Benedetta", "Joy"], weakAgainst: ["Karrie", "Lesley"] } }),
    createHero({ id: "kimmy", name: "KIMMY", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffff00", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "lancelot", name: "LANCELOT", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Khufra", "Saber", "Minsitthar"] } }),
    createHero({ id: "lapu_lapu", name: "LAPU-LAPU", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4400", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "leomord", name: "LEOMORD", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#333333", counters: { strongAgainst: ["Layla"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "lesley", name: "LESLEY", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ff0066", counters: { strongAgainst: ["Layla", "Granger"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "ling", name: "LING", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#00ccff", counters: { strongAgainst: ["Layla"], weakAgainst: ["Khufra", "Minsitthar", "Saber"] } }),
    createHero({ id: "lolita", name: "LOLITA", class: "SUPPORT", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Chang'e", "Cyclops"], weakAgainst: ["Tigreal", "Akai"] } }),
    createHero({ id: "lunox", name: "LUNOX", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffcc00", counters: { strongAgainst: ["Tanks"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "luo_yi", name: "LUO YI", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffccff", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "lylia", name: "LYLIA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#330066", counters: { strongAgainst: ["Tigreal"], weakAgainst: ["Saber", "Helcurt"] } }),
    createHero({ id: "martis", name: "MARTIS", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#9900ff" }),
    createHero({ id: "masha", name: "MASHA", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff6600" }),
    createHero({ id: "mathilda", name: "MATHILDA", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Melee", primaryColor: "#00ffcc" }),
    createHero({ id: "melissa", name: "MELISSA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffccff" }),
    createHero({ id: "minotaur", name: "MINOTAUR", class: "TANK", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#ff3300" }),
    createHero({ id: "minsitthar", name: "MINSITTHAR", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", specialty: "Control / Initiator", counters: { strongAgainst: ["Fanny", "Gusion", "Lancelot"], weakAgainst: ["Tigreal", "Akai"] } }),
    createHero({ id: "miya", name: "MIYA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", isFeatured: true, primaryColor: "#55aaff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "moskov", name: "MOSKOV", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#6600ff", counters: { strongAgainst: ["Claude", "Layla"], weakAgainst: ["Saber", "Lesley"] }, specialty: "Chase / Reap" }),
    createHero({ id: "natalia", name: "NATALIA", class: "ASSASSIN", lane: "ROAM", damageType: "Physical", attackType: "Melee", primaryColor: "#ffffff", specialty: "Chase / Burst", counters: { strongAgainst: ["Layla", "Miya", "Eudora"], weakAgainst: ["Hylos", "Baxia"] } }),
    createHero({ id: "natan", name: "NATAN", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffcc00", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] }, specialty: "Reap / Burst" }),
    createHero({ id: "odette", name: "ODETTE", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Nana", "Vexana"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "paquito", name: "PAQUITO", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Zilong", "Alucard"], weakAgainst: ["Chou", "Ruby"] } }),
    createHero({ id: "pharsa", name: "PHARSA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Lancelot"] } }),
    createHero({ id: "phoveus", name: "PHOVEUS", class: "FIGHTER", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#cc00ff", counters: { strongAgainst: ["Fanny", "Gusion", "Benedetta", "Lancelot"], weakAgainst: ["Esmeralda", "Baxia"] } }),
    createHero({ id: "popol_and_kupa", name: "POPOL AND KUPA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Claude", "Roger"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "rafaela", name: "RAFAELA", class: "SUPPORT", lane: "ROAM", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Natalia"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "roger", name: "ROGER", class: "FIGHTER", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#663300", counters: { strongAgainst: ["Claude", "Layla"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "ruby", name: "RUBY", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff0000", counters: { strongAgainst: ["Fanny", "Alucard", "Paquito"], weakAgainst: ["Baxia", "Phoveus"] } }),
    createHero({ id: "selena", name: "SELENA", class: "ASSASSIN", lane: "JUNGLE", damageType: "Magic", attackType: "Melee", primaryColor: "#cc00ff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "silvanna", name: "SILVANNA", class: "FIGHTER", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Alucard", "Zilong"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "sun", name: "SUN", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffcc00", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "terizla", name: "TERIZLA", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#333333", counters: { strongAgainst: ["Zilong", "Alucard"], weakAgainst: ["Chou", "Ruby"] } }),
    createHero({ id: "thamuz", name: "THAMUZ", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff3300", counters: { strongAgainst: ["Alucard", "Zilong"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "uranus", name: "URANUS", class: "TANK", lane: "EXP LANE", damageType: "Magic", attackType: "Melee", primaryColor: "#ffff00", counters: { strongAgainst: ["Chou", "Zilong"], weakAgainst: ["Baxia", "Phoveus"] } }),
    createHero({ id: "vale", name: "VALE", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "valentina", name: "VALENTINA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#330066", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "valir", name: "VALIR", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#ff6600", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "vexana", name: "VEXANA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ffcc", counters: { strongAgainst: ["Nana", "Odette"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "wanwan", name: "WANWAN", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffffff", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion", "Phoveus"] } }),
    createHero({ id: "x_borg", name: "X-BORG", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4400", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "xavier", name: "XAVIER", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ccff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "yi_sun_shin", name: "YI SUN-SHIN", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#ffffff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "yin", name: "YIN", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#ff4400", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "yu_zhong", name: "YU ZHONG", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", primaryColor: "#006600", counters: { strongAgainst: ["Zilong", "Alucard"], weakAgainst: ["Chou", "Ruby"] } }),
    createHero({ id: "yve", name: "YVE", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#330066", counters: { strongAgainst: ["Tigreal", "Akai"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "zhask", name: "ZHASK", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#6600ff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "zilong", name: "ZILONG", class: "FIGHTER", lane: "EXP LANE", damageType: "Physical", attackType: "Melee", isFeatured: true, primaryColor: "#ffbb00", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Chou"] } }),
    createHero({ id: "nolan", name: "NOLAN", class: "ASSASSIN", lane: "JUNGLE", damageType: "Physical", attackType: "Melee", primaryColor: "#6600ff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "ixia", name: "IXIA", class: "MARKSMAN", lane: "GOLD LANE", damageType: "Physical", attackType: "Ranged", primaryColor: "#ffccff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
    createHero({ id: "novaria", name: "NOVARIA", class: "MAGE", lane: "MID LANE", damageType: "Magic", attackType: "Ranged", primaryColor: "#00ccff", counters: { strongAgainst: ["Layla", "Hanabi"], weakAgainst: ["Saber", "Gusion"] } }),
];
