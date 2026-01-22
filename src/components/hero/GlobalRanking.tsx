"use client";
import { motion } from "framer-motion";

interface GlobalRankingProps {
    heroId: string;
    primaryColor: string;
}

const MOCK_PLAYERS = [
    { rank: 1, name: "ShadowSlayer99", avatar: "/avatars/1.png", winrate: "88.5%", matches: 1240, score: 9850 },
    { rank: 2, name: "MysticGloryX", avatar: "/avatars/2.png", winrate: "82.1%", matches: 980, score: 9620 },
    { rank: 3, name: "Nocturnal_K", avatar: "/avatars/3.png", winrate: "79.8%", matches: 1532, score: 9410 },
    { rank: 12, name: "ViperStrike", avatar: "/avatars/4.png", winrate: "76.4%", matches: 850, score: 8900 },
    { rank: 45, name: "LunarEclipse", avatar: "/avatars/5.png", winrate: "72.0%", matches: 620, score: 8150 },
];

export default function GlobalRanking({ heroId, primaryColor }: GlobalRankingProps) {
    return (
        <div className="space-y-8 w-full">
            <header className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase" style={{ color: primaryColor }}>// GLOBAL_TOP_OPERATORS</div>
                <div className="h-[1px] bg-white/10 grow" />
            </header>

            <div className="space-y-2">
                {MOCK_PLAYERS.map((player, idx) => (
                    <motion.div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-[#0b0e14] border border-white/5 hover:border-white/20 transition-colors group cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <div className="flex items-center gap-6">
                            <div className="font-display text-2xl text-white/20 w-8 text-center group-hover:text-white transition-colors">#{player.rank}</div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10 group-hover:border-accent transition-colors">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} alt={player.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-display text-lg text-white tracking-wide">{player.name}</div>
                                    <div className="font-mono text-[0.5rem] text-[#666] tracking-widest uppercase">SERVER_ID: {Math.floor(Math.random() * 9000) + 1000}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-right font-mono text-xs">
                            <div>
                                <div className="text-[#666] text-[0.5rem] uppercase mb-1">WIN_RATE</div>
                                <div className="text-accent">{player.winrate}</div>
                            </div>
                            <div>
                                <div className="text-[#666] text-[0.5rem] uppercase mb-1">MATCHES</div>
                                <div className="text-white">{player.matches}</div>
                            </div>
                            <div className="hidden md:block">
                                <div className="text-[#666] text-[0.5rem] uppercase mb-1">MMR_SCORE</div>
                                <div className="text-neon-gold">{player.score}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button className="px-8 py-3 bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest flex items-center gap-2">
                    VIEW_FULL_LEADERBOARD <span>→</span>
                </button>
            </div>
        </div>
    );
}
