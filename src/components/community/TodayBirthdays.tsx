"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { asset } from "@/lib/base-path";
import {
    formatBirthday,
    localToday,
    toDateKey,
    type BirthdayHero,
} from "@/lib/birthdays";

interface Today {
    month: number;
    day: number;
    date: string;
    label: string;
}

let cachedToday: Today | null = null;
let cachedDate = "";

const subscribeToday = (callback: () => void) => {
    const timer = setInterval(callback, 60_000);
    return () => clearInterval(timer);
};

function getTodaySnapshot(): Today | null {
    const current = localToday();
    if (current.date !== cachedDate) {
        cachedDate = current.date;
        cachedToday = { ...current, label: formatBirthday(current.date) };
    }
    return cachedToday;
}

const getServerToday = () => null;

export default function TodayBirthdays({ birthdays }: { birthdays: BirthdayHero[] }) {
    const today = useSyncExternalStore(subscribeToday, getTodaySnapshot, getServerToday);

    const byDate = useMemo(() => {
        const map = new Map<string, BirthdayHero[]>();
        for (const entry of birthdays) {
            const list = map.get(entry.date) ?? [];
            list.push(entry);
            map.set(entry.date, list);
        }
        return map;
    }, [birthdays]);

    const matches = today ? byDate.get(today.date) ?? [] : [];

    let next: { date: string; heroes: BirthdayHero[] } | null = null;
    if (today && matches.length === 0) {
        for (let offset = 1; offset <= 366; offset += 1) {
            const date = new Date(2000, today.month - 1, today.day + offset);
            const key = toDateKey(date.getMonth() + 1, date.getDate());
            const heroes = byDate.get(key);
            if (heroes?.length) {
                next = { date: key, heroes };
                break;
            }
        }
    }

    return (
        <section className="panel overflow-hidden" aria-labelledby="today-birthdays-heading">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-5 sm:p-7">
                <div>
                    <div className="eyebrow">
                        Today / {today ? today.label : "reading the calendar"}
                    </div>
                    <h2 id="today-birthdays-heading" className="display mt-2 text-3xl sm:text-4xl">
                        Today&apos;s hero birthdays
                    </h2>
                </div>
                <CalendarDays className="text-accent" size={20} aria-hidden="true" />
            </div>

            <div className="p-5 sm:p-7">
                {!today ? (
                    <div className="space-y-3" aria-hidden="true">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="flex animate-pulse items-center gap-4">
                                <div className="h-20 w-12 bg-subtle" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-subtle" />
                                    <div className="h-3 w-48 bg-subtle" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : matches.length > 0 ? (
                    <div>
                        <p className="text-sm leading-relaxed text-muted">
                            {matches.length === 1
                                ? `The Land of Dawn is celebrating ${matches[0].name} today.`
                                : `The Land of Dawn is celebrating ${matches
                                      .map((hero) => hero.name)
                                      .join(" and ")} today.`}
                        </p>
                        <div className="mt-5 divide-y divide-line">
                            {matches.map((hero) => (
                                <Link
                                    key={hero.slug}
                                    href={`/hero/${hero.slug}`}
                                    className="group flex items-center gap-4 py-3.5"
                                >
                                    <div className="w-12 shrink-0 overflow-hidden border border-line">
                                        <SmartImage
                                            image={{
                                                src: asset(hero.portrait),
                                                aspect: "240 / 390",
                                                local: true,
                                            }}
                                            alt={`${hero.name} portrait`}
                                            name={hero.name}
                                            sizes="48px"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="display truncate text-2xl transition-colors group-hover:text-accent">
                                            {hero.name}
                                        </div>
                                        <div className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                                            {hero.title ?? hero.roles.join(" / ")}
                                        </div>
                                    </div>
                                    <ArrowUpRight
                                        size={14}
                                        className="shrink-0 text-faint transition-colors group-hover:text-accent"
                                        aria-hidden="true"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm leading-relaxed text-muted">
                            No hero has a documented birthday on {today.label}. The record is
                            quiet, but the next celebration is already on the calendar.
                        </p>
                        {next && (
                            <Link
                                href={`/community/birthday-twin/?date=${next.date}`}
                                className="group mt-6 flex items-center justify-between gap-4 border border-line bg-bg px-4 py-3 transition-colors hover:border-accent"
                            >
                                <span>
                                    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                        Next up / {formatBirthday(next.date)}
                                    </span>
                                    <span className="display mt-1 block text-2xl transition-colors group-hover:text-accent">
                                        {next.heroes.map((hero) => hero.name).join(", ")}
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={15}
                                    className="text-faint transition-colors group-hover:text-accent"
                                    aria-hidden="true"
                                />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-line px-5 py-4 sm:px-7">
                <Link
                    href={today ? `/community/birthday-twin/?date=${today.date}` : "/community/birthday-twin"}
                    className="link-arrow"
                >
                    Open Birthday Twin
                    <ArrowUpRight size={12} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
