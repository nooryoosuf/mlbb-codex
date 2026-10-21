import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "danger" | "success";

const TONES: Record<Tone, string> = {
    neutral: "border-line bg-subtle text-muted",
    accent: "border-accent/35 bg-accent-soft text-accent",
    danger: "border-danger/35 bg-danger/10 text-danger",
    success: "border-success/35 bg-success/10 text-success",
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
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5 ${TONES[tone]} ${className}`}
        >
            {children}
        </span>
    );
}

export function SectionHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
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
                <span className="text-xs text-muted">{label}</span>
                <span className="font-mono text-xs text-fg">
                    {value === null ? "—" : `${value}${suffix ?? ""}`}
                </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-subtle" role="presentation">
                <div
                    className="h-full rounded-full bg-accent/80 transition-[width] duration-500"
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
        <div className="grid place-items-center rounded-panel border border-dashed border-line-strong bg-elevated/50 px-6 py-16 text-center">
            <div className="max-w-sm">
                <h3 className="font-display text-2xl">{title}</h3>
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
    const styles =
        variant === "primary"
            ? "bg-accent text-accent-contrast hover:bg-accent-strong"
            : "border border-line-strong text-fg hover:bg-subtle";
    return (
        <Link
            href={href}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors ${styles} ${className}`}
        >
            {children}
        </Link>
    );
}
