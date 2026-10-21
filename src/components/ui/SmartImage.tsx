"use client";

import { useState } from "react";
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
    rounded = "rounded-card",
}: SmartImageProps) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const showFallback = !image.src || failed;

    return (
        <div
            className={`relative overflow-hidden bg-subtle ${rounded} ${className}`}
            style={{ aspectRatio: image.aspect, backgroundImage: showFallback ? placeholderGradient(alt) : undefined }}
        >
            {!showFallback && (
                <>
                    {!loaded && <div className="absolute inset-0 animate-pulse bg-line" aria-hidden="true" />}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image.src ?? ""}
                        alt={alt}
                        sizes={sizes}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={priority ? "high" : "auto"}
                        onLoad={() => setLoaded(true)}
                        onError={() => setFailed(true)}
                        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
                    />
                </>
            )}

            {showFallback && (
                <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-2xl tracking-[0.2em] text-fg/25">
                        {name ? initials(name) : alt.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}
