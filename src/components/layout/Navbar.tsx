"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Hexagon, Menu, Terminal, Zap } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "HOME", icon: Home },
        { href: "/heroes", label: "HEROES", icon: Menu },
        { href: "/builders", label: "BUILDERS", icon: Hexagon },
        { href: "/knowledge", label: "INTEL", icon: Terminal },
    ];

    return (
        <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <nav className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl shadow-black/50 ring-1 ring-white/5 transition-all hover:bg-black/50 hover:border-white/10">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link href={link.href} key={link.href} className="relative group">
                            <div className={`
                                flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300
                                ${isActive
                                    ? 'text-white bg-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}>
                                <Icon size={20} strokeWidth={1.5} />
                                <span className={`font-mono text-xs font-bold tracking-widest transition-all duration-300 ${isActive ? 'max-w-20 opacity-100' : 'max-w-0 opacity-0 overflow-hidden group-hover:max-w-20 group-hover:opacity-100'} whitespace-nowrap`}>
                                    {link.label}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent blur-[1px]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
}
