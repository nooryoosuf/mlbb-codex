import type { MetadataRoute } from "next";
import { heroes, items } from "@/data";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = ["", "/heroes", "/items", "/emblems", "/tools", "/tools/compare", "/tools/counters", "/tools/favourites", "/tools/random"];

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
    ];
}
