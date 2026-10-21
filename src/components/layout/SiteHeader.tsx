"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X, Heart, Sun, Moon, ArrowRight } from "lucide-react";
import CommandPalette from "@/components/search/CommandPalette";
import { useTheme } from "@/lib/use-theme";
import { useFavourites } from "@/lib/use-favourites";
import { useScrolled } from "@/lib/store";

const NAV = [
    { href: "/heroes", label: "Heroes" },
    { href: "/items", label: "Items" },
    { href: "/emblems", label: "Emblems" },
    { href: "/tools", label: "Tools" },
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
                className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent bg-transparent"
                    }`}
            >
                <div className="mx-auto flex h-16 max-w-shell items-center gap-3 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-2.5" aria-label="MLBB Codex home">
                        <span className="grid h-8 w-8 place-items-center rounded-md border border-line-strong bg-elevated font-display text-lg leading-none text-accent transition-colors group-hover:border-accent">
                            C
                        </span>
                        <span className="hidden font-display text-lg tracking-tight sm:block">
                            MLBB <span className="text-accent">Codex</span>
                        </span>
                    </Link>

                    <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
                        {NAV.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                onClick={() => setOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "text-fg" : "text-muted hover:text-fg"
                                        }`}
                                >
                                    {item.label}
                                    {active && (
                                        <span className="absolute inset-x-3 -bottom-[13px] h-px bg-accent" aria-hidden="true" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPaletteOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-md border border-line bg-elevated px-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                            aria-label="Search heroes"
                        >
                            <Search size={15} aria-hidden="true" />
                            <span className="hidden lg:inline">Search</span>
                            <kbd className="hidden rounded border border-line bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-faint lg:inline">
                                Ctrl K
                            </kbd>
                        </button>

                        <Link
                            href="/tools/favourites"
                            className="relative grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-fg"
                            aria-label={`Favourites${favourites.length ? ` (${favourites.length})` : ""}`}
                        >
                            <Heart size={17} aria-hidden="true" />
                            {favourites.length > 0 && (
                                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold text-accent-contrast">
                                    {favourites.length}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={toggle}
                            className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-fg"
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                        >
                            {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-fg md:hidden"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                        >
                            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </header>

            {open && (
                <div className="fixed inset-x-0 top-16 z-40 border-b border-line bg-bg/98 backdrop-blur-xl md:hidden">
                    <nav className="mx-auto max-w-shell px-4 py-3" aria-label="Mobile">
                        {NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between rounded-md px-3 py-3 text-base text-fg transition-colors hover:bg-subtle"
                            >
                                {item.label}
                                <ArrowRight size={15} className="text-faint" aria-hidden="true" />
                            </Link>
                        ))}
                        <Link
                            href="/tools/favourites"
                            className="flex items-center justify-between rounded-md px-3 py-3 text-base text-fg transition-colors hover:bg-subtle"
                        >
                            Favourites
                            <span className="font-mono text-xs text-faint">{favourites.length}</span>
                        </Link>
                    </nav>
                </div>
            )}

            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </>
    );
}
