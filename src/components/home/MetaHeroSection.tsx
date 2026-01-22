"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, Ban, Target, Sword, Shield, AlertTriangle } from "lucide-react";
import { MetaHero } from "@/lib/meta-api";
import Link from "next/link";

interface MetaHeroSectionProps {
    data: MetaHero[];
}

const RoleIcon = ({ role }: { role: string }) => {
    switch (role.toLowerCase()) {
        case "assassin": return <Sword size={14} />;
        case "tank": return <Shield size={14} />;
        case "marksman": return <Target size={14} />;
        case "mage": return <AlertTriangle size={14} />; // Using generic for now
        default: return <Trophy size={14} />;
    }
}

export default function MetaHeroSection({ data }: MetaHeroSectionProps) {
    const [filter, setFilter] = useState<"ALL" | "S+" | "S">("S+");

    // Filter and sort by Tier then Win Rate
    const displayedHeroes = data
        .filter(h => filter === "ALL" || h.tier === filter)
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 4); // Top 4 for the requested "Hero of the Week" spotlight feel

    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Trophy size={20} className="text-neon-gold animate-pulse" />
                        <span className="font-mono text-xs text-neon-gold tracking-[0.4em] uppercase">META_ANALYSIS_V2.0</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight">
                        META <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-600">HEROES</span>
                    </h2>
                </div>

                <div className="flex gap-2">
                    {(["S+", "S", "ALL"] as const).map(tier => (
                        <button
                            key={tier}
                            onClick={() => setFilter(tier)}
                            className={`px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all clip-valorant-card ${filter === tier
                                ? 'bg-accent text-white shadow-[0_0_15px_rgba(255,70,85,0.4)]'
                                : 'bg-white/5 text-[#666] hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            TIER_{tier}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                    {displayedHeroes.map((hero, idx) => (
                        <motion.div
                            key={hero.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="group relative bg-[#0b0e14]/80 backdrop-blur-sm border border-white/10 hover:border-accent transition-all duration-300 clip-valorant-card hover:-translate-y-2"
                        >
                            {/* Card Header / Image */}
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent z-10" />

                                {/* Placeholder Image handling - in real app would match IDs properly */}
                                <img
                                    src={`/heroes/${hero.name.replace(/\s+/g, '')}.png`}
                                    alt={hero.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    onError={(e) => {
                                        // Fallback if image not found
                                        (e.target as HTMLImageElement).src = '/heroes/Saber.png';
                                    }}
                                />

                                {/* Tier Badge */}
                                <div className="absolute top-4 right-4 z-20">
                                    <div className={`
                                        w-12 h-12 flex items-center justify-center font-display text-2xl font-bold
                                        bg-black/80 border border-white/20 backdrop-blur-md
                                        ${hero.tier === 'S+' ? 'text-neon-gold border-neon-gold shadow-[0_0_15px_rgba(255,183,0,0.3)]' : 'text-white'}
                                    `}>
                                        {hero.tier}
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10 rounded-full">
                                        <RoleIcon role={hero.role} />
                                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white">{hero.role}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                <h3 className="font-display text-3xl text-white uppercase mb-4 group-hover:text-neon-gold transition-colors">{hero.name}</h3>

                                {/* Tactical Data Bar */}
                                <div className="grid grid-cols-3 gap-2 mb-6 border-t border-white/10 pt-4">
                                    <div className="flex flex-col items-center">
                                        <span className="font-mono text-[0.5rem] text-[#666] mb-1">WIN_RATE</span>
                                        <span className={`font-mono text-sm font-bold ${hero.winRate >= 55 ? 'text-neon-green' : 'text-white'}`}>{hero.winRate}%</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-white/10">
                                        <span className="font-mono text-[0.5rem] text-[#666] mb-1">PICK_RATE</span>
                                        <span className="font-mono text-sm font-bold text-white">{hero.pickRate}%</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-white/10">
                                        <span className="font-mono text-[0.5rem] text-[#666] mb-1">BAN_RATE</span>
                                        <span className="font-mono text-sm font-bold text-accent">{hero.banRate}%</span>
                                    </div>
                                </div>

                                {/* Core Items Mini-Display */}
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[0.5rem] text-[#444] uppercase tracking-widest">CORE_BUILD</span>
                                    <div className="flex gap-1">
                                        {hero.coreItems.slice(0, 3).map((item, i) => (
                                            <div key={i} className="w-6 h-6 bg-white/5 border border-white/10 flex items-center justify-center group/item relative">
                                                <Sword size={10} className="text-[#644]" />
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 text-[0.5rem] font-mono whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none">
                                                    {item}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link href={`/hero/${hero.id}`} className="absolute inset-0 z-30" />
                            {/* Hover Border Effect */}
                            {/* Hover Border Effect using pseudo-element logic via classes since clip-path cuts standard borders */}
                            <div className="absolute inset-0 bg-transparent pointer-events-none transition-all duration-300 group-hover:shadow-[inset_0_0_0_1px_#ff4655]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Disclaimer / Footer */}
            <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
                <span className="font-mono text-[0.6rem] text-[#444] uppercase tracking-widest">DATA_SOURCE: MLBB_OFFICIAL_API_V4</span>
                <span className="font-mono text-[0.6rem] text-neon-gold uppercase tracking-widest animate-pulse">LIVE_UPDATE_ACTIVE</span>
            </div>
        </section>
    );
}
