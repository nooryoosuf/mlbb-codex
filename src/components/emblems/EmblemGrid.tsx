"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { itemIcon } from "@/lib/images";
import type { Emblem, Talent } from "@/data/emblems";

export function EmblemGrid({ emblems, talents }: { emblems: Emblem[]; talents: Talent[] }) {
    const [selected, setSelected] = useState<string>(emblems[0]?.id ?? "");

    return (
        <div className="space-y-14">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {emblems.map((emblem, index) => {
                    const active = selected === emblem.id;
                    return (
                        <button
                            key={emblem.id}
                            type="button"
                            onClick={() => setSelected(emblem.id)}
                            aria-pressed={active}
                            className={`group relative border p-5 text-left transition-colors ${
                                active ? "border-accent bg-elevated" : "border-line bg-elevated hover:border-line-strong"
                            }`}
                        >
                            <span
                                className={`absolute right-4 top-4 font-mono text-[9px] tracking-[0.18em] ${
                                    active ? "text-accent" : "text-faint"
                                }`}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="flex items-start gap-3.5">
                                <div className="h-12 w-12 shrink-0 border border-line bg-subtle">
                                    <SmartImage image={itemIcon(emblem.icon)} alt="" name={emblem.name} sizes="48px" />
                                </div>
                                <div className="min-w-0 flex-1 pr-6">
                                    <h2 className="display text-2xl leading-none">{emblem.name}</h2>
                                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                                        {emblem.role}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">
                                {emblem.description}
                            </p>

                            <ul className="mt-4 space-y-2 border-t border-line pt-3">
                                {emblem.attributes.map((attribute) => (
                                    <li key={attribute} className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] text-muted">{attribute.split(":")[0]}</span>
                                        <span className="font-mono text-[10px] text-fg">{attribute.split(":")[1]?.trim() ?? ""}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-[0.2em] text-accent">02</span>
                            <span className="eyebrow">Talent pool</span>
                        </div>
                        <h2 className="display text-3xl">Mix across emblems</h2>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{talents.length} talents</p>
                </div>

                <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {talents.map((talent) => (
                        <div key={talent.id} className="flex items-start gap-3 bg-elevated p-4 transition-colors hover:bg-subtle">
                            <div className="h-9 w-9 shrink-0 border border-line bg-bg">
                                <SmartImage image={itemIcon(talent.icon)} alt="" name={talent.name} sizes="36px" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-medium text-fg">{talent.name}</h3>
                                <p className="mt-1 text-[11px] leading-relaxed text-muted">{talent.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Emblem and talent data reflects the current role-based system. Attributes are base bonuses at full emblem level.
            </p>
        </div>
    );
}
