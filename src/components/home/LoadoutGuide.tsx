"use client";
import React, { useState } from "react";
import { Zap, Flame, Skull, Crosshair, Hexagon, Shield, Activity, Target, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emblems = [
    { id: "assassin", name: "ASSASSIN", icon: Skull, desc: "Increases Adaptive Penetration, Adaptive Attack, and Movement Speed. Best for burst damage dealers." },
    { id: "mage", name: "MAGE", icon: Hexagon, desc: "Increases Magic Power, Magic Penetration, and Cooldown Reduction. Essential for ability casters." },
    { id: "fighter", name: "FIGHTER", icon: Crosshair, desc: "Increases Spell Vamp, Adaptive Attack, and Hybrid Defense. Balanced for sustain and damage." },
    { id: "tank", name: "TANK", icon: Shield, desc: "Increases Hybrid Defense, HP, and HP Regen. Optimized for frontliners." }
];

const spells = [
    { id: "retribution", name: "RETRIBUTION", icon: Zap, desc: "Deals True Damage to creeps or minions. Essential for Junglers to secure objectives." },
    { id: "flicker", name: "FLICKER", icon: Target, desc: "Teleport a short distance in a specified direction. Used for chasing or escaping." },
    { id: "flameshot", name: "FLAMESHOT", icon: Flame, desc: "Fires a flaming shot that knocks back enemies and deals Magic Damage." }
];

export default function LoadoutGuide() {
    const [activeItem, setActiveItem] = useState<any>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <Cpu size={16} className="text-accent" />
                        <h3 className="font-mono text-[0.65rem] tracking-[0.4em] text-[#666] uppercase">COMBAT_EMBLEM_DATABASE</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {emblems.map(e => (
                            <motion.button
                                key={e.id}
                                className={`aspect-square flex items-center justify-center border transition-all duration-300 group relative overflow-hidden ${activeItem?.id === e.id
                                        ? 'bg-accent/20 border-accent shadow-[0_0_15px_rgba(255,70,85,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:border-accent/40 hover:bg-white/10'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setActiveItem(e)}
                            >
                                <e.icon size={28} className={`transition-colors ${activeItem?.id === e.id ? 'text-white' : 'text-[#444] group-hover:text-accent'}`} />
                                {activeItem?.id === e.id && (
                                    <div className="absolute inset-0 border border-accent animate-pulse" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <Activity size={16} className="text-neon-gold" />
                        <h3 className="font-mono text-[0.65rem] tracking-[0.4em] text-[#666] uppercase">BATTLE_SPELL_MATRIX</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {spells.map(s => (
                            <motion.button
                                key={s.id}
                                className={`aspect-square flex items-center justify-center border transition-all duration-300 group relative overflow-hidden ${activeItem?.id === s.id
                                        ? 'bg-neon-gold/20 border-neon-gold shadow-[0_0_15px_rgba(255,183,0,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:border-neon-gold/40 hover:bg-white/10'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setActiveItem(s)}
                            >
                                <s.icon size={28} className={`transition-colors ${activeItem?.id === s.id ? 'text-white' : 'text-[#444] group-hover:text-neon-gold'}`} />
                                {activeItem?.id === s.id && (
                                    <div className="absolute inset-0 border border-neon-gold animate-pulse" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-panel p-10 min-h-[350px] flex items-center justify-center relative group">
                <div className="absolute top-4 left-4 font-mono text-[0.5rem] text-[#222]">MODULE_SPEC_V1.0</div>
                <div className="absolute bottom-4 right-4 font-mono text-[0.5rem] text-[#222] group-hover:text-accent transition-colors">DECRYPTED</div>

                <AnimatePresence mode="wait">
                    {activeItem ? (
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col items-center text-center space-y-8"
                        >
                            <div className="w-20 h-20 border-2 border-accent/20 flex items-center justify-center p-4 bg-white/5">
                                <activeItem.icon size={40} className="text-accent" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-display text-4xl text-white tracking-widest uppercase glow-accent">{activeItem.name}</h4>
                                <div className="h-[1px] w-24 bg-accent/40 mx-auto" />
                                <p className="font-mono text-[0.85rem] text-[#8b9bb4] leading-relaxed max-w-xs">{activeItem.desc}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Cpu size={48} />
                            <div className="font-mono text-[0.6rem] tracking-[0.4em] uppercase text-center">INITIALIZE_SELECTION_SEQUENCE</div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
