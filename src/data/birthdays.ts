import { heroes, type Hero } from "./index";
import { getLoreFacts, getLoreProfile, type HeroLoreProfile, type LoreFacts } from "./lore";
import {
    MONTHS,
    parseDateKey,
    toDateKey,
    type BirthdayHero,
    type BirthdayMatch,
} from "@/lib/birthdays";

const BIRTHDAY_OVERRIDES: Record<string, { date: string; note: string }> = {
    irithel: {
        date: "12-12",
        note: "Birthday from the official MLBB CN hero profile cited by the wiki.",
    },
};

function cleanText(value: string): string {
    return value
        .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function firstSentence(value: string, limit = 210): string {
    const text = cleanText(value);
    if (!text || text.startsWith("{{") || /Infobox|File:|\{\{|\}\}/.test(text)) return "";

    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
    let result = (sentences[0] ?? text).trim();

    if (result.length < 80 && sentences[1] && result.length + sentences[1].length < limit) {
        result = `${result} ${sentences[1].trim()}`;
    }
    if (result.length > limit) {
        result = `${result.slice(0, limit - 3).replace(/\s+\S*$/, "")}...`;
    }
    return result;
}

function fallbackFact(hero: Hero, facts: LoreFacts): string {
    const origin = cleanText(facts.origin);
    const species = cleanText(facts.species);
    if (origin && species) return `From ${origin}. ${species}.`;
    if (origin) return `From ${origin}.`;
    if (species) return `${species}.`;
    if (facts.title) return `Known as ${facts.title}.`;
    return `${hero.roles.join(" / ")} from ${hero.region ?? "the Land of Dawn"}.`;
}

function buildFact(hero: Hero, facts: LoreFacts, profile: HeroLoreProfile | undefined): string {
    return (
        firstSentence(profile?.summary ?? "") ||
        firstSentence(facts.intro) ||
        fallbackFact(hero, facts)
    );
}

export const BIRTHDAYS: BirthdayHero[] = heroes
    .flatMap((hero) => {
        const facts = getLoreFacts(hero.slug);
        if (!facts) return [];

        const override = BIRTHDAY_OVERRIDES[hero.slug];
        const parsed = parseDateKey(override?.date ?? facts.birthday);
        if (!parsed) return [];

        const profile = getLoreProfile(hero.slug);

        return [
            {
                slug: hero.slug,
                name: hero.name,
                title: hero.title,
                roles: [...hero.roles],
                lanes: [...hero.lanes],
                region: hero.region,
                date: toDateKey(parsed.month, parsed.day),
                month: parsed.month,
                day: parsed.day,
                portrait: hero.portrait,
                splash: hero.splash,
                fact: buildFact(hero, facts, profile),
                source: {
                    label: `Mobile Legends Wiki - ${hero.name}`,
                    url: facts.source,
                },
                sourceNote: override?.note,
            },
        ];
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

export const BIRTHDAYS_BY_DATE = new Map<string, BirthdayHero[]>();
for (const entry of BIRTHDAYS) {
    const list = BIRTHDAYS_BY_DATE.get(entry.date) ?? [];
    list.push(entry);
    BIRTHDAYS_BY_DATE.set(entry.date, list);
}

export const BIRTHDAY_DATES = [...BIRTHDAYS_BY_DATE.keys()].sort();
export const SHARED_BIRTHDAY_DATES = BIRTHDAY_DATES.filter(
    (date) => (BIRTHDAYS_BY_DATE.get(date)?.length ?? 0) > 1
);

export const BIRTHDAY_MONTHS: BirthdayMatch[][] = MONTHS.map((month) => {
    return BIRTHDAY_DATES.filter((date) => parseDateKey(date)?.month === month.value).map((date) => {
        const parsed = parseDateKey(date);
        return {
            date,
            month: parsed?.month ?? month.value,
            day: parsed?.day ?? 1,
            heroes: BIRTHDAYS_BY_DATE.get(date) ?? [],
        };
    });
});

const documented = new Set(BIRTHDAYS.map((entry) => entry.slug));

export const BIRTHDAY_UNDATED = heroes
    .filter((hero) => !documented.has(hero.slug))
    .map((hero) => ({ slug: hero.slug, name: hero.name }));

export const BIRTHDAY_STATS = {
    documented: BIRTHDAYS.length,
    total: heroes.length,
    undated: BIRTHDAY_UNDATED.length,
    dates: BIRTHDAY_DATES.length,
    sharedDates: SHARED_BIRTHDAY_DATES.length,
    triples: BIRTHDAY_DATES.filter((date) => (BIRTHDAYS_BY_DATE.get(date)?.length ?? 0) >= 3).length,
};

export function getBirthdayHeroes(date: string): BirthdayHero[] {
    return BIRTHDAYS_BY_DATE.get(date) ?? [];
}
