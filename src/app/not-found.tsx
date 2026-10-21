import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="mx-auto grid min-h-[70dvh] max-w-shell place-items-center px-4 py-20 text-center sm:px-6 lg:px-8">
            <div className="max-w-md">
                <Compass size={36} className="mx-auto mb-6 text-accent" aria-hidden="true" />
                <div className="eyebrow mb-3">Error 404</div>
                <h1 className="font-display text-5xl leading-tight sm:text-6xl">Page not found</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                    That hero, item, or page is not in the codex. It may have been renamed or removed.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                    <Link
                        href="/heroes"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-contrast hover:bg-accent-strong"
                    >
                        Browse heroes
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-line-strong px-4 text-sm font-medium text-fg hover:bg-subtle"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
