import {
    wiki,
    type LoreArc,
    type LoreDiscovery,
    type LoreEra,
    type LoreEvent,
} from "./core";

export const LORE_ERAS: LoreEra[] = [
    {
        id: "ancient-ones",
        name: "The Age of the Ancient Ones",
        span: "Before recorded history",
        summary:
            "The oldest layer of the setting: the Ancient Ones, their ruins, the Twilight Orb and the structures later civilisations built over. Almost everything about it survives only as archaeology.",
    },
    {
        id: "endless-war",
        name: "The Endless War",
        span: "Millennia, ending in the Era of Strife",
        summary:
            "The long war between the forces of light and the Abyss. The dragon twins fled to Cadia, the Black Dragon swallowed Lieh, the Shadow Swamp was corrupted, and Miya was born as the era closed.",
    },
    {
        id: "second-plane-war",
        name: "The Second Plane War",
        span: "After the Endless War",
        summary:
            "A later conflict that wounded Estes and forced him into a long sleep. Its battles appear in elven and Moniyan chronicles, but its exact chronology is disputed.",
    },
    {
        id: "fall-of-ridgeburg",
        name: "The Fall of Ridgeburg",
        span: "About a century before the present",
        summary:
            "Vexana released the Mist over Ridgeburg to stop the Abyss, transforming the city and its people. Necrokeep has been isolated ever since.",
    },
    {
        id: "present-age",
        name: "The Present Age",
        span: "The current timeline",
        summary:
            "The Abyss has risen again, the Lightborn defend Moniyan, Yu Zhong has returned to Cadia, the Forsaken Light has broken with the Church, and Eruditio is once more trying to prevent a catastrophe.",
    },
];

