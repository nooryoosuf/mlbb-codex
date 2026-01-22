"use client";
import { motion } from "framer-motion";
import { Zap, Shield, Crosshair } from "lucide-react";

interface BuildsPanelProps {
    equipment: {
        name: string;
        icon: string;
        attribute: string;
    }[];
}

export default function BuildsPanel({ equipment }: BuildsPanelProps) {
    if (!equipment || equipment.length === 0) return null;

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase">// RECOMMENDED_LOADOUT</div>
                <div className="h-[1px] bg-white/10 grow" />
            </header>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {equipment.map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="group relative flex flex-col gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-4 group-hover:border-accent transition-colors relative overflow-hidden">
                            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors z-0" />
                            <img src={item.icon} alt={item.name} className="w-full h-full object-contain relative z-10 drop-shadow-lg" />

                            {/* Connect line */}
                            {idx < equipment.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-[1px] bg-white/10 z-0" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="font-display text-sm text-white uppercase tracking-wider">{item.name}</div>
                            <div className="font-mono text-[0.5rem] text-[#666] uppercase tracking-widest">{item.attribute}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 p-4 border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <Zap size={14} className="text-neon-gold" />
                <span className="font-mono text-[0.6rem] text-[#8b9bb4] uppercase tracking-widest">BUILD_EFFICIENCY_RATING: 94.2% // META_SYNCHRONIZED</span>
            </div>
        </div>
    );
}
