import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
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
        <div>
            <header className="relative overflow-hidden border-b border-line">
                <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_20%_0%,black,transparent_70%)]" />
                <div className="relative mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <Link
                        href="/items"
                        className="mb-10 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-faint transition-colors hover:text-accent"
                    >
                        <ArrowLeft size={12} aria-hidden="true" /> All items
                    </Link>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                        <div className="h-24 w-24 shrink-0 border border-line-strong bg-elevated p-1 sm:h-28 sm:w-28">
                            <SmartImage image={itemIcon(item.image)} alt={`${item.name} icon`} name={item.name} sizes="112px" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap gap-1.5">
                                {item.category && (
                                    <span className="border border-accent bg-accent px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-contrast">
                                        {item.category}
                                    </span>
                                )}
                                {item.price !== null && (
                                    <span className="border border-line-strong px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                                        {item.price}g
                                    </span>
                                )}
                            </div>
                            <h1 className="display text-[clamp(2.6rem,7vw,5rem)] leading-[0.85]">{item.name}</h1>
                            {item.summary && <p className="mt-3 text-base text-muted">{item.summary}</p>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
                    <section className="bg-elevated p-6">
                        <h2 className="eyebrow mb-3">Bonuses</h2>
                        <p className="text-sm leading-relaxed text-fg">{item.bonus || "—"}</p>
                    </section>

                    <section className="bg-elevated p-6">
                        <h2 className="eyebrow mb-3">Best for</h2>
                        <p className="text-sm leading-relaxed text-fg">{item.bestFor || "—"}</p>
                    </section>

                    {(item.passive || item.unique || item.active) && (
                        <section className="bg-elevated p-6 sm:col-span-2">
                            <h2 className="eyebrow mb-3">Effects</h2>
                            <div className="space-y-3 text-sm leading-relaxed text-muted">
                                {item.unique && <p><span className="font-medium text-fg">Unique — </span>{item.unique}</p>}
                                {item.passive && <p><span className="font-medium text-fg">Passive — </span>{item.passive}</p>}
                                {item.active && <p><span className="font-medium text-fg">Active — </span>{item.active}</p>}
                            </div>
                        </section>
                    )}

                    {recipeItems.length > 0 && (
                        <section className="bg-elevated p-6 sm:col-span-2">
                            <h2 className="eyebrow mb-3">Build path</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {recipeItems.map((component) => (
                                    <Link
                                        key={component.slug}
                                        href={`/items/${component.slug}`}
                                        className="tag"
                                    >
                                        {component.name}
                                        <ArrowUpRight size={10} aria-hidden="true" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                    Item data from MLBBDex (Mobile Legends Wiki, CC BY-SA).
                </p>
            </div>
        </div>
    );
}
