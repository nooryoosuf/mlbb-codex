"use client";
import React, { useState } from "react";
import { Lock, Unlock } from "lucide-react";

export default function LoreDecryption({ text, accentColor }: { text: string, accentColor: string }) {
    const [isDecrypted, setIsDecrypted] = useState(false);

    return (
        <div
            className={`cursor-pointer transition-all duration-500 p-8 bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group ${!isDecrypted ? 'hover:bg-white/[0.04]' : ''
                }`}
            style={{ borderLeft: `2px solid ${accentColor}` }}
            onClick={() => !isDecrypted && setIsDecrypted(true)}
        >
            <div className="flex justify-between items-center mb-6 font-mono text-[0.7rem] uppercase tracking-[2px]">
                <span style={{ color: accentColor }}>// FILE_ORIGIN.ENC</span>
                <div className="flex items-center gap-2">
                    {isDecrypted ? <Unlock size={14} style={{ color: accentColor }} /> : <Lock size={14} className="text-[#666] group-hover:text-accent group-hover:animate-pulse" />}
                </div>
            </div>

            {isDecrypted ? (
                <p className="font-mono text-sm leading-relaxed text-[#aeb4b7]">{text}</p>
            ) : (
                <div className="relative">
                    <p className="font-mono text-sm leading-relaxed text-[#333] select-none break-all">
                        {text.substring(0, 150).replace(/[a-zA-Z]/g, "█")}...
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-mono text-xs text-accent font-bold mb-1">[RESTRICTED ACCESS]</span>
                        <span className="font-mono text-[0.6rem] text-[#666] uppercase tracking-[3px]">CLICK_TO_DECRYPT</span>
                    </div>
                </div>
            )}
        </div>
    );
}