export const LORE_EVENTS: LoreEvent[] = [
    {
        id: "black-dragon-swallows-lieh",
        eraId: "endless-war",
        title: "The Black Dragon swallows Lieh",
        summary:
            "During the Endless War, the last dragon twins opened a path to Cadia. The exhausted Black Dragon swallowed the Evil God Lieh to stop his pursuit, sealing the god inside himself and beginning a millennia-long corruption.",
        heroSlugs: ["yu-zhong", "baxia"],
        sources: [wiki("Yu Zhong")],
        confidence: "confirmed",
    },
    {
        id: "shadow-swamp-corrupted",
        eraId: "endless-war",
        title: "The Shadow Swamp is corrupted",
        summary:
            "The Abyss corroded the fertile southern land of Azrya into the Shadow Swamp. The Dark Elves survived in the poisoned wetland and built their sacred tradition around it.",
        heroSlugs: ["karina", "selena"],
        sources: [wiki("Azrya Woodlands")],
        confidence: "confirmed",
    },
    {
        id: "miya-born",
        eraId: "endless-war",
        title: "Miya is born at the end of the Era of Strife",
        summary:
            "Miya's file places her birth at the close of the Era of Strife, making her a direct witness to the Endless War's last horrors and the corruption of the elven lands.",
        heroSlugs: ["miya", "estes"],
        sources: [wiki("Miya")],
        confidence: "confirmed",
    },
    {
        id: "estes-wounded",
        eraId: "second-plane-war",
        title: "Estes is wounded and sleeps",
        summary:
            "The Moon Elf King was gravely injured in the Second Plane War and fell into a deep sleep, leaving the Moon Elves to face the Abyss' return without him until he woke on a night of thunder.",
        heroSlugs: ["estes", "miya"],
        sources: [wiki("Estes")],
        confidence: "confirmed",
    },
    {
        id: "ridgeburg-mist",
        eraId: "fall-of-ridgeburg",
        title: "Vexana releases the Mist",
        summary:
            "Facing the Abyss' advance, Duchess Vexana released the Mist over Ridgeburg. The city was saved and its people turned undead. A century later it is known as Necrokeep.",
        heroSlugs: ["vexana", "leomord", "faramis"],
        sources: [wiki("Necrokeep")],
        confidence: "confirmed",
    },
    {
        id: "aamon-inherits",
        eraId: "present-age",
        title: "Aamon inherits House Paxley",
        summary:
            "Aamon's parents vanished in a sandstorm while visiting Altair. At eighteen he became Duke Paxley and head of the most powerful duchy in the Moniyan Empire.",
        heroSlugs: ["aamon", "gusion", "valentina"],
        sources: [wiki("Aamon")],
        confidence: "confirmed",
    },
    {
        id: "dyrroth-abducted",
        eraId: "present-age",
        title: "Dyrroth is taken into the Abyss",
        summary:
            "The Moniyan prince Dyrroth was abducted and reshaped by Alice into the Abyss' Son of Darkness. Silvanna's search for him has continued ever since.",
        heroSlugs: ["dyrroth", "silvanna", "alice"],
        sources: [wiki("Dyrroth"), wiki("Silvanna")],
        confidence: "confirmed",
    },
    {
        id: "terizla-guild-destroyed",
        eraId: "present-age",
        title: "The Free Smiths' Guild is destroyed",
        summary:
            "The Church of Light condemned Terizla's guild as heretical. Xavier, then Arbiter of Light, led the suppression. Terizla survived, was framed, and eventually became the Abyss' Executioner.",
        heroSlugs: ["terizla", "xavier", "julian"],
        sources: [wiki("Terizla"), wiki("Xavier")],
        confidence: "confirmed",
    },
    {
        id: "forsaken-light-formed",
        eraId: "present-age",
        title: "The Forsaken Light forms",
        summary:
            "Xavier was ordered to capture Yin and Melissa and instead joined them. Together with Julian, the four outcasts became the Forsaken Light.",
        heroSlugs: ["xavier", "yin", "melissa", "julian"],
        sources: [wiki("Xavier"), wiki("Yin")],
        confidence: "confirmed",
    },
    {
        id: "yu-zhong-returns",
        eraId: "present-age",
        title: "Yu Zhong returns to the Dragon Altar",
        summary:
            "Defeated by Baxia and left for dead, Yu Zhong trained for ten years, returned to the Dragon Altar, broke the Reverse Scale's seal and fought Lieh. Wanwan's friendship helped him regain himself.",
        heroSlugs: ["yu-zhong", "baxia", "wanwan", "ling", "zilong"],
        sources: [wiki("Yu Zhong")],
        confidence: "confirmed",
    },
    {
        id: "lancelot-odette",
        eraId: "present-age",
        title: "Lancelot and Odette choose each other",
        summary:
            "Wounded in a tavern brawl, Lancelot was rescued by Odette. The arranged betrothal became a real bond, and Odette left Swan Castle to travel with him.",
        heroSlugs: ["lancelot", "odette"],
        sources: [wiki("Lancelot"), wiki("Odette")],
        confidence: "confirmed",
    },
    {
        id: "carmilla-transformed",
        eraId: "present-age",
        title: "Carmilla becomes a Blood Demon",
        summary:
            "Carmilla chose death rather than separation from Cecilion. She woke in his arms as a Blood Demon, completing a transformation driven by devotion rather than conquest.",
        heroSlugs: ["carmilla", "cecilion"],
        sources: [wiki("Carmilla")],
        confidence: "confirmed",
    },
];

