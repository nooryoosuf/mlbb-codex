import { heroes } from "@/data/heroes";
import HeroClientView from "./HeroClientView";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return heroes.map((hero) => ({
        id: hero.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hero = heroes.find(h => h.id === id);

    if (!hero) return notFound();

    return <HeroClientView hero={hero} />;
}
