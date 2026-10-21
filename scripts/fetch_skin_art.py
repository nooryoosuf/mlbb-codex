"""Collect full-width 16:9 skin splash artwork for all heroes.

Each skin is mapped to its full wide 16:9 splash illustration (1280x720 WebP
from MLBBDex's Wiki-derived gallery illustrations, or full-resolution 16:9
splash art from the Mobile Legends Fandom Wiki when a skin name differs or is
only on the Wiki).

Usage:
    python scripts/fetch_skin_art.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEROES_PATH = os.path.join(ROOT, "src", "data", "heroes.json")
OUT = os.path.join(ROOT, "src", "data", "skin_art.json")

# Localized / renamed skin titles between the skin table and gallery illustrations
ALIASES: dict[tuple[str, str], str] = {
    ("atlas", "935"): "Rune Sentinel",
    ("aurora", "363"): "Foxy Lady",
    ("baxia", "874"): "Ba-rista",
    ("beatrix", "1056"): "Stellar Brilliance",
    ("benedetta", "973"): "Street Blow",
    ("claude", "655"): "Summer Chill",
    ("clint", "132"): "Summer Blast",
    ("eudora", "152"): "Vivo Selfie Goddess",
    ("fanny", "176"): "Summer Rescue",
    ("freya", "102210"): "Galatic Vanquisher",
    ("gatotkaca", "411"): "Mighty Guardian",
    ("helcurt", "512"): "Exoracial Executioner",
    ("hilda", "356"): "Bass Crazy",
    ("ixia", "1211"): "Arclight Outlaw",
    ("kagura", "255"): "Soryu Maiden",
    ("layla", "101812"): "Midnight Waltz",
    ("lylia", "861"): "Little Wizard",
    ("martis", "581"): "Asura King",
    ("minsitthar", "745"): "Crimson Lion",
    ("miya", "100115"): "Arrow of Spring",
    ("moskov", "103111"): "Infernal Wyrmlord",
    ("nana", "057"): "Summer Fun",
    ("roger", "395"): "Phantom Pirate",
    ("roger", "398"): "Fiend Haunter",
    ("valir", "573"): "Shikigami Summoner",
    ("yi-sun-shin", "305"): "Lone Destructor",
}

# Direct Fandom Wiki splash URLs for the two skins not in MLBBDex gallery
WIKI_FALLBACKS: dict[tuple[str, str], dict] = {
    ("helcurt", "517"): {
        "url": "https://static.wikia.nocookie.net/mobile-legends/images/a/a9/Helcurt_%28Cyber_Infiltrator%29.jpg/revision/latest?cb=20250821115351",
        "width": 947,
        "height": 540,
    },
    ("franco", "102"): {
        "url": "https://static.wikia.nocookie.net/mobile-legends/images/c/c3/Franco_%28Masterchef%29.jpg/revision/latest?cb=20211209065151",
        "width": 607,
        "height": 1080,
    },
}


def normalize(value: str) -> str:
    value = value.replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def main() -> None:
    heroes = json.load(open(HEROES_PATH, encoding="utf-8"))
    result: dict[str, dict] = {}
    total = 0
    covered = 0

    for hero in heroes:
        slug = hero["slug"]
        gallery = {normalize(item["name"]): item["image"] for item in hero.get("gallery", []) if item.get("image")}
        for skin in hero.get("skins", []):
            total += 1
            sid = str(skin["id"])
            target_name = ALIASES.get((slug, sid), skin["name"])
            url = gallery.get(normalize(target_name))
            if url:
                result.setdefault(slug, {})[sid] = {
                    "url": url,
                    "width": 1280,
                    "height": 720,
                }
                covered += 1
            elif (slug, sid) in WIKI_FALLBACKS:
                result.setdefault(slug, {})[sid] = WIKI_FALLBACKS[(slug, sid)]
                covered += 1

    payload = {
        "source": "MLBBDex & Mobile Legends Wiki (Fandom), CC BY-SA",
        "fetched": "2026-10-21",
        "skins": result,
    }
    json.dump(payload, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"skins={total} covered={covered} ({covered / total:.1%})")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
