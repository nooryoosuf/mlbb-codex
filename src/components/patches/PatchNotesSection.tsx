import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { SectionHeader } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { patchNotes } from "@/data";

export default function PatchNotesSection() {
    const [latest, ...older] = patchNotes.patches;
    if (!latest) return null;

    return (
        <section>
            <SectionHeader
                index="05"
                eyebrow="Patch notes"
                title="Latest balance changes"
                description="Highlights from the newest patch, pulled from the community wiki and condensed for the draft."
                action={
                    <Link href="/patches" className="link-arrow">
                        All patch notes <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                }
            />

            <Reveal>
                <div className="grid gap-px border border-line bg-line lg:grid-cols-[17rem_1fr]">
                    <div className="relative overflow-hidden bg-accent p-6 text-accent-contrast">
                        <span className="pointer-events-none absolute -right-3 -top-6 select-none display text-[7rem] leading-none text-white/10">
                            {latest.version.split(".")[0]}
                        </span>
                        <div className="relative">
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">Patch</div>
                            <div className="display mt-1 text-[clamp(3rem,6vw,4.5rem)] leading-[0.85]">{latest.version}</div>
                            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] opacity-80">
                                {latest.date ?? "Date not listed"}
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/25 pt-4">
                                <ChangeCount label="Buffs" value={latest.changes.buff} />
                                <ChangeCount label="Nerfs" value={latest.changes.nerf} />
                                <ChangeCount label="Adjusts" value={latest.changes.adjust} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg p-6 sm:p-8">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText size={13} className="text-accent" aria-hidden="true" />
                            <span className="eyebrow">What changed</span>
                        </div>
                        <ul className="space-y-3">
                            {latest.highlights.map((line, index) => (
                                <li key={index} className="grid grid-cols-[1.5rem_1fr] gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
                                    <span className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span>
                                    <span className="text-sm leading-relaxed text-muted">{line}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link href="/patches" className="btn btn-primary h-9 px-4">
                                Read the patch
                            </Link>
                            <Link href="/meta" className="btn btn-ghost h-9 px-4">
                                See the meta
                            </Link>
                        </div>
                    </div>
                </div>
            </Reveal>

            {older.length > 0 && (
                <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {older.slice(0, 3).map((patch) => (
                        <Link
                            key={patch.version}
                            href="/patches"
                            className="group bg-elevated p-4 transition-colors hover:bg-subtle"
                        >
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="display text-2xl leading-none transition-colors group-hover:text-accent">
                                    {patch.version}
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                                    {patch.date ?? "—"}
                                </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                                {patch.highlights[0] ?? patch.intro}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

function ChangeCount({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="display text-2xl leading-none">{value}</div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] opacity-70">{label}</div>
        </div>
    );
}
