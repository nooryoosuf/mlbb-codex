import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import TodayBirthdays from "@/components/community/TodayBirthdays";
import SmartImage from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/motion";
import { Badge, LinkButton, SectionHeader } from "@/components/ui/primitives";
import { heroes } from "@/data";
import {
    BIRTHDAYS,
    BIRTHDAY_STATS,
    SHARED_BIRTHDAY_DATES,
    getBirthdayHeroes,
} from "@/data/birthdays";
import { asset } from "@/lib/base-path";
import { formatBirthday } from "@/lib/birthdays";
import { heroSplash } from "@/lib/images";

export const metadata: Metadata = {
    title: "Community",
    description:
        "Find the Mobile Legends hero who shares your birthday. Sourced dates, shared birthdays, and a shareable Codex birthday card.",
    alternates: { canonical: "/community" },
};

const HOW_IT_WORKS = [
    {
        title: "Pick your date",
        body: "Month and day, no year. The ledger only needs the calendar day.",
    },
    {
        title: "Break the seal",
        body: "The reveal returns every hero with the same documented birthday.",
    },
    {
        title: "Keep the card",
        body: "Share the generated card natively, download it, or send a link to the date.",
    },
];

const ROADMAP = [
    {
        title: "Hero polls",
        body: "Settle the roster's biggest arguments with a clean community vote.",
    },
    {
        title: "Fan creations",
        body: "A curated wall for builds, edits and art from Codex readers.",
    },
    {
        title: "Community quizzes",
        body: "Quick lore and ability challenges with a shareable result.",
    },
    {
        title: "Player spotlights",
        body: "Short interviews with the people behind the picks.",
    },
];

