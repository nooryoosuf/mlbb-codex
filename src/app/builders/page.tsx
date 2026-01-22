"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Cpu, X, AlertTriangle, Layers, ShoppingBag, TrendingUp, ShieldCheck, Activity, Target, ArrowLeft } from "lucide-react";
import buildersData from "../../data/builders_data.json";
import equipmentData from "../../data/equipment.json";
import LoadoutGuide from "@/components/home/LoadoutGuide";

const TACTICAL_WARNINGS = [
    {
        title: "MALEFELIC ROAR + WAR AXE",
        desc: "ANTISYNERGY: War Axe focuses on True Damage at max stacks. Since True Damage ignores Physical Defense, the percentage Physical PEN from Malefic Roar becomes less efficient. Prioritize Hunter Strike for CDR and flat Pen instead."
    },
    {
        title: "BLOOD WINGS + HOLY CRYSTAL",
        desc: "EFFICIENCY ALERT: Stacking flat Magic Power early is sub-optimal. Prioritize Genius Wand for penetration before high-percentage Magic Power scaling in the late game."
    },
    {
        title: "Fredrinn + Tank Emblem",
        desc: "META WARNING: Fredrinn scales better with Fighter Emblem / HP. Using Tank Emblem reduces the conversion factor for his Crystal Energy burst from his passive."
    },
    {
        title: "Golden Staff + Critical Items",
        desc: "ANTISYNERGY: Golden Staff converts Critical Chance into Attack Speed. Do not build Berseker's Fury or Haas's Claws if you are using Golden Staff, as the Crit Chance will be wasted."
    }
];

const META_TIPS = [
    { emblem: "Basic Common", bestFor: "Mana-hungry Heroes", tip: "Eliminates need for Mana Boots on Zhuxin / Hylos." },
    { emblem: "Assassin", bestFor: "Burst / Junglers", tip: "Highest Adaptive Pen for Sora and Gusion." },
    { emblem: "Tank", bestFor: "Frontliners", tip: "Use Tenacity (Tier 2) for massive defense boosts at low HP." },
    { emblem: "Mage", bestFor: "Magic DPS", tip: "Bargain Hunter allows 1-item lead in early game." }
];

