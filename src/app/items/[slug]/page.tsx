import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { itemIcon } from "@/lib/images";
import { items, getItem } from "@/data";

export const dynamicParams = false;

export function generateStaticParams() {
    return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const item = getItem(slug);
    if (!item) return { title: "Item not found" };
    return {
        title: item.name,
        description: `${item.name} — ${item.summary}. ${item.bonus}`.trim(),
        alternates: { canonical: `/items/${item.slug}` },
    };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getItem(slug);
    if (!item) notFound();

    const recipeItems = item.recipe
        .map((name) => items.find((candidate) => candidate.name === name))
        .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/items" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
                <ArrowLeft size={14} aria-hidden="true" /> All items
            </Link>

            <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="h-20 w-20 shrink-0">
                    <SmartImage image={itemIcon(item.image)} alt={`${item.name} icon`} name={item.name} sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        {item.category && <Badge tone="accent">{item.category}</Badge>}
                        {item.price !== null && <Badge>{item.price}g</Badge>}
                    </div>
                    <h1 className="font-display text-4xl leading-tight sm:text-5xl">{item.name}</h1>
                    <p className="mt-1.5 text-base text-muted">{item.summary}</p>
                </div>
            </header>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <section className="rounded-panel border border-line bg-elevated p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Bonuses</h2>
                    <p className="text-sm leading-relaxed text-fg">{item.bonus || "—"}</p>
                </section>

                <section className="rounded-panel border border-line bg-elevated p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Best for</h2>
                    <p className="text-sm leading-relaxed text-fg">{item.bestFor || "—"}</p>
                </section>

                {(item.passive || item.unique || item.active) && (
                    <section className="rounded-panel border border-line bg-elevated p-5 sm:col-span-2">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Effects</h2>
                        <div className="space-y-3 text-sm leading-relaxed text-muted">
                            {item.unique && <p><span className="font-medium text-fg">Unique: </span>{item.unique}</p>}
                            {item.passive && <p><span className="font-medium text-fg">Passive: </span>{item.passive}</p>}
                            {item.active && <p><span className="font-medium text-fg">Active: </span>{item.active}</p>}
                        </div>
                    </section>
                )}

                {recipeItems.length > 0 && (
                    <section className="rounded-panel border border-line bg-elevated p-5 sm:col-span-2">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Build path</h2>
                        <div className="flex flex-wrap gap-2">
                            {recipeItems.map((component) => (
                                <Link
                                    key={component.slug}
                                    href={`/items/${component.slug}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
                                >
                                    {component.name}
                                    <ArrowUpRight size={11} aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <p className="mt-8 text-xs text-faint">
                Item data from MLBBDex (Mobile Legends Wiki, CC BY-SA).
            </p>
        </div>
    );
}
