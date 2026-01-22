"use client";
import React, { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, Users, FileText, TreePine, Sword, CircleDollarSign, TrendingUp, Map, Zap, Shield, Circle, Activity, Info, Target } from "lucide-react";
import { motion } from "framer-motion";
import HeroVideoBackdrop from "@/components/hero/HeroVideoBackdrop";
import TacticalRadar from "@/components/hero/TacticalRadar";
import AbilitiesModule from "@/components/hero/AbilitiesModule";
import SkinsGrid from "@/components/hero/SkinsGrid";
import ComprehensiveBuildPanel from "@/components/hero/ComprehensiveBuildPanel";
import GlobalRanking from "@/components/hero/GlobalRanking";
import { Hero } from "@/data/heroes";
import AudioModule from "@/components/hero/AudioModule";
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
            {/* Elite Standee Container - INCREASED SIZE */}
            <div className="absolute right-0 top-0 h-[85vh] w-full lg:w-[65%] z-[1] overflow-hidden pointer-events-none mt-10">
                <motion.div
                    className="relative w-full h-full flex items-center justify-end pr-0 lg:pr-48"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <img
                        src={hero.image}
                        alt={hero.name}
                        className="h-[110%] w-auto object-contain object-top opacity-90 mix-blend-normal drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] [mask-image:linear-gradient(to_bottom,black_40%,transparent_95%)]"
                    />
                    {/* Simplified mask/gradient for cleaner look */}
                    <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </motion.div>
            </div>

            <Link href="/heroes" className="fixed top-12 left-12 z-50 bg-[#0b0e14] border border-white/10 px-6 py-3 font-mono text-[0.65rem] text-accent font-bold uppercase flex items-center gap-3 transition-all hover:bg-accent hover:text-white group clip-valorant-card">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> TERMINAL_EXIT
            </Link>


            <div className="relative z-[10] pt-40 pb-32 px-6 md:px-12 lg:px-20 grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-12 max-w-[1920px] mx-auto items-start">
                <div className="flex flex-col min-w-0">
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
                        {/* Secondary Intel Grid - MOVED TO LOWER SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative bg-[#0b0e14]/60 backdrop-blur-md p-8 clip-valorant-card group overflow-hidden h-[180px] flex flex-col justify-center">
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

                            <div className="relative bg-[#0b0e14]/60 backdrop-blur-md p-8 clip-valorant-card group overflow-hidden h-[180px] flex flex-col justify-center">
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
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {hero.relationships.map((rel, i) => (
                                    <Link href={rel.heroId ? `/hero/${rel.heroId}` : '#'} key={i} className="relative flex flex-col items-center gap-3 min-w-[100px] group">
                                        <div className="w-20 h-20 rounded-full border-2 border-white/10 p-1 group-hover:border-accent transition-colors relative">
                                            <img src={rel.image} alt={rel.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0b0e14] border border-white/20 px-2 py-0.5 text-[0.5rem] font-mono text-white whitespace-nowrap uppercase tracking-wider group-hover:text-accent group-hover:border-accent transition-colors">
                                                {rel.type}
                                            </div>
                                        </div>
                                        <span className="font-display text-sm text-white uppercase group-hover:text-accent transition-colors">{rel.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Inspiration Footnote */}
                        {/* PRO RANKING SECTION */}
                        <div className="mt-8">
                            <GlobalRanking heroId={hero.id} primaryColor={hero.primaryColor} />
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

                {/* Right Column: Tactical Widgets & Visuals */}
                <div className="flex flex-col gap-12 relative z-20 mt-20">
                    {/* Tactical Radar Widget */}
                    <motion.div
                        className="relative bg-[#0b0e14]/80 backdrop-blur-md p-8 border border-white/5 clip-valorant-card group overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ borderColor: `${hero.primaryColor}20` }}
                    >
                        <div className="font-mono text-[0.6rem] text-accent tracking-[0.5em] uppercase mb-6" style={{ color: hero.primaryColor }}>
                            // TELEMETRY_DATA
                        </div>
                        <TacticalRadar
                            stats={{
                                ...hero.stats,
                                effect: hero.stats.control
                            }}
                            primaryColor={hero.primaryColor}
                        />
                    </motion.div>

                    {/* Abilities Module */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <AbilitiesModule skills={hero.skills} accentColor={hero.primaryColor} />
                    </motion.div>

                    {/* Skins Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <SkinsGrid skins={hero.gallery} heroName={hero.name} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
