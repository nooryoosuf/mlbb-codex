import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { patchNotes } from "@/data";

export const metadata: Metadata = {
    title: "Patch notes",
    description: "Recent Mobile Legends balance patches, condensed: hero changes, battlefield tweaks and system updates.",
    alternates: { canonical: "/patches" },
};

export default function PatchesPage() {
    return (
        <>
            <PageHeader
                index="05"
                eyebrow="Balance log"
                title="Patch notes"
                description="Recent patches, flattened from the Mobile Legends Wiki into readable sections. Highlights first, full notes below."
                meta={
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                        {patchNotes.patches.length} recent patches · source: {patchNotes.source}
                    </span>
                }
            />

            <div className="mx-auto max-w-shell space-y-3 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                {patchNotes.patches.map((patch, patchIndex) => (
                    <article key={patch.version} className="border border-line bg-elevated">
                        <div className="grid gap-px bg-line lg:grid-cols-[15rem_1fr]">
                            <div className="bg-bg p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="eyebrow">Patch</span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                                        {patch.date ?? "—"}
                                    </span>
                                </div>
                                <h2 className="display mt-2 text-[clamp(2.4rem,5vw,3.5rem)] leading-[0.85]">{patch.version}</h2>
                                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
                                    <Stat label="Buff" value={patch.changes.buff} tone="text-success" />
                                    <Stat label="Nerf" value={patch.changes.nerf} tone="text-danger" />
                                    <Stat label="Adjust" value={patch.changes.adjust} tone="text-accent" />
                                </div>
                                <a
                                    href={patch.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                                >
                                    Wiki page <ArrowUpRight size={10} aria-hidden="true" />
                                </a>
                            </div>

                            <div className="bg-bg p-5 sm:p-6">
                                <ul className="space-y-2">
                                    {patch.highlights.map((line, index) => (
                                        <li key={index} className="flex gap-3 text-sm leading-relaxed text-muted">
                                            <span className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span>
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>

                                {patch.sections.length > 0 && (
                                    <div className="mt-5 border-t border-line pt-3">
                                        {patch.sections.map((section, sectionIndex) => (
                                            <details
                                                key={`${section.title}-${sectionIndex}`}
                                                className="group border-b border-line py-2 last:border-b-0"
                                                open={patchIndex === 0 && sectionIndex === 1}
                                            >
                                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg">
                                                    {section.title}
                                                    <span className="text-faint transition-transform group-open:rotate-45">+</span>
                                                </summary>
                                                <div className="mt-3 max-h-[26rem] overflow-y-auto whitespace-pre-line pr-2 text-xs leading-relaxed text-muted">
                                                    {section.body}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>
                ))}

                <p className="pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-faint">
                    {patchNotes.attribution} Rates and balance intent can change after release; the wiki is the source of record.
                </p>
            </div>
        </>
    );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
    return (
        <div>
            <div className={`display text-xl leading-none ${tone}`}>{value}</div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-faint">{label}</div>
        </div>
    );
}
