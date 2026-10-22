import type { ReactNode } from "react";
import SmartImage from "@/components/ui/SmartImage";
import type { ResolvedImage } from "@/lib/images";

export default function PageHeader({
    index,
    eyebrow,
    title,
    description,
    meta,
    image,
    imageAlt = "",
    portrait,
    portraitAlt,
}: {
    index: string;
    eyebrow: string;
    title: string;
    description?: string;
    meta?: ReactNode;
    image?: ResolvedImage;
    imageAlt?: string;
    portrait?: ResolvedImage;
    portraitAlt?: string;
}) {
    return (
        <header className="relative isolate overflow-hidden border-b border-line">
            {image && (
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <SmartImage
                        image={image}
                        alt={imageAlt}
                        name={title}
                        priority
                        sizes="100vw"
                        className="h-full w-full"
                        imgClassName="object-cover object-top opacity-60"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,var(--bg)_30%,transparent_82%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--bg)_0%,transparent_70%)]" />
                </div>
            )}
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_20%_0%,black,transparent_70%)]" />
            <span
                aria-hidden="true"
                className="display text-stroke pointer-events-none absolute -right-4 -top-10 select-none text-[13rem] leading-none opacity-40 sm:-top-16 sm:text-[20rem]"
            >
                {index}
            </span>

            <div className="relative mx-auto max-w-shell px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className={portrait ? "flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between" : ""}>
                    <div className="min-w-0">
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

                    {portrait && (
                        <div className="hidden w-32 shrink-0 border border-line-strong sm:block lg:w-40">
                            <SmartImage
                                image={portrait}
                                alt={portraitAlt ?? ""}
                                name={title}
                                priority
                                sizes="160px"
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
