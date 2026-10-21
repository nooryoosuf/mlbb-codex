import type { ReactNode } from "react";

export default function PageHeader({
    index,
    eyebrow,
    title,
    description,
    meta,
}: {
    index: string;
    eyebrow: string;
    title: string;
    description?: string;
    meta?: ReactNode;
}) {
    return (
        <header className="relative overflow-hidden border-b border-line">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_20%_0%,black,transparent_70%)]" />
            <span
                aria-hidden="true"
                className="display text-stroke pointer-events-none absolute -right-4 -top-10 select-none text-[13rem] leading-none opacity-40 sm:-top-16 sm:text-[20rem]"
            >
                {index}
            </span>

            <div className="relative mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="mb-5 flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{index}</span>
                    <span className="h-px w-8 bg-line-strong" />
                    <span className="eyebrow">{eyebrow}</span>
                </div>

                <h1 className="display max-w-4xl text-[clamp(2.6rem,6vw,4.75rem)]">{title}</h1>

                {description && (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                        {description}
                    </p>
                )}

                {meta && <div className="mt-7">{meta}</div>}
            </div>
        </header>
    );
}
