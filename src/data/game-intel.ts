
export interface PatchNote {
    id: string;
    heroName: string;
    type: "BUFF" | "NERF" | "ADJUST";
    summary: string;
    date: string;
}

export interface MapFeature {
    id: string;
    name: string;
    type: "TERRAIN" | "OBJECTIVE" | "MECHANIC";
    description: string;
    coordinates: string; // tactical flavor text
}

export const patchNotes: PatchNote[] = [
    { id: "p1", heroName: "FANNY", type: "NERF", summary: "Energy cost increased by 10% per cable. Wall span detection reduced.", date: "2024-05-15" },
    { id: "p2", heroName: "GUSION", type: "BUFF", summary: "Passive stack duration increased to 5s. Dagger speed +15%.", date: "2024-05-15" },
    { id: "p3", heroName: "CHOU", type: "ADJUST", summary: "Shunpo shield removed. Damage reduction added during dash.", date: "2024-05-10" },
    { id: "p4", heroName: "TIGREAL", type: "BUFF", summary: "Implosion radius increased. Now pulls enemies slightly faster.", date: "2024-05-01" },
];

export const mapIntel: MapFeature[] = [
    {
        id: "m1",
        name: "SANCTUM ISLAND",
        type: "TERRAIN",
        description: "The primary battlefield. Features dynamic water rendering which affects movement speed in the river bed.",
        coordinates: "SECTOR 01-ALPHA"
    },
    {
        id: "m2",
        name: "FLYING CLOUD",
        type: "MECHANIC",
        description: "A mysterious energy field that grants movement speed boosts to heroes passing through the mid-lane air currents.",
        coordinates: "GRID 44-X"
    },
    {
        id: "m3",
        name: "BROKEN WALLS",
        type: "TERRAIN",
        description: "Destructible cover points near the Gold Lane. Can be dashed through by Assassins but blocks projectiles.",
        coordinates: "SECTOR 03-BRAVO"
    },
    {
        id: "m4",
        name: "LITHOWANDERER",
        type: "OBJECTIVE",
        description: "A neutral creep in the river. Defeating it spawns a healing ward that follows the killer.",
        coordinates: "RIVER-BED-N"
    }
];

export const strategyTips = [
    { title: "COUNTERING ASSASSINS", content: "Use hard crowd control (suppression/knockup) to stop mobile heroes like Fanny." },
    { title: "LANE PRESSURE", content: "Push waves before rotating to objectives like Turtle or Lord." },
    { title: "MAP AWARENESS", content: "Check the minimap every 5 seconds. If enemies are missing, retreat to safety." }
];
