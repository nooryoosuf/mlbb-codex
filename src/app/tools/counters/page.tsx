import type { Metadata } from "next";
import CounterExplorer from "@/components/tools/CounterExplorer";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Counter explorer",
    description: "See which heroes a Mobile Legends hero is strong against, weak against, and pairs well with.",
    alternates: { canonical: "/tools/counters" },
};

export default function CountersPage() {
    return (
        <>
            <PageHeader
                index="04.2"
                eyebrow="Tool"
                title="Counter explorer"
                description="Choose a hero to see recorded matchups and synergy partners."
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <CounterExplorer />
            </div>
        </>
    );
}
