"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Swords, Zap, Terminal as TerminalIcon, Cpu, Map, ShieldAlert, Crosshair, Activity } from "lucide-react";
import HeroVideoBackdrop from "@/components/hero/HeroVideoBackdrop";
import { heroes } from "@/data/heroes";
import { patchNotes, mapIntel, strategyTips } from "@/data/game-intel";
import MatchupSearch from "@/components/home/MatchupSearch";
import IdentityTerminal from "@/components/home/IdentityTerminal";
import MetaHeroSection from "@/components/home/MetaHeroSection";
import { fetchMetaHeroes, MetaHero } from "@/lib/meta-api";
import { useEffect, useState } from "react";

export default function Home() {
  const [metaHeroes, setMetaHeroes] = useState<MetaHero[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMetaHeroes();
      setMetaHeroes(data);
    };
    loadData();
  }, []);

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 flex flex-col items-center relative">
      <HeroVideoBackdrop />

      <div className="w-full max-w-[1440px] z-10 space-y-32">
        {/* Elite Command Header */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 gap-8">
          <div className="flex flex-col">
            <div className="font-mono text-[0.6rem] text-accent tracking-[0.4em] mb-4">// CENTRAL_COMMAND_ARCHIVE_v4.2</div>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-none uppercase group">
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">MLBB</span> <span className="text-accent glow-accent">CODEX</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-3 font-mono">
            <div className="flex items-center gap-3 bg-neon-green/5 border border-neon-green/20 px-4 py-2 rounded-none">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
              <span className="text-neon-green text-xs tracking-widest font-bold">SYSTEM_LOCKED_ONLINE</span>
            </div>
            <div className="text-[0.6rem] text-[#444] tracking-widest uppercase">UPTIME: 124:45:12</div>
          </div>
        </header>

        <MetaHeroSection data={metaHeroes} />

        {/* Tactical Hero Spotlight Grid */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <Crosshair className="text-accent" size={20} />
            <h2 className="font-display text-2xl tracking-[0.2em] uppercase">
              <span className="text-white">ROSTER</span>_<span className="text-accent">SPOTLIGHT</span> <span className="text-[#444]">//</span> <span className="text-white">PRIMARY</span>_<span className="text-accent">THREATS</span>
            </h2>
            <div className="h-[1px] bg-gradient-to-r from-accent to-transparent grow ml-4" />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {heroes.filter(h => h.isFeatured).slice(0, 5).map((hero) => (
              <Link href={`/hero/${hero.id}`} key={hero.id} className="group">
                <motion.div
                  className="aspect-[1/1] relative bg-[#0b0e14]/40 border border-white/10 transition-all duration-300 hover:border-accent hover:-translate-y-2 group overflow-hidden clip-valorant-card"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {/* Subtle Scanline Overlay on Card */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-[5] animate-scan opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Activity size={14} className="text-accent" />
                    <div className="h-[1px] bg-white/20 grow mx-4" />
                    <span className="font-mono text-[0.6rem] text-accent">ID_{hero.id.toUpperCase()}</span>
                  </div>

                  <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-8 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="font-mono text-[0.7rem] text-accent mb-2 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">// CLASS: {hero.class}</div>
                    <h3 className="font-display text-5xl md:text-6xl text-white leading-[0.85] uppercase mb-4">{hero.name}</h3>
                    <div className="flex items-center gap-4 border-t border-white/10 pt-4 opacity-100 group-hover:opacity-100 transition-opacity">
                      <span className="font-mono text-[0.6rem] text-[#8b9bb4] uppercase tracking-widest">LANE: {hero.lane}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

            <Link href="/heroes" className="group">
              <motion.div
                className="aspect-[1/1] relative border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-accent/10 hover:border-accent clip-valorant-card"
                variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
              >
                <div className="relative p-10 flex flex-col items-center text-center">
                  <ArrowRight size={48} className="text-[#333] mb-8 translate-x-0 group-hover:translate-x-3 group-hover:text-red-600 transition-all" />
                  <h3 className="font-display text-3xl text-white mb-4 tracking-widest uppercase group-hover:text-red-500 transition-colors">ACCESS_FULL_VAULT</h3>
                  <p className="font-mono text-[#444] text-[0.7rem] uppercase group-hover:text-accent/80 transition-colors">DECRYPT_125_TOTAL_SIGNATURES</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </section>



        {/* Identity Scanning Module */}
        <section className="glass-panel p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-[0.6rem] text-accent/30 vertical-text select-none">DATA_SHAME_v1.0</div>
          <div className="flex items-center gap-4 mb-12">
            <TerminalIcon className="text-accent" size={20} />
            <h2 className="font-display text-4xl text-white tracking-[0.1em] uppercase">
              <span className="text-white">WHO</span>_<span className="text-accent">IS</span>_<span className="text-white">YOUR</span>_<span className="text-accent">HERO</span>?
            </h2>
          </div>
          <IdentityTerminal />
        </section>

        {/* Matchup Matrix Module */}
        <section className="space-y-12">
          <div className="flex flex-col">
            <div className="font-mono text-[0.65rem] text-accent tracking-[0.5em] mb-4 uppercase">// TACTICAL_SYNERGY_AND_COUNTER_PROTOCOLS</div>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter group">
              <span className="text-white">GLOBAL</span>_<span className="text-accent decoration-dotted underline decoration-accent/50">MATCHUP</span>_<span className="text-white">MATRIX</span>
            </h2>
          </div>
          <MatchupSearch />
        </section>



        {/* Data Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Patch Logs */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <Cpu className="text-accent" size={18} />
              <h2 className="font-display text-2xl tracking-[0.2em] uppercase">
                <span className="text-white">SYSTEM</span>_<span className="text-accent">PATCH</span>_<span className="text-white">LOGS</span>
              </h2>
              <div className="h-[1px] bg-gradient-to-r from-accent to-transparent grow ml-4" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {patchNotes.slice(0, 4).map((note) => (
                <div key={note.id} className="bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                  <div className="flex flex-col">
                    <div className="font-display text-xl text-white uppercase tracking-wide group-hover:text-accent transition-colors">{note.heroName}</div>
                    <div className="font-mono text-[0.6rem] text-[#444] uppercase tracking-widest">{note.date} // {note.type}</div>
                  </div>
                  <div className={`text-[0.65rem] font-bold px-3 py-1 font-mono tracking-widest border ${note.type === 'BUFF' ? 'text-neon-green border-neon-green/20 bg-neon-green/5' :
                    note.type === 'NERF' ? 'text-accent border-accent/20 bg-accent/5' :
                      'text-blue-400 border-blue-400/20 bg-blue-400/5'
                    }`}>
                    {note.type}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Strategic Intel */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <ShieldAlert className="text-accent" size={18} />
              <h2 className="font-display text-2xl tracking-[0.2em] uppercase">
                <span className="text-white">TACTICAL</span>_<span className="text-accent">INTEL</span>
              </h2>
              <div className="h-[1px] bg-gradient-to-r from-accent to-transparent grow ml-4" />
            </div>
            <div className="bg-[#0f1923]/40 border border-white/5 overflow-hidden">
              {strategyTips.slice(0, 3).map((tip, idx) => (
                <div key={idx} className="border-b border-white/5 last:border-b-0 p-8 flex flex-col gap-3 group hover:bg-accent/5 transition-colors">
                  <div className="font-display text-lg text-white group-hover:text-accent transition-colors flex items-center gap-3">
                    <span className="font-mono text-[0.6rem] text-[#444]">0{idx + 1} //</span> {tip.title}
                  </div>
                  <p className="font-mono text-xs text-[#8b9bb4] leading-relaxed line-clamp-2">{tip.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Map Intelligence Map Strip */}
        <section className="space-y-12 pb-32">
          <div className="flex items-center gap-4">
            <Map className="text-accent" size={18} />
            <h2 className="font-display text-2xl tracking-[0.2em] uppercase">
              <span className="text-white">MAPPING</span>_<span className="text-accent">INFRASTRUCTURE</span>
            </h2>
            <div className="h-[1px] bg-gradient-to-r from-accent to-transparent grow ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mapIntel.map((item) => (
              <div key={item.id} className="relative p-1 bg-white/[0.02] border border-white/5 hover:border-accent group transition-all">
                <div className="p-8">
                  <div className="font-mono text-[0.6rem] text-[#444] mb-4 flex justify-between">
                    <span>COORD: {item.coordinates}</span>
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">DATA_CAPTURED</span>
                  </div>
                  <h3 className="font-display text-2xl text-white mb-4 uppercase tracking-wider">{item.name}</h3>
                  <p className="font-mono text-xs text-[#8b9bb4] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
