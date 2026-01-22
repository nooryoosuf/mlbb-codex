"use client";
import { motion } from "framer-motion";

interface TacticalRadarProps {
    stats: {
        durability: number;
        offense: number;
        effect: number;
        difficulty: number;
    };
    primaryColor: string;
}

export default function TacticalRadar({ stats, primaryColor }: TacticalRadarProps) {
    // Stats are typically 0-100 or 1-10. Let's assume 0-100 for normalization.
    // If input is small (like 1-10), multiply by 10.
    const normalize = (val: number) => val > 10 ? val : val * 10;

    const data = {
        durability: normalize(stats.durability),
        offense: normalize(stats.offense),
        effect: normalize(stats.effect),
        difficulty: normalize(stats.difficulty)
    };

    // Radar Chart Points calculation (Diamond Shape)
    // Center is 100,100. Radius is 90.
    // Top: Durability
    // Right: Offense
    // Bottom: Effect
    // Left: Difficulty

    const getPoint = (value: number, angle: number) => {
        const r = (value / 100) * 90;
        const x = 100 + r * Math.sin(angle * Math.PI / 180);
        const y = 100 - r * Math.cos(angle * Math.PI / 180);
        return `${x},${y}`;
    };

    const p1 = getPoint(data.durability, 0);   // Top
    const p2 = getPoint(data.offense, 90);     // Right
    const p3 = getPoint(data.effect, 180);    // Bottom
    const p4 = getPoint(data.difficulty, 270); // Left

    const polyPoints = `${p1} ${p2} ${p3} ${p4}`;

    return (
        <div className="relative w-full aspect-square max-w-[300px] mx-auto">
            {/* Background Grid */}
            <svg viewBox="0 0 200 200" className="w-full h-full transform rotate-0">
                {/* Concentric webs */}
                {[25, 50, 75, 100].map((level, i) => (
                    <polygon
                        key={i}
                        points={`100,${100 - (level / 100) * 90} ${100 + (level / 100) * 90},100 100,${100 + (level / 100) * 90} ${100 - (level / 100) * 90},100`}
                        fill="none"
                        stroke="#333"
                        strokeWidth="1"
                        className="opacity-50"
                    />
                ))}

                {/* Axes */}
                <line x1="100" y1="10" x2="100" y2="190" stroke="#333" strokeWidth="1" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="#333" strokeWidth="1" />

                {/* Data Polygon */}
                <motion.polygon
                    initial={{ points: "100,100 100,100 100,100 100,100" }}
                    animate={{ points: polyPoints }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    fill={`${primaryColor}33`} // 20% opacity hex
                    stroke={primaryColor}
                    strokeWidth="2"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
            </svg>

            {/* Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 font-mono text-[0.6rem] tracking-widest text-[#8b9bb4] uppercase bg-[#0b0e14] px-1 group-hover:text-accent transition-colors">DURABILITY</div>
            <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 font-mono text-[0.6rem] tracking-widest text-[#8b9bb4] uppercase rotate-90 origin-left group-hover:text-accent transition-colors">OFFENSE</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 font-mono text-[0.6rem] tracking-widest text-[#8b9bb4] uppercase bg-[#0b0e14] px-1 group-hover:text-accent transition-colors">EFFECT</div>
            <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 font-mono text-[0.6rem] tracking-widest text-[#8b9bb4] uppercase -rotate-90 origin-right group-hover:text-accent transition-colors">DIFFICULTY</div>
        </div>
    );
}
