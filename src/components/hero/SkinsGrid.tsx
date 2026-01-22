"use client";
import { motion } from "framer-motion";

interface SkinsGridProps {
    skins: string[];
    heroName: string;
}

export default function SkinsGrid({ skins, heroName }: SkinsGridProps) {
    if (!skins || skins.length === 0) return null;

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase">// VISUAL_VARIANTS</div>
                <div className="h-[1px] bg-white/10 grow" />
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skins.map((skin, idx) => (
                    <motion.div
                        key={idx}
                        className="group relative aspect-[3/4] overflow-hidden border border-white/10 hover:border-accent transition-colors bg-black/40 cursor-pointer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Fallback pattern if image fails (or strictly for decoration) */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                        {/* We assume skins are just URLs passed in `skins` array for now */}
                        <img
                            src={skin}
                            alt={`${heroName} Skin ${idx + 1}`}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-0 left-0 w-full p-4">
                            <div className="font-mono text-[0.6rem] text-white/60 tracking-widest uppercase mb-1">SKIN_0{idx + 1}</div>
                            <div className="h-[2px] w-0 group-hover:w-full bg-accent transition-all duration-300" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
