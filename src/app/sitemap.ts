import type { MetadataRoute } from "next";
import { heroes, items } from "@/data";
import { LORE_WORLD } from "@/data/lore";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        "",
        "/meta",
        "/heroes",
        "/items",
        "/emblems",
        "/patches",
        "/tools",
        "/tools/compare",
        "/tools/counters",
        "/tools/favourites",
        "/tools/random",
        "/lore",
        "/lore/heroes",
        "/lore/relationships",
        "/lore/world",
        "/lore/timeline",
        "/lore/discoveries",
    ];

    return [
        ...staticRoutes.map((route) => ({
            url: `${siteUrl}${route === "" ? "/" : `${route}/`}`,
            changeFrequency: "weekly" as const,
            priority: route === "" ? 1 : 0.8,
        })),
        ...heroes.map((hero) => ({
            url: `${siteUrl}/hero/${hero.slug}/`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...items.map((item) => ({
            url: `${siteUrl}/items/${item.slug}/`,
            changeFrequency: "monthly" as const,
            priority: 0.4,
        })),
        ...heroes.map((hero) => ({
            url: `${siteUrl}/lore/heroes/${hero.slug}/`,
            changeFrequency: "monthly" as const,
            priority: 0.5,
        })),
        ...LORE_WORLD.map((entry) => ({
            url: `${siteUrl}/lore/world/${entry.id}/`,
            changeFrequency: "monthly" as const,
            priority: 0.4,
        })),
    ];
}
