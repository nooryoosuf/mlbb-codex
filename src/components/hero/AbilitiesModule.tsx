"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Crosshair, Sword, Activity } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    type: string;
    description: string;
    iconName?: 'Zap' | 'Shield' | 'Crosshair' | 'Sword' | 'Activity';
}

interface AbilitiesModuleProps {
    skills: Skill[];
    accentColor: string;
}

const IconMap: Record<string, any> = {
    Zap, Shield, Crosshair, Sword, Activity
};

export default function AbilitiesModule({ skills, accentColor }: AbilitiesModuleProps) {
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4 mb-4">
                <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase" style={{ color: accentColor }}>// TACTICAL_ABILITIES</div>
                <div className="h-[1px] bg-white/10 grow" />
            </header>

            <div className="flex gap-4">
                {skills.map((skill, idx) => {
                    const Icon = IconMap[skill.iconName || 'Zap'] || Zap;
                    return (
                        <div key={idx} className="relative group">
                            {/* Circular Icon */}
                            <motion.button
                                className="w-16 h-16 rounded-full border border-white/20 bg-[#0b0e14] flex items-center justify-center relative z-10 hover:border-accent hover:bg-accent/10 transition-all duration-300"
                                style={{ borderColor: hoveredSkill?.id === skill.id ? accentColor : '' }}
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon size={24} className="text-white group-hover:text-accent transition-colors" style={{ color: hoveredSkill?.id === skill.id ? accentColor : '#fff' }} />
                            </motion.button>

                            {/* Connection Line (visual only) */}
                            {idx < skills.length - 1 && (
                                <div className="absolute top-1/2 left-full w-4 h-[1px] bg-white/10 z-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Description Area - Fixed height to prevent layout shift */}
            <div className="relative min-h-[120px] bg-white/[0.03] border border-white/10 p-6 clip-valorant-card">
                <AnimatePresence mode="wait">
                    {hoveredSkill ? (
                        <motion.div
                            key={hoveredSkill.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-display text-xl uppercase tracking-wider text-white" style={{ textShadow: `0 0 10px ${accentColor}80` }}>{hoveredSkill.name}</h3>
                                <span className="font-mono text-[0.6rem] px-2 py-0.5 border border-white/20 uppercase text-[#8b9bb4]">{hoveredSkill.type}</span>
                            </div>
                            <p className="font-mono text-xs text-[#aaa] leading-relaxed">
                                {hoveredSkill.description}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full text-[#444]"
                        >
                            <Activity size={24} className="mb-2 opacity-50" />
                            <span className="font-mono text-[0.6rem] tracking-widest uppercase">HOVER_ABILITY_ICON_FOR_DATA</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
