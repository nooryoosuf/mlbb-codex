import type { Metadata } from "next";
import RandomPicker from "@/components/tools/RandomPicker";

export const metadata: Metadata = {
    title: "Random hero picker",
    description: "Draw a random Mobile Legends hero, optionally filtered by role and lane.",
    alternates: { canonical: "/tools/random" },
};

export default function RandomPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="eyebrow mb-2">Tool</div>
                <h1 className="font-display text-4xl">Random picker</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                    Let the codex decide. Restrict the pool by role or lane if you want a fair draw.
                </p>
            </header>
            <RandomPicker />
        </div>
    );
}
