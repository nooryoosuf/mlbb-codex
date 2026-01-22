"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Hexagon, Menu } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "CODEX", icon: Home },
        { href: "/heroes", label: "HEROES", icon: Menu },
        { href: "/builders", label: "BUILDERS", icon: Hexagon },
    ];

    return (
        <motion.nav
            className="fixed bottom-8 right-8 z-[100] md:left-auto left-4 right-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="flex items-center gap-3 bg-[#0b0e14]/70 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-[0_0_20px_rgba(255,70,85,0.2)] md:w-auto w-full justify-center ring-1 ring-white/5">
                {/* Brand Marker - Triangle Logo */}
                <div className="w-10 h-10 flex items-center justify-center bg-accent text-black font-bold relative overflow-hidden clip-path-triangle [clip-path:polygon(50%_0%,0%_100%,100%_100%)] shadow-[0_0_15px_rgba(255,70,85,0.6)]">
                    <div className="absolute inset-0 bg-white/30 skew-y-12 scale-150 translate-y-2" />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 rotate-180">
                        <path d="M12 2L2 22H22L12 2Z" />
                    </svg>
                </div>

                <div className="flex items-center gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link href={link.href} key={link.href} className="relative group">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white/10 text-white' : 'text-[#8b9bb4] hover:text-white hover:bg-white/5'}`}>
                                    <Icon size={18} />
                                    <span className="font-mono text-sm font-bold tracking-wider md:block hidden">{link.label}</span>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 rounded-full border border-accent shadow-[0_0_20px_rgba(255,70,85,0.6)] pointer-events-none"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
}