export default function BuildersHub() {
    const [selectedEmblem, setSelectedEmblem] = useState(buildersData.emblems[0]);
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);


    return (
        <main className="min-h-screen pt-32 pb-32 px-6 md:px-12 flex flex-col items-center">
            {/* Background Layer inherited from globals */}

            <div className="w-full max-w-[1440px] z-10 space-y-32">
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-widest uppercase hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK_TO_CODEX
                </Link>

                {/* Protocol Header */}
                <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 gap-8">
                    <div className="flex flex-col">
                        <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] mb-4">// MISSION_CRITICAL_EQUIPMENT_LOADOUT</div>
                        <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-none text-white uppercase">
                            BUILDERS_<span className="text-accent glow-accent">HUB</span>
                        </h1>
                    </div>
                    <div className="flex flex-col items-end gap-3 font-mono">
                        <div className="flex items-center gap-3 bg-neon-gold/5 border border-neon-gold/20 px-4 py-2">
                            <div className="w-2 h-2 bg-neon-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(255,183,0,0.5)]" />
                            <span className="text-neon-gold text-xs tracking-widest font-bold">PROTOCOLS_LOADED</span>
                        </div>
                        <div className="text-[0.6rem] text-[#444] tracking-widest uppercase">ENCRYPTION: AES-256</div>
                    </div>
                </header>

                {/* 01 // Emblem Lab */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <Cpu className="text-accent" size={20} />
                        <h2 className="font-display text-2xl text-white tracking-[0.2em] uppercase">01 // THE_EMBLEM_LAB</h2>
                        <div className="h-[1px] bg-white/10 grow ml-4" />
                        <span className="font-mono text-[0.6rem] text-accent uppercase bg-accent/10 px-3 py-1 border border-accent/20">ACTIVE_PROTOCOL</span>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                        {buildersData.emblems.map((emblem, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedEmblem(emblem)}
                                className={`min-w-[160px] aspect-square flex flex-col items-center justify-center border transition-all duration-300 relative group overflow-hidden [clip-path:polygon(0_0,100%_0,100%_80%,80%_100%,0_100%)] ${selectedEmblem.name === emblem.name
                                    ? 'bg-accent/10 border-accent shadow-[0_0_30px_rgba(255,70,85,0.2)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <img src={emblem.icon} alt={emblem.name} className={`w-12 h-12 mb-3 transition-transform duration-500 ${selectedEmblem.name === emblem.name ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,70,85,0.5)]' : 'grayscale group-hover:grayscale-0'}`} />
                                <span className="font-mono text-[0.65rem] text-white tracking-widest uppercase">{emblem.name}</span>
                                {selectedEmblem.name === emblem.name && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedEmblem.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-[#0f1923]/40 border border-white/10 p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 font-mono text-[0.5rem] text-[#222] select-none uppercase tracking-[0.5em]">DATA_STREAM_v4.2</div>
                            {selectedEmblem.attributes.split(', ').map((attr, idx) => {
                                const [label, value] = attr.split(': ');
                                return (
                                    <div key={idx} className="flex flex-col gap-2 group">
                                        <span className="font-mono text-[0.6rem] text-neon-green uppercase tracking-[3px] group-hover:text-accent transition-colors">{label}</span>
                                        <span className="font-display text-5xl text-white tracking-tighter group-hover:glow-accent transition-all">{value}</span>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* 02 // Combat Modules (Moved from Homepage) */}
                <section className="space-y-12">
                    <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
                        <div className="flex flex-col">
                            <h2 className="font-display text-4xl text-white tracking-widest uppercase mb-4 flex items-center gap-4">
                                <Zap className="text-neon-gold" /> <span className="text-white">COMBAT</span>_<span className="text-neon-gold">MODULES</span>
                            </h2>
                            <p className="font-mono text-sm text-[#666] tracking-widest uppercase">EQUIPMENT, EMBLEMS, AND BATTLE_CORE INTELLIGENCE</p>
                        </div>
                    </header>
                    <LoadoutGuide />
                </section>

                {/* 03 // Equipment Arsenal */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <ShoppingBag className="text-neon-gold" size={20} />
                        <h2 className="font-display text-2xl tracking-[0.2em] uppercase">
                            <span className="text-white">03 // EQUIPMENT</span>_<span className="text-neon-gold">ARSENAL</span>
                        </h2>
                        <div className="h-[1px] bg-white/10 grow ml-4" />
                        <span className="font-mono text-[0.6rem] text-neon-gold uppercase bg-neon-gold/10 px-3 py-1 border border-neon-gold/20">TIER_3_READY</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {equipmentData.map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                onClick={() => setSelectedEquipment(item)}
                                className={`aspect-square relative flex items-center justify-center border transition-all duration-300 group ${selectedEquipment?.name === item.name
                                    ? 'bg-neon-gold/20 border-neon-gold'
                                    : 'bg-white/5 border-white/5 hover:border-neon-gold/50'
                                    }`}
                            >
                                <img src={item.icon} alt={item.name} className="w-3/4 h-3/4 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" />
                                <div className="absolute bottom-1 right-1 font-mono text-[0.4rem] text-neon-gold opacity-0 group-hover:opacity-100 transition-opacity uppercase">DATA</div>
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedEquipment && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="glass-panel p-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-gold/30 animate-pulse" />
                                <button onClick={() => setSelectedEquipment(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>

                                <div className="flex flex-col lg:flex-row gap-16">
                                    <div className="flex flex-col items-center lg:items-start lg:w-1/3">
                                        <div className="w-32 h-32 border-2 border-neon-gold p-4 bg-black/40 mb-8 relative">
                                            <img src={selectedEquipment.icon} alt={selectedEquipment.name} className="w-full h-full object-contain" />
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-neon-gold text-black font-mono text-[0.6rem] font-bold px-3 py-1 whitespace-nowrap uppercase tracking-widest">
                                                {selectedEquipment.cost} GOLD
                                            </div>
                                        </div>
                                        <h3 className="font-display text-5xl text-white uppercase text-center lg:text-left leading-none mb-4 tracking-tighter">{selectedEquipment.name}</h3>
                                        <div className="font-mono text-[0.65rem] text-neon-gold uppercase tracking-[0.4em] mb-8">// CATEGORY: {selectedEquipment.category}</div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="font-mono text-[0.6rem] text-[#444] tracking-widest uppercase flex items-center gap-3">
                                                    <TrendingUp size={14} className="text-neon-gold" /> CORE_ATTRIBUTES
                                                </div>
                                                <ul className="space-y-3">
                                                    {selectedEquipment.stats.map((s: string, i: number) => (
                                                        <li key={i} className="font-mono text-xs text-white flex items-center gap-3 before:content-['>'] before:text-neon-gold before:font-bold">{s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="font-mono text-[0.6rem] text-[#444] tracking-widest uppercase flex items-center gap-3">
                                                    <Zap size={14} className="text-neon-gold" /> UNIQUE_EFFECTS
                                                </div>
                                                <div className="space-y-6">
                                                    {selectedEquipment.unique_passives.map((p: { name: string; description: string }, i: number) => (
                                                        <div key={i} className="bg-white/5 p-4 border-l-2 border-neon-gold/40">
                                                            <strong className="text-neon-gold block font-display text-sm tracking-widest mb-2 uppercase">{p.name}</strong>
                                                            <p className="font-mono text-[0.7rem] text-[#8b9bb4] leading-relaxed">{p.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="font-mono text-[0.6rem] text-[#444] tracking-widest uppercase flex items-center gap-3">
                                                    <Target size={14} className="text-neon-green" /> BEST_UTILIZATION
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedEquipment.best_for.map((b: string, i: number) => (
                                                        <span key={i} className="font-mono text-[0.6rem] text-neon-green bg-neon-green/5 border border-neon-green/20 px-3 py-1 uppercase">{b}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="font-mono text-[0.6rem] text-[#444] tracking-widest uppercase flex items-center gap-3">
                                                    <ShieldCheck size={14} className="text-accent" /> COUNTER_PROTOCOL
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedEquipment.countered_by.map((c: string, i: number) => (
                                                        <span key={i} className="font-mono text-[0.6rem] text-accent bg-accent/5 border border-accent/20 px-3 py-1 uppercase">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* 04 // Tactical Warnings */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="text-accent" size={20} />
                        <h2 className="font-display text-2xl text-white tracking-[0.2em] uppercase">04 // TACTICAL_THREAT_DATABASE</h2>
                        <div className="h-[1px] bg-white/10 grow ml-4" />
                        <span className="font-mono text-[0.6rem] text-accent uppercase bg-accent/10 px-3 py-1 border border-accent/20">HIGH_PRIORITY</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {TACTICAL_WARNINGS.map((warning, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1c22] border-l-4 border-accent p-8 space-y-4 hover:bg-accent/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4 text-accent">
                                    <AlertTriangle size={20} className="group-hover:animate-pulse" />
                                    <h3 className="font-display text-xl uppercase tracking-widest group-hover:animate-text-glitch">{warning.title}</h3>
                                </div>
                                <p className="font-mono text-xs text-[#8b9bb4] leading-relaxed tracking-wide italic">"{warning.desc}"</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 05 // Meta Tips */}
                <section className="space-y-12 pb-32">
                    <div className="flex items-center gap-4">
                        <Activity className="text-neon-gold" size={20} />
                        <h2 className="font-display text-2xl text-white tracking-[0.2em] uppercase">05 // INTELLIGENCE_STREAM</h2>
                        <div className="h-[1px] bg-white/10 grow ml-4" />
                        <span className="font-mono text-[0.6rem] text-neon-gold uppercase bg-neon-gold/10 px-3 py-1 border border-neon-gold/20">2026_UPDATE</span>
                    </div>

                    <div className="bg-[#0f1923]/40 border border-white/5 overflow-hidden">
                        <table className="w-full text-left font-mono">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 text-[0.65rem] text-accent tracking-[0.4em] uppercase">EMBLEM_SIGNATURE</th>
                                    <th className="p-6 text-[0.65rem] text-accent tracking-[0.4em] uppercase">RECOMMENDED_FOR</th>
                                    <th className="p-6 text-[0.65rem] text-accent tracking-[0.4em] uppercase">STRATEGIC_ADVICE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {META_TIPS.map((tip, idx) => (
                                    <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                                        <td className="p-6 font-display text-xl text-white group-hover:text-accent transition-colors uppercase">{tip.emblem}</td>
                                        <td className="p-6 font-mono text-[0.65rem] text-[#8b9bb4] uppercase tracking-widest">{tip.bestFor}</td>
                                        <td className="p-6 font-mono text-[0.7rem] text-white leading-relaxed">
                                            <span className="text-neon-green mr-2">PROTOCOL:</span> {tip.tip}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Selection Modal */}

        </main>
    );
}
