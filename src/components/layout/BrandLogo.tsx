import { asset } from "@/lib/base-path";

export default function BrandLogo({
    className = "",
    label,
}: {
    className?: string;
    label?: string;
}) {
    return (
        <span
            className={`inline-flex items-center ${className}`}
            role="img"
            aria-label={label}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={asset("/brand/codex-logo-white.png") ?? ""}
                alt=""
                width={404}
                height={387}
                decoding="async"
                className="brand-logo-dark h-full w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={asset("/brand/codex-logo-color.png") ?? ""}
                alt=""
                width={404}
                height={387}
                decoding="async"
                className="brand-logo-light h-full w-auto"
            />
        </span>
    );
}
