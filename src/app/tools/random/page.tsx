import type { Metadata } from "next";
import RandomPicker from "@/components/tools/RandomPicker";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Random hero picker",
    description: "Draw a random Mobile Legends hero, optionally filtered by role and lane.",
    alternates: { canonical: "/tools/random" },
};

export default function RandomPage() {
    return (
        <>
            <PageHeader
                index="06.4"
                eyebrow="Tool"
                title="Random picker"
                description="Let the codex decide. Restrict the pool by role or lane for a fair draw."
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <RandomPicker />
            </div>
        </>
    );
}
