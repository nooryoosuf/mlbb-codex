
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Hexagon, Shield, Sword, Skull, Crosshair, Target } from "lucide-react";
import styles from "./HeroLoadout.module.css";
import { Hero } from "@/data/heroes";

interface Props {
    hero: Hero;
}

// Map strings to icons (fallback handling)
const iconMap: Record<string, any> = {
    "Assassin": Skull,
    "Mage": Hexagon,
    "Fighter": Sword,
    "Tank": Shield,
    "Marksman": Target,
    "Support": Zap,
    "Retribution": Zap,
    "Flicker": Zap, // wind icon not always avail
};

export default function HeroLoadout({ hero }: Props) {
    if (!hero.loadout) return null;

    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [activeNode, setActiveNode] = useState<string | null>("core");

    const EmblemIcon = iconMap[hero.loadout.emblem] || Hexagon;
    const SpellIcon = iconMap[hero.loadout.battleSpell] || Zap;

    // Typewriter effect state
    const [displayText, setDisplayText] = useState("");
    const targetText = hoveredNode || activeNode ? getDesc(hoveredNode || activeNode!, hero) : "";

    useEffect(() => {
        let index = 0;
        setDisplayText("");
        if (!targetText) return;

        const interval = setInterval(() => {
            setDisplayText((prev) => targetText.slice(0, index + 1));
            index++;
            if (index >= targetText.length) clearInterval(interval);
        }, 20); // Speed of typing

        return () => clearInterval(interval);
    }, [targetText]);

    return (
        <div className={styles.loadoutContainer}>
            <div className={styles.header}>
                <Hexagon size={24} /> TACTICAL LOADOUT // {hero.loadout.emblem.toUpperCase()}
            </div>

            <div className={styles.circuitBoard}>
                {/* Animated Connecting Lines */}
                <svg className={styles.connectionLine}>
                    <motion.path
                        d="M 20% 50 L 50% 150 L 80% 50"
                        fill="none"
                        stroke="#ff4655"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M 50% 150 L 50% 250"
                        fill="none"
                        stroke="#ff4655"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                    />
                </svg>

                {/* Tier 1 Node */}
                <div
                    className={`${styles.nodeSlot} ${styles.tier1} ${activeNode === "tier1" ? styles.nodeActive : ""}`}
                    onMouseEnter={() => setHoveredNode("tier1")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode("tier1")}
                >
                    <span className={styles.nodeLabel}>TIER 1</span>
                    <div className={styles.nodeCircle}>
                        <Zap size={20} />
                    </div>
                </div>

                {/* Tier 2 Node */}
                <div
                    className={`${styles.nodeSlot} ${styles.tier2} ${activeNode === "tier2" ? styles.nodeActive : ""}`}
                    onMouseEnter={() => setHoveredNode("tier2")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode("tier2")}
                >
                    <span className={styles.nodeLabel}>TIER 2</span>
                    <div className={styles.nodeCircle}>
                        <Crosshair size={20} />
                    </div>
                </div>

                {/* Core Talent Node */}
                <div
                    className={`${styles.nodeSlot} ${styles.core} ${activeNode === "core" ? styles.nodeActive : ""}`}
                    onMouseEnter={() => setHoveredNode("core")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode("core")}
                >
                    <span className={styles.nodeLabel}>CORE TALENT</span>
                    <div className={styles.nodeHex}>
                        <EmblemIcon size={32} />
                    </div>

                    {/* Scanning Animation */}
                    {(hoveredNode === "core" || activeNode === "core") && (
                        <motion.div
                            className={styles.scanLine}
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    )}
                </div>
            </div>

            {/* Battle Spell Slot */}
            <div
                className={styles.spellSlot}
                onMouseEnter={() => setHoveredNode("spell")}
                onMouseLeave={() => setHoveredNode(null)}
            >
                <span className={styles.readyText}>READY</span>
                <div className={styles.spellFrame}>
                    <SpellIcon size={28} color="#4ade80" />
                </div>
            </div>

            {/* Detail Readout */}
            <div className={styles.detailBox}>
                <span className={styles.detailTitle}>
                    {hoveredNode ? getNodeTitle(hoveredNode, hero) : getNodeTitle(activeNode!, hero)}
                </span>
                <p>{displayText}</p>
            </div>
        </div>
    );
}

function getDesc(node: string, hero: Hero) {
    switch (node) {
        case "tier1": return `Talent: ${hero.loadout.talents[0].toUpperCase()} // Enhances basic attributes suited for early game efficiency.`;
        case "tier2": return `Talent: ${hero.loadout.talents[1].toUpperCase()} // Provides specialized stats like penetration or sustain against objectives.`;
        case "core": return `Talent: ${hero.loadout.talents[2].toUpperCase()} // The primary combat modifier defining the hero's playstyle.`;
        case "spell": return `Spell: ${hero.loadout.battleSpell.toUpperCase()} // Critical tactical ability. Cooldown management required.`;
        default: return "SYSTEM READY...";
    }
}

function getNodeTitle(node: string, hero: Hero) {
    if (node === "spell") return "BATTLE SPELL";
    if (node === "core") return "CORE TALENT";
    return "SUB-TALENT MODULE";
}
