"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

interface HeroGalleryProps {
    images: string[];
}

export default function HeroGallery({ images }: HeroGalleryProps) {
    const [currentIdx, setCurrentIdx] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 bg-black/40 border border-white/10 p-6 [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
            <div className="flex justify-between items-center font-mono text-[0.6rem] text-[#8b9bb4] tracking-[2px] uppercase mb-2">
                <span className="flex items-center gap-2"><ImageIcon size={14} className="text-accent" /> EVIDENCE_BOARD</span>
                <span className="opacity-50">IMG_{currentIdx + 1}/{images.length}</span>
            </div>

            <div className="relative aspect-video bg-black overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[0.65rem] text-accent font-bold">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> REC
                </div>

                {/* Visual Artifacts */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,0,0.06))] pointer-events-none z-[5]" />
                <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none z-[5]" />

                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIdx}
                        src={images[currentIdx]}
                        className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                </AnimatePresence>

                {/* Scanline Animation */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-accent/20 animate-scan z-10" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        className={`w-16 h-10 object-cover cursor-pointer transition-all border-2 ${idx === currentIdx ? 'border-accent opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        onClick={() => setCurrentIdx(idx)}
                        alt={`Evidence ${idx}`}
                    />
                ))}
            </div>
        </div>
    );
}
