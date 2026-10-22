import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { heroes, items, patches } from "@/data";

const MARQUEE = [
    `${heroes.length} heroes`,
    `${items.length} items`,
    `${patches.length} patches`,
    "verified stats",
    "skill data",
    "skins",
    "matchups",
    "lore dossiers",
    "the Land of Dawn",
    "birthday twins",
];

export default function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-line">
            <div className="marquee overflow-hidden border-b border-line py-3">
                <div className="marquee-track">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                            {MARQUEE.map((label) => (
                                <span
                                    key={`${copy}-${label}`}
                                    className="flex items-center font-mono text-[10px] uppercase tracking-[0.24em] text-faint"
                                >
                                    <span className="px-6">{label}</span>
                                    <span className="text-accent">/</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                        <div className="flex items-center gap-4">
                            <BrandLogo className="h-12" label="MLBB Codex" />
                            <div className="display text-5xl leading-none sm:text-6xl">
                                MLBB<span className="text-accent">/</span>CODEX
                            </div>
                        </div>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                            A companion database for Mobile Legends: Bang Bang. Every hero, item and
                            emblem, with the tools to compare them before you queue.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Link href="/heroes" className="btn btn-primary h-9 px-4">
                                Browse the roster
                            </Link>
                            <Link href="/tools/compare" className="btn btn-ghost h-9 px-4">
                                Compare heroes
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                        <div>
                            <div className="eyebrow mb-4">Explore</div>
                            <ul className="space-y-2.5 text-sm text-muted">
                                <li><Link href="/meta" className="transition-colors hover:text-accent">Live meta</Link></li>
                                <li><Link href="/heroes" className="transition-colors hover:text-accent">Heroes</Link></li>
                                <li><Link href="/items" className="transition-colors hover:text-accent">Items</Link></li>
                                <li><Link href="/emblems" className="transition-colors hover:text-accent">Emblems</Link></li>
                                <li><Link href="/patches" className="transition-colors hover:text-accent">Patch notes</Link></li>
                                <li><Link href="/lore" className="transition-colors hover:text-accent">Lore</Link></li>
                                <li><Link href="/community" className="transition-colors hover:text-accent">Community</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="eyebrow mb-4">Tools</div>
                            <ul className="space-y-2.5 text-sm text-muted">
                                <li><Link href="/tools/compare" className="transition-colors hover:text-accent">Compare</Link></li>
                                <li><Link href="/tools/counters" className="transition-colors hover:text-accent">Counters</Link></li>
                                <li><Link href="/tools/favourites" className="transition-colors hover:text-accent">Favourites</Link></li>
                                <li><Link href="/tools/random" className="transition-colors hover:text-accent">Random picker</Link></li>
                                <li><Link href="/community/birthday-twin" className="transition-colors hover:text-accent">Birthday Twin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="eyebrow mb-4">Data</div>
                            <ul className="space-y-2.5 text-sm text-muted">
                                <li>
                                    <a href="https://mlbbdex.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                                        MLBBDex
                                    </a>
                                </li>
                                <li>
                                    <a href="https://mobilelegends.fandom.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                                        ML Wiki
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint sm:flex-row sm:items-center sm:justify-between">
                    <p>Unofficial fan project. Data CC BY-SA. Artwork © Moonton.</p>
                    <p>Not affiliated with Moonton or Mobile Legends.</p>
                </div>
            </div>
        </footer>
    );
}
