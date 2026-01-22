"use client";
import React from "react";
import { motion } from "framer-motion";

interface StatRadarProps {
    stats: {
        offense: number;
        difficulty: number;
        durability: number;
        control: number;
    };
}

export default function StatRadar({ stats }: StatRadarProps) {
    const MAX_RADIUS = 100;

    const getPoint = (value: number, axis: 'top' | 'right' | 'bottom' | 'left') => {
        const r = (value / 100) * MAX_RADIUS;
        switch (axis) {
            case 'top': return `0,${-r}`;
            case 'right': return `${r},0`;
            case 'bottom': return `0,${r}`;
            case 'left': return `${-r},0`;
        }
    };

    const points = `
    ${getPoint(stats.offense, 'top')} 
    ${getPoint(stats.difficulty, 'right')} 
    ${getPoint(stats.durability, 'bottom')} 
    ${getPoint(stats.control, 'left')}
  `;

    const guidePoints = `0,-100 100,0 0,100 -100,0`;

    return (
        <div className="relative aspect-square flex flex-col items-center justify-center p-12 bg-black/[0.1] border border-white/5 overflow-hidden group">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="relative w-full h-full flex items-center justify-center pt-8">
                <svg viewBox="-150 -150 300 300" className="w-full h-full transition-all duration-700">
                    <defs>
                        <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ff4655" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ff4655" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Outer Boundary */}
                    <polygon points={guidePoints} fill="none" className="stroke-white/10" strokeWidth="1" />

                    {/* Concentric Circles */}
                    {[20, 40, 60, 80, 100].map((r) => (
                        <circle key={r} r={r} fill="none" className="stroke-white/[0.03]" strokeWidth="1" />
                    ))}

                    {/* Axes Lines */}
                    <line x1="0" y1="-100" x2="0" y2="100" className="stroke-white/10" strokeWidth="1" />
                    <line x1="-100" y1="0" x2="100" y2="0" className="stroke-white/10" strokeWidth="1" />

                    {/* Label Groupings */}
                    <g className="font-display text-[10px] tracking-[4px] font-bold uppercase select-none">
                        <text x="0" y="-125" className="fill-white group-hover:fill-accent transition-colors" textAnchor="middle">OFFENSE</text>
                        <text x="135" y="4" className="fill-white group-hover:fill-accent transition-colors" textAnchor="middle">DIFFICULTY</text>
                        <text x="0" y="135" className="fill-white group-hover:fill-accent transition-colors" textAnchor="middle">DURABILITY</text>
                        <text x="-135" y="4" className="fill-white group-hover:fill-accent transition-colors" textAnchor="middle">CONTROL</text>
                    </g>

                    {/* Secondary Data Points Labels */}
                    <g className="font-mono text-[7px] fill-[#444] tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                        <text x="10" y="-105" textAnchor="start">{stats.offense}%</text>
                        <text x="105" y="15" textAnchor="start">{stats.difficulty}%</text>
                        <text x="10" y="115" textAnchor="start">{stats.durability}%</text>
                        <text x="-105" y="15" textAnchor="end">{stats.control}%</text>
                    </g>

                    {/* The Data Shape */}
                    <motion.polygon
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.7, scale: 1 }}
                        transition={{ duration: 1, ease: "circOut" }}
                        points={points}
                        className="fill-accent/30 stroke-accent"
                        strokeWidth="3"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(255,70,85,0.4))' }}
                    />

                    {/* Vertex Dots */}
                    {[
                        { val: stats.offense, axis: 'top', cx: 0, cy: -(stats.offense / 100) * 100 },
                        { val: stats.difficulty, axis: 'right', cx: (stats.difficulty / 100) * 100, cy: 0 },
                        { val: stats.durability, axis: 'bottom', cx: 0, cy: (stats.durability / 100) * 100 },
                        { val: stats.control, axis: 'left', cx: -(stats.control / 100) * 100, cy: 0 }
                    ].map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={p.cx}
                            cy={p.cy}
                            r="4"
                            className="fill-white stroke-accent"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                        />
                    ))}

                    {/* Radar Sweep Animation */}
                    <motion.line
                        x1="0" y1="0" x2="150" y2="0"
                        className="stroke-accent/40"
                        strokeWidth="1"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: '0 0' }}
                    />
                </svg>
            </div>

            {/* Status Footer */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(255,70,85,1)]" />
                <span className="font-mono text-[0.5rem] text-[#333] tracking-[0.4em]">CAPABILITY_ANALYSIS_STABLE</span>
            </div>
        </div>
    );
}
