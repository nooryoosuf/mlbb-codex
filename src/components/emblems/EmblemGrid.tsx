"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { itemIcon } from "@/lib/images";
import type { Emblem, Talent } from "@/data/emblems";

export function EmblemGrid({ emblems, talents }: { emblems: Emblem[]; talents: Talent[] }) {
    const [selected, setSelected] = useState<string>(emblems[0]?.id ?? "");

    return (
        <div className="space-y-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {emblems.map((emblem) => {
                    const active = selected === emblem.id;
                    return (
                        <button
                            key={emblem.id}
                            type="button"
                            onClick={() => setSelected(emblem.id)}
                            aria-pressed={active}
                            className={`rounded-panel border p-5 text-left transition-colors ${active
                                    ? "border-accent bg-accent-soft/40"
                                    : "border-line bg-elevated hover:border-line-strong"
                                }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="h-12 w-12 shrink-0">
                                    <SmartImage image={itemIcon(emblem.icon)} alt="" name={emblem.name} sizes="48px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-display text-xl">{emblem.name}</h2>
                                        <Badge tone={active ? "accent" : "neutral"}>{emblem.role}</Badge>
                                    </div>
                                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted">
                                        {emblem.description}
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-4 space-y-1 border-t border-line pt-3">
                                {emblem.attributes.map((attribute) => (
                                    <li key={attribute} className="flex items-center justify-between gap-2 text-[11px]">
                                        <span className="text-muted">{attribute.split(":")[0]}</span>
                                        <span className="font-mono text-fg">{attribute.split(":")[1]?.trim() ?? ""}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <div className="eyebrow mb-2">Talent pool</div>
                        <h2 className="font-display text-3xl">Mix across emblems</h2>
                    </div>
                    <p className="text-sm text-muted">{talents.length} talents</p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {talents.map((talent) => (
                        <div
                            key={talent.id}
                            className="flex items-start gap-3 rounded-card border border-line bg-elevated p-3.5"
                        >
                            <div className="h-9 w-9 shrink-0">
                                <SmartImage image={itemIcon(talent.icon)} alt="" name={talent.name} sizes="36px" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-medium text-fg">{talent.name}</h3>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{talent.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <p className="text-xs text-faint">
                Emblem and talent data reflects the current role-based system. Attributes are the
                base bonuses at full emblem level.
            </p>
        </div>
    );
}
