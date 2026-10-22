"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X, Heart, Sun, Moon, ArrowUpRight } from "lucide-react";
import CommandPalette from "@/components/search/CommandPalette";
import BrandLogo from "@/components/layout/BrandLogo";
import { useTheme } from "@/lib/use-theme";
import { useFavourites } from "@/lib/use-favourites";
import { useScrolled } from "@/lib/store";

const NAV = [
    { href: "/meta", label: "Meta", code: "01" },
    { href: "/heroes", label: "Heroes", code: "02" },
    { href: "/items", label: "Items", code: "03" },
    { href: "/emblems", label: "Emblems", code: "04" },
    { href: "/patches", label: "Patches", code: "05" },
    { href: "/tools", label: "Tools", code: "06" },
    { href: "/lore", label: "Lore", code: "07" },
];

export default function SiteHeader() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const scrolled = useScrolled();
    const { theme, toggle } = useTheme();
    const { favourites } = useFavourites();

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setPaletteOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-colors duration-300 ${
                    scrolled || open
                        ? "border-b border-line bg-bg/90 backdrop-blur-xl"
                        : "border-b border-transparent bg-transparent"
                }`}
            >
                <div className="mx-auto flex h-14 max-w-shell items-center gap-2 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-2.5" aria-label="MLBB Codex home">
                        <BrandLogo
                            className="h-7 transition-transform duration-300 group-hover:-translate-y-0.5"
                            label="MLBB Codex"
                        />
                        <span className="display hidden text-lg leading-none tracking-wide sm:block">
                            MLBB<span className="text-accent">/</span>CODEX
                        </span>
                    </Link>

                    <nav className="ml-6 hidden h-full items-center lg:flex" aria-label="Primary">
                        {NAV.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`group relative flex h-full items-center px-3.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                                        active ? "text-fg" : "text-muted hover:text-fg"
                                    }`}
                                >
                                    <span className="mr-1.5 text-[8px] text-accent">{item.code}</span>
                                    {item.label}
                                    <span
                                        className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
                                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPaletteOpen(true)}
                            className="flex h-8 items-center gap-2 border border-line bg-elevated px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-line-strong hover:text-fg"
                            aria-label="Search heroes and items"
                        >
                            <Search size={13} aria-hidden="true" />
                            <span className="hidden lg:inline">Search</span>
                            <kbd className="hidden border border-line px-1 py-px text-[9px] text-faint lg:inline">
                                Ctrl K
                            </kbd>
                        </button>

                        <Link
                            href="/tools/favourites"
                            className="relative grid h-8 w-8 place-items-center text-muted transition-colors hover:text-fg"
                            aria-label={`Favourites${favourites.length ? ` (${favourites.length})` : ""}`}
                        >
                            <Heart size={16} aria-hidden="true" />
                            {favourites.length > 0 && (
                                <span className="absolute right-0.5 top-0.5 grid h-3.5 min-w-3.5 place-items-center bg-accent px-0.5 font-mono text-[8px] font-bold leading-none text-accent-contrast">
                                    {favourites.length}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={toggle}
                            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-fg"
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                        >
                            {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-fg lg:hidden"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                        >
                            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-bg lg:hidden"
                    >
                        <nav className="mx-auto max-w-shell px-4 py-8" aria-label="Mobile">
                            {NAV.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="group flex items-center justify-between border-b border-line py-4"
                                    >
                                        <span className="display text-4xl transition-colors group-hover:text-accent">
                                            {item.label}
                                        </span>
                                        <span className="font-mono text-[10px] tracking-[0.2em] text-faint">{item.code}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="mt-8 space-y-1"
                            >
                                <Link
                                    href="/tools/favourites"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                                >
                                    Favourites
                                    <span className="text-accent">{favourites.length}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        setPaletteOpen(true);
                                    }}
                                    className="flex w-full items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                                >
                                    Search
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                </button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </>
    );
}
