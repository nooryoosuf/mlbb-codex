"use client";
import React from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, Wind } from "lucide-react";

interface Props {
    mobility: number;
    armor: number;
    resource: "Mana" | "Energy" | "None";
    resourceValue: number;
    accentColor: string;
}

export default function StatusColumn({ mobility, armor, resource, resourceValue, accentColor }: Props) {
    return (
        <div className="glass-panel p-8 space-y-10 relative group">
            {/* Header Accent */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Activity size={14} className="text-accent" />
                <span className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase">VITAL_STATUS_TELEMETRY</span>
            </div>

            <div className="space-y-8">
                {/* Mobility Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="flex items-center gap-3">
                            <Wind size={14} className="text-[#444] group-hover:text-accent transition-colors" />
                            <span className="font-display text-sm text-white tracking-widest">MOBILITY_INDEX</span>
                        </div>
                        <span className="font-mono text-xs text-accent font-bold">{mobility}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 w-full relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${mobility}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}40` }}
                        />
                        {/* Segmented Grid Overlay */}
                        <div className="absolute inset-0 flex justify-between px-0 pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-black/40" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Armor Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="flex items-center gap-3">
                            <Shield size={14} className="text-[#444] group-hover:text-accent transition-colors" />
                            <span className="font-display text-sm text-white tracking-widest">ARMOR_PROTOCOL</span>
                        </div>
                        <span className="font-mono text-xs text-accent font-bold">{armor}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 w-full relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${armor}%` }}
                            transition={{ duration: 1.5, ease: "circOut", delay: 0.1 }}
                            style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}40` }}
                        />
                        <div className="absolute inset-0 flex justify-between px-0 pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-black/40" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resource Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="flex items-center gap-3">
                            <Zap size={14} className="text-[#444] group-hover:text-accent transition-colors" />
                            <span className="font-display text-sm text-white tracking-widest uppercase">{resource}_CAPACITY</span>
                        </div>
                        <span className="font-mono text-xs text-accent font-bold">{resourceValue}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 w-full relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${resourceValue}%` }}
                            transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                            style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}40` }}
                        />
                        <div className="absolute inset-0 flex justify-between px-0 pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-black/40" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5 font-mono text-[0.5rem] text-[#222] tracking-widest uppercase">
                <span>SYSTEM_V_LOCK</span>
                <span>TELEMETRY_v8.4</span>
            </div>
        </div>
    );
}
