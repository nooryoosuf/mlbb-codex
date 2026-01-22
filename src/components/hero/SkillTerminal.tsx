"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Crosshair, Sword, Activity, Cpu } from 'lucide-react';

export interface Skill {
    id: string;
    name: string;
    type: string;
    description: string;
    iconName?: 'Zap' | 'Shield' | 'Crosshair' | 'Sword' | 'Activity';
}

interface SkillTerminalProps {
    skills: Skill[];
}

const Typewriter = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length - 1) {
                setDisplayedText((prev) => prev + text[i]);
                i++;
            } else {
                setDisplayedText(text);
                clearInterval(timer);
            }
        }, 8);

        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
}

const IconMap: Record<string, any> = {
    Zap, Shield, Crosshair, Sword, Activity
};

export default function SkillTerminal({ skills }: SkillTerminalProps) {
    const [activeSkill, setActiveSkill] = useState<Skill>(skills[0]);

    if (!skills || skills.length === 0) return null;

    return (
        <div className="glass-panel overflow-hidden border border-white/10 group">
            {/* Terminal Header Decoration */}
            <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Cpu size={14} className="text-accent animate-pulse" />
                    <span className="font-mono text-[0.6rem] text-accent tracking-[0.3em] uppercase">NEURAL_SKILL_ENCODING_v4</span>
                </div>
                <div className="font-mono text-[0.5rem] text-[#333]">RELAY: STABLE</div>
            </div>

            <div className="flex border-b border-white/10">
                {skills.map((skill) => {
                    const Icon = IconMap[skill.iconName || 'Zap'] || Zap;
                    const isActive = activeSkill.id === skill.id;
                    return (
                        <button
                            key={skill.id}
                            className={`flex-1 p-8 flex flex-col items-center justify-center transition-all border-r border-white/10 last:border-r-0 relative group ${isActive ? 'bg-accent/15' : 'hover:bg-white/5'}`}
                            onClick={() => setActiveSkill(skill)}
                        >
                            <Icon size={24} className={`${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.6)]' : 'text-[#444] group-hover:text-accent/50'} transition-all duration-300`} />
                            {isActive && (
                                <motion.div
                                    layoutId="skill-active-indicator"
                                    className="absolute bottom-0 left-0 w-full h-[3px] bg-accent shadow-[0_0_15px_rgba(255,70,85,0.8)]"
                                />
                            )}
                            <div className="absolute top-2 right-2 font-mono text-[0.5rem] text-[#222] group-hover:text-accent/20 transition-colors">ID:{skill.id.toUpperCase()}</div>
                        </button>
                    );
                })}
            </div>

            <div className="p-10 space-y-8 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-[0.03] pointer-events-none" />

                <div className="relative flex justify-between items-end gap-8 border-b border-white/5 pb-6">
                    <div className="flex flex-col gap-2">
                        <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase">SYSTEM_ABILITY_MAPPING</div>
                        <motion.h3
                            key={activeSkill.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-display text-4xl text-white uppercase tracking-wider glow-accent"
                        >
                            {activeSkill.name}
                        </motion.h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="font-mono text-[0.5rem] text-[#333] uppercase mb-1">ABILITY_CLASS</span>
                        <span className="font-mono text-xs text-accent tracking-[2px] uppercase bg-accent/5 border border-accent/20 px-3 py-1">{activeSkill.type}</span>
                    </div>
                </div>

                <div className="relative font-mono text-[0.85rem] text-[#8b9bb4] leading-relaxed min-h-[140px] bg-black/20 p-6 border-l-2 border-accent/30">
                    <Typewriter key={activeSkill.id} text={activeSkill.description} />
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="text-accent ml-1 font-bold"
                    >
                        _
                    </motion.span>
                </div>

                <div className="flex justify-between items-center font-mono text-[0.5rem] text-[#222] tracking-[3px] uppercase">
                    <span>STAGED_EXECUTION</span>
                    <span>v4.0.01_STABLE</span>
                </div>
            </div>
        </div>
    );
}
