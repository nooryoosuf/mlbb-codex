"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Terminal as TerminalIcon, ShieldAlert, Scan, Cpu, Activity } from "lucide-react";

interface RoastResult {
    name: string;
    hero: string;
    roast: string;
    image: string;
}

const ROAST_DATA = [
    {
        hero: "NANA",
        image: "/heroes/Nana.png",
        roast: "You are Nana. You look innocent, but everyone secretly wishes you'd stop throwing that cat and stay in the base where it's safe. You're the reason people have trust issues."
    },
    {
        hero: "FANNY",
        image: "/heroes/Fanny.png",
        roast: "You are Fanny. You spend more time hit-and-running into walls than actually hitting enemies. Your energy bar is as empty as your teammates' hopes when there is a teamfight."
    },
    {
        hero: "GUSION",
        image: "/heroes/Gusion.png",
        roast: "You are Gusion. You have 10 daggers and 0 map awareness. You'll spend 5 minutes doing a complex combo just to kill a minion and then die to a tower."
    },
    {
        hero: "FRANCO",
        image: "/heroes/Franco.png",
        roast: "You are Franco. You miss 99% of your hooks and 100% of the hooks that actually matter. But hey, at least you can dance in the bush while your team loses."
    },
    {
        hero: "LAYLA",
        image: "/heroes/Layla.png",
        roast: "You are Layla. The 'tutorial' hero. You've been playing for 3 years but still think walking into a bush with 5 enemies is a 'strategic flank.' Classic."
    },
    {
        hero: "CHOU",
        image: "/heroes/Chou.png",
        roast: "You are Chou. You think every wall is an opportunity for a useless freestyle. Your KDA is 0/10 but you still spam recall like you're winning a world championship."
    },
    {
        hero: "SABER",
        image: "/heroes/Saber.png",
        roast: "You are Saber. A one-trick pony with a 'Delete' button. You wait in a bush for 2 minutes just to kill a marksman and then get instantly deleted by their tank."
    },
    {
        hero: "TIGREAL",
        image: "/heroes/Tigreal.png",
        roast: "You are Tigreal. You push enemies AWAY from your team's AOE skills just to prove you're 'helping'. Thanks for saving the enemy carry, agent."
    },
    {
        hero: "ALUCARD",
        image: "/heroes/Alucard.png",
        roast: "You are Alucard. You jump into 1v5 situations screaming 'nothing lasts forever'—and indeed, your lifespan in teamfights is about 0.5 seconds."
    },
    {
        hero: "MIYA",
        image: "/heroes/Miya.png",
        roast: "You are Miya. You farm for 15 minutes, ignore every teamfight, and then ult to run away the moment an enemy looks at you. True 'carry' potential."
    },
    {
        hero: "ALDOUS",
        image: "/heroes/Aldous.png",
        roast: "You are Aldous. 'Wait for late game' is your motto, but the game ends in 10 minutes while you're still punching minions. One punch man? More like zero impact man."
    },
    {
        hero: "JOHNSON",
        image: "/heroes/Johnson.png",
        roast: "You are Johnson. You treat the map like a racing game. You crash into walls, minions, and towers, but never into the enemy team when it actually counts."
    },
    {
        hero: "LESLEY",
        image: "/heroes/Lesley.png",
        roast: "You are Lesley. You pick this hero regardless of team composition. You think you're a sniper, but you're really just a free meal for the enemy assassin."
    },
    {
        hero: "ESTES",
        image: "/heroes/Estes.png",
        roast: "You are Estes. You think healing makes you a god, but you just prolong your team's suffering before the inevitable wipe. Also, nice KS with that S1."
    },
    {
        hero: "HANABI",
        image: "/heroes/Hanabi.png",
        roast: "You are Hanabi. You stand still and auto-attack, hoping your shield saves you. Spoiler alert: It doesn't. You catch every CC skill like you're playing Pokemon."
    },
    {
        hero: "LANCELOT",
        image: "/heroes/Lancelot.png",
        roast: "You are Lancelot. infinite dashes, zero kills. You dash through 50 minions just to look cool and then realize you have no skills left to actually fight."
    },
    {
        hero: "LING",
        image: "/heroes/Ling.png",
        roast: "You are Ling. You jump from wall to wall looking majestic until you run out of energy and fall down like a bird with broken wings. Easy target."
    },
    {
        hero: "ANGELA",
        image: "/heroes/Angela.png",
        roast: "You are Angela. You only ult your duo partner even if they are feeding. The rest of the team could be dying, but as long as your boyfriend is alive, it's fine."
    },
    {
        hero: "VALIR",
        image: "/heroes/Valir.png",
        roast: "You are Valir. You just spam fireballs and hope something hits. You push enemies to safety more often than you stun them."
    },
    {
        hero: "EUDORA",
        image: "/heroes/Eudora.png",
        roast: "You are Eudora. You exist solely in bushes. Your gameplay is literally: wait, click, delete, run. High skill floor? I think not."
    }
];

