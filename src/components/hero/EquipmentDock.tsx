"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Anchor, Shield, Footprints, Zap, Sparkles, Box, LayoutGrid } from "lucide-react";
import { Hero } from "@/data/heroes";

const iconMap: any = {
    "boots": Footprints,
    "axe": Anchor,
    "armor": Shield,
    "gun": Zap,
    "sword": Sword,
    "scythe": Sword,
    "blade": Sword,
    "wand": Sparkles,
    "glaive": Sword,
    "crystal": Sparkles,
    "winter": Shield,
    "blood": Sparkles,
    "shield": Shield
};

interface Props {
    equipment: Hero['equipment'];
}

export default function EquipmentDock({ equipment }: Props) {
    if (!equipment) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
                <LayoutGrid size={14} className="text-[#333]" />
                <span className="font-mono text-[0.6rem] text-[#333] tracking-[0.4em] uppercase">OPTIMAL_LOADOUT_ARRAY</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-8 glass-panel relative group">
                {/* HUD Decor */}
                <div className="absolute top-2 right-4 font-mono text-[0.5rem] text-[#222]">ARRAY_v4.1</div>

                {equipment.map((item, idx) => {
                    const Icon = iconMap[item.icon] || Sword;
                    return (
                        <motion.div
                            key={idx}
                            className="relative group aspect-square bg-white/[0.03] border border-white/10 flex items-center justify-center cursor-help transition-all hover:bg-accent/20 hover:border-accent shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]"
                            whileHover={{ scale: 1.05, y: -4 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Icon size={24} className="text-[#444] group-hover:text-white transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />

                            {/* Hover Active Indicator */}
                            <div className="absolute top-1 right-1 w-1 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Tactical Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none">
                                <div className="bg-[#0b0e14] border border-white/20 p-5 w-56 shadow-[0_20px_50px_rgba(0,0,0,0.8)] [clip-path:polygon(0_0,100%_0,100%_80%,80%_100%,0_100%)]">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                            <Box size={14} className="text-accent" />
                                            <span className="font-display text-base text-white uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-mono text-[0.5rem] text-accent tracking-widest uppercase">ENHANCEMENT_SIGNATURE:</span>
                                            <span className="font-mono text-[0.7rem] text-[#8b9bb4] italic leading-tight">{item.attribute}</span>
                                        </div>
                                    </div>
                                    {/* Tooltip HUD scan bar */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/40 animate-scan" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
