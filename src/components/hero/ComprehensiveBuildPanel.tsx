"use client";
import { motion } from "framer-motion";
import { Zap, Shield, Crosshair, Sword } from "lucide-react";

interface Build {
    title: string;
    description: string;
    equipment: string[]; // item icons/names
    emblems: string[]; // talent icons/names
    battleSpell: string; // spell icon/name
}

interface ComprehensiveBuildPanelProps {
    heroClass: string;
    primaryColor: string;
}

// Temporary mock data generator since we don't have full build data for every hero yet
const getMockBuilds = (role: string) => {
    const commonItems = [
        "https://static.wikia.nocookie.net/mobile-legends/images/d/d6/Blade_of_Despair.png",
        "https://static.wikia.nocookie.net/mobile-legends/images/9/91/Endless_Battle.png",
        "https://static.wikia.nocookie.net/mobile-legends/images/d/d8/Berserker%27s_Fury.png",
        "https://static.wikia.nocookie.net/mobile-legends/images/7/7e/Demon_Hunter_Sword.png",
        "https://static.wikia.nocookie.net/mobile-legends/images/3/36/Malefic_Roar.png",
        "https://static.wikia.nocookie.net/mobile-legends/images/2/23/Rose_Gold_Meteor.png"
    ];

    // Fallback images if scraping hasn't populated everything
    return [
        {
            title: "TEAM BUFF",
            description: "Maximizes utility and support presence for teamfights.",
            equipment: commonItems,
            emblems: ["Agility", "Festival of Blood", "Brave Smite", "Fighter Emblem"],
            battleSpell: "https://static.wikia.nocookie.net/mobile-legends/images/6/64/Flicker.png"
        },
        {
            title: "SUSTAINED DPS",
            description: "Balanced damage output with survivability for prolonged engagements.",
            equipment: commonItems,
            emblems: ["Fatal", "Weapon Master", "Killing Spree", "Assassin Emblem"],
            battleSpell: "https://static.wikia.nocookie.net/mobile-legends/images/1/1d/Retribution.png"
        },
        {
            title: "DURABLE",
            description: "High defense and resistance builds to soak damage.",
            equipment: commonItems,
            emblems: ["Firmness", "Tenacity", "Concussive Blast", "Tank Emblem"],
            battleSpell: "https://static.wikia.nocookie.net/mobile-legends/images/e/e0/Vengeance.png"
        }
    ];
};

export default function ComprehensiveBuildPanel({ heroClass, primaryColor }: ComprehensiveBuildPanelProps) {
    const builds = getMockBuilds(heroClass);

    return (
        <div className="space-y-12 w-full">
            <header className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase" style={{ color: primaryColor }}>// TACTICAL_LOADOUT_CONFIGURATIONS</div>
                <div className="h-[1px] bg-white/10 grow" />
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {builds.map((build, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-[#0b0e14]/60 border border-white/5 p-6 space-y-6 relative group overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border border-transparent group-hover:border-accent/30 transition-colors pointer-events-none" />

                        <div className="space-y-2">
                            <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-accent transition-colors">{build.title}</h3>
                            <p className="font-mono text-xs text-[#666] leading-relaxed">{build.description}</p>
                        </div>

                        {/* Equipment Row */}
                        <div className="space-y-2">
                            <div className="font-mono text-[0.5rem] text-[#444] tracking-widest uppercase">EQUIPMENT_SEQUENCE</div>
                            <div className="flex gap-2">
                                {build.equipment.map((item, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden relative group/item">
                                        <img src={item} alt="Item" className="w-full h-full object-cover opacity-70 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-8">
                            {/* Emblem Config */}
                            <div className="space-y-2 flex-1">
                                <div className="font-mono text-[0.5rem] text-[#444] tracking-widest uppercase">EMBLEM_MATRIX</div>
                                <div className="flex gap-2">
                                    {build.emblems.map((emblem, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[0.5rem] text-white/40 overflow-hidden">
                                            {/* Placeholder for emblem icons - using initials or SVG if available */}
                                            {emblem.slice(0, 2).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Battle Spell */}
                            <div className="space-y-2">
                                <div className="font-mono text-[0.5rem] text-[#444] tracking-widest uppercase">SPELL_MOD</div>
                                <div className="w-12 h-12 rounded-full border border-accent/20 bg-accent/5 p-1">
                                    <img src={build.battleSpell} alt="Spell" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
