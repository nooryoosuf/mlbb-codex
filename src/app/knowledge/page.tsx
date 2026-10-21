import Link from "next/link";
import { BASE_PATH } from "@/lib/base-path";

export const metadata = { title: "Emblems", robots: { index: false, follow: true } };

export default function KnowledgeRedirect() {
    return (
        <div className="mx-auto max-w-shell px-4 py-20 text-center sm:px-6 lg:px-8">
            <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/emblems/`} />
            <p className="text-sm text-muted">
                This page moved.{" "}
                <Link href="/emblems" className="text-accent underline underline-offset-4">
                    Continue to emblems
                </Link>
                .
            </p>
        </div>
    );
}
