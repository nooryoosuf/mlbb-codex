export interface BirthdaySource {
    label: string;
    url: string;
}

export interface BirthdayHero {
    slug: string;
    name: string;
    title: string | null;
    roles: string[];
    lanes: string[];
    region: string | null;
    date: string;
    month: number;
    day: number;
    portrait: string | null;
    splash: string | null;
    fact: string;
    source: BirthdaySource;
    sourceNote?: string;
}

export interface BirthdayMatch {
    date: string;
    month: number;
    day: number;
    heroes: BirthdayHero[];
}

export const MONTHS = [
    { value: 1, short: "JAN", name: "January" },
    { value: 2, short: "FEB", name: "February" },
    { value: 3, short: "MAR", name: "March" },
    { value: 4, short: "APR", name: "April" },
    { value: 5, short: "MAY", name: "May" },
    { value: 6, short: "JUN", name: "June" },
    { value: 7, short: "JUL", name: "July" },
    { value: 8, short: "AUG", name: "August" },
    { value: 9, short: "SEP", name: "September" },
    { value: 10, short: "OCT", name: "October" },
    { value: 11, short: "NOV", name: "November" },
    { value: 12, short: "DEC", name: "December" },
] as const;

export function pad(value: number): string {
    return String(value).padStart(2, "0");
}

export function toDateKey(month: number, day: number): string {
    return `${pad(month)}-${pad(day)}`;
}

export function parseDateKey(value: string | null | undefined): { month: number; day: number } | null {
    if (!value) return null;
    const match = /^(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth(month)) return null;
    return { month, day };
}

export function isValidDateKey(value: string | null | undefined): value is string {
    return Boolean(parseDateKey(value));
}

export function daysInMonth(month: number): number {
    return new Date(2000, month, 0).getDate();
}

export function formatBirthday(dateKey: string): string {
    const parsed = parseDateKey(dateKey);
    if (!parsed) return dateKey;
    return `${MONTHS[parsed.month - 1].name} ${parsed.day}`;
}

export function monthName(month: number): string {
    return MONTHS[month - 1]?.name ?? "";
}

export function monthShort(month: number): string {
    return MONTHS[month - 1]?.short ?? "";
}

export function localToday(): { month: number; day: number; date: string } {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return { month, day, date: toDateKey(month, day) };
}
