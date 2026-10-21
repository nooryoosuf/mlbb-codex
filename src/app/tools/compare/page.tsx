import type { Metadata } from "next";
import { Suspense } from "react";
import CompareTool from "@/components/tools/CompareTool";

export const metadata: Metadata = {
    title: "Compare heroes",
    description: "Compare two Mobile Legends heroes side by side: base stats, roles, lanes, and abilities.",
    alternates: { canonical: "/tools/compare" },
};

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-shell px-4 py-16 text-sm text-muted">Loading comparison…</div>}>
            <CompareTool />
        </Suspense>
    );
}
