"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ArrowUpRight,
    CalendarDays,
    RotateCcw,
    Sparkles,
} from "lucide-react";
import BirthdayCard from "@/components/community/BirthdayCard";
import SmartImage from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/primitives";
import { asset } from "@/lib/base-path";
import {
    MONTHS,
    daysInMonth,
    formatBirthday,
    localToday,
    toDateKey,
    type BirthdayHero,
} from "@/lib/birthdays";

const EASE = [0.16, 1, 0.3, 1] as const;

function BirthdayHeroCard({ hero }: { hero: BirthdayHero }) {
    return (
        <article className="group grid grid-cols-[7rem_1fr] border border-line bg-elevated transition-colors hover:border-line-strong sm:grid-cols-[9.5rem_1fr]">
            <Link
                href={`/hero/${hero.slug}`}
                className="relative block overflow-hidden border-r border-line bg-subtle"
                aria-label={`Open ${hero.name}'s hero profile`}
            >
                <SmartImage
                    image={{ src: asset(hero.portrait), aspect: "240 / 390", local: true }}
                    alt={`${hero.name} portrait`}
                    name={hero.name}
                    priority
                    sizes="(max-width: 640px) 112px, 152px"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                />
                <span className="absolute left-0 top-0 border-b border-r border-line-strong bg-bg/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                    Twin
                </span>
            </Link>

            <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="display truncate text-3xl leading-none transition-colors group-hover:text-accent sm:text-4xl">
                            {hero.name}
                        </h3>
                        <p className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                            {hero.title ?? hero.region ?? "The Land of Dawn"}
                        </p>
                    </div>
                    <Badge tone="accent">{hero.date.replace("-", ".")}</Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {hero.roles.map((role) => (
                        <span
                            key={role}
                            className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                        >
                            {role}
                        </span>
                    ))}
                    {hero.lanes.map((lane) => (
                        <span
                            key={lane}
                            className="border border-line/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint"
                        >
                            {lane}
                        </span>
                    ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{hero.fact}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {hero.region ?? "Region unlisted"}
                    </span>
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/hero/${hero.slug}`}
                            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-fg"
                        >
                            Dossier
                            <ArrowUpRight size={11} aria-hidden="true" />
                        </Link>
                        <a
                            href={hero.source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-fg"
                            title={hero.sourceNote ?? hero.source.label}
                        >
                            Source
                            <ArrowUpRight size={11} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}

function PickerSkeleton() {
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

const subscribeMounted = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

export default function BirthdayTwin({
    birthdays,
    initialDate,
}: {
    birthdays: BirthdayHero[];
    initialDate: { month: number; day: number } | null;
}) {
    const reduce = useReducedMotion();
    const mounted = useSyncExternalStore(subscribeMounted, getMounted, getServerMounted);
    const fallback =
        initialDate ??
        (typeof window === "undefined" ? { month: 1, day: 1 } : localToday());

    const [month, setMonth] = useState(fallback.month);
    const [day, setDay] = useState(fallback.day);
    const [revealed, setRevealed] = useState(Boolean(initialDate));
    const [revealing, setRevealing] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const byDate = useMemo(() => {
        const map = new Map<string, BirthdayHero[]>();
        for (const entry of birthdays) {
            const list = map.get(entry.date) ?? [];
            list.push(entry);
            map.set(entry.date, list);
        }
        return map;
    }, [birthdays]);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    const dateKey = toDateKey(month, day);
    const matches = byDate.get(dateKey) ?? [];
    const monthDef = MONTHS[month - 1];

    const cancelReveal = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        setRevealing(false);
    }, []);

    const chooseMonth = (value: number) => {
        cancelReveal();
        setMonth(value);
        setDay((current) => Math.min(current, daysInMonth(value)));
        setRevealed(false);
    };

    const chooseDay = (value: number) => {
        cancelReveal();
        setDay(value);
        setRevealed(false);
    };

    const useToday = () => {
        cancelReveal();
        const today = localToday();
        setMonth(today.month);
        setDay(today.day);
        setRevealed(false);
    };

    const reveal = useCallback(() => {
        if (revealing) return;
        cancelReveal();

        const finish = () => {
            setRevealing(false);
            setRevealed(true);
            const url = new URL(window.location.href);
            url.searchParams.set("date", dateKey);
            window.history.replaceState(null, "", url.toString());
        };

        if (reduce) {
            finish();
            return;
        }

        setRevealing(true);
        timer.current = setTimeout(finish, 620);
    }, [cancelReveal, dateKey, reduce, revealing]);

    if (!mounted) return <PickerSkeleton />;

    return (
        <div>
            <p className="sr-only" role="status" aria-live="polite">
                {revealed
                    ? matches.length > 0
                        ? `${matches.length} ${matches.length === 1 ? "hero" : "heroes"} share ${formatBirthday(dateKey)}: ${matches
                              .map((hero) => hero.name)
                              .join(", ")}.`
                        : `No documented hero birthdays on ${formatBirthday(dateKey)}.`
                    : `Selected ${formatBirthday(dateKey)}.`}
            </p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
                <div className="panel h-fit p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="eyebrow">Your birthday</div>
                            <div className="display mt-3 flex items-baseline gap-2 text-6xl sm:text-7xl">
                                <span className="text-accent">{monthDef.short}</span>
                                <span>{String(day).padStart(2, "0")}</span>
                            </div>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                                {monthDef.name} {day} / no year needed
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={useToday}
                            className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
                        >
                            <CalendarDays size={12} aria-hidden="true" />
                            Today
                        </button>
                    </div>

                    <fieldset className="mt-7">
                        <legend className="eyebrow">Month</legend>
                        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                            {MONTHS.map((entry) => (
                                <button
                                    key={entry.value}
                                    type="button"
                                    onClick={() => chooseMonth(entry.value)}
                                    aria-pressed={month === entry.value}
                                    aria-label={entry.name}
                                    className={`h-9 border font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                                        month === entry.value
                                            ? "border-accent bg-accent text-accent-contrast"
                                            : "border-line text-muted hover:border-line-strong hover:text-fg"
                                    }`}
                                >
                                    {entry.short}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="mt-6">
                        <legend className="eyebrow">Day</legend>
                        <div className="mt-3 grid grid-cols-7 gap-1.5">
                            {Array.from({ length: daysInMonth(month) }, (_, index) => index + 1).map(
                                (value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => chooseDay(value)}
                                        aria-pressed={day === value}
                                        aria-label={`${monthDef.name} ${value}`}
                                        className={`grid h-9 place-items-center border font-mono text-[10px] transition-colors ${
                                            day === value
                                                ? "border-accent bg-accent text-accent-contrast"
                                                : "border-line text-muted hover:border-line-strong hover:text-fg"
                                        }`}
                                    >
                                        {value}
                                    </button>
                                )
                            )}
                        </div>
                    </fieldset>

                    <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={reveal}
                            disabled={revealing}
                            aria-busy={revealing}
                            className="btn btn-primary flex-1 disabled:cursor-wait disabled:opacity-70"
                        >
                            <Sparkles size={14} aria-hidden="true" />
                            {revealing ? "Reading the stars" : "Reveal my twins"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                cancelReveal();
                                setRevealed(false);
                            }}
                            className="btn btn-ghost px-4"
                            aria-label="Clear the reveal"
                        >
                            <RotateCcw size={14} aria-hidden="true" />
                        </button>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-faint">
                        Pick the day you were born. Shared birthdays are common in the Land of
                        Dawn, so multiple heroes can answer.
                    </p>
                </div>

                <div className="min-w-0">
                    <AnimatePresence mode="wait">
                        {!revealed ? (
                            <motion.div
                                key="sealed"
                                initial={reduce ? false : { opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                                transition={{ duration: 0.45, ease: EASE }}
                                className="grid min-h-[26rem] place-items-center border border-dashed border-line-strong px-6 py-14 text-center"
                            >
                                <div className="max-w-sm">
                                    <span className="display text-stroke text-[7rem] leading-none">
                                        ?
                                    </span>
                                    <h2 className="display mt-3 text-3xl">The ledger is sealed</h2>
                                    <p className="mt-3 text-sm leading-relaxed text-muted">
                                        Choose a month and day, then reveal every hero recorded
                                        with the same birthday. No account, no guesswork.
                                    </p>
                                    <div className="mt-6 flex justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                                        <span className="border border-line px-2 py-1">
                                            {monthDef.short}
                                        </span>
                                        <span className="border border-line px-2 py-1">
                                            {String(day).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`result-${dateKey}`}
                                initial={reduce ? false : { opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, ease: EASE }}
                                className="min-w-0"
                            >
                                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                                    <div>
                                        <div className="eyebrow">The reveal / {dateKey}</div>
                                        <h2 className="display mt-3 max-w-xl text-4xl sm:text-5xl">
                                            {matches.length > 0
                                                ? matches.length === 1
                                                    ? `${matches[0].name} shares your birthday`
                                                    : `${matches.length} heroes share your birthday`
                                                : "No documented birthday here"}
                                        </h2>
                                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                                            {formatBirthday(dateKey)} / {dateKey}
                                        </p>
                                    </div>
                                    <Badge tone={matches.length > 0 ? "accent" : "neutral"}>
                                        {matches.length > 0 ? "Match found" : "Uncharted"}
                                    </Badge>
                                </div>

                                {matches.length > 0 ? (
                                    <motion.div
                                        initial={reduce ? false : "hidden"}
                                        animate="show"
                                        variants={{
                                            hidden: {},
                                            show: { transition: { staggerChildren: 0.08 } },
                                        }}
                                        className="mt-6 grid gap-4"
                                    >
                                        {matches.map((hero) => (
                                            <motion.div
                                                key={hero.slug}
                                                variants={{
                                                    hidden: { opacity: 0, y: 14 },
                                                    show: {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: { duration: 0.5, ease: EASE },
                                                    },
                                                }}
                                            >
                                                <BirthdayHeroCard hero={hero} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="mt-6 border border-dashed border-line-strong px-6 py-12 text-center">
                                        <h3 className="display text-2xl">The record is quiet.</h3>
                                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                                            The wiki has no birthday recorded for this date, so
                                            there is no twin to show. Try another day or check
                                            who was born today.
                                        </p>
                                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={useToday}
                                                className="btn btn-primary"
                                            >
                                                <CalendarDays size={14} aria-hidden="true" />
                                                Use today
                                            </button>
                                            <a href="#birthday-ledger" className="btn btn-ghost">
                                                Browse the ledger
                                            </a>
                                        </div>
                                        <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-faint">
                                            Two heroes, Dori and Hirara, have no documented
                                            birthday at all. They never appear in a reveal.
                                        </p>
                                    </div>
                                )}

                                {matches.length > 0 && (
                                    <div className="mt-10">
                                        <BirthdayCard
                                            key={`${dateKey}-${matches
                                                .map((hero) => hero.slug)
                                                .join("-")}`}
                                            heroes={matches}
                                            dateKey={dateKey}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
