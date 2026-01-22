"use client";
import React, { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, Users, FileText, TreePine, Sword, CircleDollarSign, TrendingUp, Map, Zap, Shield, Circle, Activity, Info, Target } from "lucide-react";
import { motion } from "framer-motion";
import HeroVideoBackdrop from "@/components/hero/HeroVideoBackdrop";
import StatRadar from "@/components/hero/StatRadar";
import SkillTerminal from "@/components/hero/SkillTerminal";
import { Hero } from "@/data/heroes";
import AudioModule from "@/components/hero/AudioModule";
import EquipmentDock from "@/components/hero/EquipmentDock";
import StatusColumn from "@/components/hero/StatusColumn";
import LoreDecryption from "@/components/hero/LoreDecryption";

interface Props {
    hero: Hero;
}

const LaneIcons: { [key: string]: any } = {
    "JUNGLE": TreePine,
    "MID LANE": Sword,
    "GOLD LANE": CircleDollarSign,
    "EXP LANE": TrendingUp,
    "ROAM": Map,
};

export default function HeroClientView({ hero }: Props) {
    const LaneIcon = LaneIcons[hero.lane] || Map;

    return (
        <div
            className="min-h-screen bg-black text-white relative overflow-hidden"
            style={{ "--c-accent": hero.primaryColor } as CSSProperties}
        >
            <HeroVideoBackdrop />

            {/* Elite Standee Container */}
            <div className="absolute right-0 top-0 h-full w-full md:w-[60%] z-[1] overflow-hidden pointer-events-none">
                <motion.div
                    className="relative w-full h-full flex items-center justify-center translate-x-24 md:translate-x-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <img
                        src={hero.image}
                        alt={hero.name}
                        className="h-full w-auto object-cover object-right-top md:object-center opacity-80 mix-blend-normal mask-image-linear-to-b"
                        style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                    />
                    {/* Radial depth on image - Adjusted for visibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-[2]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-[2]" />

                    {/* Floating HUD over image */}
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-40">
                        <div className="vertical-text font-mono text-xs tracking-[1em] text-white/50">AUTHENTIFIED_DATA_VAULT</div>
                        <div className="w-[1px] h-32 bg-white/20 ml-1.5" />
                        <div className="vertical-text font-mono text-[0.6rem] tracking-widest text-accent font-bold">ID_{hero.id.toUpperCase()}</div>
                    </div>
                </motion.div>
            </div>

            <Link href="/heroes" className="fixed top-12 left-12 z-50 bg-[#0b0e14] border border-white/10 px-6 py-3 font-mono text-[0.65rem] text-accent font-bold uppercase flex items-center gap-3 transition-all hover:bg-accent hover:text-white group clip-valorant-card">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> TERMINAL_EXIT
            </Link>

            <div className="relative z-[10] pt-40 pb-32 px-8 md:px-16 lg:px-24 grid grid-cols-1 xl:grid-cols-[1fr_500px] gap-24 max-w-[1920px] mx-auto">
                <div className="flex flex-col">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <div className="flex items-center gap-4 mb-6 font-mono text-[0.7rem] text-accent tracking-[0.5em] uppercase">
                            <Activity size={16} /> CLASSIFIED_INTEL // V4.1.2
                        </div>
                        <h1 className="font-display text-[6.5rem] md:text-[10rem] 2xl:text-[12rem] leading-[0.75] text-white uppercase mb-8 pointer-events-none tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50" style={{ textShadow: `0 0 50px ${hero.primaryColor}50` }}>{hero.name}</span>
                        </h1>
                        <div className="font-mono text-sm tracking-[0.8em] text-accent uppercase mb-8 pl-2 opacity-80" style={{ color: hero.primaryColor }}>
                            // {hero.id} // THE_{hero.role.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-8 mb-12">
                            <div className="h-[2px] w-24 bg-accent glow-accent" />
                            <div className="font-display text-3xl md:text-4xl text-[#8b9bb4] tracking-widest uppercase">{hero.role}</div>
                        </div>

                        {/* Tactical Status Modules - Color Coded & Chart-like */}
                        <div className="flex flex-wrap gap-4 mb-16">
                            <div className="bg-[#0b0e14]/80 backdrop-blur-md border px-6 py-3 flex flex-col gap-2 min-w-[140px] clip-valorant-card relative group overflow-hidden"
                                style={{ borderColor: `${hero.primaryColor || '#ff4655'}40` }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="font-mono text-[0.5rem] tracking-widest uppercase" style={{ color: hero.primaryColor }}>DAMAGE_TYPE</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: hero.primaryColor }} />
                                    <span className="font-display text-xl tracking-widest uppercase text-white">{hero.damageType}</span>
                                </div>
                            </div>

                            <div className="bg-[#0b0e14]/80 backdrop-blur-md border px-6 py-3 flex flex-col gap-2 min-w-[140px] clip-valorant-card relative group overflow-hidden"
                                style={{ borderColor: `${hero.primaryColor || '#ff4655'}40` }}>
                                <span className="font-mono text-[0.5rem] tracking-widest uppercase" style={{ color: hero.primaryColor }}>DIFFICULTY</span>
                                <div className="flex items-center gap-1 h-6">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-1.5 h-full transform skew-x-[-12deg] ${i < (hero.stats.difficulty / 20) ? 'opacity-100' : 'opacity-20'}`}
                                            style={{ backgroundColor: i < (hero.stats.difficulty / 20) ? hero.primaryColor : '#444' }} />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0b0e14]/80 backdrop-blur-md border px-6 py-3 flex flex-col gap-2 min-w-[140px] clip-valorant-card relative group overflow-hidden"
                                style={{ borderColor: `${hero.primaryColor || '#ff4655'}40` }}>
                                <span className="font-mono text-[0.5rem] tracking-widest uppercase" style={{ color: hero.primaryColor }}>SUB_CLASS</span>
                                <span className="font-display text-xl tracking-widest uppercase text-white">{hero.class}</span>
                            </div>
                        </div>

                        {/* Audio Module */}
                        <div className="mb-16">
                            <AudioModule voiceLine={hero.voiceLine} accentColor={hero.primaryColor} />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {/* Secondary Intel Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative bg-[#0b0e14]/60 backdrop-blur-md p-8 clip-valorant-card group overflow-hidden">
                                <div className="absolute inset-0 bg-transparent pointer-events-none transition-all duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_0_0_1px_var(--c-accent)] border-l-4 border-l-accent" />
                                <div className="relative z-10 space-y-4">
                                    <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase flex items-center gap-2">
                                        <Target size={14} /> OPTIMAL_LANE
                                    </div>
                                    <div className="font-display text-3xl flex items-center gap-4 text-white uppercase group">
                                        <LaneIcon size={24} className="text-accent group-hover:animate-pulse" /> {hero.lane}
                                    </div>
                                    <p className="font-mono text-xs text-[#666] leading-relaxed uppercase">Recommended path for maximum gold efficiency and objective control.</p>
                                </div>
                            </div>
                            <div className="relative bg-[#0b0e14]/60 backdrop-blur-md p-8 clip-valorant-card group overflow-hidden">
                                <div className="absolute inset-0 bg-transparent pointer-events-none transition-all duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_0_0_1px_var(--c-accent)] border-l-4 border-l-accent" />
                                <div className="relative z-10 space-y-4">
                                    <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase flex items-center gap-2">
                                        <Info size={14} /> COMBAT_SYNOPSIS
                                    </div>
                                    <div className="font-display text-3xl text-white uppercase">{hero.specialty}</div>
                                    <p className="font-mono text-xs text-[#666] leading-relaxed uppercase">Primary engagement style and utility contribution to squad teamfights.</p>
                                </div>
                            </div>
                        </div>

                        {/* Lore Decryption Module */}
                        <div className="space-y-6">
                            <div className="font-mono text-[0.6rem] text-[#444] tracking-[0.6em] uppercase">// DECRYPTING_BIOGRAPHY_SEQUENCE</div>
                            <LoreDecryption text={hero.biography} accentColor={hero.primaryColor} />
                        </div>

                        {/* Associates Section */}
                        <div className="space-y-8">
                            <div className="font-display text-2xl text-white tracking-[0.2em] flex items-center gap-4 uppercase">
                                <Users size={24} className="text-accent" /> KNOWN_SYNERGIES_&_RIVALS
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {hero.relationships.map((rel, i) => (
                                    <Link href={rel.heroId ? `/hero/${rel.heroId}` : '#'} key={i} className="relative bg-[#0b0e14]/40 border border-white/10 p-5 flex items-center gap-6 group transition-all clip-valorant-card hover:bg-white/5">
                                        <div className="absolute inset-0 bg-transparent pointer-events-none transition-all duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_0_0_1px_#ff4655]" />
                                        <div className="relative">
                                            <div className="absolute inset-0 border border-accent/40 scale-110 opacity-0 group-hover:opacity-100 transition-all" />
                                            <img src={rel.image} alt={rel.name} className="w-16 h-16 grayscale group-hover:grayscale-0 transition-all border border-white/10" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display text-xl text-white group-hover:text-accent transition-colors uppercase">{rel.name}</span>
                                            <span className="font-mono text-[0.6rem] text-[#666] uppercase group-hover:text-accent tracking-tighter transition-colors">// {rel.type}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Inspiration Footnote */}
                        <div className="bg-white/[0.02] border-l border-white/10 p-10 font-mono text-sm text-[#8b9bb4] italic leading-relaxed relative">
                            <div className="absolute top-0 right-0 p-2 font-mono text-[0.5rem] tracking-widest text-[#222]">DEV_FOOTNOTE</div>
                            "{hero.inspiration}"
                        </div>
                    </motion.div>

                    {/* Infinite Quote Scroller */}
                    <div className="mt-12 py-10 border-y border-white/5 overflow-hidden select-none">
                        <motion.div
                            className="font-display text-6xl text-white/[0.03] whitespace-nowrap uppercase italic flex gap-24"
                            animate={{ x: [0, -1500] }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        >
                            <span>"{hero.quote}"</span>
                            <span>"{hero.quote}"</span>
                            <span>"{hero.quote}"</span>
                            <span>"{hero.quote}"</span>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Tactical Widgets */}
                <div className="flex flex-col gap-12">
                    {/* Stat Radar Widget */}
                    <motion.div
                        className="relative bg-[#0b0e14]/60 backdrop-blur-md p-8 clip-valorant-card group overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="absolute inset-0 bg-transparent pointer-events-none transition-all duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_0_0_1px_var(--c-accent)]" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 font-mono text-[0.6rem] text-accent tracking-[0.5em] uppercase">
                                <Target size={14} /> CAPABILITY_MATRIX
                            </div>
                            <StatRadar stats={hero.stats} />
                        </div>
                    </motion.div>

                    {/* Attributes Bar Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <StatusColumn
                            mobility={hero.stats.offense}
                            armor={hero.stats.durability}
                            resource={hero.resource}
                            resourceValue={hero.stats.control}
                            accentColor={hero.primaryColor}
                        />
                    </motion.div>

                    {/* Equipment Array Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="font-mono text-[0.6rem] text-[#444] tracking-[0.5em] uppercase px-2">OPTIMAL_LOADOUT_ARRAY</div>
                        <EquipmentDock equipment={hero.equipment} />
                    </motion.div>

                    {/* Skill Terminal Module */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <SkillTerminal skills={hero.skills} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
