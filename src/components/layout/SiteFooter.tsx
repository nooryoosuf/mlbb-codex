import Link from "next/link";
import { heroes, items } from "@/data";

export default function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-line">
            <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                    <div className="max-w-sm">
                        <div className="font-display text-xl">
                            MLBB <span className="text-accent">Codex</span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            A companion database for Mobile Legends: Bang Bang — {heroes.length} heroes,
                            {" "}{items.length} items, verified stats and matchups.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                        <div>
                            <div className="eyebrow mb-3">Explore</div>
                            <ul className="space-y-2 text-sm text-muted">
                                <li><Link href="/heroes" className="hover:text-fg">Heroes</Link></li>
                                <li><Link href="/items" className="hover:text-fg">Items</Link></li>
                                <li><Link href="/emblems" className="hover:text-fg">Emblems</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="eyebrow mb-3">Tools</div>
                            <ul className="space-y-2 text-sm text-muted">
                                <li><Link href="/tools/compare" className="hover:text-fg">Compare</Link></li>
                                <li><Link href="/tools/counters" className="hover:text-fg">Counters</Link></li>
                                <li><Link href="/tools/favourites" className="hover:text-fg">Favourites</Link></li>
                                <li><Link href="/tools/random" className="hover:text-fg">Random picker</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="eyebrow mb-3">Data</div>
                            <ul className="space-y-2 text-sm text-muted">
                                <li>
                                    <a href="https://mlbbdex.com" target="_blank" rel="noreferrer" className="hover:text-fg">
                                        MLBBDex
                                    </a>
                                </li>
                                <li>
                                    <a href="https://mobilelegends.fandom.com" target="_blank" rel="noreferrer" className="hover:text-fg">
                                        ML Wiki
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Unofficial fan project. Hero data and artwork © Moonton. Wiki-derived data CC BY-SA.
                    </p>
                    <p className="font-mono">Not affiliated with Moonton or Mobile Legends.</p>
                </div>
            </div>
        </footer>
    );
}