export default function CommunityPage() {
    const specimenDate =
        SHARED_BIRTHDAY_DATES.find((date) => getBirthdayHeroes(date).length >= 3) ??
        SHARED_BIRTHDAY_DATES[0] ??
        BIRTHDAYS[0]?.date ??
        "01-01";
    const specimenHeroes = getBirthdayHeroes(specimenDate).slice(0, 3);
    const coverHero = heroes.find((hero) => hero.slug === specimenHeroes[0]?.slug);
    const cover = coverHero ? heroSplash(coverHero) : undefined;

    return (
        <>
            <PageHeader
                index="08"
                eyebrow="Community"
                title="Find the hero who shares your birthday."
                description="A small, human corner of the Codex. Start with the day you were born, meet the heroes who share it, and leave with a card worth posting."
                image={cover}
                imageAlt={coverHero ? `${coverHero.name} skin artwork` : ""}
                meta={
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.documented}</span> documented
                            birthdays
                        </span>
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.sharedDates}</span> shared
                            dates
                        </span>
                        <span>
                            <span className="text-fg">{BIRTHDAY_STATS.undated}</span> heroes
                            unlisted
                        </span>
                    </div>
                }
            />

            <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <Reveal>
                    <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="relative isolate overflow-hidden bg-elevated p-6 sm:p-9 lg:p-11">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge tone="accent">Live feature</Badge>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                                    01 / Birthday Twin
                                </span>
                            </div>

                            <h2 className="display mt-9 text-[clamp(3.4rem,8vw,6.2rem)] leading-[0.82]">
                                Birthday
                                <br />
                                <span className="text-accent">Twin</span>
                            </h2>

                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                                Every documented hero birthday in one place. Pick a date, reveal
                                every match, and generate a Codex card with the hero art, the date
                                and the names.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                <LinkButton href="/community/birthday-twin">
                                    Find my twin
                                    <ArrowUpRight size={14} aria-hidden="true" />
                                </LinkButton>
                                <a href="#today" className="btn btn-ghost">
                                    <CalendarDays size={14} aria-hidden="true" />
                                    Today&apos;s birthdays
                                </a>
                            </div>

                            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-5">
                                <div>
                                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Documented
                                    </dt>
                                    <dd className="display mt-1 text-3xl">{BIRTHDAY_STATS.documented}</dd>
                                </div>
                                <div>
                                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Shared
                                    </dt>
                                    <dd className="display mt-1 text-3xl">{BIRTHDAY_STATS.sharedDates}</dd>
                                </div>
                                <div>
                                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Triples
                                    </dt>
                                    <dd className="display mt-1 text-3xl">{BIRTHDAY_STATS.triples}</dd>
                                </div>
                            </dl>

                            <span
                                aria-hidden="true"
                                className="display text-stroke pointer-events-none absolute -right-5 -top-8 select-none text-[11rem] leading-none opacity-30 sm:text-[15rem]"
                            >
                                08
                            </span>
                        </div>

                        <div className="relative overflow-hidden bg-bg p-6 sm:p-8">
                            <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
                            <div className="relative flex h-full flex-col justify-between gap-8">
                                <div className="flex items-center justify-between gap-4 border-b border-line pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                                    <span>Shared birthday</span>
                                    <span className="text-accent">{formatBirthday(specimenDate)}</span>
                                </div>

                                <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
                                    {specimenHeroes.map((hero, index) => (
                                        <Link
                                            key={hero.slug}
                                            href={`/hero/${hero.slug}`}
                                            className={`group block border border-line bg-elevated transition-[transform,border-color] duration-500 ease-editorial hover:-translate-y-2 hover:border-accent ${
                                                index === 0
                                                    ? "-rotate-2"
                                                    : index === 1
                                                      ? "translate-y-5 rotate-1"
                                                      : "rotate-2"
                                            }`}
                                        >
                                            <SmartImage
                                                image={{
                                                    src: asset(hero.portrait),
                                                    aspect: "240 / 390",
                                                    local: true,
                                                }}
                                                alt={`${hero.name} portrait`}
                                                name={hero.name}
                                                priority
                                                sizes="(max-width: 640px) 30vw, 14rem"
                                            />
                                            <div className="border-t border-line p-2.5">
                                                <div className="display truncate text-sm leading-none sm:text-lg">
                                                    {hero.name}
                                                </div>
                                                <div className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                                                    {hero.roles.join(" / ")}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <p className="border-t border-line pt-4 text-xs leading-relaxed text-faint">
                                    {specimenHeroes.length} heroes, one date. Shared birthdays are
                                    part of the record, not a duplicate entry.
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <section
                    id="today"
                    className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]"
                >
                    <Reveal>
                        <TodayBirthdays birthdays={BIRTHDAYS} />
                    </Reveal>

                    <Reveal delay={0.08}>
                        <div className="panel h-full p-5 sm:p-7">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-accent" aria-hidden="true" />
                                <span className="eyebrow">How it works</span>
                            </div>
                            <ol className="mt-5 divide-y divide-line">
                                {HOW_IT_WORKS.map((step, index) => (
                                    <li key={step.title} className="flex gap-4 py-4">
                                        <span className="font-mono text-[10px] text-accent">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <h3 className="display text-xl">{step.title}</h3>
                                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                                {step.body}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-2 border-t border-line pt-4 text-xs leading-relaxed text-faint">
                                No accounts. No backend. The date stays in your browser, and the
                                card is drawn locally.
                            </p>
                        </div>
                    </Reveal>
                </section>

                <section className="mt-16">
                    <SectionHeader
                        index="02"
                        eyebrow="The roadmap"
                        title="One feature, room to grow"
                        description="Community is being built in chapters. Birthday Twin is live. Everything else stays off the page until it actually exists."
                    />
                    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                        {ROADMAP.map((item) => (
                            <div key={item.title} className="bg-elevated p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Planned
                                    </span>
                                    <span className="h-1.5 w-1.5 bg-accent/50" aria-hidden="true" />
                                </div>
                                <h3 className="display mt-8 text-2xl">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10 grid gap-6 border border-line bg-elevated p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <div className="eyebrow">About the birthdays</div>
                        <h2 className="display mt-3 text-3xl">Sourced, not invented.</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                            {BIRTHDAY_STATS.documented} of {BIRTHDAY_STATS.total} heroes have a
                            documented birthday. Dates come from each hero&apos;s Mobile Legends
                            Wiki profile, which cites official region profiles and in-game records
                            where available. Every reveal links back to its source.
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                            Dori and Hirara currently have no documented date, so they are left
                            out instead of guessed. If a date changes, the ledger changes with it.
                        </p>
                    </div>
                    <div className="flex flex-col justify-between gap-6 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        <div className="flex flex-wrap gap-2">
                            <Badge tone="neutral">{BIRTHDAY_STATS.dates} calendar dates</Badge>
                            <Badge tone="neutral">{BIRTHDAY_STATS.sharedDates} shared</Badge>
                            <Badge tone="neutral">Source linked</Badge>
                        </div>
                        <Link href="/community/birthday-twin" className="link-arrow">
                            Open the full ledger
                            <ArrowUpRight size={12} aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
