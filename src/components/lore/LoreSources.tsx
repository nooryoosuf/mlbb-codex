import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { CONFIDENCE_LABEL, type LoreConfidence, type LoreSource } from "@/data/lore";

export function ConfidenceBadge({ confidence }: { confidence: LoreConfidence }) {
    const tone = confidence === "confirmed" ? "success" : confidence === "unconfirmed" ? "danger" : "neutral";
    return <Badge tone={tone}>{CONFIDENCE_LABEL[confidence]}</Badge>;
}

export default function LoreSources({
    sources,
    confidence,
    label = "Sources",
    compact = false,
}: {
    sources: LoreSource[];
    confidence?: LoreConfidence;
    label?: string;
    compact?: boolean;
}) {
    const unique = sources.filter(
        (source, index) => sources.findIndex((candidate) => candidate.url === source.url) === index
    );

    if (unique.length === 0) return null;

    if (compact) {
        return (
            <div className="flex flex-wrap items-center gap-2">
                {confidence && <ConfidenceBadge confidence={confidence} />}
                {unique.map((source) => (
                    <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-accent"
                    >
                        <ExternalLink size={9} className="shrink-0" aria-hidden="true" />
                        <span className="truncate">{source.label.replace("Mobile Legends Wiki — ", "")}</span>
                    </a>
                ))}
            </div>
        );
    }

    return (
        <section className="border border-line bg-elevated">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <h2 className="display text-lg leading-none">{label}</h2>
                {confidence && <ConfidenceBadge confidence={confidence} />}
            </div>
            <ul className="divide-y divide-line">
                {unique.map((source) => (
                    <li key={source.url}>
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-start justify-between gap-4 px-5 py-3 transition-colors hover:bg-subtle"
                        >
                            <span className="min-w-0">
                                <span className="block text-sm leading-snug text-fg transition-colors group-hover:text-accent">
                                    {source.label}
                                </span>
                                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                    {source.kind === "official" ? "Official source" : "Community reference"}
                                </span>
                            </span>
                            <ExternalLink size={12} className="mt-1 shrink-0 text-faint group-hover:text-accent" aria-hidden="true" />
                        </a>
                    </li>
                ))}
            </ul>
            <p className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-faint">
                Community wiki entries can lag or contradict each other. Ambiguity is marked rather than resolved
                silently.
            </p>
        </section>
    );
}
