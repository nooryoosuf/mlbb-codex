"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { emblems, battleSpells } from "@/data/game-knowledge";
import HeroVideoBackdrop from "@/components/hero/HeroVideoBackdrop";

export default function KnowledgeBase() {
    const [activeTab, setActiveTab] = useState<"emblems" | "spells">("emblems");

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center">
            <HeroVideoBackdrop />

            <header className="relative z-20 pt-32 pb-16 text-center">
                <h1 className="font-display text-4xl mb-2 tracking-[4px] uppercase">BATTLE_DATA</h1>
                <span className="font-mono text-xs text-[#666] tracking-[2px]">// TACTICAL RESOURCE DATABASE</span>
            </header>

            <div className="relative z-20 flex gap-4 mb-20">
                <button
                    onClick={() => setActiveTab("emblems")}
                    className={`px-8 py-3 font-mono text-sm tracking-[2px] transition-all border ${activeTab === "emblems" ? 'bg-accent border-accent text-white shadow-[0_0_20px_rgba(255,70,85,0.4)]' : 'bg-white/5 border-white/10 text-[#8b9bb4] hover:bg-white/10'}`}
                >
                    EMBLEM_SETS
                </button>
                <button
                    onClick={() => setActiveTab("spells")}
                    className={`px-8 py-3 font-mono text-sm tracking-[2px] transition-all border ${activeTab === "spells" ? 'bg-accent border-accent text-white shadow-[0_0_20px_rgba(255,70,85,0.4)]' : 'bg-white/5 border-white/10 text-[#8b9bb4] hover:bg-white/10'}`}
                >
                    BATTLE_SPELLS
                </button>
            </div>

            <div className="relative z-20 w-full max-w-7xl px-8 pb-32">
                {activeTab === "emblems" && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {emblems.map((emblem) => {
                            const Icon = emblem.icon;
                            return (
                                <div key={emblem.id} className="bg-[#0a0a0c]/80 border border-white/5 p-8 flex flex-col group hover:border-accent transition-all [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                            <Icon size={24} className="text-[#8b9bb4] group-hover:text-accent" />
                                        </div>
                                        <span className="font-mono text-[0.6rem] text-accent tracking-[2px] uppercase">{emblem.role}</span>
                                    </div>
                                    <h2 className="font-display text-2xl text-white mb-4 uppercase tracking-[1px]">{emblem.name}</h2>
                                    <p className="font-mono text-sm text-[#8b9bb4] leading-relaxed mb-8 h-20 overflow-hidden">{emblem.description}</p>

                                    <span className="font-mono text-[0.6rem] text-[#444] tracking-[2px] mb-4 uppercase border-b border-white/5 pb-2">KEY ATTRIBUTES:</span>
                                    <ul className="flex flex-col gap-2 mb-8">
                                        {emblem.attributes.map((attr, i) => (
                                            <li key={i} className="font-mono text-[0.75rem] text-[#aeb4b7] flex items-center gap-2 before:content-['>'] before:text-accent">{attr}</li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto pt-6 border-t border-white/5 font-mono text-[0.7rem] text-neon-green uppercase tracking-[1px]">
                                        Best for: {emblem.bestFor}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {activeTab === "spells" && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {battleSpells.map((spell) => {
                            const Icon = spell.icon;
                            return (
                                <div key={spell.id} className="bg-[#0a0a0c]/80 border border-white/5 p-8 flex flex-col group hover:border-accent transition-all [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                            <Icon size={24} className="text-[#8b9bb4] group-hover:text-accent" />
                                        </div>
                                        <span className="font-mono text-[0.6rem] text-accent tracking-[2px] uppercase">COOLDOWN: {spell.cooldown}</span>
                                    </div>
                                    <h2 className="font-display text-2xl text-white mb-4 uppercase tracking-[1px]">{spell.name}</h2>
                                    <p className="font-mono text-sm text-[#8b9bb4] leading-relaxed mb-8 h-20 overflow-hidden">{spell.description}</p>

                                    <div className="mt-auto pt-6 border-t border-white/5 font-mono text-[0.7rem] text-neon-green uppercase tracking-[1px]">
                                        Recommended for: {spell.bestFor}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </main>
    );
}
