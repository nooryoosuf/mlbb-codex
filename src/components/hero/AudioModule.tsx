"use client";
import React, { useState } from "react";
import { Mic, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    voiceLine: string;
    accentColor: string;
}

export default function AudioModule({ voiceLine, accentColor }: Props) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 3000);
    };

    return (
        <div className="flex items-center gap-4 mt-2.5">
            <button
                onClick={handlePlay}
                className="bg-white/5 border border-white/20 p-2 px-4 rounded-none flex items-center gap-2.5 transition-all duration-300 font-mono text-white hover:bg-white/10"
                style={{ borderColor: isPlaying ? accentColor : undefined, color: isPlaying ? accentColor : undefined }}
            >
                {isPlaying ? <Activity size={18} className="animate-pulse" /> : <Mic size={18} />}
                COMMS_LINK
            </button>

            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-2 pl-2.5"
                    style={{ borderLeftColor: accentColor }}
                >
                    <span className="font-mono text-[0.9rem]" style={{ color: accentColor }}>
                        "{voiceLine}"
                    </span>
                </motion.div>
            )}
        </div>
    );
}
