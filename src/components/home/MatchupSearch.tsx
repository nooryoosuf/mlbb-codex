"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, Target, Zap, Cpu, Scan, Info, Activity, AlertTriangle } from "lucide-react";
import { heroes, Hero } from "@/data/heroes";

export default function MatchupSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return heroes.filter(h =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.class.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
    }, [searchTerm]);

    const handleSelectHero = (hero: Hero) => {
        setSelectedHero(hero);
        setSearchTerm("");
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Tactical HUD Search Bar */}
            <div className={`relative transition-all duration-500 ${selectedHero ? 'mb-12' : 'mb-0'}`}>
                <div className="absolute inset-0 bg-[#06090e]/80 backdrop-blur-xl border border-white/10 [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)] -z-10 group" />

                <div className="p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Scan size={18} className="text-accent animate-pulse" />
                            <div className="flex flex-col">
                                <span className="font-mono text-[0.65rem] text-accent tracking-[0.4em] uppercase">ROSTER_SCANNER // BATTLE_INTEL</span>
                                <span className="font-display text-lg text-white tracking-widest uppercase">MATCHUP_ANALYZER_v4.1</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 font-mono text-[0.6rem] text-[#333]">
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#00ff9d]" /> UPLINK_STABLE</div>
                            <div>SECURE_LINE: 0x88f21</div>
                        </div>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 font-mono text-white text-lg tracking-wider outline-none transition-all focus:border-accent focus:bg-white/10 placeholder:text-[#333]"
                            placeholder="OPERATOR_INPUT: IDENTIFY HERO FOR TACTICAL DECRYPTION..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-accent transition-colors" size={24} />

                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    className="absolute top-full left-0 right-0 bg-[#0b0e14] border-x border-b border-accent/40 z-[100] mt-1 shadow-[0_20px_50px_rgba(0,0,0,0.8)] divide-y divide-white/5 max-h-[400px] overflow-y-auto scrollbar-hide"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {searchResults.map(hero => (
                                        <div
                                            key={hero.id}
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/10 group/item transition-colors"
                                            onClick={() => handleSelectHero(hero)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 relative overflow-hidden">
                                                    <img src={hero.image} alt={hero.name} className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-display text-xl text-white uppercase group-hover/item:text-accent transition-colors">{hero.name}</span>
                                                    <span className="font-mono text-[0.6rem] text-[#666] uppercase tracking-widest">{hero.role}</span>
                                                </div>
                                            </div>
                                            <div className="font-mono text-[0.6rem] text-accent opacity-0 group-hover/item:opacity-100 transition-opacity">SELECT_PROFILE &gt;</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Matchup Matrix */}
            <AnimatePresence mode="wait">
                {selectedHero ? (
                    <motion.div
                        key={selectedHero.id}
                        className="glass-panel p-12 relative overflow-hidden group"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />

                        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-white/10 pb-12">
                            <div className="flex items-center gap-8">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden border-2 border-accent/40">
                                    <img src={selectedHero.image} alt={selectedHero.name} className="w-full h-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="font-mono text-[0.7rem] text-accent tracking-[0.5em] uppercase">// SUBJECT: {selectedHero.id.toUpperCase()}</div>
                                    <h2 className="font-display text-6xl md:text-8xl text-white leading-none uppercase tracking-tighter shadow-accent">{selectedHero.name}</h2>
                                    <div className="flex gap-4">
                                        <span className="font-mono text-[0.6rem] text-[#8b9bb4] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1">CLASS: {selectedHero.class}</span>
                                        <span className="font-mono text-[0.6rem] text-accent uppercase tracking-widest bg-accent/5 border border-accent/10 px-3 py-1">DIFFICULTY: {selectedHero.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="font-mono text-[0.6rem] text-[#444] hover:text-accent transition-colors tracking-widest uppercase border border-white/10 px-4 py-2 hover:border-accent/40"
                                onClick={() => setSelectedHero(null)}
                            >
                                [ PURGE_PROFILE ]
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            {/* Threat Levels (Counters) */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 bg-gradient-to-r from-accent/10 to-transparent p-2 border-l-2 border-accent">
                                    <ShieldAlert size={18} className="text-accent animate-pulse" />
                                    <h3 className="font-display text-2xl text-white tracking-widest uppercase">
                                        <span className="text-white">CRITICAL</span>_<span className="text-accent">THREATS</span>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedHero.counters.weakAgainst.map((counter, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-accent/5 border border-accent/10 p-2 pr-4 flex items-center justify-between group/threat hover:bg-accent/10 transition-colors"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Hero Image handling for counters */}
                                                <div className="w-10 h-10 border border-white/10 overflow-hidden relative">
                                                    <img
                                                        src={`/heroes/${counter.replace(/\s+/g, '')}.png`}
                                                        onError={(e) => (e.target as HTMLImageElement).src = '/heroes/Saber.png'}
                                                        className="w-full h-full object-cover"
                                                        alt={counter}
                                                    />
                                                </div>
                                                <span className="font-display text-xl text-white uppercase tracking-wider group-hover/threat:text-accent transition-colors">{counter}</span>
                                            </div>
                                            <div className="font-mono text-[0.5rem] text-accent opacity-50 group-hover/threat:opacity-100 transition-opacity">HIGH_THREAT</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Targets of Opportunity */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 bg-gradient-to-r from-neon-green/10 to-transparent p-2 border-l-2 border-neon-green">
                                    <Target size={18} className="text-neon-green" />
                                    <h3 className="font-display text-2xl text-white tracking-widest uppercase">
                                        <span className="text-white">OPTIMAL</span>_<span className="text-neon-green">TARGETS</span>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedHero.counters.strongAgainst.map((target, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-neon-green/5 border border-neon-green/10 p-2 pr-4 flex items-center justify-between group/target hover:bg-neon-green/10 transition-colors"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Hero Image handling for targets */}
                                                <div className="w-10 h-10 border border-white/10 overflow-hidden relative">
                                                    <img
                                                        src={`/heroes/${target.replace(/\s+/g, '')}.png`}
                                                        onError={(e) => (e.target as HTMLImageElement).src = '/heroes/Saber.png'}
                                                        className="w-full h-full object-cover"
                                                        alt={target}
                                                    />
                                                </div>
                                                <span className="font-display text-xl text-white uppercase tracking-wider group-hover/target:text-neon-green transition-colors">{target}</span>
                                            </div>
                                            <div className="font-mono text-[0.5rem] text-neon-green opacity-50 group-hover/target:opacity-100 transition-opacity">VULNERABLE</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tactical Intelligence Note */}
                        <div className="mt-16 bg-[#000]/40 border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 font-mono text-[0.4rem] text-[#222]">SYSTEM_GEN_ADVICE</div>
                            <div className="flex items-center gap-4 text-accent min-w-max">
                                <Info size={24} />
                                <span className="font-mono text-xs font-bold tracking-widest uppercase">TACTICAL_RECOMMENDATION:</span>
                            </div>
                            <div className="font-mono text-sm text-[#8b9bb4] italic leading-relaxed uppercase border-l border-white/10 pl-8">
                                DATA INDICATES {selectedHero.name.toUpperCase()} PERFORMANCE PEAKS WITH {selectedHero.loadout.battleSpell.toUpperCase()} DEPLOYMENT. PRIORITIZE {selectedHero.loadout.emblem.toUpperCase()} EMBLEM FOR SYNERGY.
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="h-[400px] glass-panel border border-dashed border-white/10 flex flex-col items-center justify-center space-y-8 group bg-gradient-to-b from-[#0b0e14] via-[#0b0e14] to-accent/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="relative">
                            <Cpu size={64} className="text-[#1a202c] group-hover:text-accent transition-colors duration-1000" />
                            <motion.div
                                className="absolute inset-0 border-2 border-accent rounded-full opacity-30"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <div className="text-center space-y-4">
                            <h3 className="font-display text-3xl text-[#444] uppercase tracking-widest group-hover:text-white transition-colors">AWAITING_INPUT_TARGET</h3>
                            <p className="font-mono text-[0.7rem] text-[#222] tracking-[0.4em] uppercase group-hover:text-[#666]">INITIALIZE SCAN SEQUENCE TO GENERATE MISSION_MATCHUP_MATRIX</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
