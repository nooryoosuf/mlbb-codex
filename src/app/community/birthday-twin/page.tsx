import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BirthdayTwinRoute from "@/components/community/BirthdayTwinRoute";
import { SectionHeader } from "@/components/ui/primitives";
import {
    BIRTHDAYS,
    BIRTHDAY_MONTHS,
    BIRTHDAY_STATS,
} from "@/data/birthdays";
import { MONTHS, pad } from "@/lib/birthdays";

export const metadata: Metadata = {
    title: "Birthday Twin",
    description:
        "Pick a month and day to reveal every Mobile Legends hero with the same birthday. Generate a shareable MLBB Codex birthday card.",
    alternates: { canonical: "/community/birthday-twin" },
};

function BirthdayTwinFallback() {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="panel p-6 sm:p-8">
                <div className="h-3 w-24 animate-pulse bg-subtle" />
                <div className="mt-6 h-20 w-44 animate-pulse bg-subtle" />
                <div className="mt-8 grid grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="h-9 animate-pulse bg-subtle" />
                    ))}
                </div>
                <div className="mt-6 grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, index) => (
                        <div key={index} className="h-9 animate-pulse bg-subtle" />
                    ))}
                </div>
            </div>
            <div className="grid min-h-72 place-items-center border border-dashed border-line-strong px-8 py-16 text-center">
                <div>
                    <Sparkles className="mx-auto text-accent" size={22} aria-hidden="true" />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                        Loading the birthday ledger.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function BirthdayTwinPage() {
    return (
        <>
            <PageHeader
                index="08"
                eyebrow="Community / Birthday Twin"
                title="Who shares your birthday?"
                description="Pick the day you were born. The Codex will reveal every hero recorded with the same date, then draw a card you can keep."
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.documented}</span> documented
                        </span>
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.dates}</span> calendar dates
                        </span>
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.sharedDates}</span> shared
                            dates
                        </span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <Suspense fallback={<BirthdayTwinFallback />}>
                    <BirthdayTwinRoute birthdays={BIRTHDAYS} />
                </Suspense>

                <section id="birthday-ledger" className="mt-20 scroll-mt-24">
                    <SectionHeader
                        index="01"
                        eyebrow="The full ledger"
                        title="Every documented birthday"
                        description="Select a date to open its reveal. Names are grouped by month so shared dates stay visible."
                        action={
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                                {BIRTHDAY_STATS.documented} heroes / {BIRTHDAY_STATS.dates} dates
                            </span>
                        }
                    />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {MONTHS.map((month, index) => {
                            const entries = BIRTHDAY_MONTHS[index] ?? [];
                            const count = entries.reduce(
                                (total, entry) => total + entry.heroes.length,
                                0
                            );
                            return (
                                <section
                                    key={month.value}
                                    className="border border-line bg-elevated"
                                    aria-labelledby={`month-${month.value}`}
                                >
                                    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                                        <h3
                                            id={`month-${month.value}`}
                                            className="display text-2xl"
                                        >
                                            {month.name}
                                        </h3>
                                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                            {String(count).padStart(2, "0")} heroes
                                        </span>
                                    </div>

                                    {entries.length > 0 ? (
                                        <ul className="divide-y divide-line px-4">
                                            {entries.map((entry) => (
                                                <li
                                                    key={entry.date}
                                                    className="grid grid-cols-[2.2rem_1fr] gap-3 py-3"
                                                >
                                                    <span className="font-mono text-[10px] text-accent">
                                                        {pad(entry.day)}
                                                    </span>
                                                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                                                        {entry.heroes.map((hero) => (
                                                            <Link
                                                                key={hero.slug}
                                                                href={`/community/birthday-twin/?date=${hero.date}`}
                                                                prefetch={false}
                                                                className="text-sm text-muted transition-colors hover:text-accent"
                                                            >
                                                                {hero.name}
                                                            </Link>
                                                        ))}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="px-4 py-5 text-sm text-faint">
                                            No documented birthdays.
                                        </p>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-10 flex flex-col gap-5 border border-line bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <div className="eyebrow">Sourcing</div>
                        <h2 className="display mt-2 text-2xl">
                            Every date links to its record.
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                            Each reveal carries a source link to the hero&apos;s Mobile Legends
                            Wiki profile. Dori and Hirara have no documented birthday, so they do
                            not appear in any result.
                        </p>
                    </div>
                    <Link href="/community" className="link-arrow shrink-0">
                        Back to Community
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                </section>
            </div>
        </>
    );
}
