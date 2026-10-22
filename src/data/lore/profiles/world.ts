import { wiki, type HeroLoreProfile } from "../core";
import { profile } from "./shared";

export const WORLD_PROFILES: HeroLoreProfile[] = [
    profile(
        "yu-zhong",
        "Black Dragon",
        "The Endless War / Present Age",
        "Reincarnation of the Black Dragon; conqueror of Cadia",
        "Yu Zhong carries the will of the Black Dragon, the last of the dragon twins who swallowed the Evil God Lieh to save the Cadia Riverlands. Defeated by his senior brother Baxia and left for dead, he returned ten years later to break the Reverse Scale's seal.",
        [
            {
                title: "The dragon's burden",
                body: "In the age of the Endless War, the Black and White Dragon twins opened a path to Cadia to save their people. The Black Dragon swallowed Lieh and sealed the god inside himself. Millennia later Lieh's corruption had turned the dragon's heir into a conqueror who believed unity through conquest was the only future Cadia had left.",
            },
            {
                title: "The return to the altar",
                body: "Baxia, his senior brother, defeated him and left him in the mountains. Yu Zhong spent ten years training and returned to the Dragon Altar, broke the Reverse Scale's seal and fought Lieh. Wanwan's friendship helped him recover himself. He is now recorded as the reincarnation of the Black Dragon, and the Oriental Fighters name him both old friend and enemy.",
            },
        ],
        ["corruption", "reincarnation", "conquest"],
        ["cadia-court"],
        [wiki("Dragon Altar")],
        "suggested",
        "Yu Zhong, the reincarnation of the Black Dragon, intends to unify the Cadia Riverlands through conquest and usher in an era of prosperity."
    ),
    profile(
        "baxia",
        "Mystic Tortoise",
        "The Endless War",
        "Guardian of Cadia; senior brother of Yu Zhong",
        "Baxia is the spirit of the Mystic Tortoise and one of Cadia's Four Immortals. He lost his master and comrades at the Battle of the Twin Dragons, then took up the duty of guarding the realm — including against the brother he once trained.",
        [
            {
                title: "The Battle of the Twin Dragons",
                body: "Baxia's file places him at the Battle of the Twin Dragons, where his master and comrades died. As the spirit of the Mystic Tortoise he survived to carry their responsibility: the Dragon Altar, the Oriental Fighters and the balance of the Cadia Riverlands.",
            },
            {
                title: "The senior brother",
                body: "He is Yu Zhong's senior brother and the one who defeated him after the Black Dragon's corruption. Baxia now fights beside Ling, Wanwan and Zilong as an Oriental Fighter. His record lists Yu Zhong as an old friend and enemy, and Luo Yi as an enemy — the war for Cadia runs through his own family of disciples.",
            },
        ],
        ["endurance", "guardianship", "loss"],
        ["oriental-fighters"]
    ),
    profile(
        "wanwan",
        "Agile Tiger",
        "The Present Age",
        "Tang Clan heir; Oriental Fighter",
        "Wanwan grew up in a secluded mountain abode, chosen by the Agile Tiger before she knew what the choice meant. She is Yin's childhood sweetheart and one of the few people who can still call Yu Zhong a friend.",
        [
            {
                title: "The chosen heir",
                body: "Wanwan belongs to the Tang Clan and was raised away from the politics of the Cadia city-states. Her carefree childhood ended when she met Yu Zhong, Yin and the Oriental Fighters and learned that the Agile Tiger had already marked her as its vessel.",
            },
            {
                title: "The friend who brought him back",
                body: "During the final battle at the Dragon Altar, Wanwan's friendship helped Yu Zhong regain himself after Lieh's influence. She is recorded as his former friend and enemy, and as Yin's childhood sweetheart. Her loyalty is personal rather than political, which is exactly why it matters in Cadia.",
            },
            {
                title: "Oriental Fighters",
                body: "She fights alongside Baxia, Ling and Zilong. The four of them guard the Dragon Altar and the Great Dragon's legacy, though each understands that duty differently.",
            },
        ],
        ["choice", "friendship", "the tiger"],
        ["oriental-fighters"]
    ),
    profile(
        "ling",
        "Cyan Finch",
        "The Present Age",
        "Former Finch Sect assassin; Oriental Fighter",
        "Ling was an assassin of the Finch Sect before a near-death mission brought him to the Vermilion Bird. The encounter gave him a hunger for freedom that the sect would not grant without one last job.",
        [
            {
                title: "The Finch Sect",
                body: "The Finch Sect is a feared order of assassins in the Cadia Riverlands. Ling was raised inside it and sent on the kind of missions that do not expect a return. When he nearly died, the Vermilion Bird saved him and kindled a desire to live outside the sect's orders.",
            },
            {
                title: "The last contract",
                body: "To leave, he agreed to one final mission: infiltrate the Dragon Altar. What he found there made him an Oriental Fighter instead. He is recorded as Zilong's fellow disciple and rival, and as a companion of Baxia, Wanwan and Zetian.",
            },
        ],
        ["freedom", "assassins", "rebirth"],
        ["oriental-fighters"]
    ),
    profile(
        "zilong",
        "Spear of Dragon",
        "The Present Age",
        "Disciple of the Great Dragon; Oriental Fighter",
        "Zilong was taken in by the Tianyin Swordmaster Sect and chose the spear over the sword. He trained without a teacher until the Great Dragon accepted him, and he is Chang'e's adoptive older brother.",
        [
            {
                title: "The spear without a master",
                body: "The Tianyin Swordmaster Sect was famous for its swordsmanship, but Zilong picked up the spear and practised its basics alone. His stubbornness eventually earned him a place as a disciple of the Great Dragon, the power at the centre of Cadia's cosmology.",
            },
            {
                title: "The Oriental Fighter",
                body: "He is recorded as Ling's fellow disciple and rival, a co-member of the Oriental Fighters with Baxia and Wanwan, and an enemy of Yu Zhong and Luo Yi. He is also Chang'e's adoptive older brother, a domestic tie that survives every war.",
            },
        ],
        ["perseverance", "the spear", "brotherhood"],
        ["oriental-fighters"]
    ),
    profile(
        "yin",
        "Martial Genius",
        "The Present Age",
        "Vessel of Lieh; Forsaken Light",
        "Yin is a young martial artist from the east whose sudden violence unsettles even his allies. The cause is not temperament: the Evil God Lieh dwells inside him, and the Forsaken Light is trying to keep both of them alive.",
        [
            {
                title: "The god inside",
                body: "Yin appears simple and righteous until the sinister aura surfaces. Lieh, the Evil God who corrupted the Black Dragon, lives within him as an alter ego. Yin's discipline is therefore not a personality trait but a daily containment strategy.",
            },
            {
                title: "Forsaken Light",
                body: "He is recorded as a co-member of the Forsaken Light with Xavier, Melissa and Julian. His file lists Yu Zhong and Alice as enemies, Wanwan as his childhood sweetheart, and Lieh as his alter ego. The squad exists because each of its members has been pushed outside the institutions that were supposed to protect them.",
            },
        ],
        ["possession", "discipline", "chosen family"],
        ["forsaken-light"]
    ),
    profile(
        "xavier",
        "Defier of Light",
        "The Present Age",
        "Former Arbiter of Light; Forsaken Light",
        "Xavier was the Knights of Light's Arbiter, the man sent to suppress Terizla's Free Smiths' Guild. A decade of guilt followed, and when he was ordered to capture Yin and Melissa he finally chose conscience over command.",
        [
            {
                title: "The Arbiter",
                body: "Xavier rose through the Knights of Light and was given the title Arbiter of Light. His record ties him to the suppression of Terizla's guild, an act that became the centre of a decade of inner struggle. He is half-elf, which may explain why the order's purity politics never fully accepted him.",
            },
            {
                title: "The defection",
                body: "Ordered to capture Yin and Melissa as heretics, Xavier broke with the Monastery and joined them instead. He is recorded as a Forsaken Light co-member with Yin, Melissa and Julian, an enemy of Alice and Terizla, and a companion of Alucard. His story is the cost of obedience finally being paid.",
            },
        ],
        ["conscience", "institutions", "atonement"],
        ["forsaken-light", "monastery-of-light"]
    ),
    profile(
        "melissa",
        "Cursed Needle",
        "The Present Age",
        "Tailor of Lumina City; Forsaken Light",
        "Melissa is an illegitimate noble who runs a small tailor shop in Lumina City. She fights with cursed needles and black magic, solving problems for clients the law would rather ignore — until the Church named her a heretic.",
        [
            {
                title: "The tailor",
                body: "Raised in the capital as an illegitimate child of a noble house, Melissa built a life at the edge of respectable society. Her shop gave her access to every layer of Lumina City, and her needles gave her a way to defend the people the Church left behind.",
            },
            {
                title: "The heretic",
                body: "Her black magic made her a target. She is recorded as a maternal distant cousin of Aamon, Gusion and Marcel, a descendant of Valentina, and a co-member of the Forsaken Light with Yin, Xavier and Julian. Alice counts her as an enemy. The tailor's shop is now a refuge for the empire's unwanted.",
            },
        ],
        ["craft", "outsiders", "defiance"],
        ["forsaken-light", "house-paxley"]
    ),
    profile(
        "julian",
        "Scarlet Raven",
        "The Present Age",
        "Former Raven; Forsaken Light",
        "Julian was six years old when the Church of Light destroyed his father's guild. Raised by the archbishop and trained as a Raven, he was sent to purify Xavier and instead found the secret buried under his own childhood.",
        [
            {
                title: "The Ravens",
                body: "Julian is Terizla's son. After the Free Smiths' Guild was wiped out, the archbishop adopted him and moulded him into an elite member of the Ravens, a force that answered only to the archbishop. His loyalty was manufactured from the wreckage of his family.",
            },
            {
                title: "The truth in the snow",
                body: "Sent to 'purify' Xavier, Julian caught a glimpse of what had happened ten years earlier, on the winter night the guild was destroyed. He joined the Forsaken Light with Xavier, Yin and Melissa. His file lists Alice as an enemy and Terizla as his father — the two halves of a life the Church tried to separate.",
            },
        ],
        ["memory", "manipulation", "reunion"],
        ["forsaken-light"]
    ),
    profile(
        "lunox",
        "Twilight Goddess",
        "The Endless War",
        "Keeper of the balance between order and chaos",
        "Lunox was born with a dreamworld that reflects and reshapes reality. She uses it to hold the balance between order and chaos, and the effort has already put her to sleep once.",
        [
            {
                title: "The dreamworld",
                body: "Lunox is a Light Elf whose dreams affect the waking world. The two cosmic forces — order and chaos — pour through her, and she spends her existence keeping them from consuming each other. She is recorded as the Twilight Goddess and as an immortal of the Minoan Labyrinth.",
            },
            {
                title: "The long sleep",
                body: "The pressure of both powers eventually forced her into a long sleep, from which she became one of the forces sustaining the world's balance. Belerick, Natan, Aamon, Kaja and Uranus are recorded among her companions and allies. She is less a faction than a condition the Land of Dawn depends on.",
            },
        ],
        ["balance", "dreams", "cosmology"],
        ["fate-deniers"],
        [],
        "suggested"
    ),
    profile(
        "angela",
        "Bunnylove",
        "The Present Age",
        "Peace Android Prototype 1",
        "Angela is the first life form Laboratory 1718 created without a human body or soul. Built by Dr. Baker to bring peace, she is a machine trying to understand the people she was made to protect.",
        [
            {
                title: "Prototype 1",
                body: "Laboratory 1718 began as a collaboration between Dr. Rooney and Dr. Baker, founded to use technology and artificial creatures for peace. Angela, formally Peace Android Prototype 1, was the first of their creations made without human tissue or a human soul.",
            },
            {
                title: "The heart of the machine",
                body: "Her file records Dr. Baker as creator, Alpha as an enemy, Saber as an ally and Chip as a confidant and adoptive sibling. She attaches herself to allies in battle, healing and shielding them — a design decision that reads, in hindsight, like a wish.",
            },
        ],
        ["artifice", "care", "personhood"],
        ["laboratory-1718", "eruditio-scholars"],
        [],
        "confirmed",
        "Artificial human made in Laboratory 1718"
    ),
    profile(
        "layla",
        "Energy Gunner",
        "The Present Age",
        "Daughter of Eruditio; Eruditio Ranger",
        "Layla is the bright star of Eruditio, a young gunner raised among scholars and soldiers. Her optimism is not naivety: she grew up watching the city's defences and decided to stand in front of them.",
        [
            {
                title: "The city of scholars",
                body: "Eruditio is the technological counterweight to the Magic Academy, a multicultural city in the Agelta Drylands that has played a central role in preventing the Great Calamity. Layla is publicly known there as the 'daughter of Eruditio' and serves in the Eruditio Rangers.",
            },
            {
                title: "The gunner",
                body: "Her record lists Ixia as her best friend and confidante, Novaria as her teacher, and Laboratory 1718 as hostile. She fights with an energy gun built for sieges and carries the city's hope in a way that makes her a target. Layla's story is Eruditio's belief that technology can still be used for protection rather than domination.",
            },
        ],
        ["hope", "science", "youth"],
        ["eruditio-scholars"],
        [],
        "suggested"
    ),
    profile(
        "kadita",
        "Ocean Goddess",
        "The Present Age",
        "Queen of the Southern Seas",
        "Kadita was a human princess before she became the Ocean Goddess of the Vonetis Sea. She guards the islanders who pray to her, and the trident she carries is both a promise and a warning.",
        [
            {
                title: "The southern seas",
                body: "The Vonetis Sea is an archipelago of tribes, harbours and old ruins. Kadita is its protector, recorded as a mermaid goddess and formerly human. The islanders navigate dangerous waters without fear because they believe she is watching.",
            },
            {
                title: "The trident",
                body: "Her title is Queen of the Southern Seas, and her file lists Kalea and Badang as companions, with Kalea described as close as a sister. Kadita's authority is not political; it is the sea itself answering her.",
            },
        ],
        ["the sea", "protection", "transformation"],
        ["vonetis-guardians"],
        [],
        "suggested"
    ),
    profile(
        "argus",
        "Dark Angel",
        "The Age of the Ancient Ones",
        "Fallen demi-angel",
        "Argus and Rafaela are twin angels, but the Monastery of Light only ever acknowledged her. Used as a weapon and denied as a person, Argus fell — and the darkness he found was less honest than the light that rejected him.",
        [
            {
                title: "The unwanted twin",
                body: "Angels in the legends of the Land of Dawn are female, which made Argus an anomaly from birth. The Monastery of Light used his power to destroy heresy while refusing to recognise his existence, and every praise given to Rafaela became a measure of what he was denied.",
            },
            {
                title: "The fall",
                body: "The rift between the twins widened until Argus turned against the light entirely. He is recorded as a fallen demi-angel, affiliated with the Abyss and the Celestial Palace, and an enemy of the Light. Rafaela's file confirms the same history from her side: the brother she lost to resentment.",
            },
        ],
        ["rejection", "twins", "fall"],
        ["abyss-court"],
        [],
        "suggested"
    ),
    profile(
        "karina",
        "Shadow Blade",
        "The Present Age",
        "Dark Elf assassin; Selena's sister",
        "Karina is the finest killer of the Dark Elves and the older sister of Selena. She failed to stop Selena from giving herself to the Abyss, and now hunts a way to bring her back.",
        [
            {
                title: "The Dark Elves",
                body: "Karina grew up among the Dark Elves of the Shadow Swamp, codependent with her younger sister Selena. The swamp was once fertile land; the Abyss corroded it, and the Dark Elves built their sacred identity around what remained.",
            },
            {
                title: "The sister she lost",
                body: "Selena dedicated herself to the Abyss and became its witch. Karina's response was not to abandon her but to become the best killer among her people and set out to stop her sister's work while searching for a way to reverse it. Her file lists an unnamed clan as her only affiliation; the rest of her loyalty is family.",
            },
        ],
        ["kinship", "assassination", "the Abyss"],
        ["dark-elves"]
    ),
    profile(
        "selena",
        "Abyssal Witch",
        "The Present Age",
        "Dark Elf witch of the Abyss",
        "Selena gave herself to the Abyss and became its witch. Her older sister Karina has been trying to save her ever since — a pursuit that defines both of their stories.",
        [
            {
                title: "The Shadow Swamp",
                body: "Selena is a Dark Elf of the Shadow Swamp, the corrupted southern land held sacred by her people. In ancient times the region belonged to the God of Darkness; in the present, his followers remain. Selena's file lists her as an Abyssal Witch and an enemy of Obsidia, who hunts the Abyss' servants.",
            },
            {
                title: "Two sisters, two sides",
                body: "Her record is sparse by design: her story is told mostly through Karina's search. Selena chose the Abyss; Karina chose to bring her home. The Land of Dawn rarely allows both.",
            },
        ],
        ["temptation", "sisterhood", "the Abyss"],
        ["dark-elves", "abyss-court"]
    ),
    profile(
        "hanabi",
        "Scarlet Flower",
        "The Present Age",
        "Leader of the Scarlet Sect",
        "Hanabi owns Higanbana, one of the seven great armaments of the Scarlet Shadow. She closed herself off from every feeling to become worthy of it — and then learned that power without emotion is volatile and fleeting.",
        [
            {
                title: "Higanbana",
                body: "Hanabi is the pride of the Scarlet Sect and the bearer of Higanbana, one of the Scarlet Shadow's seven great armaments. She pursued power single-mindedly to carry on her father's will, suppressing her emotions until even the weapon would not fully accept her.",
            },
            {
                title: "The world inside the blade",
                body: "While chasing a spy she slipped into Higanbana's inner world and lingered between illusion and reality. She returned understanding that feeling was not a weakness to be excised but part of the power itself. Her file records Hayabusa as her childhood sweetheart, Kagura as a close friend, and Hanzo as an enemy.",
            },
        ],
        ["discipline", "emotion", "the blade"],
        ["cadia-court"]
    ),
    profile(
        "hayabusa",
        "Crimson Shadow",
        "The Present Age",
        "Second heir of the Shadow Sect",
        "Hayabusa was the second heir of the Shadow Sect and looked up to his brother as the moon itself. To keep the peace between the Shadow and Scarlet Sects he became a hostage in the rival clan — and forged a bond with Hanabi that outlasted the politics.",
        [
            {
                title: "The hostage",
                body: "To preserve the delicate balance between the Shadow and Scarlet Sects, Hayabusa willingly took his brother's place as a political hostage and was raised inside the Scarlet Sect. Every day there he lived by his brother's principles and mastered the Shadow Shuriken technique.",
            },
            {
                title: "The broken peace",
                body: "Hanzo's betrayal and his brother's disappearance shattered the peace Hayabusa had been traded for. He is recorded as Hanabi's childhood sweetheart and as a ninja of the Shadow Sect. His loyalty was always to a person rather than a clan, which is why the clan's collapse broke him.",
            },
        ],
        ["sacrifice", "brotherhood", "the shadow"],
        ["cadia-court"],
        [],
        "suggested"
    ),
    profile(
        "kagura",
        "Sacred Crane",
        "The Present Age",
        "Scarlet Shadow mage",
        "Kagura was given a name by the Scarlet Shadow and taught about peace by Hayabusa. When she opened her umbrella she saw calamity, regret and a past that was not hers — and chose to carry it anyway.",
        [
            {
                title: "The umbrella",
                body: "Kagura's origins are uncertain even in the record. Raised within the Scarlet Shadow, she was uncertain of her path until she opened her umbrella in contemplation and beheld visions of calamity and eternity. What she saw convinced her that her freedom was bound to the regrets of others.",
            },
            {
                title: "The path of freedom",
                body: "She chose to carry both the regrets and hopes of those who had passed, and to experience the mortal realm on their behalf. Her file records Hanabi as a close friend and Hayabusa as the one who taught her of peace. She is the gentlest proof that the Scarlet Shadow is more than its assassins.",
            },
        ],
        ["memory", "freedom", "the umbrella"],
        ["cadia-court"],
        [],
        "suggested"
    ),
];
