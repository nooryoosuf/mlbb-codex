import { wiki, type HeroLoreProfile } from "../core";
import { profile } from "./shared";

export const MONIYAN_PROFILES: HeroLoreProfile[] = [
    profile(
        "tigreal",
        "Warrior of Dawn",
        "The Present Age",
        "Commander of the Imperial Army; Lightborn leader",
        "Tigreal Wertz carries a name older than his command. The rising star of the Moniyan Empire took the blame for a disastrous campaign and left his family behind — a choice that still shapes his sister Fanny and the knights who follow him.",
        [
            {
                title: "The Wertz name",
                body: "Tigreal is the eldest child of the Wertz family and the older brother of Fanny. His father Gareth and uncle Eckert belong to the same martial line. When a battle went wrong, Tigreal accepted responsibility and went into exile rather than let the blame fall on his soldiers.",
            },
            {
                title: "Lightborn",
                body: "He returned to serve alongside Alucard, Granger, Harith and Silvanna as one of the Lightborn, the empire's answer to the Abyss. Alice, Thamuz and the demon court count him among their most persistent enemies. His instinct to protect his people is the same one that cost him his home.",
            },
        ],
        ["duty", "exile", "the Wertz family"],
        ["lightborn", "imperial-army"]
    ),
    profile(
        "fanny",
        "Blade Dancer",
        "The Present Age",
        "Lightborn ranger; Wertz heir",
        "Fanny grew up protected by her family and her older brother. When Tigreal took the blame for a failed campaign and left, she ignored every objection and joined the army, earning her place with weapons of her own design.",
        [
            {
                title: "Following the name",
                body: "Fanny's decision to enlist was a direct answer to her brother's exile. Rather than let the Wertz name be buried under the scandal, she built the cable-driven blades that make her one of the fastest fighters in the Land of Dawn and completed trials the old guard had closed to her family.",
            },
            {
                title: "The Lightborn ranger",
                body: "Her speed made her invaluable to the Lightborn. She fights beside Tigreal, Alucard, Granger, Harith and Silvanna, and the Abyss knows her as a harasser who never stays still. The arrogance in her voice is a family trait; the discipline behind it is hers alone.",
            },
        ],
        ["family", "defiance", "speed"],
        ["lightborn", "imperial-army"]
    ),
    profile(
        "miya",
        "Moonlight Archer",
        "The Endless War",
        "Priestess of the Moon; immortal",
        "Born at the close of the Era of Strife, Miya watched the Abyss defile the Shadow Swamp and scatter the elves. She is Estes' younger sister, a priestess who took up the bow when prayer was no longer enough.",
        [
            {
                title: "A witness to the war",
                body: "Miya's earliest memories are of the Endless War and its cost to the elven people. The Abyss corrupted the Shadow Swamp and pushed the Moon Elves back toward the Moonlit Forest. Her immortality is not a blessing in her telling; it is the reason she keeps watch while others age and die.",
            },
            {
                title: "The archer and the hunter",
                body: "Her file records a love interest in Alucard, the demon hunter, and enmity with Alice and Balmond. Those ties place her at the seam between the elven and human wars against the Abyss: a priestess who fights beside a human knight and against the darkness that took her homeland.",
            },
        ],
        ["memory", "moonlight", "endurance"],
        ["moon-elves", "lunar-temple"],
        [],
        "suggested"
    ),
    profile(
        "estes",
        "Moon Elf King",
        "The Second Plane War",
        "King of the Moon Elves",
        "Estes rules the Moon Elves from the Lunar Temple. Wounded in the Second Plane War, he slept for years and woke only when the Abyss rose again — a king who measures his reign in the lives he could not save.",
        [
            {
                title: "The sleeping king",
                body: "The Elf King was gravely injured in the Second Plane War and fell into a deep sleep. His people endured the Abyss' return without him until a night of thunder pulled him back to the throne. His birthplace is recorded as the Tree of Life in the Moonlit Forest.",
            },
            {
                title: "The elder brother",
                body: "Estes is Miya's older brother. His file lists Alice and Balmond as enemies, and Lunox, Belerick, Valentina and Irlan among his associates. Where Miya carries the memory of the war, Estes carries the burden of having missed part of it.",
            },
        ],
        ["sleep", "restoration", "kingship"],
        ["moon-elves", "lunar-temple"],
        [],
        "confirmed",
        "Elf King who rules the Moon Elves"
    ),
    profile(
        "alice",
        "Queen of Blood Demons",
        "The Abyss Awakens",
        "Sovereign of the Sanguine Lair",
        "Love was once everything to Alice. Imprisoned by the Monastery of Light, betrayed by the family she protected, she traded her humanity for power and became the Queen of Blood Demons — over two thousand years old and still counting the cost.",
        [
            {
                title: "The prisoner who loved",
                body: "Alice's fall begins with devotion. Her own account describes a maiden who measured her worth by love and her faith by what she would endure for her family, even while the Monastery of Light held her. When the lies were exposed, she concluded that power, not love, was the only thing that could not be taken from her.",
            },
            {
                title: "The Sanguine Lair",
                body: "She rules the Blood Demons from the Sanguine Lair and commands, at various points, the Orc Legion and Dark Elves. Her file lists an extraordinary roster of enemies — Estes, Miya, Pharsa, Vexana, Khaleed, Cecilion, Carmilla and the Forsaken Light among them — which is itself a portrait of how far her war has spread.",
            },
        ],
        ["betrayal", "power", "immortality"],
        ["abyss-court"],
        [wiki("Sanguine Lair")]
    ),
    profile(
        "dyrroth",
        "Son of Darkness",
        "The Present Age",
        "Prince of the Abyss; former prince of Moniyan",
        "Dyrroth was born a prince of light in the Moniyan Empire. Abducted as a child, he was reshaped by Alice into the Abyss' most loyal son — while his sister Silvanna has never stopped searching for the brother she remembers.",
        [
            {
                title: "The stolen prince",
                body: "Dyrroth is the son of Emperor Aurelius II and the younger brother of Silvanna. Alice took him from the Moniyan court and raised him inside the Abyss. He is not of demon blood by birth, but the record calls him a Blood Demon now: the transformation was as much political as physical.",
            },
            {
                title: "The family split in two",
                body: "His file binds him to Alice as companion and abductor, to Thamuz as mentor, and to Silvanna, Odette, Vexana and the Lightborn as enemies. The tragedy is structural: every person who might have loved him stands on the other side of the war, and the one who made him is the one he obeys.",
            },
        ],
        ["abduction", "identity", "loyalty"],
        ["abyss-court", "lightborn"]
    ),
    profile(
        "silvanna",
        "Holy Knightess",
        "The Present Age",
        "Princess-regent; Lightborn commander",
        "When her younger brother vanished, Silvanna took up the burden of the Moniyan Empire. She became the finest knight of the Imperial Order, then the leader of the Lightborn — and she has never accepted that Dyrroth is lost.",
        [
            {
                title: "The regent who rides",
                body: "Silvanna is the daughter of Aurelius II and the sister of Dyrroth. After his disappearance she joined the Empire Chevaliers and rose to command, taking on the duties of a throne she never expected to carry alone. Her file calls her the princess of the Moniyan Empire and a knightess of the Imperial Knight's Order.",
            },
            {
                title: "The sister's war",
                body: "She leads the Lightborn against the Abyss while searching for Dyrroth. That dual purpose defines her: every victory against the demon court is also a step toward the brother she believes can still be reached. Alice, Thamuz and the Abyss' whole hierarchy stand between them.",
            },
        ],
        ["duty", "kinship", "command"],
        ["lightborn", "imperial-army"]
    ),
    profile(
        "alucard",
        "Demon Hunter",
        "The Present Age",
        "Lightborn striker; former Arbiter of Light",
        "Alucard's father died in a battle against demons beside Tigreal. He joined the Monastery of Light to destroy what killed his father, then left it in anger when he learned what that battle had really been.",
        [
            {
                title: "The father's war",
                body: "Alucard's father was a comrade of Tigreal and disappeared fighting demons. That loss set Alucard on the Monastery's path. He became a demon hunter and an Arbiter of Light, taking the fight to the Abyss with a conviction that bordered on self-destruction.",
            },
            {
                title: "Leaving the Monastery",
                body: "What he discovered about the battle broke his faith in the institution, not in the cause. He left the Monastery of Light and continued hunting on his own terms, later rejoining the fight as one of the Lightborn. The record still lists the Monastery among his affiliations and the Abyss among his enemies.",
            },
        ],
        ["revenge", "faith", "independence"],
        ["lightborn", "monastery-of-light"]
    ),
    profile(
        "aamon",
        "Duke of Shards",
        "The Present Age",
        "Head of House Paxley; Lord of Castle Aberleen",
        "Aamon Paxley inherited the most powerful duchy in the Moniyan Empire at eighteen, after his parents vanished in a sandstorm. He learned the family's secret spell, buried his doubts, and became a nobleman who is warm in the salon and merciless on the field.",
        [
            {
                title: "The heir",
                body: "House Paxley rules Castle Aberleen and holds decisive influence in the empire while keeping a deliberately low profile. Aamon was raised as its heir: studies, official duties and a secret spell passed only to direct descendants. The spell did not match the family's public devotion to the Lord of Light, and that contradiction sent him into the family archives.",
            },
            {
                title: "The Duke of Shards",
                body: "His father and mother disappeared while visiting Altair, and Aamon became duke at eighteen. He is recorded as Gusion's older brother, Valentina's descendant, and the cousin of Marcel and Melissa. His magic turns light itself into blades; his reputation turns every room into a negotiation.",
            },
        ],
        ["inheritance", "secrecy", "control"],
        ["house-paxley"],
        [],
        "confirmed",
        "The aloof Duke of Castle Aberleen."
    ),
    profile(
        "gusion",
        "Holy Blade",
        "The Present Age",
        "Former heir of House Paxley; Lightborn ally",
        "Gusion was born into the most powerful magic family on the continent and wanted nothing to do with magic. He left House Paxley to develop a fighting style drawn from holy light — and took the family's expectations with him.",
        [
            {
                title: "The son who left",
                body: "The second Paxley son rejected the arcane tradition of Castle Aberleen and studied the light instead, turning it into blades he could throw. His departure was not a break with power but a redefinition of it: he kept the family's ambition and discarded its methods.",
            },
            {
                title: "Bonds outside the house",
                body: "His file records Aamon as his older brother, Valentina as an ancestor, Marcel and Melissa as cousins, and Lesley as a mutual crush. He also fought beside Belerick, Lunox and Natan, and was saved by Carmilla and Cecilion. Gusion's story is the Paxley story told from the outside.",
            },
        ],
        ["rebellion", "light", "family"],
        ["house-paxley"],
        [],
        "confirmed"
    ),
    profile(
        "lesley",
        "Deadly Sniper",
        "The Present Age",
        "House Vance operative; Harley's sister",
        "Lesley lost her father, was adopted by House Vance, and made her younger brother Harley the centre of her world. She protects him from a distance, with a rifle and a silence that the rest of the empire finds unnerving.",
        [
            {
                title: "The Vance household",
                body: "After her biological father's death, Lesley was taken in by Duke Vance and became Harley's foster sister. The Vance family presided over the security of a noble house, and Lesley grew up inside that world of contracts, guards and quiet violence. Fredrinn is recorded as her uncle.",
            },
            {
                title: "The black sniper",
                body: "She keeps Harley out of danger without letting him see it. Her file also records a mutual crush with Gusion, which places the Paxley inheritance and the Vance household in the same social orbit. In the field she is the shot no one hears before it lands.",
            },
        ],
        ["protection", "distance", "precision"],
        ["house-vance"]
    ),
    profile(
        "lancelot",
        "Blade of Roses",
        "The Present Age",
        "Eldest son of House Baroque; Odette's fiancé",
        "Lancelot was born to resist. The eldest son of Duke Baroque rejected his arranged marriage, left Castle Gorge and lived as a wandering duelist until a tavern wound and a princess changed his direction.",
        [
            {
                title: "The prodigal son",
                body: "House Baroque rules Castle Gorge, a fief whose gold mines have run dry but whose fencing tradition remains legendary. Lancelot was raised inside that prestige and treated it as a cage. He travelled, drank, fought and refused the political marriage his father had planned.",
            },
            {
                title: "Odette and the return",
                body: "Wounded in a drunken brawl, Lancelot was rescued by Odette of House Alvin. The encounter gave him something he had not expected to want: a reason to return. He is recorded as Odette's lover and arranged fiancé, Guinevere's older brother, and a member of House Baroque. The blade of roses is a repentant man's weapon.",
            },
        ],
        ["rebellion", "redemption", "romance"],
        ["house-baroque"],
        [],
        "confirmed",
        "Prodigal son and genius swordsman of House Baroque."
    ),
    profile(
        "odette",
        "Swan Princess",
        "The Present Age",
        "Princess of House Alvin",
        "Odette was raised to be a well-behaved princess and secretly wanted adventure. She found it in a wounded swordsman named Lancelot, and then chose him over the marriage her family had arranged.",
        [
            {
                title: "The Swan Castle",
                body: "Odette is the daughter of Prince Alvin and a princess of House Alvin, raised at Swan Castle with the expectations of a noble daughter. Her file describes a romantic who played the obedient lady while longing for the world outside the castle walls.",
            },
            {
                title: "Choosing Lancelot",
                body: "She rescued Lancelot after a duel and gradually recognised her own feelings. Their betrothal had been arranged, but the choice to leave was hers. Her record lists Silvanna, Dyrroth and Vexana as relatives, which quietly ties the Alvin line to the Moniyan royal family and to Necrokeep.",
            },
        ],
        ["choice", "romance", "duty"],
        ["house-alvin"]
    ),
    profile(
        "guinevere",
        "Porcelain Maid",
        "The Present Age",
        "Magic Academy prodigy; Lancelot's sister",
        "Guinevere is the youngest daughter of House Baroque and one of the most gifted students the Magic Academy has produced. She refused to be a political bargaining chip, even when her family insisted otherwise.",
        [
            {
                title: "The Academy",
                body: "Guinevere studied magic from childhood and became exceptionally talented at it. House Baroque wanted her to marry into a house of higher status; she wanted a life chosen by herself. Her file ties her to Lancelot as his younger sister and to House Baroque as one of its few noble daughters.",
            },
            {
                title: "The refusal",
                body: "Her story repeats her brother's from a different angle: the same house, the same dynastic pressure, a different kind of escape. Where Lancelot left with a blade and a wound, Guinevere leaves with a spellbook and a refusal.",
            },
        ],
        ["talent", "refusal", "dynasty"],
        ["house-baroque"],
        [],
        "suggested"
    ),
    profile(
        "valentina",
        "Prophetess of the Night",
        "The Endless War",
        "Former Duchess of House Paxley; immortal",
        "Valentina was Duchess of House Paxley when betrayal cost her lover Irlan his soul. She made a pact with an Evil God to gain immortality and shadow magic, and has moved through the Paxley line's history ever since.",
        [
            {
                title: "The betrayal",
                body: "During an Abyss invasion, Valentina and her lover Irlan were betrayed by members of House Paxley. Irlan lost his soul. Valentina's response was to seek a power that no house, church or death could revoke: a bargain with an Evil God that granted her eternal life in shadow.",
            },
            {
                title: "The ancestor in the walls",
                body: "She is recorded as an ancestor of Aamon, Gusion, Marcel and Melissa, and as a companion of Aamon in the present day. Over a thousand years old and appearing twenty-eight, she is the Paxley family's oldest secret walking through its own halls.",
            },
        ],
        ["grief", "pacts", "immortality"],
        ["house-paxley"],
        [],
        "confirmed"
    ),
    profile(
        "carmilla",
        "Shadow of Twilight",
        "The Present Age",
        "Blood Demon; Cecilion's lover",
        "Carmilla fell in love with a Blood Demon named Cecilion. She guessed what he was, chose him anyway, and gave up her life for it — then woke in his arms as a Blood Demon herself.",
        [
            {
                title: "The choice",
                body: "Carmilla belonged to House Ansaac of Castle Aberleen. She fell in love with Cecilion, an opera singer and Blood Demon, and understood the danger better than anyone. Rather than be separated from him, she took her own life.",
            },
            {
                title: "The awakening",
                body: "She woke as a Blood Demon, held by her lover. The record lists her transformation plainly: human-turned-Blood Demon. Her story is the gentlest entry in the Abyss' catalogue and the clearest example of how the demon court grows — not only by conquest, but by devotion.",
            },
        ],
        ["devotion", "transformation", "the Abyss"],
        ["abyss-court"],
        [],
        "confirmed"
    ),
    profile(
        "vexana",
        "Shimmer of Hope",
        "The Fall of Ridgeburg",
        "Duchess of Necrokeep",
        "Vexana was a princess of House Gaius who never left Lumina City until she became Duchess of Ridgeburg. When the Abyss came, she released the Mist to save the city and turned its people into undead.",
        [
            {
                title: "Ridgeburg",
                body: "Ridgeburg, now called Necrokeep, was a prosperous fortress-city on the northern Barren Lands and a frontline of the Moniyan Empire. Vexana governed it as duchess. Her record ties her by blood to the Moniyan and Alvin lines, including Silvanna, Dyrroth and Odette.",
            },
            {
                title: "The Mist",
                body: "A century ago she released the Mist to shield Ridgeburg from the Abyss. It worked, at the cost of the residents' humanity: the city became Necrokeep, the Undying City, forgotten by the living. Vexana rules it still as the gentle mother of the undead, with Leomord and Faramis at her side.",
            },
        ],
        ["sacrifice", "undeath", "memory"],
        ["necrokeep"],
        [wiki("Necrokeep")]
    ),
    profile(
        "leomord",
        "The Oathkeeper",
        "The Fall of Ridgeburg",
        "Knight of Necrokeep",
        "Leomord was a sworn knight of Ridgeburg who broke his oath with his own sword. He has guarded the cursed land ever since, bound to the Mist and to a city that death itself abandoned.",
        [
            {
                title: "The broken oath",
                body: "The record does not soften what happened: Leomord was forced to shatter the oath he had sworn, and the act defined the rest of his existence. He became an undead knight bound to the Mist that Vexana released over Ridgeburg.",
            },
            {
                title: "The watch",
                body: "He guards Necrokeep from the crags of the Lantis Mountains. Vexana and Faramis are recorded as allies, Alice and Terizla as enemies. His file lists the pre-revamp enmity with Benedetta and Brody as no longer current, a useful reminder that the lore itself is revised.",
            },
        ],
        ["oaths", "penance", "the undead"],
        ["necrokeep"]
    ),
    profile(
        "faramis",
        "Soul Binder",
        "The Fall of Ridgeburg",
        "Physician of Necrokeep",
        "Faramis came to Necrokeep to study its plague and found a cursed duchess, a girl who brought him light, and a vow he could not abandon. He chose undeath so he could keep working on a cure.",
        [
            {
                title: "The physician",
                body: "Faramis was a gifted doctor who travelled to Necrokeep to understand the plague that followed the Mist. Instead of a cure he found Vexana and the people she had saved by cursing them. He stayed, and his record lists him as physician and necromancer.",
            },
            {
                title: "The voluntary curse",
                body: "He willingly took on the curse so that he could continue his research indefinitely. Vexana and Leomord are recorded as his allies. In a city of the undead, he is the one still trying to reverse the condition rather than endure it.",
            },
        ],
        ["medicine", "persistence", "the curse"],
        ["necrokeep"]
    ),
    profile(
        "terizla",
        "Executioner",
        "The Present Age",
        "Abyss Executioner; former head of the Free Smiths' Guild",
        "Terizla was the most respected craftsman of his age until the Church of Light branded him a heretic. Now he wields his hammer for the Abyss and for the day he can answer for his kin.",
        [
            {
                title: "The Free Smiths' Guild",
                body: "Terizla led the Free Smiths' Guild and was revered for his craft. The Church of Light destroyed the guild on charges of heresy. Xavier, then Arbiter of Light, carried out the suppression. Terizla's son Julian survived and was taken in by the archbishop who condemned them.",
            },
            {
                title: "The Executioner",
                body: "Framed and stripped of everything, Terizla joined the Abyss and became its Executioner. Alice counts him as a companion; Vexana and Leomord count him as an enemy; Xavier does too. His hammer is a tool of revenge, and the Abyss is simply the hand that picked it up.",
            },
        ],
        ["craft", "injustice", "vengeance"],
        ["abyss-court"]
    ),
];
