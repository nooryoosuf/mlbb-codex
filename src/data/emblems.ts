import raw from "./builders_data.json";

export interface Emblem {
    id: string;
    name: string;
    role: string;
    description: string;
    bestFor: string;
    attributes: string[];
    icon: string;
}

export interface Talent {
    id: string;
    name: string;
    description: string;
    icon: string;
}

interface RawEmblem {
    name: string;
    role: string;
    description: string;
    bestFor: string;
    attributes: string[];
    icon: string;
}

interface RawTalent {
    name: string;
    description: string;
    icon: string;
}

const slug = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const data = raw as { emblems: RawEmblem[]; talents: RawTalent[] };

export const emblems: Emblem[] = data.emblems.map((emblem) => ({
    ...emblem,
    id: slug(emblem.name),
}));

export const talents: Talent[] = data.talents.map((talent) => ({
    ...talent,
    id: slug(talent.name),
}));
