import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroProfile from "@/components/hero/HeroProfile";
import { heroes, getHero } from "@/data";

export const dynamicParams = false;

export function generateStaticParams() {
    return heroes.map((hero) => ({ id: hero.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const hero = getHero(id);
    if (!hero) return { title: "Hero not found" };

    const description = `${hero.name}${hero.title ? `, ${hero.title}` : ""} — ${[
        ...hero.roles,
        ...hero.lanes,
    ].join(" · ")}. Verified base stats, abilities, skins, and matchups.`;

    return {
        title: hero.name,
        description,
        alternates: { canonical: `/hero/${hero.slug}` },
        openGraph: {
            title: `${hero.name} — MLBB Codex`,
            description,
            url: `/hero/${hero.slug}`,
            images: hero.splash ? [{ url: hero.splash, alt: `${hero.name} splash art` }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${hero.name} — MLBB Codex`,
            description,
            images: hero.splash ? [hero.splash] : undefined,
        },
    };
}

export default async function HeroPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hero = getHero(id);
    if (!hero) notFound();
    return <HeroProfile hero={hero} />;
}
