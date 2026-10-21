import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "danger" | "success";

const TONES: Record<Tone, string> = {
    neutral: "border-line-strong text-muted",
    accent: "border-accent/45 bg-accent-soft text-accent",
    danger: "border-danger/40 bg-danger/10 text-danger",
    success: "border-success/40 bg-success/10 text-success",
};

export function Badge({
    children,
    tone = "neutral",
    className = "",
}: {
    children: ReactNode;
    tone?: Tone;
    className?: string;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] leading-4 ${TONES[tone]} ${className}`}
        >
            {children}
        </span>
    );
}

export function SectionHeader({
    eyebrow,
    index,
    title,
    description,
    action,
}: {
    eyebrow?: string;
    index?: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-line pb-5">
            <div className="min-w-0">
                {(eyebrow || index) && (
                    <div className="mb-3 flex items-center gap-3">
                        {index && <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{index}</span>}
                        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                    </div>
                )}
                <h2 className="display text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}

export function StatBar({
    label,
    value,
    max = 10,
    suffix,
}: {
    label: string;
    value: number | null;
    max?: number;
    suffix?: string;
}) {
    const pct = value === null ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{label}</span>
                <span className="font-mono text-xs text-fg">
                    {value === null ? "—" : `${value}${suffix ?? ""}`}
                </span>
            </div>
            <div className="h-1 w-full bg-subtle" role="presentation">
                <div
                    className="h-full bg-accent transition-[width] duration-700 ease-editorial"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="grid place-items-center border border-dashed border-line-strong px-6 py-20 text-center">
            <div className="max-w-sm">
                <h3 className="display text-2xl">{title}</h3>
                {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
                {action && <div className="mt-6">{action}</div>}
            </div>
        </div>
    );
}

export function LinkButton({
    href,
    children,
    variant = "primary",
    className = "",
}: {
    href: string;
    children: ReactNode;
    variant?: "primary" | "ghost";
    className?: string;
}) {
    return (
        <Link href={href} className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}>
            {children}
        </Link>
    );
}
