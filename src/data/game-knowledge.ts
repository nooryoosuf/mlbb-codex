
import { Zap, Shield, Sword, Hexagon, Crosshair, Heart, Wind, Flame, Skull, Target } from "lucide-react";

export interface Emblem {
    id: string;
    name: string;
    role: string;
    description: string;
    attributes: string[];
    bestFor: string;
    icon: any; // Lucide icon
}

export interface BattleSpell {
    id: string;
    name: string;
    cooldown: string;
    description: string;
    bestFor: string;
    icon: any;
}

export const emblems: Emblem[] = [
    {
        id: "common",
        name: "BASIC COMMON",
        role: "ALL-ROUNDER",
        description: "Provides balanced stats suitable for beginners or heroes who need a mix of regeneration and survivability.",
        attributes: ["+Hybrid Regen", "+HP", "+Adaptive Attack"],
        bestFor: "New players, Mana-hungry heroes in early game",
        icon: Zap
    },
    {
        id: "tank",
        name: "CUSTOM TANK",
        role: "DEFENSE",
        description: "Maximizes durability and crowd control resilience. Essential for frontline protectors.",
        attributes: ["+HP", "+Hybrid Defense", "+HP Regen"],
        bestFor: "Tanks, Roamers, Durable Fighters",
        icon: Shield
    },
    {
        id: "assassin",
        name: "CUSTOM ASSASSIN",
        role: "BURST / MOBILITY",
        description: "Focuses on high penetration and speed to eliminate key targets quickly.",
        attributes: ["+Adaptive Penetration", "+Adaptive Attack", "+Movement Speed"],
        bestFor: "Assassins, Burst Fighters, aggressive Marksmen",
        icon: Skull
    },
    {
        id: "mage",
        name: "CUSTOM MAGE",
        role: "MAGIC OFFENSE",
        description: "Enhances magic power and cooldown reduction for spell-casting dominance.",
        attributes: ["+Magic Power", "+Magic Penetration", "+Cooldown Reduction"],
        bestFor: "Mages, Magic Assassins, Magic Fighters",
        icon: Hexagon
    },
    {
        id: "fighter",
        name: "CUSTOM FIGHTER",
        role: "SUSTAIN / DAMAGE",
        description: "Balanced offense and defense with a focus on sustain through Spell Vamp.",
        attributes: ["+Spell Vamp", "+Adaptive Attack", "+Hybrid Defense"],
        bestFor: "Fighters, Sustain-heavy Assassins",
        icon: Sword
    },
    {
        id: "support",
        name: "CUSTOM SUPPORT",
        role: "UTILITY",
        description: "Boosts healing effects and reduces cooldowns to aid allies more frequently.",
        attributes: ["+Healing Effect", "+Cooldown Reduction", "+Movement Speed"],
        bestFor: "Healers, Utility Supports, some Tanks",
        icon: Heart
    },
    {
        id: "marksman",
        name: "CUSTOM MARKSMAN",
        role: "DPS / CRIT",
        description: "Increases attack speed and lifesteal for sustained ranged damage.",
        attributes: ["+Attack Speed", "+Adaptive Attack", "+Lifesteal"],
        bestFor: "Marksmen, some Attack Speed Fighters",
        icon: Target
    }
];

export const battleSpells: BattleSpell[] = [
    {
        id: "execute",
        name: "EXECUTE",
        cooldown: "90s",
        description: "Deals True Damage to a target enemy. Damage increases if the target has low HP. Ignores shields.",
        bestFor: "Kill-secure heroes (Paquito, Gusion)",
        icon: Sword
    },
    {
        id: "retribution",
        name: "RETRIBUTION",
        cooldown: "35s",
        description: "Deals True Damage to creeps/minions. Passive: Increases creep rewards. MANDATORY for Junglers.",
        bestFor: "Junglers",
        icon: Zap
    },
    {
        id: "inspire",
        name: "INSPIRE",
        cooldown: "60s",
        description: "Significantly enhances Attack Speed and ignores some Physical Defense for a short duration.",
        bestFor: "Attack Speed Marksmen (Moskov, Wanwan)",
        icon: Wind
    },
    {
        id: "sprint",
        name: "SPRINT",
        cooldown: "100s",
        description: "Grants massive Movement Speed and immunity to slowing effects.",
        bestFor: "Low mobility mages/marksmen",
        icon: Wind
    },
    {
        id: "revitalize",
        name: "REVITALIZE",
        cooldown: "100s",
        description: "Summons a Healing Spring that restores HP for allies within area.",
        bestFor: "Supports (Estes, Rafaela) or Tanky team comps",
        icon: Heart
    },
    {
        id: "aegis",
        name: "AEGIS",
        cooldown: "90s",
        description: "Generates a shield for the hero and the nearest low-HP ally.",
        bestFor: "Squishy heroes needing burst protection",
        icon: Shield
    },
    {
        id: "petrify",
        name: "PETRIFY",
        cooldown: "90s",
        description: "Petrifies nearby enemies for 0.8s and deals Magic Damage.",
        bestFor: "Heroes needing extra CC (Benedetta, Yu Zhong)",
        icon: Hexagon
    },
    {
        id: "flameshot",
        name: "FLAMESHOT",
        cooldown: "50s",
        description: "Fires a flaming shot. Knocks back nearby enemies or snipes low HP enemies from afar.",
        bestFor: "Mages, Magic Assassins",
        icon: Flame
    },
    {
        id: "flicker",
        name: "FLICKER",
        cooldown: "120s",
        description: "Teleport a short distance. Can be combined with skills for outplay potential.",
        bestFor: "Almost everyone",
        icon: Wind
    },
    {
        id: "vengeance",
        name: "VENGEANCE",
        cooldown: "75s",
        description: "Reflects damage back to the attacker and reduces incoming damage.",
        bestFor: "Tanks, Sustain Fighters (Gatotkaca, Belerick)",
        icon: Shield
    }
];
