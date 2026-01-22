"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Filter, Shield, Sword, Zap, Target, Crosshair, Cpu, Menu, ArrowLeft } from "lucide-react";
import HeroVideoBackdrop from "@/components/hero/HeroVideoBackdrop";
import { heroes } from "@/data/heroes";

const LANES = ["ALL", "Gold", "EXP", "Mid", "Jungle", "Roam"];
const ROLES = ["ALL", "Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];

export default function HeroesIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLane, setActiveLane] = useState("ALL");
    const [activeRole, setActiveRole] = useState("ALL");

    const filteredHeroes = heroes.filter(hero => {
        const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hero.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLane = activeLane === "ALL" || hero.lane === activeLane;
        const matchesRole = activeRole === "ALL" || hero.role.includes(activeRole);
        return matchesSearch && matchesLane && matchesRole;
    });

    return (
        <main className="min-h-screen bg-black text-white relative">
            <HeroVideoBackdrop />


            <div className="flex flex-col lg:flex-row relative z-10">
                {/* Tactical Sidebar */}
                <aside className="w-full lg:w-96 min-h-screen border-r border-white/10 bg-black/80 backdrop-blur-xl p-10 pt-12 space-y-12">
                    <Link href="/" className="inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-widest uppercase hover:text-white mb-8 transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK_TO_CODEX
                    </Link>

                    <header className="space-y-4">
                        <div className="font-mono text-[0.6rem] text-accent tracking-[0.5em] uppercase">// DATA_INDEXED</div>
                        <h1 className="font-display text-6xl text-white tracking-tighter leading-none uppercase">
                            HERO_<span className="text-accent glow-accent">VAULT</span>
                        </h1>
                        <p className="font-mono text-xs text-[#444] tracking-widest leading-relaxed">AUTHENTICATING_ROSTER_SIGNATURES... ACCESS_GRANTED [125_ENTRIES_LOADED]</p>
                    </header>

                    {/* Search Module */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-accent font-mono text-[0.65rem] tracking-widest uppercase mb-4">
                            <Search size={14} /> SEARCH_ARCHIVE
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="IDENTIFY_HERO..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-5 pl-12 font-mono text-sm tracking-wider focus:outline-none focus:border-accent group-hover:bg-white/[0.08] transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-accent transition-colors" size={18} />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] text-[#333]">V4.1</div>
                        </div>
                    </div>

                    {/* Lane Matrix */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-accent font-mono text-[0.65rem] tracking-widest uppercase mb-4">
                            <Target size={14} /> TACTICAL_LANE_INDEX
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {LANES.map(lane => (
                                <button
                                    key={lane}
                                    onClick={() => setActiveLane(lane)}
                                    className={`p-3 text-left font-mono text-[0.7rem] border transition-all ${activeLane === lane
                                        ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(255,70,85,0.3)]'
                                        : 'bg-white/5 border-white/5 text-[#8b9bb4] hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {lane.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-accent font-mono text-[0.65rem] tracking-widest uppercase mb-4">
                            <Shield size={14} /> COMBAT_ROLES
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setActiveRole(role)}
                                    className={`px-4 py-2 font-mono text-[0.65rem] border transition-all ${activeRole === role
                                        ? 'bg-white text-black border-white'
                                        : 'bg-white/5 border-white/5 text-[#444] hover:text-white'
                                        }`}
                                >
                                    {role.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5">
                        <div className="flex justify-between items-center text-[0.6rem] font-mono text-[#333] tracking-[4px]">
                            <span>ENCRYPTION_v8.4.2</span>
                            <span>S_STATUS_OFF</span>
                        </div>
                    </div>
                </aside>

                {/* Hero Grid Content */}
                <div className="flex-1 p-8 lg:p-20 pt-32 lg:pt-32">
                    <header className="flex justify-between items-end mb-16 border-b border-white/10 pb-12">
                        <div className="flex flex-col">
                            <h2 className="font-display text-4xl uppercase tracking-tighter mb-4">
                                <span className="text-white">RESULTS</span>_<span className="text-accent">OUTPUT</span>
                            </h2>
                            <div className="font-mono text-[0.65rem] text-accent tracking-[0.4em] uppercase">SYSTEM_MATCHES: {filteredHeroes.length}</div>
                        </div>
                        <div className="flex items-center gap-6 font-mono text-[0.6rem] text-[#444] tracking-widest">
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> SCANNING_ACTIVE</div>
                            <div className="hidden md:block">PAGE_01 // 01</div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        <AnimatePresence>
                            {filteredHeroes.map((hero, idx) => (
                                <motion.div
                                    key={hero.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05, ease: "backOut" }}
                                >
                                    <Link href={`/hero/${hero.id}`} className="group block h-full">
                                        <div className="relative aspect-[3/4] bg-black/40 border border-white/10 group-hover:border-accent transition-all duration-500 overflow-hidden clip-valorant-card">
                                            {/* Scanline Background */}
                                            <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-10" />

                                            <img
                                                src={hero.image}
                                                alt={hero.name}
                                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                            {/* Hover HUD Elements - Pseudo-border */}
                                            <div className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:shadow-[inset_0_0_0_1px_#ff4655] pointer-events-none" />
                                            <div className="absolute top-2 left-2 font-mono text-[0.5rem] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                                ID: {hero.id.toUpperCase()}
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <div className="font-mono text-[0.6rem] text-accent mb-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase">{hero.difficulty} DIFF</div>
                                                <h3 className="font-display text-4xl text-white leading-none uppercase mb-2 group-hover:text-accent transition-colors">{hero.name}</h3>
                                                <div className="flex gap-2">
                                                    <span className="font-mono text-[0.5rem] text-[#8b9bb4] uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/10">{hero.lane}</span>
                                                    <span className="font-mono text-[0.5rem] text-[#8b9bb4] uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/10">{hero.role}</span>
                                                </div>
                                            </div>

                                            {/* Moving scan bar on hover */}
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/40 shadow-[0_0_10px_rgba(255,70,85,0.8)] z-10 opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredHeroes.length === 0 && (
                        <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/[0.02]">
                            <Cpu className="text-[#333] mb-6" size={48} />
                            <div className="font-mono text-sm text-[#444] tracking-[1em] uppercase">NO_SIGNATURES_MATCHED</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Index Counter */}
            <div className="fixed bottom-12 left-12 z-[100] hidden xl:flex flex-col gap-1 items-start font-mono text-[0.6rem] text-white/20 select-none">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent" />
                    <span>DATABASE_MASTER_STREAM</span>
                </div>
                <div>v4.88.1.002 // TACTICAL_GRID</div>
            </div>
        </main>
    );
}
