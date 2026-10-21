import type { Metadata } from "next";
import CounterExplorer from "@/components/tools/CounterExplorer";

export const metadata: Metadata = {
    title: "Counter explorer",
    description: "See which heroes a Mobile Legends hero is strong against, weak against, and pairs well with.",
    alternates: { canonical: "/tools/counters" },
};

export default function CountersPage() {
    return (
        <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="eyebrow mb-2">Tool</div>
                <h1 className="font-display text-4xl">Counter explorer</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                    Choose a hero to see recorded matchups and synergy partners.
                </p>
            </header>
            <CounterExplorer />
        </div>
    );
}