export const LORE_ARCS: LoreArc[] = [
    {
        id: "light-and-abyss",
        title: "Light and the Abyss",
        eraId: "endless-war",
        summary:
            "The defining conflict of the setting: the Lord of Light and the Abyss, the elven and human worlds caught between them, and the long cost of holding the line.",
        beats: [
            "The Endless War corrupts the Shadow Swamp and scatters the elves.",
            "Estes is wounded and sleeps; Miya keeps watch.",
            "Alice rises through betrayal and takes the Sanguine Lair.",
            "The Lightborn and the Monastery of Light answer the Abyss' return.",
        ],
        heroSlugs: ["miya", "estes", "alice", "tigreal", "silvanna", "alucard", "thamuz", "balmond"],
        sources: [wiki("Land of Dawn"), wiki("Alice")],
        confidence: "confirmed",
    },
    {
        id: "lightborn",
        title: "The Lightborn",
        eraId: "present-age",
        summary:
            "The Moniyan Empire's elite squad, formed around the Wertz name, the Monastery's hunters and the crown's last princess.",
        beats: [
            "Tigreal takes the blame for a failed campaign and leaves his family.",
            "Fanny enlists and earns a place among the Lightborn.",
            "Silvanna takes command while searching for Dyrroth.",
            "The squad fights Alice, Thamuz and the Abyss' court.",
        ],
        heroSlugs: ["tigreal", "fanny", "alucard", "granger", "harith", "silvanna", "dyrroth"],
        sources: [wiki("Tigreal"), wiki("Silvanna")],
        confidence: "confirmed",
    },
    {
        id: "paxley-inheritance",
        title: "The Paxley Inheritance",
        eraId: "present-age",
        summary:
            "Castle Aberleen's first family carries an old pact, a secret spell and a habit of producing children who leave.",
        beats: [
            "Aamon inherits at eighteen after his parents vanish.",
            "Gusion rejects the family's magic and leaves.",
            "Valentina, the immortal ancestor, still walks the halls.",
            "Melissa, a distant Paxley cousin and illegitimate daughter, is drawn into the Forsaken Light.",
        ],
        heroSlugs: ["aamon", "gusion", "valentina", "melissa", "marcel", "carmilla", "cecilion"],
        sources: [wiki("Aamon"), wiki("Gusion"), wiki("Valentina")],
        confidence: "confirmed",
    },
    {
        id: "baroque-romance",
        title: "The Blade of Roses",
        eraId: "present-age",
        summary:
            "A rebellious heir, an arranged marriage and a princess who wanted adventure: the Moniyan nobility's most personal rebellion.",
        beats: [
            "Lancelot refuses his father's political marriage and leaves Castle Gorge.",
            "Odette rescues him after a tavern duel.",
            "The betrothal becomes a real bond; Odette leaves Swan Castle.",
            "Guinevere, Lancelot's sister, resists the same dynastic logic.",
        ],
        heroSlugs: ["lancelot", "odette", "guinevere"],
        sources: [wiki("Lancelot"), wiki("Odette")],
        confidence: "confirmed",
    },
    {
        id: "black-dragon-arc",
        title: "The Black Dragon's Return",
        eraId: "endless-war",
        summary:
            "Cadia's founding tragedy and its present war: the dragon who swallowed a god, the disciple who inherited his corruption and the fighters who guard the altar.",
        beats: [
            "The Black Dragon swallows Lieh to save the Cadia Riverlands.",
            "Yu Zhong is corrupted, defeated by Baxia and left for dead.",
            "He returns ten years later and breaks the Reverse Scale's seal.",
            "Wanwan's friendship helps him recover himself.",
        ],
        heroSlugs: ["yu-zhong", "baxia", "wanwan", "ling", "zilong", "yin"],
        sources: [wiki("Yu Zhong"), wiki("Baxia")],
        confidence: "confirmed",
    },
    {
        id: "forsaken-light-arc",
        title: "The Forsaken Light",
        eraId: "present-age",
        summary:
            "Four people the Church of Light could not tolerate, and the squad they formed after it tried to destroy them.",
        beats: [
            "Xavier suppresses Terizla's guild and spends a decade in guilt.",
            "Terizla becomes the Abyss' Executioner; his son Julian is taken by the archbishop.",
            "Xavier is ordered to capture Yin and Melissa and refuses.",
            "The four become the Forsaken Light.",
        ],
        heroSlugs: ["xavier", "yin", "melissa", "julian", "terizla", "alice"],
        sources: [wiki("Xavier"), wiki("Terizla")],
        confidence: "confirmed",
    },
    {
        id: "necrokeep-curse",
        title: "The Necrokeep Curse",
        eraId: "fall-of-ridgeburg",
        summary:
            "A city saved by a curse, a duchess who refuses to let it die, and the knight and physician who stayed.",
        beats: [
            "Vexana releases the Mist as the Abyss advances.",
            "Ridgeburg's people become undead; the city becomes Necrokeep.",
            "Leomord guards the cursed land; Faramis studies a cure.",
            "Alice and Terizla remain the city's enemies.",
        ],
        heroSlugs: ["vexana", "leomord", "faramis", "alice", "terizla"],
        sources: [wiki("Necrokeep")],
        confidence: "confirmed",
    },
    {
        id: "eruditio-machines",
        title: "Eruditio's Machines",
        eraId: "present-age",
        summary:
            "The technological city's attempt to protect the Land of Dawn through invention, and the artificial lives it created along the way.",
        beats: [
            "Eruditio's scholars build a city independent of the Magic Academy.",
            "Laboratory 1718 creates Angela and the android programme.",
            "Layla and the Eruditio Rangers defend the city.",
            "Natan leads Eruditio through repeated wars.",
        ],
        heroSlugs: ["layla", "natan", "angela", "alpha", "saber", "chip", "ixia", "novaria"],
        sources: [wiki("Eruditio"), wiki("Laboratory 1718")],
        confidence: "confirmed",
    },
    {
        id: "ocean-desert",
        title: "The Ocean and the Desert",
        eraId: "present-age",
        summary:
            "The southern seas and the western sands hold older powers than the Moniyan-Abyss war: island gods, buried tyrants and outlaw kingdoms.",
        beats: [
            "Kadita guards the Vonetis islands as the Ocean Goddess.",
            "Kalea and Badang protect the archipelago beside her.",
            "Esmeralda seals Khufra beneath the ruins of Tivacan.",
            "Khaleed and Moskov's friendship ends in the desert war.",
        ],
        heroSlugs: ["kadita", "kalea", "badang", "khufra", "esmeralda", "khaleed", "moskov"],
        sources: [wiki("Vonetis Sea"), wiki("Khufra")],
        confidence: "suggested",
    },
    {
        id: "northern-fire",
        title: "The Northern Fire",
        eraId: "present-age",
        summary:
            "Beyond the empire's northern border, the Frozen Sea and Queen's Peak produce guardians, pirates and mages who owe nothing to Moniyan.",
        beats: [
            "Aurora receives the Light at Queen's Peak and becomes the Maiden of the Glacier.",
            "Freya, Franco, Bane and Atlas fight over the Frozen Sea.",
            "The Magic Academy trains Harley, Lylia and others outside the Church's reach.",
        ],
        heroSlugs: ["aurora", "freya", "franco", "bane", "atlas", "harley", "lylia", "eudora", "gord"],
        sources: [wiki("Northern Vale"), wiki("Frozen Sea")],
        confidence: "suggested",
    },
];

