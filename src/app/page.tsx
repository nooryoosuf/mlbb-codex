import type { Metadata } from "next";
import HeroMasthead from "@/components/home/HeroMasthead";
import MetaBand from "@/components/meta/MetaBand";
import HomeSections from "@/components/home/HomeSections";

export const metadata: Metadata = {
    title: "MLBB Codex — Know every hero. Master every match.",
    description:
        "A complete Mobile Legends: Bang Bang hero codex with verified stats, skills, skins, matchups, items, and build tools.",
    alternates: { canonical: "/" },
};

export default function HomePage() {
    return (
        <>
            <HeroMasthead />
            <MetaBand />
            <HomeSections />
        </>
    );
}
