import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { heroPortrait } from "@/lib/images";
import type { Hero } from "@/data";
import type { LoreFaction, LoreWorldEntry } from "@/data/lore";

export function HeroChips({ heroes, empty }: { heroes: Hero[]; empty?: string }) {
    if (heroes.length === 0) {
        return empty ? <p className="text-sm text-faint">{empty}</p> : null;
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {heroes.map((hero) => (
                <Link
                    key={hero.slug}
                    href={`/lore/heroes/${hero.slug}`}
                    className="group inline-flex h-8 items-center gap-2 border border-line bg-elevated pl-1 pr-2.5 transition-colors hover:border-accent"
                >
                    <span className="h-6 w-[18px] shrink-0 overflow-hidden border border-line">
                        <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="18px" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors group-hover:text-fg">
                        {hero.name}
                    </span>
                </Link>
            ))}
        </div>
    );
}

export function HeroPortraitGrid({ heroes }: { heroes: Hero[] }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {heroes.map((hero) => (
                <Link
                    key={hero.slug}
                    href={`/lore/heroes/${hero.slug}`}
                    className="group flex items-center gap-3 border border-line bg-elevated p-2 transition-colors hover:border-accent"
                >
                    <span className="h-14 w-10 shrink-0 overflow-hidden border border-line">
                        <SmartImage image={heroPortrait(hero)} alt="" name={hero.name} sizes="40px" />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm transition-colors group-hover:text-accent">
                            {hero.name}
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                            {hero.title ?? hero.roles.join(" / ")}
                        </span>
                    </span>
                </Link>
            ))}
        </div>
    );
}

export function FactionList({ factions }: { factions: LoreFaction[] }) {
    if (factions.length === 0) return null;
    return (
        <ul className="divide-y divide-line border border-line bg-elevated">
            {factions.map((faction) => (
                <li key={faction.id} className="px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-sm text-fg">{faction.name}</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                            {faction.kind}
                        </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{faction.summary}</p>
                </li>
            ))}
        </ul>
    );
}

export function WorldLinks({ entries }: { entries: LoreWorldEntry[] }) {
    if (entries.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            {entries.map((entry) => (
                <Link
                    key={entry.id}
                    href={`/lore/world/${entry.id}`}
                    className="tag h-6 transition-colors hover:border-accent hover:text-accent"
                >
                    {entry.name}
                </Link>
            ))}
        </div>
    );
}