export const LORE_DISCOVERIES: LoreDiscovery[] = [
    {
        id: "tigreal-fanny",
        title: "The Lightborn commander and his sister",
        body:
            "Tigreal Wertz and Fanny are siblings. When Tigreal accepted blame for a failed campaign and left home, Fanny defied their family and enlisted, eventually joining him in the Lightborn.",
        category: "kinship",
        heroSlugs: ["tigreal", "fanny"],
        sources: [wiki("Tigreal"), wiki("Fanny")],
        confidence: "confirmed",
    },
    {
        id: "estes-miya",
        title: "A king and a priestess",
        body:
            "Estes, the Moon Elf King, is Miya's older brother. Both were born in the Moonlit Forest and both are recorded as immortal.",
        category: "kinship",
        heroSlugs: ["estes", "miya"],
        worldId: "moonlit-forest",
        sources: [wiki("Estes"), wiki("Miya")],
        confidence: "confirmed",
    },
    {
        id: "paxley-brothers",
        title: "Castle Aberleen's two sons",
        body:
            "Aamon is the elder heir of House Paxley; Gusion is his younger brother, who left the family to develop a fighting style based on holy light. Valentina is recorded as their ancestor.",
        category: "kinship",
        heroSlugs: ["aamon", "gusion", "valentina"],
        worldId: "castle-aberleen",
        sources: [wiki("Aamon"), wiki("Gusion")],
        confidence: "confirmed",
    },
    {
        id: "silvanna-dyrroth",
        title: "The princess and the prince of the Abyss",
        body:
            "Silvanna and Dyrroth are siblings. He was abducted as a child and raised by Alice; Silvanna became princess-regent and has continued searching for him while leading the Lightborn against the Abyss.",
        category: "kinship",
        heroSlugs: ["silvanna", "dyrroth", "alice"],
        sources: [wiki("Silvanna"), wiki("Dyrroth")],
        confidence: "confirmed",
    },
    {
        id: "karina-selena",
        title: "Two sisters on opposite sides",
        body:
            "Karina and Selena are Dark Elf sisters. Selena gave herself to the Abyss; Karina became her people's finest killer in order to stop her and find a way to bring her back.",
        category: "kinship",
        heroSlugs: ["karina", "selena"],
        worldId: "shadow-swamp",
        sources: [wiki("Karina"), wiki("Selena")],
        confidence: "confirmed",
    },
    {
        id: "argus-rafaela",
        title: "The twins the Light would not acknowledge",
        body:
            "Argus and Rafaela are twin angels. The Monastery of Light praised Rafaela and denied Argus, and the rift eventually drove him into the Abyss.",
        category: "kinship",
        heroSlugs: ["argus", "rafaela"],
        sources: [wiki("Argus"), wiki("Rafaela")],
        confidence: "confirmed",
    },
    {
        id: "lancelot-odette",
        title: "A betrothal that became a choice",
        body:
            "Lancelot and Odette were arranged to be married, but their bond began when Odette rescued the wounded swordsman after a tavern brawl. She later left Swan Castle to travel with him.",
        category: "romance",
        heroSlugs: ["lancelot", "odette"],
        sources: [wiki("Lancelot"), wiki("Odette")],
        confidence: "confirmed",
    },
    {
        id: "gusion-lesley",
        title: "A mutual crush across two noble houses",
        body:
            "Both Gusion's and Lesley's files list the other as a crush. The Paxley heir and the Vance sniper are the closest thing the Moniyan nobility has to a romance subplot.",
        category: "romance",
        heroSlugs: ["gusion", "lesley"],
        sources: [wiki("Gusion"), wiki("Lesley")],
        confidence: "confirmed",
    },
    {
        id: "yin-wanwan",
        title: "Childhood sweethearts in Cadia",
        body:
            "Yin and Wanwan are recorded as childhood sweethearts. Wanwan is also the friend whose intervention helped Yu Zhong recover from Lieh's influence.",
        category: "romance",
        heroSlugs: ["yin", "wanwan"],
        sources: [wiki("Yin"), wiki("Wanwan")],
        confidence: "confirmed",
    },
    {
        id: "hanabi-hayabusa",
        title: "The Scarlet flower and the Crimson shadow",
        body:
            "Hanabi and Hayabusa are childhood sweethearts. She leads the Scarlet Sect; he is the second heir of the Shadow Sect. Their clans' balance complicates everything.",
        category: "romance",
        heroSlugs: ["hanabi", "hayabusa"],
        sources: [wiki("Hanabi"), wiki("Hayabusa")],
        confidence: "confirmed",
    },
    {
        id: "khufra-esmeralda",
        title: "The tyrant and the astrologer",
        body:
            "Khufra and Esmeralda were once lovers. She awakened from his influence and sealed him beneath the ruins of Tivacan; his return is still anticipated.",
        category: "rivalry",
        heroSlugs: ["khufra", "esmeralda"],
        worldId: "agelta-drylands",
        sources: [wiki("Khufra"), wiki("Esmeralda")],
        confidence: "confirmed",
    },
    {
        id: "necrokeep-truth",
        title: "Necrokeep is Ridgeburg",
        body:
            "Necrokeep was once Ridgeburg, a prosperous fortress-city on the Moniyan frontier. A century ago Duchess Vexana released the Mist to protect it from the Abyss, and the city's people became undead.",
        category: "place",
        worldId: "necrokeep",
        heroSlugs: ["vexana", "leomord", "faramis"],
        sources: [wiki("Necrokeep")],
        confidence: "confirmed",
    },
    {
        id: "valentina-pact",
        title: "The Paxley ancestor who would not die",
        body:
            "Valentina was Duchess of House Paxley when her lover Irlan lost his soul to betrayal. She made a pact with an Evil God, gained immortality and shadow magic, and now searches for the Heart of Anima, a fragment of the Twilight Orb that could restore him.",
        category: "artifact",
        heroSlugs: ["valentina", "aamon"],
        sources: [wiki("Valentina")],
        confidence: "confirmed",
    },
    {
        id: "alice-age",
        title: "Alice is over two thousand years old",
        body:
            "Alice's file gives her age as 2000+, appearing twenty-five. She was human once and became a Blood Demon after the Monastery of Light and her own family betrayed her.",
        category: "identity",
        heroSlugs: ["alice"],
        worldId: "sanguine-lair",
        sources: [wiki("Alice")],
        confidence: "confirmed",
    },
    {
        id: "angela-prototype",
        title: "Angela is a prototype",
        body:
            "Angela's full designation is Peace Android Prototype 1. She was created by Dr. Baker at Laboratory 1718, the first life form there made without a human body or soul.",
        category: "identity",
        heroSlugs: ["angela"],
        worldId: "laboratory-1718",
        sources: [wiki("Angela")],
        confidence: "confirmed",
    },
    {
        id: "layla-eruditio",
        title: "The daughter of Eruditio",
        body:
            "Layla is publicly known as the 'daughter of Eruditio' and serves in its Rangers. Ixia is her best friend and confidante; Novaria is her teacher.",
        category: "identity",
        heroSlugs: ["layla", "ixia", "novaria"],
        worldId: "eruditio",
        sources: [wiki("Layla"), wiki("Ixia")],
        confidence: "confirmed",
    },
    {
        id: "belerick-floryn",
        title: "Belerick created Floryn",
        body:
            "Belerick is recorded as Floryn's creator and father. Sora and Hylos are companions within the same circle, and Lunox is linked to them as an ally.",
        category: "kinship",
        heroSlugs: ["belerick", "floryn", "sora", "hylos"],
        sources: [wiki("Floryn")],
        confidence: "confirmed",
    },
    {
        id: "lightborn-roster",
        title: "Who the Lightborn actually are",
        body:
            "The Lightborn squad is recorded as Tigreal, Fanny, Alucard, Granger, Harith and Silvanna. Silvanna leads it; Tigreal and Alucard's fathers served together.",
        category: "identity",
        heroSlugs: ["tigreal", "fanny", "alucard", "granger", "harith", "silvanna"],
        sources: [wiki("Tigreal"), wiki("Silvanna")],
        confidence: "confirmed",
    },
    {
        id: "yu-zhong-reincarnation",
        title: "Yu Zhong is the Black Dragon reborn",
        body:
            "Yu Zhong carries the will and reincarnation of the Black Dragon, the last of the dragon twins who swallowed Lieh to save Cadia. Baxia is his senior brother.",
        category: "identity",
        heroSlugs: ["yu-zhong", "baxia"],
        worldId: "dragon-altar",
        sources: [wiki("Yu Zhong")],
        confidence: "confirmed",
    },
    {
        id: "moon-elves-leonin",
        title: "An old alliance in the woods",
        body:
            "The Leonin Elves, including Harith's people, have a longstanding alliance with the Moon Elves of the Moonlit Forest.",
        category: "place",
        heroSlugs: ["harith", "estes", "miya"],
        worldId: "moonlit-forest",
        sources: [wiki("Harith")],
        confidence: "confirmed",
    },
];
