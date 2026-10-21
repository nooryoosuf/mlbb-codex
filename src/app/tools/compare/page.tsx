import type { Metadata } from "next";
import { Suspense } from "react";
import CompareTool from "@/components/tools/CompareTool";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
    title: "Compare heroes",
    description: "Compare two Mobile Legends heroes side by side: base stats, roles, lanes, and abilities.",
    alternates: { canonical: "/tools/compare" },
};

export default function ComparePage() {
    return (
        <>
            <PageHeader
                index="04.1"
                eyebrow="Tool"
                title="Compare heroes"
                description="Line up two heroes across base stats, ratings and ability kits."
            />
            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <Suspense
                    fallback={
                        <div className="border border-line bg-elevated px-4 py-16 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                            Loading comparison
                        </div>
                    }
                >
                    <CompareTool />
                </Suspense>
            </div>
        </>
    );
}