export default function IdentityTerminal() {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState<"idle" | "scanning" | "revealed">("idle");
    const [result, setResult] = useState<RoastResult | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [scrollingLines, setScrollingLines] = useState<string[]>([]);

    const getHeroFromName = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % ROAST_DATA.length;
        return ROAST_DATA[index];
    };

    const handleReveal = () => {
        if (!inputValue.trim()) return;

        setStatus("scanning");
        setScanProgress(0);

        const heroData = getHeroFromName(inputValue.trim());
        setResult({
            name: inputValue.trim(),
            ...heroData
        });

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => setStatus("revealed"), 500);
            }
            setScanProgress(progress);

            const mockLines = [
                `DECRYPTING_SECURE_LAYER_${Math.random().toString(16).substring(2, 8)}`,
                `BYPASSING_NEURAL_FIREWALL...`,
                `ANALYZING_BEHAVIORAL_PATTERNS: ${progress.toFixed(0)}%`,
                `WARNING: HIGH_TOXICITY_LEVELS_DETECTED`,
                `IDENTIFYING_OPERATOR_SIGNATURE...`,
                `MATCH_FOUND: [REDACTED]`,
                `EXTRACTING_IDENTITY_DB_V2.1`
            ];
            setScrollingLines(prev => [...prev.slice(-5), mockLines[Math.floor(Math.random() * mockLines.length)]]);
        }, 100);
    };

    const handleShare = () => {
        if (!result) return;
        const shareText = `[HERO_IDENTITY_REVEALED]\nOperator: ${result.name}\nIdentity: ${result.hero}\n\n"${result.roast}"\n\nFind your identity at HERO_CODEX`;
        navigator.clipboard.writeText(shareText);
    };

    const resetTerminal = () => {
        setStatus("idle");
        setInputValue("");
        setResult(null);
    };

    return (
        <div className="w-full relative">
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden group">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
                <div className="absolute top-0 left-0 w-32 h-[3px] bg-accent" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/50" />

                <div className="flex justify-between items-center mb-12 relative z-10">
                    <div className="flex items-center gap-4">
                        <TerminalIcon size={20} className="text-accent" />
                        <div className="flex flex-col">
                            <span className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase">IDENTITY_PROFILER_v9.0</span>
                            <span className="font-display text-xl text-white tracking-widest uppercase">NAME_SHAME_TERMINAL</span>
                        </div>
                    </div>

                    {/* Data Status Lines */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-[1px] bg-white/20" />
                            <span className="font-mono text-[0.5rem] text-[#666] tracking-widest uppercase">SYS_READY</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-[1px] bg-accent/50" />
                            <span className="font-mono text-[0.5rem] text-accent tracking-widest uppercase">ENCRYPTION_OFF</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 p-6 text-white font-mono text-2xl outline-none transition-all focus:border-accent focus:bg-white/10 placeholder:text-[#222]"
                                    placeholder="OPERATOR_NAME_IDENTIFICATION..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleReveal()}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                    <span className="font-mono text-[0.6rem] text-[#333] hidden md:block">INITIATE_SEQUENCE</span>
                                    <button
                                        onClick={handleReveal}
                                        className="w-12 h-12 bg-accent/10 border border-accent/40 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
                                    >
                                        <Scan size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-4 font-mono text-[0.6rem] text-[#333] tracking-widest uppercase border-t border-white/5 pt-4 mt-8">
                                <span className="flex items-center gap-2">
                                    <ShieldAlert size={10} /> WARN: POTENTIAL_EG_BRUISING
                                </span>
                                <span className="flex items-center gap-2">
                                    ENCRYPTION: RSA-4096 <div className="w-2 h-2 bg-accent/50 rounded-full animate-pulse" />
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {status === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 space-y-12"
                        >
                            <div className="relative">
                                <ShieldAlert size={64} className="text-accent animate-pulse" />
                                <motion.div
                                    className="absolute inset-0 border-2 border-accent rounded-full"
                                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </div>

                            <div className="w-full max-w-md space-y-4">
                                <div className="flex justify-between font-mono text-[0.6rem] text-accent tracking-[0.2em]">
                                    <span>SCANNING_NEURAL_PATTERNS</span>
                                    <span>{Math.floor(scanProgress)}%</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-accent/30 animate-pulse" />
                                </div>
                            </div>

                            <div className="font-mono text-[0.6rem] text-[#444] h-[60px] overflow-hidden text-center space-y-2 uppercase tracking-widest">
                                {scrollingLines.map((line, i) => (
                                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{line}</motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {status === "revealed" && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12">
                                <div className="relative aspect-square border-2 border-accent group overflow-hidden">
                                    <div className="absolute inset-0 bg-accent/10 animate-pulse z-[2] mix-blend-overlay" />
                                    <img src={result.image} alt={result.hero} className="w-full h-full object-cover brightness-110 contrast-125" />
                                    <div className="absolute top-2 left-2 bg-accent text-white font-mono text-[0.6rem] px-2 py-0.5 z-[10] tracking-widest">THREAT_IDENTIFIED</div>
                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent/60 animate-scan z-[10]" />
                                </div>

                                <div className="flex flex-col justify-center space-y-6">
                                    <div className="space-y-2">
                                        <div className="font-mono text-[0.7rem] text-accent tracking-[0.5em] uppercase">// OPERATOR: {result.name}</div>
                                        <h2 className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-tighter">{result.hero}</h2>
                                    </div>

                                    <div className="relative p-8 bg-white/5 border-l-4 border-accent space-y-4 italic">
                                        <div className="absolute top-2 right-4 font-mono text-[0.5rem] text-[#222]">DECRYPTION_LOG</div>
                                        <p className="font-mono text-base md:text-lg text-[#8b9bb4] leading-relaxed">
                                            "{result.roast}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            className="bg-accent text-white font-mono py-4 px-10 text-xs font-bold tracking-[3px] transition-all hover:bg-white hover:text-accent hover:-translate-y-1 flex items-center justify-center gap-3 [clip-path:polygon(0_0,100%_0,100%_70%,85%_100%,0_100%)] shadow-[0_10px_30px_rgba(255,70,85,0.2)]"
                                            onClick={handleShare}
                                        >
                                            <Share2 size={16} /> SHARE_YOUR_SHAME
                                        </button>
                                        <button
                                            className="border border-white/10 text-[#444] hover:text-white hover:border-white/30 font-mono py-4 px-10 text-xs font-bold tracking-[3px] transition-all uppercase flex items-center justify-center gap-3"
                                            onClick={resetTerminal}
                                        >
                                            <Cpu size={16} /> REBOOT_SYSTEM
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terminal Background Matrix Decor */}
            <div className="absolute -z-10 -bottom-20 -right-20 opacity-5 pointer-events-none">
                <div className="font-mono text-[6rem] leading-none text-white select-none vertical-text">
                    TERMINAL_v9.0_SHAME_DECRYPTION_ACTIVE
                </div>
            </div>
        </div>
    );
}
