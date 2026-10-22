"use client";

import { useCallback, useState } from "react";
import { placeholderGradient, initials, type ResolvedImage } from "@/lib/images";

interface SmartImageProps {
    image: ResolvedImage;
    alt: string;
    className?: string;
    imgClassName?: string;
    priority?: boolean;
    sizes?: string;
    /** Show the initials fallback instead of a gradient-only tile. */
    name?: string;
    rounded?: string;
    /** "contain" keeps the whole artwork visible instead of cropping it. */
    fit?: "cover" | "contain";
    /** Override the aspect ratio (e.g. a fixed stage for a contain viewer). */
    aspect?: string;
}

/**
 * Renders artwork with a stable aspect box, lazy loading, and a graceful
 * fallback when the upstream asset is missing or fails to load.
 */
export default function SmartImage({
    image,
    alt,
    className = "",
    imgClassName = "",
    priority = false,
    sizes,
    name,
    rounded = "",
    fit = "cover",
    aspect,
}: SmartImageProps) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const failed = Boolean(image.src && failedSrc === image.src);
    const loaded = Boolean(image.src && loadedSrc === image.src);
    const showFallback = !image.src || failed;
    const syncLoadedState = useCallback(
        (node: HTMLImageElement | null) => {
            if (!node?.complete) return;
            if (node.naturalWidth > 0) {
                setLoadedSrc(image.src);
            } else {
                setFailedSrc(image.src);
            }
        },
        [image.src],
    );

    return (
        <div
            className={`relative overflow-hidden bg-subtle ${rounded} ${className}`}
            style={{
                aspectRatio: aspect ?? image.aspect,
                backgroundImage: showFallback ? placeholderGradient(alt) : undefined,
            }}
        >
            {!showFallback && (
                <>
                    {!loaded && <div className="absolute inset-0 animate-pulse bg-line" aria-hidden="true" />}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={image.src ?? alt}
                        ref={syncLoadedState}
                        src={image.src ?? ""}
                        alt={alt}
                        sizes={sizes}
                        referrerPolicy="no-referrer"
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={priority ? "high" : "auto"}
                        onLoad={() => setLoadedSrc(image.src)}
                        onError={() => setFailedSrc(image.src)}
                        className={`h-full w-full transition-opacity duration-500 ${
                            fit === "contain" ? "object-contain" : "object-cover"
                        } ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
                    />
                </>
            )}

            {showFallback && (
                <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-2xl tracking-[0.15em] text-fg/25">
                        {name ? initials(name) : alt.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}
